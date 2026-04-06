# Admin Session QA Redesign

**Date:** 2026-03-30
**Status:** Approved, ready to implement

## Problem

The current `/admin/session/{id}` page is hard to use for QA review:
- Event timeline is 143 rows of nearly identical noise
- Conversation is truncated plain text blobs
- Blueprint is raw JSON in a pre block
- No way to download the conversation or blueprint
- No at-a-glance quality signal — you have to scroll the whole page

## Goal

A QA-first admin session page that lets James answer "did Claude do a good job in this interview?" in under 30 seconds, then drill into specifics.

## Approved Design

### Section 1 — QA Scorecard (top)

Full-width panel replacing the current two-column User Profile + Session panels.

- **Left:** Name, email, tier badge, member since
- **Center:** Phase bar (large), depth grade (large letter + %), 5 mini dimension bars (inciting_incident, belief_specificity, client_avatar_precision, personal_stakes, mirror_moment each X/5)
- **Right:** Health signal flags (auto-detected red/yellow/green), API cost, created date

Health signals:
- 🔴 Phase stuck (>20 messages in one phase)
- 🔴 Low depth dimension (<2/5 on any)
- 🟡 Blueprint generated but V3 missing fields
- 🟢 Completed, all fields present

### Section 2 — Depth Highlights

Horizontal scroll row of auto-detected signal cards below the scorecard.

Signal types detected from conversation data:
| Signal | Detection method |
|--------|-----------------|
| Phase transition | Event where phase changes in timeline |
| Deep probe | Claude follow-up question in same phase after substantive user response |
| Breakthrough moment | User message >200 chars with emotional keywords |
| Skipped surface | Claude moved phases after short user response (<30 chars) |

Each card shows: signal type badge, 120 char excerpt, "Jump to ↓" anchor link.

### Section 3 — Tabbed Content + Downloads

**Persistent download bar above tabs:**
- Download Transcript .txt
- Download Transcript PDF (styled HTML → browser print)
- Download Blueprint .json
- Download Blueprint Formatted (readable HTML)

**Tabs:**
1. **Transcript** (default) — full chat bubbles, no truncation, phase change markers inline, depth highlight markers on flagged messages
2. **Blueprint** — rendered sections per key (marketQuotes, idealClient, competitiveAdvantage, v3 fields), raw JSON toggle at bottom
3. **Insights** — existing grid of insight cards (unchanged)
4. **Raw Timeline** — existing event log, collapsed by default

## Technical Approach

### Files to change
- `src/index.js` — `handleAdminSessionDetail` function (lines ~20574-20736) — full rewrite
- `src/routes/admin.js` — add 4 new download route handlers
- `src/router.js` — add 4 new route entries

### New API routes
```
GET /admin/session/{id}/transcript.txt       → plain text download
GET /admin/session/{id}/transcript-formatted → styled HTML (browser prints to PDF)
GET /admin/session/{id}/blueprint.json       → clean JSON download
GET /admin/session/{id}/blueprint-formatted  → readable HTML download
```

### Depth highlight detection algorithm
Runs server-side during page render, iterates kvMessages:
1. Find phase transition moments from event timeline
2. Scan Claude messages for follow-up probes (question mark present, same phase as previous message, user previous message >100 chars)
3. Scan user messages for breakthroughs (>200 chars + emotional keywords)
4. Flag phase transitions after short user responses (<30 chars) as skipped surface

### Data sources (unchanged)
- D1 `sessions` table — scorecard metadata, depth scores, phase
- D1 `session_insights` — insights tab
- D1 `session_events` — timeline tab + phase transition detection
- KV `{sessionId}` — full conversation messages
- KV `blueprint:{sessionId}` — blueprint data

## What We're NOT changing
- The existing `handleAdminExportSession` (Export JSON button still works)
- The admin dashboard list page
- Any API endpoints other than the 4 new download routes
- The existing `viewSession` modal in the dashboard

## Success Criteria
- Scorecard visible above the fold on a 1440px screen
- Depth highlights visible without scrolling
- Full transcript readable without truncation
- All 4 download buttons work
- Page load time under 2 seconds (same data fetching as today)
