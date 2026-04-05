# DWI Comprehensive Testing & Optimization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ship observability foundation + emotional payoff redesign + completion-rate interventions + operator dashboard in four PRs, over a work session, so James can test live as we build.

**Architecture:** Four-phase rollout on feature branches merging to `main`. Phase 0 adds invisible plumbing (tier/health derivation, event standardization, schema additions, backfill). Phase B replaces the single depth score with a 5-stat glance + earned tier title. Phase A adds cron-driven detection for 4 failure modes with auto-recovery, gentle nudges, or admin alerts. Phase C adds `/admin/health` live dashboard + issues-only email + moderate cleanup.

**Tech Stack:** Cloudflare Workers (deep-work-api, ~23K-line bundled JS at `src/index.js`), D1 (database `92121f3b-dcfb-4fa8-8482-b827224b611d`), KV (SESSIONS binding), Resend for email, Cron Triggers via wrangler.toml, vitest for unit tests.

**Design doc:** `docs/plans/2026-04-05-dwi-comprehensive-testing-optimization-design.md`

---

## Phase 0 — Observability Foundation

### Task 0.1: Add tests directory + vitest config

**Files:**
- Create: `tests/unit/compute-tier.test.js`
- Create: `vitest.config.js`
- Modify: `package.json` (add test scripts + vitest devDep)

**Step 1:** Install vitest locally: `cd ~/deep-work-api && npm install --save-dev vitest`

**Step 2:** Create `vitest.config.js`:

```javascript
import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { environment: 'node', include: ['tests/**/*.test.js'] } });
```

**Step 3:** Add scripts to `package.json`: `"test": "vitest run"`, `"test:watch": "vitest"`.

**Step 4:** Commit: `chore: add vitest test harness`

### Task 0.2: `computeUserTier` pure function + tests (TDD)

**Files:**
- Create: `src/lib/tier.js`
- Create: `tests/unit/compute-tier.test.js`

**Step 1:** Write failing test in `tests/unit/compute-tier.test.js`:

```javascript
import { describe, it, expect } from 'vitest';
import { computeUserTier } from '../../src/lib/tier.js';

describe('computeUserTier', () => {
  it('returns Didnt Flinch Once for A+ (23-25)', () => {
    expect(computeUserTier(25).tier_title).toBe("Didn't Flinch Once");
    expect(computeUserTier(23).tier_title).toBe("Didn't Flinch Once");
    expect(computeUserTier(25).grade).toBe('A+');
  });
  it('returns Sat With The Fire for A (20-22)', () => {
    expect(computeUserTier(22).tier_title).toBe("Sat With The Fire");
    expect(computeUserTier(20).tier_title).toBe("Sat With The Fire");
  });
  it('returns Named The Pattern for B+ (17-19)', () => {
    expect(computeUserTier(19).tier_title).toBe("Named The Pattern");
  });
  it('returns Told On Yourself for B (14-16)', () => {
    expect(computeUserTier(15).tier_title).toBe("Told On Yourself");
  });
  it('returns Took The First Swing for C (<14)', () => {
    expect(computeUserTier(10).tier_title).toBe("Took The First Swing");
    expect(computeUserTier(0).tier_title).toBe("Took The First Swing");
  });
  it('returns null for missing score', () => {
    expect(computeUserTier(null)).toBe(null);
    expect(computeUserTier(undefined)).toBe(null);
  });
});
```

**Step 2:** Run test, expect FAIL: `npx vitest run tests/unit/compute-tier.test.js`

**Step 3:** Write `src/lib/tier.js`:

```javascript
export function computeUserTier(score) {
  if (score === null || score === undefined) return null;
  const s = Number(score);
  if (s >= 23) return { grade: 'A+', tier_title: "Didn't Flinch Once" };
  if (s >= 20) return { grade: 'A',  tier_title: "Sat With The Fire" };
  if (s >= 17) return { grade: 'B+', tier_title: "Named The Pattern" };
  if (s >= 14) return { grade: 'B',  tier_title: "Told On Yourself" };
  return           { grade: 'C',  tier_title: "Took The First Swing" };
}
```

**Step 4:** Run tests, expect PASS.

**Step 5:** Commit: `feat(phase0): add computeUserTier pure function with tests`

### Task 0.3: `computeSessionHealth` pure function + tests

**Files:**
- Create: `src/lib/session-health.js`
- Create: `tests/unit/session-health.test.js`

**Step 1:** Write failing tests covering 7 health states:
- `complete` — status='completed' OR 'blueprint_complete', blueprint_generated=1
- `shallow_complete` — blueprint_generated=1, depth_grade='C'
- `stuck_phase` — message_count>=30 AND phase<=2, OR >=12 messages on current phase without advance
- `cold_abandoned` — message_count=0 AND created_at >24h ago
- `mid_drop` — message_count>5, last_active_at >48h ago (structural phase) or >5d (emotional phase 2/3/5/8), status='active'
- `failed` — status='failed' OR blueprint_job status='failed'
- `healthy` — default for active sessions not matching above

**Step 2:** Run tests, expect FAIL.

**Step 3:** Implement in `src/lib/session-health.js`:

```javascript
const EMOTIONAL_PHASES = new Set([2, 3, 5, 8]);
const HOUR_MS = 60 * 60 * 1000;

export function computeSessionHealth(s, now = new Date()) {
  if (!s) return 'unknown';
  const nowMs = now.getTime();
  const createdMs = s.created_at ? new Date(s.created_at).getTime() : nowMs;
  const lastActiveMs = s.last_active_at ? new Date(s.last_active_at).getTime() : createdMs;
  const hoursSinceActive = (nowMs - lastActiveMs) / HOUR_MS;
  const hoursSinceCreated = (nowMs - createdMs) / HOUR_MS;
  const phase = Number(s.phase || 0);
  const msgCount = Number(s.message_count || 0);

  // Terminal states first
  if (s.blueprint_generated === 1 && s.depth_grade === 'C') return 'shallow_complete';
  if (s.status === 'completed' || s.status === 'blueprint_complete') return 'complete';
  if (s.status === 'failed') return 'failed';
  if (s.status === 'restarted' || s.status === 'expired') return s.status;

  // Active session problem states
  if (msgCount === 0 && hoursSinceCreated > 24) return 'cold_abandoned';
  if (msgCount >= 30 && phase <= 2) return 'stuck_phase';

  // Mid-drop thresholds phase-aware
  const dropThreshold = EMOTIONAL_PHASES.has(phase) ? 24 * 5 : 48; // hours
  if (msgCount > 5 && hoursSinceActive > dropThreshold && s.status === 'active') return 'mid_drop';

  return 'healthy';
}
```

**Step 4:** Run tests, expect PASS.

**Step 5:** Commit: `feat(phase0): add computeSessionHealth pure function with tests`

### Task 0.4: D1 schema migration — add 3 columns to sessions

**Files:**
- Create: `migrations/2026-04-05-phase0-health-columns.sql`

**Step 1:** Write migration SQL:

```sql
ALTER TABLE sessions ADD COLUMN tier_title TEXT;
ALTER TABLE sessions ADD COLUMN session_health TEXT;
ALTER TABLE sessions ADD COLUMN health_updated_at DATETIME;
CREATE INDEX IF NOT EXISTS idx_sessions_health ON sessions(session_health);
CREATE INDEX IF NOT EXISTS idx_sessions_tier ON sessions(tier_title);
```

**Step 2:** Apply via D1 MCP query tool:

```sql
-- Apply each statement separately via mcp__...__d1_database_query
```

**Step 3:** Verify columns exist:

```sql
SELECT sql FROM sqlite_master WHERE type='table' AND name='sessions';
```

**Step 4:** Commit migration file: `chore(phase0): add tier_title, session_health, health_updated_at to sessions`

### Task 0.5: `error_log` enrichment — add session_id + user_email

**Files:**
- Create: `migrations/2026-04-05-phase0-error-log-enrich.sql`

**Step 1:** Write migration:

```sql
ALTER TABLE error_log ADD COLUMN session_id TEXT;
ALTER TABLE error_log ADD COLUMN user_email TEXT;
CREATE INDEX IF NOT EXISTS idx_error_log_session ON error_log(session_id);
```

**Step 2:** Apply via D1 MCP.

**Step 3:** Commit: `chore(phase0): enrich error_log with session_id + user_email`

### Task 0.6: Port tier + health into `src/index.js` bundle

**Files:**
- Modify: `src/index.js` (add tier + health functions directly inline, since it's a pre-bundled file)

**Step 1:** Find a location near the top of the file (after imports, before route handlers). Insert both `computeUserTier` and `computeSessionHealth` inline in the bundle.

**Step 2:** Use `grep -n "function callClaude" src/index.js` to find a good insertion point.

**Step 3:** Add both functions with `__name` annotations matching esbuild convention.

**Step 4:** Build bundle: `./deploy.sh` (step 3 only — build, don't deploy yet).

**Step 5:** Commit: `feat(phase0): inline computeUserTier + computeSessionHealth into bundle`

### Task 0.7: Backfill admin endpoint

**Files:**
- Modify: `src/index.js` (add `handleAdminBackfillHealth` function + route)

**Step 1:** Add route `POST /api/admin/backfill-health?dry_run=true|false`:

```javascript
async function handleAdminBackfillHealth(request, env) {
  await requireAdmin(request, env);
  const url = new URL(request.url);
  const dryRun = url.searchParams.get('dry_run') !== 'false';
  const now = new Date();
  const rows = await env.DB.prepare(
    "SELECT id, phase, message_count, blueprint_generated, status, depth_grade, emotional_depth_score, created_at, last_active_at FROM sessions"
  ).all();
  const updates = [];
  for (const s of rows.results || []) {
    const tier = computeUserTier(s.emotional_depth_score);
    const health = computeSessionHealth(s, now);
    updates.push({ id: s.id, tier_title: tier?.tier_title || null, session_health: health });
  }
  if (!dryRun) {
    for (const u of updates) {
      await env.DB.prepare(
        "UPDATE sessions SET tier_title=?, session_health=?, health_updated_at=? WHERE id=?"
      ).bind(u.tier_title, u.session_health, now.toISOString(), u.id).run();
    }
  }
  return json({ total: updates.length, dry_run: dryRun, sample: updates.slice(0, 10) });
}
```

**Step 2:** Register route in main request handler.

**Step 3:** Deploy: `./deploy.sh`

**Step 4:** Test dry-run: `curl -X POST "https://love.jamesguldan.com/api/admin/backfill-health?dry_run=true" -H "X-Admin-Key: ..."`

**Step 5:** If output looks right, run live: `dry_run=false`.

**Step 6:** Verify via D1: `SELECT tier_title, session_health, COUNT(*) FROM sessions GROUP BY tier_title, session_health`.

**Step 7:** Commit: `feat(phase0): backfill endpoint for tier + health on existing sessions`

### Task 0.8: Event logging standardization

**Files:**
- Modify: `src/index.js` — add `logSessionEvent(env, session_id, event_type, payload)` helper + call at 10 critical moments.

**Step 1:** Add helper:

```javascript
async function logSessionEvent(env, sessionId, eventType, payload = {}) {
  try {
    await env.DB.prepare(
      "INSERT INTO session_events (id, session_id, event_type, payload, created_at) VALUES (?, ?, ?, ?, datetime('now'))"
    ).bind(crypto.randomUUID(), sessionId, eventType, JSON.stringify(payload)).run();
  } catch (e) { console.error('[logSessionEvent]', e.message); }
}
```

**Step 2:** Add calls at 10 moments: blueprint_job_started, blueprint_job_failed, blueprint_job_succeeded, phase_stuck_detected, phase_auto_advanced, nudge_scheduled, nudge_sent, nudge_opened, admin_alert_fired, tier_computed.

**Step 3:** Deploy + test by starting a session, check events flow.

**Step 4:** Commit: `feat(phase0): standardize session_events with 10 critical moments`

### Task 0.9: Hourly health snapshot cron

**Files:**
- Modify: `wrangler.toml` (add cron trigger `0 * * * *`)
- Modify: `src/index.js` (add `scheduled()` handler)

**Step 1:** Add to `wrangler.toml`:

```toml
[triggers]
crons = ["0 * * * *"]
```

**Step 2:** Add `scheduled` handler that snapshots session counts by health state into `health_checks`:

```javascript
async function runHourlySnapshot(env) {
  const counts = await env.DB.prepare(
    "SELECT session_health, COUNT(*) as cnt FROM sessions WHERE session_health IS NOT NULL GROUP BY session_health"
  ).all();
  const errorCount = await env.DB.prepare(
    "SELECT COUNT(*) as cnt FROM error_log WHERE created_at > datetime('now', '-1 hour')"
  ).first();
  const payload = { counts: counts.results, errors_last_hour: errorCount.cnt };
  await env.DB.prepare(
    "INSERT INTO health_checks (id, check_type, payload, created_at) VALUES (?, 'hourly_snapshot', ?, datetime('now'))"
  ).bind(crypto.randomUUID(), JSON.stringify(payload)).run();
}
```

**Step 3:** Wire into export default `{ scheduled(event, env, ctx) { ctx.waitUntil(runHourlySnapshot(env)); } }`.

**Step 4:** Deploy, wait 1 hour, verify row lands in `health_checks`.

**Step 5:** Commit: `feat(phase0): hourly session health snapshot cron`

### Phase 0 gate

- [ ] All Phase 0 tests pass (`npm test`)
- [ ] 87 existing sessions have tier_title + session_health populated
- [ ] Hourly cron wrote at least one snapshot
- [ ] `session_events` captures all 10 new event types
- [ ] Deploy succeeded, worker alive

**Merge PR 1 to main.**

---

## Phase B — Emotional Payoff

### Task B.1: Add `computeBreakthroughCount` + `computeHonestAnswerCount` helpers

**Files:**
- Modify: `src/index.js` (inline both functions)
- Create: `tests/unit/metrics.test.js`

**Step 1:** Write test:

```javascript
import { computeBreakthroughCount, computeHonestAnswerCount } from '../../src/lib/metrics.js';
it('counts honest answers (user msg > 40 words)', () => {
  const msgs = [
    { role: 'user', content: 'yes' },
    { role: 'user', content: 'I think what I am really trying to say is that I have always struggled with this particular pattern in my work and it goes back to childhood when my father told me something important' },
  ];
  expect(computeHonestAnswerCount(msgs)).toBe(1);
});
it('counts breakthroughs (user msg with emotional markers)', () => {
  const msgs = [
    { role: 'user', content: 'I realized I have been running from this' },
    { role: 'user', content: 'regular answer' },
    { role: 'user', content: "I've never told anyone this" },
  ];
  expect(computeBreakthroughCount(msgs)).toBe(2);
});
```

**Step 2:** Implement:

```javascript
export function computeHonestAnswerCount(messages) {
  return (messages || []).filter(m =>
    m.role === 'user' && (m.content || '').split(/\s+/).filter(Boolean).length > 40
  ).length;
}
const BREAKTHROUGH_MARKERS = [
  /\bi realized\b/i, /\bi've never\b/i, /\bi have never\b/i,
  /\bi don't usually\b/i, /\bi don't normally\b/i,
  /\bthe truth is\b/i, /\bhonestly\b/i, /\bi'm scared\b/i,
  /\bi'm ashamed\b/i, /\bthat's the first time\b/i
];
export function computeBreakthroughCount(messages) {
  return (messages || []).filter(m => {
    if (m.role !== 'user') return false;
    const t = m.content || '';
    return BREAKTHROUGH_MARKERS.some(r => r.test(t));
  }).length;
}
```

**Step 3:** Run tests PASS.

**Step 4:** Commit: `feat(phaseB): add honest-answer + breakthrough metric helpers`

### Task B.2: Update blueprint render — 5-stat glance bar

**Files:**
- Modify: `src/index.js` (the `renderBlueprintV3` function around line 18902)

**Step 1:** Locate existing glance bar HTML (line ~18902).

**Step 2:** Compute new metrics from session messages. Add above the glance bar:

```javascript
const messages = sessionMeta?.messages || [];
const honestAnswers = computeHonestAnswerCount(messages);
const breakthroughs = computeBreakthroughCount(messages);
const tier = computeUserTier(depthScore) || { tier_title: 'Took The First Swing', grade: 'C' };
```

**Step 3:** Replace the 5-card glance bar with new 5 cards:
1. Minutes of Deep Work (existing)
2. Honest Answers (new)
3. Breakthrough Moments (new)
4. Belief Patterns Named (existing)
5. Your Tier — tier_title (new, span 2 cols if needed)

**Step 4:** Remove the Depth Confidence card (added in previous Layer 3 work).

**Step 5:** Build + deploy + smoke-test by hitting an existing blueprint URL.

**Step 6:** Commit: `feat(phaseB): replace glance bar with 5 celebration metrics`

### Task B.3: Hero tier badge

**Files:**
- Modify: `src/index.js` (the hero HTML at line ~18901)

**Step 1:** Add tier eyebrow above the first name:

```html
<div class="hero-tier-badge" style="font-family:'Outfit',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;color:#C4703F;margin-bottom:8px;">${escHtml(tier.tier_title)}</div>
```

**Step 2:** Remove the numeric "Session depth score: N of 100" line from hero.

**Step 3:** Build, deploy, visually verify against 2-3 existing blueprints across tiers.

**Step 4:** Commit: `feat(phaseB): hero tier badge replaces numeric depth score`

### Task B.4: Tier detail card (below glance bar)

**Files:**
- Modify: `src/index.js` (add tier-detail section + copy)

**Step 1:** Add tier descriptions map in render function:

```javascript
const TIER_DESCRIPTIONS = {
  "Didn't Flinch Once": "You went straight at every question that most people duck. No softening, no hedging. That capacity to name the real thing is the difference between a brand that attracts and one that blends in.",
  "Sat With The Fire": "You didn't rush through the hard parts. When the interview asked you to name something uncomfortable, you stayed in it. That capacity to sit with what most people run from is the thing your clients feel when they work with you.",
  "Named The Pattern": "You caught yourself doing the thing. That kind of self-awareness is rare. It means you can see the gap between where you are and where your work wants to take you, and that gap is where real positioning lives.",
  "Told On Yourself": "You said the quiet part out loud. Not all of it, but enough to matter. The next version of this work is about staying in those moments a little longer. The clarity is on the other side of the discomfort.",
  "Took The First Swing": "You showed up and answered the questions. That counts more than it feels like. Most people never get here. Come back when you have more space, more time, and fewer distractions. The deeper layer is waiting."
};
```

**Step 2:** Render card below glance bar:

```html
<div class="tier-card"><div class="tier-card-inner"><div class="tier-card-label">${escHtml(tier.tier_title)}</div><p class="tier-card-body">${escHtml(TIER_DESCRIPTIONS[tier.tier_title] || '')}</p></div></div>
```

**Step 3:** Add CSS for `.tier-card` (gold accent, centered, 600px max-width).

**Step 4:** Deploy + smoke-test.

**Step 5:** Commit: `feat(phaseB): add tier detail card with per-tier copy`

### Task B.5: Log tier_viewed event on blueprint page load

**Files:**
- Modify: `src/index.js` (in blueprint render HTML, add client-side fetch on load)

**Step 1:** In the blueprint page script block, add:

```javascript
fetch('/api/event/tier-viewed', { method: 'POST', credentials: 'include', body: JSON.stringify({ sessionId: '${sessionId}', tier: '${tier.tier_title}' }) }).catch(()=>{});
```

**Step 2:** Add endpoint `POST /api/event/tier-viewed` that calls `logSessionEvent`.

**Step 3:** Deploy, load a blueprint, verify event lands in session_events.

**Step 4:** Commit: `feat(phaseB): track tier_viewed event on blueprint load`

### Task B.6: Snapshot tests for renderer across all 5 tiers

**Files:**
- Create: `tests/snapshot/blueprint-render.test.js`
- Create: `tests/fixtures/tier-A-plus.json`, `tier-A.json`, `tier-B-plus.json`, `tier-B.json`, `tier-C.json`

**Step 1:** Create 5 minimal fixture blueprints + sessionMeta with distinct depth scores.

**Step 2:** Write snapshot tests asserting the tier_title appears in rendered HTML for each fixture.

**Step 3:** Run tests, expect initial snapshots to be written (vitest auto-creates).

**Step 4:** Commit: `test(phaseB): snapshot tests for 5-tier renderer`

### Phase B gate

- [ ] All tests pass
- [ ] Blueprint renders show tier badge in hero
- [ ] Glance bar shows 5 new stats, no numeric depth
- [ ] Tier card renders with correct copy per tier
- [ ] 3+ existing blueprints reloaded show new tier UI correctly
- [ ] Admin session view still shows depth_grade + emotional_depth_score

**Merge PR 2 to main.**

---

## Phase A — Completion Rate

### Task A.1: Fix PhaseGuard root cause (stuck-at-phase-1 bug)

**Files:**
- Modify: `src/index.js` (PhaseGuard function + system prompt)

**Step 1:** Diagnose `sess_1775326982157_ce9fjz` (99 msgs stuck at phase 1). Read last 20 messages via D1 KV query.

**Step 2:** Identify why METADATA blocks stopped emitting (likely: model token budget hit, or metadata emission dropped after N turns).

**Step 3:** Add defensive fallback in PhaseGuard: if no METADATA seen in last 3 assistant turns, inject `[PHASE_CHECK]` prompt asking model to emit current phase.

**Step 4:** Deploy.

**Step 5:** Commit: `fix(phaseA): PhaseGuard fallback when METADATA emission drops`

### Task A.2: Auto-advance safety ceiling

**Files:**
- Modify: `src/index.js` (add phase_messages_in_current_phase tracking)

**Step 1:** Track per-phase message count in session metadata.

**Step 2:** When user has 12+ responses in a single phase, inject system message: "User has answered N questions in phase X. Acknowledge their answer and move to phase X+1 with a transition statement."

**Step 3:** Log `phase_auto_advanced` event with session_id + from_phase + to_phase.

**Step 4:** Deploy + test by watching a live session or simulating via test.

**Step 5:** Commit: `feat(phaseA): auto-advance after 12 responses in single phase`

### Task A.3: Create `nudges` table

**Files:**
- Create: `migrations/2026-04-05-phaseA-nudges-table.sql`

**Step 1:** SQL:

```sql
CREATE TABLE IF NOT EXISTS nudges (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_email TEXT,
  nudge_type TEXT NOT NULL,
  sent_at DATETIME NOT NULL,
  bounced INTEGER DEFAULT 0,
  opened INTEGER DEFAULT 0,
  opened_at DATETIME
);
CREATE INDEX idx_nudges_session ON nudges(session_id);
CREATE INDEX idx_nudges_email ON nudges(user_email);
```

**Step 2:** Apply via D1 MCP.

**Step 3:** Commit.

### Task A.4: Add `nudges_opted_out` to users table

```sql
ALTER TABLE users ADD COLUMN nudges_opted_out INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN nudges_opted_out_at DATETIME;
```

Apply, commit.

### Task A.5: Nudge scheduling logic

**Files:**
- Modify: `src/index.js` — add `computeNextNudge(session, existingNudges, now)` pure function + tests

**Step 1:** Test cases:
- Cold abandoned, 0 nudges sent → schedule `cold_48h` for 48h after created_at
- Cold abandoned, 1 nudge sent (cold_48h >2d ago) → schedule `cold_7d`
- Cold abandoned, 2 nudges sent → stop
- Mid-drop on phase 2 (emotional), 5d idle → schedule `mid_drop_initial`
- Mid-drop on phase 4 (structural), 2d idle → schedule `mid_drop_initial`
- Last user msg >80 words → add 48h grace
- User opted out → stop
- Welcome email <48h ago → skip

**Step 2:** Implement pure function returning `{ nudge_type, send_after } | null`.

**Step 3:** Tests pass.

**Step 4:** Commit: `feat(phaseA): computeNextNudge scheduling logic`

### Task A.6: Nudge sender (dry-run first)

**Files:**
- Modify: `src/index.js` — add `sendNudge(env, session, nudgeType, dryRun)`

**Step 1:** Template functions `renderNudgeEmail(nudgeType, session)` returning `{ subject, html }` for 4 types: `cold_48h`, `cold_7d`, `mid_drop_initial`, `mid_drop_followup`.

**Step 2:** Copy per template (James voice, no urgency, unsubscribe link).

**Step 3:** Sender checks `dry_run` flag; if true, logs to session_events without calling Resend.

**Step 4:** On live send, writes row to `nudges` table + `nudge_sent` event.

**Step 5:** Commit: `feat(phaseA): sendNudge with dry-run mode + 4 templates`

### Task A.7: 15-minute cron for nudge scanning

**Files:**
- Modify: `wrangler.toml` — add cron `*/15 * * * *`
- Modify: `src/index.js` — add `scanAndSendNudges(env, ctx)` to scheduled handler

**Step 1:** Scan active sessions where `last_active_at < now - 1 hour` (candidates).

**Step 2:** For each candidate, call `computeSessionHealth` + `computeNextNudge`.

**Step 3:** If nudge due and not already sent, call `sendNudge`.

**Step 4:** Ship with flag `FLAG_NUDGES_ENABLED=dry_run` initially.

**Step 5:** Deploy, watch `session_events` for 2-3 days, confirm targeting.

**Step 6:** Commit: `feat(phaseA): 15min cron scanner + nudge dispatcher`

### Task A.8: Admin alert for shallow completions

**Files:**
- Modify: `src/index.js` — trigger inside blueprint completion path

**Step 1:** After blueprint generation succeeds, check `depth_grade === 'C'`.

**Step 2:** If yes, send email to `james@jamesguldan.com` via Resend with session_id, name, email, phase_scores breakdown, link to admin view.

**Step 3:** Log `admin_alert_fired` event.

**Step 4:** Deploy + test with a test session that scores low.

**Step 5:** Commit: `feat(phaseA): admin alert for shallow (C-grade) completions`

### Task A.9: Unsubscribe endpoint

**Files:**
- Modify: `src/index.js` — add `GET /api/unsubscribe?token=...`

**Step 1:** Token is signed HMAC of `user_id + 'nudge_unsub'`.

**Step 2:** Endpoint verifies token, sets `users.nudges_opted_out=1`, returns confirmation HTML page.

**Step 3:** Include unsubscribe link in all nudge templates.

**Step 4:** Commit: `feat(phaseA): one-click nudge unsubscribe`

### Phase A gate

- [ ] Stuck-at-phase-1 bug fixed, tested with replay
- [ ] Auto-advance triggers after 12 messages
- [ ] Nudge cron running, dry-run logs visible
- [ ] Admin alert triggered for C-grade completion
- [ ] Unsubscribe endpoint works
- [ ] 48h dry-run observation complete, targeting verified

**Flip `FLAG_NUDGES_ENABLED=live`. Merge PR 3 to main.**

---

## Phase C — Operator Dashboard + Cleanup

### Task C.1: `/admin/health` dashboard HTML

**Files:**
- Modify: `src/index.js` — add `handleAdminHealthDashboard(request, env)`

**Step 1:** Auth-gate with existing admin check.

**Step 2:** Query 5 panels server-side: health state counts, active interviews (24h), recent completions (7d), nudge queue, error pulse.

**Step 3:** Render single HTML page with auto-refresh every 30s via meta refresh or fetch polling.

**Step 4:** Add nav entry in existing admin nav.

**Step 5:** Deploy + visual smoke test.

**Step 6:** Commit: `feat(phaseC): /admin/health live dashboard`

### Task C.2: Conditional daily email — "issues only"

**Files:**
- Modify: `src/index.js` — add `runDailyDigest(env)` in scheduled handler
- Modify: `wrangler.toml` — add cron `0 11 * * *` (7am ET = 11am UTC)

**Step 1:** Query all 8 trigger conditions.

**Step 2:** If ANY fire, compose email with terse one-line-per-issue body + deep links.

**Step 3:** If NONE fire, do nothing.

**Step 4:** Weekly heartbeat on Sundays regardless.

**Step 5:** Send via Resend to `james@jamesguldan.com`.

**Step 6:** Deploy + manually trigger via test endpoint to verify rendering.

**Step 7:** Commit: `feat(phaseC): issues-only daily email digest`

### Task C.3: Cleanup audit pass

**Files:**
- Create: `CLEANUP.md`
- Modify: `src/index.js` (consolidate / remove flagged items)

**Step 1:** For each target in design doc cleanup table, trace usage + decide keep/merge/remove.

**Step 2:** Document decisions in `CLEANUP.md` with before/after counts.

**Step 3:** Remove dead code in small atomic commits (one per target area).

**Step 4:** Final commit: `chore(phaseC): cleanup audit, see CLEANUP.md`

### Phase C gate

- [ ] `/admin/health` loads, all 5 panels render
- [ ] Issues-only email fires when triggers hit, skips on clean days
- [ ] Weekly heartbeat scheduled
- [ ] `CLEANUP.md` committed with before/after LOC
- [ ] No regressions in existing admin views

**Merge PR 4 to main.**

---

## Execution Order

Phase 0 (tasks 0.1-0.9) → Phase B (B.1-B.6) → Phase A (A.1-A.9) → Phase C (C.1-C.3).

Each phase is a separate branch and PR:
- `phase-0-observability-foundation`
- `phase-b-emotional-payoff`
- `phase-a-completion-rate`
- `phase-c-operator-dashboard`

Feature flags control activation. Rollback = flip flag or revert merge.

## Success Metrics (measure 2 weeks post Phase A)

- Completion rate: target 70%+ (from ~18% clean)
- Tier distribution balanced (no single tier >60%)
- Nudge open rate (if Resend webhooks wired): >20%
- Stuck recovery: auto-advance within 2 msgs of detection
- Alert emails to James: <3/week
