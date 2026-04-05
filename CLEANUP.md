# DWI Cleanup Audit — 2026-04-05

## Summary
| Metric | Before | After |
|--------|--------|-------|
| src/index.js lines | 23,974 | 23,984 (+10 net from annotation comments, -2 CSS lines) |
| Dead CSS rules removed | 0 | 2 (hero-bar, hero-bar-fill) |
| Functions annotated | 0 | 4 (renderBlueprintResults, logApiCost, runWeeklySnapshot, handleAdminGetPrompt) |
| Tables investigated | 0 | 4 (api_costs, token_usage, weekly_snapshots, prompt_versions) |

## Decisions

### renderBlueprintResults vs renderBlueprintV3
**Keep both. NOT orphaned.** These serve distinct purposes:
- `renderBlueprintV3` — live interactive blueprint view (called by `handleBlueprintRender` at `/api/blueprint/render`)
- `renderBlueprintResults` — static HTML export for PDF generation (called by `handleBlueprintPDF` and `handleBlueprintPDFDownload`)

A comment was added above `renderBlueprintResults` to document this split. The names are misleading but both are actively called.

### api_costs vs token_usage
**Keep both. NOT redundant.** Two tables, two different purposes:
- `api_costs` — per-call cost in `cost_usd` (float), keyed by session + user email. Written by `logApiCost`. Queried by admin cost dashboards (`/admin/costs`, `/admin/user-costs`). 1,075 rows as of 2026-04-05.
- `token_usage` — token-level granularity with `cost_cents` (int), tracks model, phase, cache read/write tokens. Written by `logTokenUsage`. Queried by usage analytics (`/admin/usage`, `/admin/user-usage`). 1,064 rows as of 2026-04-05.

A comment was added above `logApiCost` to document the intentional two-table design.

### weekly_snapshots
**Keep.** Actively written to by the scheduled handler via `runWeeklySnapshot`, and readable/writable via the admin API (`/api/admin/weekly-snapshots`). 2 rows as of 2026-04-05, last written 2026-04-05 13:00 UTC. A comment was added above `runWeeklySnapshot`.

### prompt_versions
**Keep.** Actively used by `handleAdminGetPrompt` and `handleAdminSavePrompt` to allow editing the system prompt via the admin panel. 1 row as of 2026-04-05, last written 2026-03-25. Falls back to hardcoded `DEEP_WORK_SYSTEM_PROMPT` if empty. A comment was added above `handleAdminGetPrompt`.

### handleAdminPatchBlueprints
**Does not exist.** No function, route, or reference to `handleAdminPatchBlueprints` or any `patch-blueprint` endpoint exists anywhere in `src/index.js`. The audit item is moot — nothing to annotate or remove.

### Orphaned admin UI fetch calls
**None found.** All fetch calls to `/api/admin/...` endpoints in the admin UI HTML correspond to real routes in the route table. No dead buttons or stale endpoints detected.

### hero-bar CSS
**Removed.** Dead CSS from Phase B — the hero section no longer renders a numeric depth bar, so `.hero-bar` and `.hero-bar-fill` rules were unreachable. Removed 2026-04-05.

Lines removed:
- `.hero-bar{margin-top:8px;width:180px;height:3px;background:rgba(255,255,255,0.15);border-radius:2px;overflow:hidden;}`
- `.hero-bar-fill{height:100%;background:var(--gold);}`

## Tables Reference
| Table | Row Count | Last Write | Write Path | Status |
|-------|-----------|-----------|------------|--------|
| api_costs | 1,075 | ongoing | logApiCost() | Active — keep |
| token_usage | 1,064 | ongoing | logTokenUsage() | Active — keep |
| weekly_snapshots | 2 | 2026-04-05 | runWeeklySnapshot() | Active — keep |
| prompt_versions | 1 | 2026-03-25 | handleAdminSavePrompt() | Active — keep |
