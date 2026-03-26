# DWI Multi-File Refactor Design

**Date:** 2026-03-26
**Goal:** Refactor the monolithic deep-work-api Worker into clean multi-file ES modules without changing any business logic, API behavior, or client-side functionality.

## Current State

- `src/index.js` (19,587 lines) is a Wrangler bundler artifact committed as source
- Partial extraction already exists: `admin.js`, `auth.js`, `prompts.js`, `html.js`, `login.js`, `legal.js`, `monitor.js` in `src/`
- `dist-worker-patched.js` and `index.js.fixed` are stale artifacts
- `deploy.yml` hardcodes `grep` checks against `src/index.js` that will break after refactor

## Target Architecture

```
src/
  index.js            -- Entry point: fetch handler + router (~100 lines)
  router.js           -- Route matching, maps paths to handlers
  middleware/
    auth.js            -- JWT, session, cookie handling
    cors.js            -- CORS headers, preflight
  routes/
    auth.js            -- /api/auth/*
    interview.js       -- /api/interview/*
    blueprint.js       -- /api/blueprint/*
    admin.js           -- /api/admin/*
    payment.js         -- /api/payment/*
    email.js           -- /api/email/*
    upload.js          -- /api/upload/*
    pages.js           -- HTML page routes
  services/
    anthropic.js       -- Anthropic API
    stripe.js          -- Stripe integration
    resend.js          -- Email sending
    imagen.js          -- Image generation
  html/
    templates.js       -- getHTML(config) from html.js
    client-js.js       -- Client JS config builders
    styles.js          -- CSS generation
  db/
    queries.js         -- D1 query helpers
    schema.js          -- Table definitions
  utils/
    helpers.js         -- Shared utilities
    constants.js       -- Product config, URLs
    crypto.js          -- JWT, token generation
    validators.js      -- Input validation
scripts/
  check-client-js.js   -- Pre-deploy SyntaxError check
```

## Phases

| Phase | What | Risk |
|-------|------|------|
| 0 | Fix deploy.yml, delete stale files | None |
| 1 | Create thin index.js entry + wire existing modules | Low |
| 2 | Extract route handlers into routes/ | Low |
| 3 | Extract services (Anthropic, Stripe, Resend) | Low |
| 4 | Extract middleware (auth, CORS) | Low |
| 5 | Move html.js to html/templates.js, add escaping docs | Medium |
| 6 | Add validators, add check-client-js.js | None |
| 7 | wrangler dev + deploy --dry-run + real deploy | None |

## Rules

1. Do NOT change any business logic, API responses, HTML output, or client-side JS
2. Preserve all env bindings (D1, KV, R2, secrets) via env parameter
3. Each phase must produce a deployable commit
4. Template literal escaping is documented with warnings in html/ files
5. The `__name` pattern is Wrangler output; clean ES modules replace it

## Verification

- [ ] wrangler dev starts without errors
- [ ] GET /app loads the blueprint app HTML
- [ ] GET /api/auth/fast-resume with valid JWT returns session data
- [ ] GET /api/admin/stats returns admin data
- [ ] POST /api/interview/respond processes a response
- [ ] Client-side script tag has no SyntaxErrors
- [ ] wrangler deploy --dry-run shows bundle under 10MB
- [ ] love.jamesguldan.com/app loads correctly after deploy
