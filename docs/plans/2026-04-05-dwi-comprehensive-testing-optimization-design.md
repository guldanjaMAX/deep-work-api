# DWI Comprehensive Testing & Optimization — Design Doc

**Date:** 2026-04-05
**Author:** James Guldan + Claude (Opus 4.6)
**Status:** Approved, ready for implementation planning

---

## Summary

Four-phase program to ship, in order:

1. **Phase 0 — Observability Foundation** (invisible, 2-3 days): standardize signals so subsequent phases compound on shared plumbing.
2. **Phase B — Emotional Payoff** (first user-visible): replace single "Depth Confidence" number with a 5-stat celebration bar and an earned tier title. Every completer gets named recognition.
3. **Phase A — Completion Rate**: detect four failure modes (stuck-phase, cold abandonment, mid-session drop, shallow completion) and respond with auto-recovery, gentle email nudges, or admin alerts. Phase-aware — emotional phases get longer grace periods.
4. **Phase C — Operator Dashboard + Cleanup**: live admin health page, conditional "issues only" email, moderate cleanup audit of unused code and redundant tables.

**Priority order declared by James:** B → A → C. Phase 0 is invisible infrastructure enabling all three.

---

## Context — Current State (Apr 5, 2026)

D1 snapshot from `92121f3b-dcfb-4fa8-8482-b827224b611d`:

| Metric | Value |
|--------|-------|
| Total sessions | 87 |
| Clean completions (status: completed / blueprint_complete) | 16 |
| Sessions marked "restarted" | 59 (34 eventually got blueprints) |
| Sessions stuck "active" | 11 (one has 99 messages still on Phase 1) |
| Errors logged (error_log) | 35 (24 anthropic_api, 8 stripe, 3 checkout) |
| Session events tracked | 2,410 |
| Metrics captured | 1,759 |
| Active alerts table | 2 rows |
| Phase scores captured | 80 |

**Depth grade distribution of completions:**
- A+: 4, A: 4, B+: 3, B: 1, C: 3

**The "depth score 40" problem:** a legitimate C-grade (10/25 from Claude 5-dimension scoring) maps to `40` in the hero via `Math.round(score/25*100)`. The score is accurate but feels like failure.

**Completion rate:** 16/87 clean = ~18%. Even counting restarts, ~40%. Target: 70%+.

**Infrastructure already present (underutilized):** `error_log`, `event_log`, `session_events`, `health_checks`, `metrics`, `alerts`, `api_costs`, `token_usage`, `phase_scores`, `weekly_snapshots`, `prompt_versions`.

---

## Approach — Thin Observability Foundation, Then B → A → C

Chosen over strict sequential (no instrumentation until Phase C) or parallel tracks (too risky with no test coverage). Phase 0 delays user-visible ship by ~2-3 days but pays back across all three phases because the data is already flowing — we just need to structure it and surface it.

---

## Phase 0 — Observability Foundation (invisible to users)

**Goal:** standardize signals. No user-facing changes.

### Components

1. **`computeUserTier(depth_score)`** — pure function, single source of truth for tier mapping:
   - A+ (23-25) → "Didn't Flinch Once"
   - A (20-22) → "Sat With The Fire"
   - B+ (17-19) → "Named The Pattern"
   - B (14-16) → "Told On Yourself"
   - C (<14) → "Took The First Swing"

2. **`computeSessionHealth(session)`** — pure derivation. Returns one of: `healthy | stuck_phase | cold_abandoned | mid_drop | shallow_complete | failed | complete`. Rules based on phase, message_count, last_active_at, status, depth_grade.

3. **Event log standardization.** Audit 12 existing event types in `session_events`. Add missing critical moments:
   - `blueprint_job_started`, `blueprint_job_failed`
   - `phase_stuck_detected`, `phase_auto_advanced`
   - `nudge_scheduled`, `nudge_sent`, `nudge_opened`, `nudge_bounced`
   - `admin_alert_fired`
   - `tier_computed`

4. **`error_log` enrichment** — add `session_id` and `user_email` columns so errors pivot to users.

5. **Sessions table additions** — 3 nullable columns: `tier_title TEXT`, `session_health TEXT`, `health_updated_at DATETIME`.

6. **Backfill endpoint** — `POST /api/admin/backfill-health` with `?dry_run=true|false`. Computes tier + health for all 87 existing sessions, writes to D1.

7. **Hourly cron worker** — snapshots to `health_checks`: session counts by state, error rate last hour, active sessions. Enables trending.

### Deliverables
3 DB columns, 1 cron, 1 backfill endpoint, standardized event names, zero user-visible changes.

---

## Phase B — Emotional Payoff (ship first user-visible)

**Goal:** when someone finishes the interview, they feel recognized, not graded.

### Hero redesign

- **Current:** `Session depth score: 40 of 100` (feels bad at low scores)
- **New:** hero shows tier title as small-caps eyebrow badge above the first name. Name is centerpiece; title is earned recognition.
- No numeric score visible in hero.

### New 5-stat glance bar (replaces current 5)

| Stat | Source | Floor behavior |
|------|--------|---------------|
| Minutes of Deep Work | existing | always shows actual minutes |
| Honest Answers | count user msgs >40 words | floor at count, typically 8+ |
| Breakthrough Moments | count user msgs with emotional markers ("I realized", "I've never", "I don't usually") | floor at 1 if any marker found |
| Belief Patterns Named | existing | floor behavior existing |
| Your Tier | `tier_title` from Phase 0 | always a title, never blank |

No user ever sees "—" or "0".

### Tier detail card (new, below glance bar)

One card explaining what their tier means. Five pre-written descriptions (James voice — witty, direct, no dashes, no exclamation points, personality-forward). Example for "Sat With The Fire":

> **Sat With The Fire.** You didn't rush through the hard parts. When the interview asked you to name something uncomfortable, you stayed in it. That capacity, to sit with what most people run from, is the thing your clients feel when they work with you.

### Admin-only visibility
Keep `depth_grade` and `emotional_depth_score` visible on all admin session views. Hidden from user blueprint render.

### Migration
Phase 0 backfill gives every existing session a `tier_title`. Old blueprints reload with new tier display automatically.

### Measurement
Log `tier_viewed` event on blueprint page load. Track distribution. If >60% are showing "Took The First Swing" after 10+ new completions, scoring threshold needs recalibration.

### Not in scope
No scoring algorithm changes, no hero visual redesign beyond above, no new Anthropic calls.

---

## Phase A — Completion Rate

**Goal:** fewer sessions fall through the cracks. Interventions are gentle, phase-aware, and designed to respect emotional depth.

### Four failure modes, four interventions

#### 1) Stuck-phase → Auto-recovery (no human)

- **Detection:** session has 15+ messages but phase hasn't advanced in 12+ messages, OR 30+ total messages still on phase ≤2.
- **Root cause fix:** diagnose the 99-message-stuck-at-phase-1 session. PhaseGuard relies on model-emitted METADATA blocks; if the model stops emitting them, phase never advances. Fix the root cause in the system prompt + PhaseGuard logic.
- **Safety net:** hard ceiling — after 12 user responses in a single phase, force-advance with a system message to the model: "The user has answered enough in phase N. Move to phase N+1."
- **Fires events:** `phase_stuck_detected`, `phase_auto_advanced`.

#### 2) Cold abandonment → Gentle nudge

- **Detection:** `message_count === 0` AND created >24h ago.
- **Frequency:** one email at 48h, one at 7 days, stop.
- **Tone:** "When you're ready. The door stays open." No urgency.
- **Respect welcome email:** skip if welcome sent <48h ago.

#### 3) Mid-session drop → Phase-aware check-in

- **Emotional/reflective phases (2, 3, 5, 8):** silence is sacred. Wait **5 days** before first check-in.
- **Structural phases (1, 4, 6, 7):** wait **48 hours** before first check-in.
- **Productive pause bonus:** if last user message was >80 words, add 48h to threshold (reward thoughtfulness).
- **Max 2 check-ins per session.** Second at +7 days, then stop.
- **Copy:** "You're in the hard part of this. Most people need time to sit with these questions. The link is here when you're ready."

#### 4) Shallow completion → Admin alert to James

- **Detection:** `blueprint_generated === 1` AND `depth_grade === 'C'`.
- **Alert:** email to James within 1 hour. Includes session ID, name/email, phase_scores breakdown, admin link.
- **Silent to user.** James decides whether to reach out personally.

### Safety overrides

- Max 2 emails per user per session
- Max 4 emails per user lifetime across all sessions
- Skip scheduled nudges if user opened welcome or blueprint-ready email <48h ago
- Unsubscribe link on every user nudge email
- Writes to `users.nudges_opted_out` on unsubscribe click

### Copy voice
James-direct, no urgency. No exclamation points. No "don't miss out". No countdown timers.

### Infrastructure
- Cron worker runs every 15 minutes, scans active sessions, runs `computeSessionHealth`, triggers nudge/alert on state transitions.
- New `nudges` table: `session_id`, `nudge_type`, `sent_at`, `bounced`, `opened`.
- Resend templates: 4 user emails (cold_48h, cold_7d, mid_drop_initial, mid_drop_followup) + 1 admin alert.
- Resend webhook integration for bounces + opens (best-effort).

---

## Phase C — Operator Dashboard + Cleanup

### Live admin dashboard — new tab at `/admin/health`

Refreshes every 30s. Five panels:

1. **Right now:** counts by health state, clickable. Active-this-hour. Blueprint jobs in flight.
2. **Active interviews:** table of sessions touched last 24h (name, phase, messages, minutes idle, tier, health badge, admin link).
3. **Recent completions (7 days):** tier distribution chart, completion list with tier badges, shallow-completion flags.
4. **Nudge queue:** scheduled next 24h + sent last 24h + opens/clicks.
5. **Error pulse:** errors last 24h by type, click-through to filtered error_log.

### Conditional daily email — "issues only"

Fires **only** if any of these are true in last 24h:

- 1+ shallow completions (C-grade)
- 1+ stuck_phase auto-recoveries
- 1+ mid-session drops detected
- Error rate >10/day OR >3x 7-day rolling average
- 0 completions on a day with 3+ active sessions
- Nudge send failure or bounce
- Any active session stuck at same phase >48h
- Any blueprint generation job failed

**Subject:** `DWI Alert — 2 shallow completions, 1 stuck recovery` (leads with issue count).

**Body:** terse, one line per issue + deep link. Empty sections skip. No email on healthy days.

**Weekly heartbeat:** Sunday 7am ET confirms cron is alive (silence = healthy, not broken).

### Moderate cleanup audit

| Target | Action |
|--------|--------|
| `renderBlueprintV3`, `renderBlueprintResults`, `handleBlueprintRender` | Consolidate to single entry |
| `api_costs` vs `token_usage` (1075 vs 1064 rows) | Verify redundancy, merge or deprecate one |
| `weekly_snapshots` | Verify still written, remove if orphaned |
| `prompt_versions` | Verify queried, keep if so |
| `handleAdminPatchBlueprints` (one-off) | Convert to reusable admin tool OR remove |
| Orphaned admin UI buttons calling dead endpoints | Remove |
| `health_checks` table | Repurpose for Phase 0 cron |

**Rules:** removed items documented in PR body with "why removed + date". Questionable-but-kept items get a top-of-function comment: `// Kept YYYY-MM-DD because X — remove if X no longer true`.

**Output:** `CLEANUP.md` listing before/after counts (routes, functions, tables, LOC) + decisions.

---

## Testing Strategy (realistic, not gold-plated)

Given the 23K-line pre-compiled bundle has zero test coverage today:

1. **Unit tests for pure functions** — `computeUserTier`, `computeSessionHealth`, `stripChatMeta`, nudge trigger logic (~10 functions). Local node + vitest. Fast, high-value.
2. **Snapshot tests for blueprint renderer** — 5 golden fixtures (one per tier) + expected HTML output. Catches render regressions.
3. **E2E smoke test** — scripted "session" posts known transcript through `runBlueprintJob`, asserts all 9 blueprint fields + tier + health state. Nightly GitHub Action.
4. **Integration contract tests** — request/response shape for each new endpoint.

**Not in scope:** worker-runtime tests, load tests, browser tests.

---

## Migration — 87 Existing Sessions

1. Deploy Phase 0 schema (3 nullable columns, backwards-compatible).
2. Run `POST /api/admin/backfill-health?dry_run=true` — returns JSON report. Review.
3. Run same endpoint with `dry_run=false` — commits tier + health.
4. Verify distribution at `/admin/health`.
5. **Rollback:** `UPDATE sessions SET tier_title=NULL, session_health=NULL`.

---

## Rollout — Four PRs, Feature-Flagged

| PR | Ships | Flag | Risk |
|----|-------|------|------|
| 1 | Phase 0 foundation | `FLAG_HEALTH_V2` | Low (invisible) |
| 2 | Phase B tier system | `FLAG_TIER_HERO` | Medium (user-visible) |
| 3 | Phase A nudges + recovery | `FLAG_NUDGES_ENABLED` (dry_run → live) | Medium-high (sends emails) |
| 4 | Phase C dashboard + cleanup | `FLAG_ADMIN_HEALTH_V2` + cleanup commits | Low (admin-only) |

**Dry-run nudges:** PR 3 ships with `FLAG_NUDGES_ENABLED=dry_run` — cron runs, logs what it would send to `session_events`, sends nothing. Watch 2-3 days, confirm targeting, flip to `live`.

**Rollback:** each flag disables via `wrangler secret put` without redeploy. Bad behavior killed in <60s.

---

## Success Metrics (measure 2 weeks after Phase A ships)

- **Completion rate:** target 70%+ reach blueprint (currently ~18% clean, ~40% including eventual-completers)
- **Tier distribution:** if >60% C-tier, recalibrate thresholds in `computeUserTier`
- **Nudge impact:** % of mid-drop sessions that resume after email
- **Stuck recovery:** auto-advance within 2 messages of detection
- **James's inbox:** <3 DWI alert emails per week indicates healthy

---

## Decisions Log

| Decision | Choice | Why |
|----------|--------|-----|
| Priority order | B → A → C | James's stated preference; emotional payoff blocks most today |
| Depth score fix strategy | Hybrid: dashboard of 5 metrics + earned tier | Neither lies (no curve) nor buries the grade — multiple winning dimensions |
| Tier voice | Witty / personality-first | Matches James's copy preferences per memory |
| Grade visibility | Admin only | Users see tier title, operators see full grade + score |
| Nudge tone | "Checking in, no rush" | Story/emotional phases need space, not urgency |
| Phase-aware thresholds | Yes (48h structural, 5d emotional) | Respects the depth of the work |
| Daily digest | Issues only + weekly heartbeat | Avoid James-inbox burnout; absence = health |
| Cleanup scope | Moderate audit | James hinted things aren't used; worth real look but not a rewrite |
| Test strategy | Unit + snapshot + smoke | Pragmatic for no-test-coverage codebase |

---

## Open Questions (resolve during implementation planning)

1. Does Resend webhook data for opens/bounces already flow into D1? If not, is it worth adding?
2. Should the tier card use a different visual treatment per tier (color per grade) or uniform?
3. Should nudge emails include a mini-summary of where they left off, or just a resume link?
4. For the shallow-completion admin alert, do we want a suggested outreach script auto-drafted?
