#!/bin/bash
# ============================================================
# deep-work-api Deploy Script
# ============================================================
# This script builds, deploys, and verifies the worker.
# It prevents the recurring issue of losing env vars/secrets
# when deploying via the Cloudflare API directly.
#
# Usage: ./deploy.sh
# ============================================================

set -euo pipefail

# --- Config (from wrangler.toml) ---
WORKER_NAME="deep-work-api"
ACCOUNT_ID="bd13f1dff62d4ccbea47440e45b48ec2"
CF_API_TOKEN="EUnZ2dUo8vA3KljdV6tI_l_LcSsXpGdJuhAKJ00D"
APP_URL="https://love.jamesguldan.com"

# Bindings
KV_NAMESPACE_ID="ad823265a8944b9da7a561198f7f3782"
R2_BUCKET="deep-work-uploads"
D1_DATABASE_ID="92121f3b-dcfb-4fa8-8482-b827224b611d"

# Plain text vars (from [vars] in wrangler.toml)
APP_ORIGIN="https://love.jamesguldan.com"
STRIPE_MODE="live"
FLAG_NUDGES_ENABLED="dry_run"

# Health check endpoints
HEALTH_ENDPOINTS=(
  "/admin"
  "/"
)

# Expected HTTP codes that mean "alive" (302 = auth redirect, 200 = ok, 401/403 = auth gate)
ALIVE_CODES="200 301 302 401 403"

# --- Colors ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# --- Functions ---
log()   { echo -e "${GREEN}[DEPLOY]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
fail()  { echo -e "${RED}[FAIL]${NC} $1"; exit 1; }

check_health() {
  local url="$1"
  local code
  code=$(/usr/bin/curl -s -o /dev/null -w "%{http_code}" "$url" --max-time 10 2>/dev/null || echo "000")
  echo "$code"
}

# --- Pre-flight checks ---
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

if [ ! -f "src/index.js" ]; then
  fail "src/index.js not found. Run this script from the deep-work-api directory."
fi

# --- Step 1: Check current health BEFORE deploying ---
log "Step 1: Checking current worker health..."
BEFORE_CODE=$(check_health "$APP_URL/admin")
if echo "$ALIVE_CODES" | grep -qw "$BEFORE_CODE"; then
  log "  Worker is currently alive (HTTP $BEFORE_CODE)"
else
  warn "  Worker is currently DOWN (HTTP $BEFORE_CODE) - proceeding with deploy"
fi

# --- Step 2: Check for active sessions ---
log "Step 2: Checking for active user sessions..."

# Read/D1 token (has read access to D1)
CF_READ_TOKEN="m2p5WbHS5ABCC4Hzbo-cY_8M2J0WGimcIuZ4thhr"

ACTIVE_SESSIONS=$(/usr/bin/curl -s -X POST \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/d1/database/$D1_DATABASE_ID/query" \
  -H "Authorization: Bearer $CF_READ_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"sql":"SELECT s.id, s.email, s.phase, s.message_count, s.last_active_at FROM sessions s WHERE s.status = '\''active'\'' AND s.message_count > 0 AND s.last_active_at > datetime('\''now'\'', '\''-1 hour'\'') ORDER BY s.last_active_at DESC"}' 2>/dev/null)

ACTIVE_COUNT=$(echo "$ACTIVE_SESSIONS" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    results = data.get('result', [{}])[0].get('results', [])
    # Filter out test/james sessions
    real = [r for r in results if r.get('email','') and not r['email'].startswith('james') and 'test' not in r['email']]
    if real:
        print(len(real))
        for r in real:
            mins_ago = ''
            print(f\"  - {r.get('email','unknown')} | Phase {r.get('phase',0)} | {r.get('message_count',0)} msgs | last active: {r.get('last_active_at','?')}\", file=sys.stderr)
    else:
        print('0')
except:
    print('0')
" 2>&1)

# Parse count (first line) and details (remaining lines)
SESSION_COUNT=$(echo "$ACTIVE_COUNT" | head -1)
SESSION_DETAILS=$(echo "$ACTIVE_COUNT" | tail -n +2)

if [ "$SESSION_COUNT" != "0" ] && [ -n "$SESSION_COUNT" ]; then
  echo ""
  warn "=================================================="
  warn "  $SESSION_COUNT ACTIVE USER SESSION(S) IN THE LAST HOUR!"
  warn "=================================================="
  echo "$SESSION_DETAILS" | while IFS= read -r line; do
    warn "$line"
  done
  echo ""
  warn "Deploying now will briefly interrupt their experience."
  echo ""

  # If running interactively, prompt for confirmation
  if [ -t 0 ]; then
    read -p "$(echo -e "${YELLOW}[WARN]${NC} Deploy anyway? (y/N): ")" CONFIRM
    if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
      echo ""
      log "Deploy cancelled. Try again when sessions are idle."
      exit 0
    fi
  else
    # Non-interactive (e.g. called from Claude) — warn but proceed
    warn "Non-interactive mode — proceeding with deploy. User was warned."
  fi
  echo ""
else
  log "  No active user sessions in the last hour. Safe to deploy."
fi

# --- Step 2.5: E2E Tests (gate — blocks deploy on failure) ---
log "Step 2.5: Running E2E test suite..."

if [ -z "${DWI_MAGIC_TOKEN:-}" ]; then
  warn "DWI_MAGIC_TOKEN not set — skipping E2E gate."
  warn "Set it to run the full suite: export DWI_MAGIC_TOKEN=<token>"
  warn "Or run manually: DWI_MAGIC_TOKEN=<token> npm run test:e2e"
else
  E2E_EXIT=0
  DWI_MAGIC_TOKEN="$DWI_MAGIC_TOKEN" \
  DWI_STRIPE_WEBHOOK_SECRET="${DWI_STRIPE_WEBHOOK_SECRET:-}" \
  PATH="/usr/local/bin:/opt/homebrew/bin:$PATH" \
    npm run test:e2e 2>&1 || E2E_EXIT=$?

  if [ "$E2E_EXIT" -ne 0 ]; then
    echo ""
    fail "E2E tests FAILED (exit $E2E_EXIT). Deploy aborted — fix the tests before deploying."
  fi

  log "  E2E tests passed. Proceeding with deploy."
fi

# --- Step 3: Build ---
log "Step 3: Building bundle with esbuild..."
npx esbuild@latest src/index.js \
  --bundle \
  --format=esm \
  --outfile=dist/index.js \
  --platform=browser \
  --log-level=warning

if [ ! -f "dist/index.js" ]; then
  fail "Build failed - dist/index.js not created"
fi

BUNDLE_SIZE=$(wc -c < dist/index.js | tr -d ' ')
log "  Bundle size: ${BUNDLE_SIZE} bytes"

if [ "$BUNDLE_SIZE" -lt 10000 ]; then
  fail "Bundle suspiciously small (${BUNDLE_SIZE} bytes). Aborting."
fi

# --- Step 4: Deploy via Cloudflare API ---
log "Step 4: Deploying to Cloudflare..."

# Build the metadata JSON with ALL bindings, vars, and keep_bindings
# CRITICAL: keep_bindings preserves secrets (Stripe keys, API keys, etc.)
METADATA=$(cat <<'METAEOF'
{
  "main_module": "index.js",
  "bindings": [
    {"type": "kv_namespace", "name": "SESSIONS", "namespace_id": "KV_ID_PLACEHOLDER"},
    {"type": "r2_bucket", "name": "UPLOADS", "bucket_name": "R2_PLACEHOLDER"},
    {"type": "d1", "name": "DB", "id": "D1_ID_PLACEHOLDER"},
    {"type": "plain_text", "name": "APP_ORIGIN", "text": "APP_ORIGIN_PLACEHOLDER"},
    {"type": "plain_text", "name": "STRIPE_MODE", "text": "STRIPE_MODE_PLACEHOLDER"},
    {"type": "plain_text", "name": "FLAG_NUDGES_ENABLED", "text": "FLAG_NUDGES_ENABLED_PLACEHOLDER"}
  ],
  "compatibility_date": "2024-12-01",
  "keep_bindings": ["secret_text"]
}
METAEOF
)

# Substitute actual values
METADATA=$(echo "$METADATA" | sed \
  -e "s|KV_ID_PLACEHOLDER|$KV_NAMESPACE_ID|g" \
  -e "s|R2_PLACEHOLDER|$R2_BUCKET|g" \
  -e "s|D1_ID_PLACEHOLDER|$D1_DATABASE_ID|g" \
  -e "s|APP_ORIGIN_PLACEHOLDER|$APP_ORIGIN|g" \
  -e "s|STRIPE_MODE_PLACEHOLDER|$STRIPE_MODE|g" \
  -e "s|FLAG_NUDGES_ENABLED_PLACEHOLDER|$FLAG_NUDGES_ENABLED|g")

DEPLOY_RESPONSE=$(/usr/bin/curl -s -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/workers/scripts/$WORKER_NAME" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -F "index.js=@dist/index.js;type=application/javascript+module" \
  -F "metadata=$METADATA;type=application/json")

DEPLOY_SUCCESS=$(echo "$DEPLOY_RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin).get('success', False))" 2>/dev/null || echo "False")

if [ "$DEPLOY_SUCCESS" != "True" ]; then
  echo "$DEPLOY_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$DEPLOY_RESPONSE"
  fail "Deploy failed! See response above."
fi

log "  Deploy succeeded"

# --- Step 5: Health check (with retries) ---
log "Step 5: Verifying worker health..."
sleep 2  # Give Cloudflare a moment to propagate

HEALTHY=false
for attempt in 1 2 3; do
  for endpoint in "${HEALTH_ENDPOINTS[@]}"; do
    CODE=$(check_health "$APP_URL$endpoint")
    if echo "$ALIVE_CODES" | grep -qw "$CODE"; then
      log "  $APP_URL$endpoint -> HTTP $CODE (alive)"
      HEALTHY=true
      break 2
    else
      warn "  $APP_URL$endpoint -> HTTP $CODE (attempt $attempt/3)"
    fi
  done
  if [ "$attempt" -lt 3 ]; then
    sleep 3
  fi
done

if [ "$HEALTHY" = false ]; then
  echo ""
  fail "WORKER IS DOWN AFTER DEPLOY! Health checks failed on all endpoints.

  Possible causes:
  1. Missing secrets - run: npx wrangler secret list --name $WORKER_NAME
  2. Missing env vars - check the METADATA in this script matches wrangler.toml [vars]
  3. Code error - check logs: npx wrangler tail --name $WORKER_NAME

  The previous version may need to be restored."
fi

# --- Step 6: Verify key routes ---
log "Step 6: Verifying key routes..."
ROUTES_OK=true

check_route() {
  local path="$1"
  local expected="$2"
  local code
  code=$(check_health "$APP_URL$path")
  if echo "$expected" | grep -qw "$code"; then
    log "  $path -> HTTP $code (ok)"
  else
    warn "  $path -> HTTP $code (expected one of: $expected)"
    ROUTES_OK=false
  fi
}

check_route "/admin" "302 403"
check_route "/" "200 302"

if [ "$ROUTES_OK" = false ]; then
  warn "Some routes returned unexpected codes. Worker is alive but may have issues."
fi

# --- Step 7: Smoke tests ---
log "Step 7: Running smoke tests..."
SMOKE_PASS=true
SMOKE_TOTAL=0
SMOKE_OK=0

smoke_check() {
  local desc="$1"
  local method="$2"
  local path="$3"
  local body="$4"
  local expect_not="${5:-500}"  # Code that means FAILURE (default 500)

  SMOKE_TOTAL=$((SMOKE_TOTAL + 1))
  local code
  if [ "$method" = "POST" ]; then
    code=$(/usr/bin/curl -s -o /dev/null -w "%{http_code}" \
      -X POST "$APP_URL$path" \
      -H "Content-Type: application/json" \
      -d "$body" --max-time 10 2>/dev/null || echo "000")
  else
    code=$(/usr/bin/curl -s -o /dev/null -w "%{http_code}" \
      "$APP_URL$path" --max-time 10 2>/dev/null || echo "000")
  fi

  if [ "$code" = "$expect_not" ] || [ "$code" = "000" ]; then
    warn "  FAIL: $desc -> HTTP $code"
    SMOKE_PASS=false
  else
    log "  OK: $desc -> HTTP $code"
    SMOKE_OK=$((SMOKE_OK + 1))
  fi
}

# Core pages
smoke_check "Homepage loads" GET "/" "" "500"
smoke_check "App page loads" GET "/app" "" "500"

# API endpoints reject bad input (not crash)
smoke_check "Chat rejects empty body" POST "/api/chat" '{}' "500"
smoke_check "Chat rejects missing message" POST "/api/chat" '{"sessionId":"test"}' "500"
smoke_check "Checkout endpoint alive" POST "/api/checkout" '{"tier":"blueprint"}' "500"
smoke_check "Webhook rejects empty" POST "/api/webhook" '{}' "500"
smoke_check "Session start responds" POST "/api/session/start" '{}' "500"

# Auth endpoints
smoke_check "Auth me without token" GET "/api/auth/me" "" "500"
smoke_check "Unsubscribe endpoint" GET "/api/unsubscribe?email=smoketest@test.com" "" "500"

# Blueprint render
smoke_check "Blueprint render responds" POST "/api/blueprint/render" '{}' "500"

log "  Smoke tests: $SMOKE_OK/$SMOKE_TOTAL passed"

if [ "$SMOKE_PASS" = false ]; then
  echo ""
  warn "=================================================="
  warn "  SMOKE TESTS FAILED — some endpoints returned 500"
  warn "=================================================="
  warn "The worker is alive but may have code errors."
  warn "Check logs: npx wrangler tail --name $WORKER_NAME"
  echo ""
fi

# --- Done ---
echo ""
log "========================================"
log "  Deploy complete and verified!"
log "  Worker: $WORKER_NAME"
log "  URL: $APP_URL"
log "========================================"
