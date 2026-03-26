# Multi-File Refactor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor the 19,587-line bundled `src/index.js` into clean ES modules without changing any behavior.

**Architecture:** Strangler-fig pattern. Create all new module files first (additive, non-breaking), then swap `index.js` to a thin entry point that imports them. This means every phase except the final swap is safe to commit and deploy.

**Tech Stack:** Cloudflare Workers, ES modules, Wrangler bundler, D1/KV/R2 bindings

---

## Existing Module Inventory

These files already exist in `src/` with clean exports. They are NOT imported by the current bundled `index.js` (it has inlined copies). After refactoring, `index.js` will import from them.

| File | Lines | Key Exports |
|------|-------|-------------|
| `auth.js` | 208 | `hashPassword`, `verifyPassword`, `createSessionToken`, `verifySessionToken`, `generateMagicToken`, `storeMagicToken`, `consumeMagicToken`, `getUserByEmail`, `getUserById`, `createUser`, `requireAuth`, `requireAdmin`, `extractToken`, `getSetting`, `setSetting`, `getAllSettings` |
| `admin.js` | 1,579 | `getAdminHTML()` |
| `html.js` | 4,984 | `getHTML(config)` |
| `legal.js` | 217 | `getPrivacyPolicyHTML()`, `getTermsOfServiceHTML()` |
| `login.js` | 520 | `getLoginHTML()` |
| `monitor.js` | 680 | `logError`, `trackMetric`, `runFullHealthCheck`, `checkFunnelHealth`, `trackAPICall`, `trackFunnelEvent`, `createAlert`, `generateDailyDigest`, `handleMonitoringDashboard`, `getErrorPageHTML`, `ERROR_PAGES` |
| `prompts.js` | 823 | `DEEP_WORK_SYSTEM_PROMPT`, `SITE_GENERATION_PROMPT`, `STRATEGIST_DEBRIEF_PROMPT`, `buildImagenPrompt`, `imagePrompts`, `getThemeCSS`, `selectTheme`, `contextEnrichmentPrompt`, `getAestheticOverrides` |

---

## Route Handler Extraction Map

These functions live in the bundled `index.js` and need to be extracted into new files.

### routes/auth.js (from index.js)
| Function | Line | Route |
|----------|------|-------|
| `handleAuthLogin` | 18371 | POST /api/auth/login |
| `handleAuthRegister` | 18406 | POST /api/auth/register |
| `handleAuthMagic` | 18439 | POST /api/auth/magic |
| `handleRequestMagic` | 18473 | POST /api/auth/request-magic |
| `handleAuthMe` | 18526 | GET /api/auth/me |
| `handleFastResume` | 14262 | GET /api/auth/fast-resume |
| `handleSetPassword` | 18536 | POST /api/auth/set-password |
| `handleMagicLink` | 18610 | GET /magic |
| `handlePaymentSuccess` | ~13357 | GET /payment-success |

### routes/session.js (from index.js)
| Function | Line | Route |
|----------|------|-------|
| `handleSessionStart` | 14022 | POST /api/session/start |
| `handleSessionClaim` | 13943 | POST /api/session/claim |
| `handleSessionResume` | 14217 | POST /api/session/resume |
| `handleSessionRestart` | 19546 | POST /api/session/restart |
| `handleGetSession` | 14130 | GET /api/session/:id |
| `handleUserActiveSession` | 14150 | GET /api/user/active-session |

### routes/interview.js (from index.js)
| Function | Line | Route |
|----------|------|-------|
| `handleChat` | 14680 | POST /api/chat |
| `handleIntakeChat` | 17855 | POST /api/intake/chat |
| `handleTestBlueprint` | 14334 | POST /api/test/blueprint |

### routes/blueprint.js (from index.js)
| Function | Line | Route |
|----------|------|-------|
| `handleBlueprintPDF` | 17836 | POST /api/blueprint/pdf |

### routes/upload.js (from index.js)
| Function | Line | Route |
|----------|------|-------|
| `handleUpload` | 14949 | POST /api/upload |
| `handlePhotoProcess` | 15020 | POST /api/photo/process |
| `handleGenerateImages` | 15135 | POST /api/generate/images |
| `handleGenerateSectionImage` | 15185 | POST /api/generate/section-image |
| `handleGenerateSectionVariants` | 15639 | POST /api/generate/section-variants |

### routes/site.js (from index.js)
| Function | Line | Route |
|----------|------|-------|
| `handleGenerateSite` | 15868 | POST /api/generate/site |
| `handleSaveSectionChoices` | 15780 | POST /api/generate/save-section-choices |
| `handleDeployPickerSite` | 15802 | POST /api/generate/deploy-picker-site |
| `handleDeploy` | 16262 | POST /api/deploy |
| `handleRefineSite` | 16319 | POST /api/refine-site |
| `handleExport` | 16479 | POST /api/export |
| `handleExportSite` | 16508 | GET /api/export-site |
| `handleServeSite` | 16215 | GET /s/:name |

### routes/payment.js (from index.js)
| Function | Line | Route |
|----------|------|-------|
| `handleCreatePaymentIntent` | 13693 | POST /api/create-payment-intent |
| `handleFulfillPayment` | 13734 | POST /api/fulfill-payment |
| `handlePaymentStatus` | 13790 | GET /api/payment-status |
| `handleCheckout` | 13809 | POST /api/checkout |
| `handleWebhook` | 13966 | POST /api/webhook |

### routes/admin.js (from index.js)
| Function | Line | Route |
|----------|------|-------|
| `handleAdminStats` | 18678 | GET /api/admin/stats |
| `handleAdminListUsers` | 18713 | GET /api/admin/users |
| `handleAdminCreateUser` | 18741 | POST /api/admin/users |
| `handleAdminListSessions` | 18822 | GET /api/admin/sessions |
| `handleAdminGetSession` | 18850 | GET /api/admin/session/:id |
| `handleAdminMagicLink` | 18881 | POST /api/admin/magic-link |
| `handleAdminGetSettings` | 19168 | GET /api/admin/settings |
| `handleAdminSaveSettings` | 19183 | POST /api/admin/settings |
| `handleAdminGetPrompt` | 19204 | GET /api/admin/prompt |
| `handleAdminSavePrompt` | 19225 | POST /api/admin/prompt |
| `handleAdminGenerateDebrief` | 18794 | POST /api/admin/generate-debrief |
| `handleAdminInjectDebrief` | 18771 | POST /api/admin/inject-debrief |
| `handleAdminTestBlueprint` | 18912 | POST /api/admin/generate-test-blueprint |
| `handleAdminQuickTestSession` | 19059 | POST /api/admin/quick-test-session |
| `handleHealthCheck` | 19249 | GET /api/admin/health |
| `handleMonitoring` | 19260 | GET /api/admin/monitoring |
| `handleDigest` | 19271 | POST /api/admin/digest |
| `handleAdminErrors` | 19282 | GET /api/admin/errors |
| `handleAPIUsage` | 19295 | GET /api/admin/api-usage |
| `handleResolveAlert` | 19339 | POST /api/admin/resolve-alert |
| `handleAdminTestTrigger` | 19449 | POST /api/admin/test-trigger |
| `handleSystemHealthCheck` | 19449 | GET /api/admin/system-health |
| `handleAdminUsage` | 19460 | GET /api/admin/usage |
| `handleAdminUserUsage` | 19489 | GET /api/admin/usage/user |
| `handleAdminPurgeKV` | 19513 | POST /api/admin/purge-kv |

### routes/feedback.js (from index.js)
| Function | Line | Route |
|----------|------|-------|
| `handleFeedback` | 17977 | POST /api/feedback |
| `handleLogEvent` | 17995 | POST /api/log-event |

### routes/pages.js (static page routing)
| Path | Handler | Line |
|------|---------|------|
| `/` | `getLoginHTML()` | 13340 |
| `/app` | `getHTML(config)` | 13346 |
| `/admin` | `getAdminHTML()` | 13354 |
| `/logout` | inline | 13376 |
| `/privacy` | `getPrivacyPolicyHTML()` | 13394 |
| `/terms` | `getTermsOfServiceHTML()` | 13396 |
| `/legal/privacy` | `getLegalHTML(...)` | 13556 |
| `/legal/terms` | `getLegalHTML(...)` | 13539 |
| `/health` | inline | 13575 |

---

## Utility/Helper Extraction Map (from index.js)

### utils/helpers.js
| Function | Line | Purpose |
|----------|------|---------|
| `json(data, status, request)` | ~13270 | JSON response helper with CORS |
| `getCORSHeaders(request)` | 13283 | CORS header builder |
| `htmlHeaders(request)` | 13299 | HTML response headers with CSP |
| `verifyStripeSignature` | ~13973 | Stripe webhook signature check |

### utils/constants.js
| Constant | Line | Purpose |
|----------|------|---------|
| `SEC_HEADERS` | 13291 | Security headers object |
| Product config objects | scattered | Stripe price IDs, tier definitions |

---

## Tasks

### Task 0: Fix CI/CD and clean up stale files

**Files:**
- Modify: `.github/workflows/deploy.yml`
- Delete: `dist-worker-patched.js`
- Delete: `src/index.js.fixed`

**Step 1: Update deploy.yml**

Replace the hardcoded `grep` checks with a real bundler test:

```yaml
name: Deploy Worker
on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    name: Deploy to Cloudflare Workers
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Verify bundle builds
        run: npx wrangler@3 deploy --dry-run --outdir=.verify-bundle 2>&1 | tee /tmp/bundle-check.log
      - name: Check bundle for critical routes
        run: |
          grep -q "create-payment-intent" .verify-bundle/*.js || (echo "ERROR: payment routes missing from bundle" && exit 1)
          grep -q "fulfill-payment" .verify-bundle/*.js || (echo "ERROR: fulfill-payment route missing from bundle" && exit 1)
          echo "Payment routes verified in bundle OK"
      - name: Deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
        run: npx wrangler@3 deploy --keep-vars
```

**Step 2: Delete stale files**

```bash
cd /tmp/dwa
git rm dist-worker-patched.js
git rm src/index.js.fixed
```

**Step 3: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "chore: fix CI to check bundle output, delete stale artifacts"
```

---

### Task 1: Create the router and utility modules

**Files:**
- Create: `src/router.js`
- Create: `src/utils/helpers.js`
- Create: `src/utils/constants.js`

**Step 1: Create `src/utils/helpers.js`**

Extract from index.js (lines ~13270-13315):
- `json()` response helper
- `getCORSHeaders()`
- `htmlHeaders()`
- `SEC_HEADERS`

All functions receive `request` (for origin checking) and return headers/responses.

**Step 2: Create `src/utils/constants.js`**

Extract product configuration, Stripe price IDs, tier definitions. These are currently scattered through index.js.

**Step 3: Create `src/router.js`**

This is the route dispatch table. Structure:

```javascript
import { json, getCORSHeaders, htmlHeaders } from './utils/helpers.js';

// Route imports (will be populated in later phases)
// import { handleAuthLogin, ... } from './routes/auth.js';

export function routeRequest(request, env, ctx) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // CORS preflight
  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: getCORSHeaders(request) });
  }

  // Route dispatch table
  // ... (if/else chain from index.js lines 13339-13600)
}
```

**Step 4: Commit**

```bash
git add src/router.js src/utils/
git commit -m "feat: add router and utility modules (no behavior change)"
```

---

### Task 2: Create route handler modules

**Files:**
- Create: `src/routes/auth.js`
- Create: `src/routes/session.js`
- Create: `src/routes/interview.js`
- Create: `src/routes/blueprint.js`
- Create: `src/routes/upload.js`
- Create: `src/routes/site.js`
- Create: `src/routes/payment.js`
- Create: `src/routes/admin.js`
- Create: `src/routes/feedback.js`
- Create: `src/routes/pages.js`

**For each route file:**

1. Copy the handler functions from index.js (using the line numbers in the extraction map above)
2. Each function signature stays the same: `async function handleXxx(request, env, ...)`
3. Add imports at the top for any shared utilities or auth functions used
4. Export all handler functions

**Example structure for `src/routes/payment.js`:**

```javascript
import { json } from '../utils/helpers.js';
import { requireAuth } from '../auth.js';

export async function handleCreatePaymentIntent(request, env) {
  // ... exact code from index.js line 13693+
}

export async function handleFulfillPayment(request, env) {
  // ... exact code from index.js line 13734+
}

// ... etc
```

**CRITICAL: Do NOT modify any function bodies.** Copy exactly. The only changes are:
1. Adding `export` keyword
2. Adding `import` statements for dependencies
3. Removing `var __name(...)` wrappers (Wrangler handles this for ES modules)

**Step: Commit per route group (3 commits)**

```bash
# Commit 2a: auth + session + interview routes
git add src/routes/auth.js src/routes/session.js src/routes/interview.js
git commit -m "feat: extract auth, session, interview route handlers"

# Commit 2b: upload + site + blueprint + payment routes
git add src/routes/upload.js src/routes/site.js src/routes/blueprint.js src/routes/payment.js
git commit -m "feat: extract upload, site, blueprint, payment route handlers"

# Commit 2c: admin + feedback + pages routes
git add src/routes/admin.js src/routes/feedback.js src/routes/pages.js
git commit -m "feat: extract admin, feedback, pages route handlers"
```

---

### Task 3: Create service modules

**Files:**
- Create: `src/services/anthropic.js`
- Create: `src/services/stripe.js`
- Create: `src/services/resend.js`
- Create: `src/services/imagen.js`

**Step 1: Extract Anthropic service calls**

Find all `fetch('https://api.anthropic.com/v1/messages', ...)` patterns in index.js. Create a single `callAnthropic(env, messages, options)` helper that the route handlers will call.

**Step 2: Extract Stripe service calls**

Find all `fetch('https://api.stripe.com/v1/...', ...)` patterns. Create helpers like `createPaymentIntent(env, params)`, `getPaymentIntent(env, id)`, etc.

**Step 3: Extract Resend service calls**

Find all `fetch('https://api.resend.com/emails', ...)` patterns. Create `sendEmail(env, to, subject, html)` and `verifyDomain(env)`.

**Step 4: Extract Imagen service calls**

Image generation API calls. Create `generateImage(env, prompt, options)`.

**Step 5: Commit**

```bash
git add src/services/
git commit -m "feat: extract service modules (Anthropic, Stripe, Resend, Imagen)"
```

---

### Task 4: Move HTML templates

**Files:**
- Create: `src/html/` directory
- Move: `src/html.js` to `src/html/templates.js`
- Create: `src/html/styles.js` (optional, if CSS is extractable)

**CRITICAL WARNING:** The html.js file contains template literals with two-level escaping (template literal escaping + browser JS string escaping). Do NOT modify any string content. This is where the recent SyntaxError bugs came from.

**Step 1: Create directory and move file**

```bash
mkdir -p src/html
git mv src/html.js src/html/templates.js
```

**Step 2: Add escaping warning comment to top of templates.js**

```javascript
// ================================================================
// WARNING: TWO-LEVEL ESCAPING RULES
// ================================================================
// This file uses template literals that output HTML with <script> blocks.
// Inside those scripts, string escaping works at TWO levels:
//
// TEMPLATE LEVEL (this file)     BROWSER JS LEVEL (what browser sees)
// \\n  (4 chars: backslash n)  -> \n   (JS escape sequence = newline)
// \n   (actual newline)        -> newline char = SyntaxError in JS string!
// \\'  (backslash apostrophe)  -> \'   (escaped apostrophe, string continues)
// \'   (just apostrophe)       -> '    (string delimiter, string closes!)
//
// RULE: Inside any single/double-quoted JS string within a <script> block:
//   - Use \\n for newlines (not actual line breaks)
//   - Use \\' for apostrophes inside single-quoted strings
//   - Use \\" for double quotes inside double-quoted strings
// ================================================================
```

**Step 3: Commit**

```bash
git add src/html/
git commit -m "feat: move html.js to html/templates.js with escaping docs"
```

---

### Task 5: Wire the thin index.js entry point

This is the critical swap. All new modules exist. Now replace index.js.

**Files:**
- Rewrite: `src/index.js`

**Step 1: Back up current index.js**

```bash
cp src/index.js src/index.js.bundle-backup
```

**Step 2: Write new thin index.js**

```javascript
// src/index.js — Entry point for deep-work-api Worker
// Wrangler bundles all imports into a single deployed Worker.

import { routeRequest } from './router.js';
import { logError, createAlert, runAbandonmentCheck, runFullHealthCheck } from './monitor.js';

export default {
  async fetch(request, env, ctx) {
    try {
      return await routeRequest(request, env, ctx);
    } catch (err) {
      // Global error handler
      const requestId = crypto.randomUUID().slice(0, 8);
      const url = new URL(request.url);

      ctx.waitUntil(
        logError(env, {
          endpoint: url.pathname,
          method: request.method,
          statusCode: 500,
          errorType: err.name,
          errorMessage: err.message,
          stack: err.stack,
          requestId
        }).catch(() => {})
      );

      ctx.waitUntil(
        createAlert(env, {
          type: 'error',
          severity: 'high',
          title: 'Unhandled Error: ' + err.message,
          details: url.pathname + ' ' + request.method,
          requestId
        }).catch(() => {})
      );

      if (url.pathname.startsWith('/api/')) {
        return new Response(JSON.stringify({ error: 'Internal error', requestId }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response('Something went wrong. Reference: ' + requestId, { status: 500 });
    }
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil((async () => {
      try {
        await runAbandonmentCheck(env);
        if (event.cron === '0 9 * * *') {
          await runFullHealthCheck(env);
        }
      } catch (e) {
        console.error('Scheduled task error:', e.message);
      }
    })());
  }
};
```

**Step 3: Wire router.js with all route imports**

Update `src/router.js` to import all handler functions from their new route files and dispatch accordingly using the same if/else pattern from the original index.js lines 13339-13600.

**Step 4: Verify locally**

```bash
cd /tmp/dwa
CLOUDFLARE_API_TOKEN=EUnZ2dUo8vA3KljdV6tI_l_LcSsXpGdJuhAKJ00D npx wrangler@3 dev
```

Test in browser:
- `localhost:8787/` (login page loads)
- `localhost:8787/app` (app page loads, no console errors)
- `localhost:8787/admin` (admin page loads)

**Step 5: Commit**

```bash
git add src/index.js src/router.js
git rm src/index.js.bundle-backup  # only if tests pass
git commit -m "feat: rewire index.js as thin entry point importing all modules"
```

---

### Task 6: Add safety net (validators + pre-deploy check)

**Files:**
- Create: `src/utils/validators.js`
- Create: `scripts/check-client-js.js`

**Step 1: Create validators**

```javascript
// src/utils/validators.js
export function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validateSessionId(id) {
  if (!id || typeof id !== 'string') return false;
  return /^[a-zA-Z0-9_-]+$/.test(id) && id.length <= 128;
}

export function sanitizeString(str, maxLen = 1000) {
  if (typeof str !== 'string') return '';
  return str.slice(0, maxLen);
}
```

**Step 2: Create pre-deploy check script**

```javascript
// scripts/check-client-js.js
// Run before deploy: node scripts/check-client-js.js
// Verifies the client-side <script> tag has no SyntaxErrors

import { getHTML } from '../src/html/templates.js';

const html = getHTML({ stripePublishableKey: 'pk_test_xxx', prices: {} });
const scriptMatch = html.match(/<script[^>]*>([\s\S]*?)<\/script>/g);

if (!scriptMatch || scriptMatch.length === 0) {
  console.error('ERROR: No <script> tags found in HTML output');
  process.exit(1);
}

let errors = 0;
scriptMatch.forEach((tag, i) => {
  const content = tag.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
  if (content.trim().length === 0) return;
  try {
    new Function(content);
    console.log(`Script #${i + 1}: OK (${content.length} chars)`);
  } catch (e) {
    console.error(`Script #${i + 1}: SYNTAX ERROR: ${e.message}`);
    errors++;
  }
});

if (errors > 0) {
  console.error(`\n${errors} script(s) have SyntaxErrors. DO NOT DEPLOY.`);
  process.exit(1);
} else {
  console.log('\nAll scripts pass. Safe to deploy.');
}
```

**Step 3: Commit**

```bash
git add src/utils/validators.js scripts/check-client-js.js
git commit -m "feat: add input validators and pre-deploy SyntaxError check"
```

---

### Task 7: Test and deploy

**Step 1: Local test**

```bash
cd /tmp/dwa
CLOUDFLARE_API_TOKEN=EUnZ2dUo8vA3KljdV6tI_l_LcSsXpGdJuhAKJ00D npx wrangler@3 dev
```

Verify all of these in browser:
- [ ] `GET /` loads login page
- [ ] `GET /app` loads app page, zero console errors
- [ ] `GET /admin` loads admin dashboard
- [ ] `GET /privacy` loads privacy policy
- [ ] `GET /terms` loads terms
- [ ] `GET /health` returns `{ ok: true }`
- [ ] Client-side script tag has no SyntaxErrors (check DevTools console)

**Step 2: Dry-run deploy**

```bash
CLOUDFLARE_API_TOKEN=EUnZ2dUo8vA3KljdV6tI_l_LcSsXpGdJuhAKJ00D npx wrangler@3 deploy --dry-run --outdir=.verify-bundle
```

Check bundle size is under 10MB.

**Step 3: Real deploy**

```bash
CLOUDFLARE_API_TOKEN=EUnZ2dUo8vA3KljdV6tI_l_LcSsXpGdJuhAKJ00D npx wrangler@3 deploy --keep-vars
```

**Step 4: Verify production**

- [ ] `https://love.jamesguldan.com/` loads
- [ ] `https://love.jamesguldan.com/app` loads with no console errors
- [ ] `https://love.jamesguldan.com/admin` loads

**Step 5: Final commit**

```bash
git commit -m "chore: verify deploy and mark refactor complete"
git push origin main
```

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Template literal escaping breaks | Task 4 adds explicit escaping docs; Task 6 adds pre-deploy SyntaxError check |
| Route handler extraction misses a dependency | Each handler function is self-contained (they all receive `request, env`). Missing imports will fail loudly at `wrangler dev` startup. |
| `__name` helper pattern breaks | Wrangler automatically handles function naming for ES modules. Remove `var __name(...)` wrappers during extraction. |
| CI/CD blocks deploy | Task 0 fixes CI to check bundle output instead of raw source files |
| Critical route missing after refactor | Dry-run deploy + bundle grep check catches this |
| Rollback needed | The bundle-backup file and git history allow instant revert: `git checkout HEAD~1 -- src/index.js` |

---

## Execution Notes for Sonnet

- **Tasks 0-4 are additive** (creating new files) and cannot break the existing app
- **Task 5 is the critical swap** and should be done in one focused session
- **Task 2 is the most labor-intensive** (93+ handler functions to extract)
- **Task 4 is the most dangerous** (template literal escaping). Copy verbatim, change nothing.
- When extracting functions, search for ALL internal calls (functions that call other functions within the same file). These become imports.
- The `__name2(function handleXxx(...), "handleXxx")` wrapper pattern should be removed, leaving just `export async function handleXxx(...)`. Wrangler handles naming.
