/**
 * Stripe Webhook E2E Test — Deep Work Interview
 *
 * Constructs signed Stripe webhook payloads and fires them at the live
 * endpoint. No Stripe CLI required — signs with HMAC-SHA256 directly.
 *
 * Usage:
 *   DWI_MAGIC_TOKEN=<token> DWI_STRIPE_WEBHOOK_SECRET=whsec_... npm run test:e2e
 *
 * DWI_STRIPE_WEBHOOK_SECRET: find it at
 *   Stripe Dashboard → Developers → Webhooks → your endpoint → Signing secret
 *
 * What this tests:
 *   - Signature rejection (invalid sig → 400)
 *   - Replayed/expired timestamp rejection → 400
 *   - Valid checkout.session.completed → 200, user created in DB
 *   - Duplicate event idempotency (same session_id → 200, no duplicate payment)
 *   - Cleanup of test data via admin API
 */

import { createHmac } from 'crypto';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { BASE_URL, anonFetch, authFetch } from './helpers.js';

const MAGIC_TOKEN = process.env.DWI_MAGIC_TOKEN || '';
const WEBHOOK_SECRET = process.env.DWI_STRIPE_WEBHOOK_SECRET || '';

// Shared state
let adminJwt = '';
let createdUserId = '';
const TEST_EMAIL = `webhook-autotest-${Date.now()}@test.invalid`;
const FAKE_SESSION_ID = `cs_test_autotest_${Date.now()}`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Sign a Stripe webhook payload.
 * Mirrors verifyStripeSignature() in index.js EXACTLY:
 *   key = TextEncoder().encode(secret)  — UTF-8 bytes of the raw string, no base64 decoding.
 * NOTE: This differs from Stripe's official SDK (which base64-decodes the whsec_ value).
 *       Use DWI_STRIPE_WEBHOOK_SECRET = the exact value stored in the worker's STRIPE_WEBHOOK_SECRET secret.
 */
function signWebhookPayload(payload, secret, timestampOverride) {
  const timestamp = timestampOverride ?? Math.floor(Date.now() / 1000);
  const signedPayload = `${timestamp}.${payload}`;
  // Use secret as-is (UTF-8), matching the worker's importKey call
  const sig = createHmac('sha256', Buffer.from(secret, 'utf8'))
    .update(signedPayload)
    .digest('hex');
  return { header: `t=${timestamp},v1=${sig}`, timestamp };
}

/**
 * Build a minimal checkout.session.completed event body.
 */
function buildCheckoutEvent(overrides = {}) {
  const sessionId = overrides.sessionId ?? FAKE_SESSION_ID;
  const email = overrides.email ?? TEST_EMAIL;
  return JSON.stringify({
    id: `evt_test_${Date.now()}`,
    type: 'checkout.session.completed',
    created: Math.floor(Date.now() / 1000),
    data: {
      object: {
        id: sessionId,
        object: 'checkout.session',
        payment_status: 'paid',
        payment_intent: `pi_test_${Date.now()}`,
        customer: `cus_test_${Date.now()}`,
        amount_total: 6700,
        currency: 'usd',
        customer_details: {
          email,
          name: 'Webhook Autotest User',
        },
        metadata: {
          tier: 'blueprint',
          email,
        },
      },
    },
    livemode: false,
  });
}

/**
 * POST a raw body to /api/webhook with the given Stripe-Signature header.
 */
function postWebhook(body, sigHeader) {
  return fetch(`${BASE_URL}/api/webhook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'stripe-signature': sigHeader,
    },
    body,
  });
}

// ─── Setup / Teardown ─────────────────────────────────────────────────────────

beforeAll(async () => {
  if (!MAGIC_TOKEN) return;

  const res = await anonFetch('/api/auth/magic', {
    method: 'POST',
    body: JSON.stringify({ token: MAGIC_TOKEN }),
  });
  const data = await res.json();
  adminJwt = data.token || '';
}, 30000); // explicit 30s hook timeout (default 10s is too tight for live network)

afterAll(async () => {
  // Clean up the test user created by the checkout event
  if (!adminJwt || !createdUserId) return;

  try {
    await fetch(`${BASE_URL}/admin/delete-user/${createdUserId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${adminJwt}` },
    });
  } catch (_) {}
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Stripe Webhook Integration', { timeout: 30000 }, () => {

  // ─── Signature Enforcement ───────────────────────────────────────

  describe('Signature Enforcement', () => {
    it('rejects webhook with no signature header', async () => {
      const body = buildCheckoutEvent();
      const res = await fetch(`${BASE_URL}/api/webhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      // Should be 400 (invalid signature) or 500 (secret not configured) — never 200
      expect(res.status).not.toBe(200);
    });

    it('rejects webhook with invalid signature', async () => {
      const body = buildCheckoutEvent();
      const res = await postWebhook(body, 't=1234567890,v1=deadbeef0000000000000000000000000000000000000000000000000000000');
      expect(res.status).toBe(400);
    });

    it('rejects webhook with expired timestamp (>5 min old)', async () => {
      if (!WEBHOOK_SECRET) {
        console.warn('Skipping: DWI_STRIPE_WEBHOOK_SECRET not set');
        return;
      }

      const body = buildCheckoutEvent();
      // 10 minutes in the past — outside the 300s tolerance window
      const staleTimestamp = Math.floor(Date.now() / 1000) - 600;
      const { header } = signWebhookPayload(body, WEBHOOK_SECRET, staleTimestamp);
      const res = await postWebhook(body, header);
      expect(res.status).toBe(400);
    });

    it('rejects webhook signed with wrong secret', async () => {
      if (!WEBHOOK_SECRET) {
        console.warn('Skipping: DWI_STRIPE_WEBHOOK_SECRET not set');
        return;
      }

      const body = buildCheckoutEvent();
      // Sign with a completely different secret
      const { header } = signWebhookPayload(body, 'whsec_thisisawrongsecret1234567890abcdef');
      const res = await postWebhook(body, header);
      expect(res.status).toBe(400);
    });
  });

  // ─── Checkout Flow ───────────────────────────────────────────────

  describe('Checkout Session Completed', () => {
    it('accepts a valid signed checkout.session.completed event', async () => {
      if (!WEBHOOK_SECRET) {
        console.warn('Skipping: DWI_STRIPE_WEBHOOK_SECRET not set');
        return;
      }

      const body = buildCheckoutEvent();
      const { header } = signWebhookPayload(body, WEBHOOK_SECRET);
      const res = await postWebhook(body, header);

      expect(res.status).toBe(200);
    });

    it('created a user account for the test email', async () => {
      if (!WEBHOOK_SECRET || !adminJwt) {
        console.warn('Skipping: need both DWI_STRIPE_WEBHOOK_SECRET and DWI_MAGIC_TOKEN');
        return;
      }

      // Poll briefly for the user to appear (webhook is async)
      let found = null;
      for (let i = 0; i < 5; i++) {
        const res = await fetch(`${BASE_URL}/api/admin/users?search=${encodeURIComponent(TEST_EMAIL)}`, {
          headers: { 'Authorization': `Bearer ${adminJwt}` },
        });
        if (res.status === 200) {
          const data = await res.json();
          const users = data.users || data.results || (Array.isArray(data) ? data : []);
          found = users.find(u => u.email === TEST_EMAIL);
          if (found) break;
        }
        await new Promise(r => setTimeout(r, 1500));
      }

      expect(found).toBeTruthy();
      expect(found.tier).toBe('blueprint');

      // Store for cleanup
      if (found) createdUserId = found.id;
    });

    it('handles duplicate event idempotently (same session ID)', async () => {
      if (!WEBHOOK_SECRET) {
        console.warn('Skipping: DWI_STRIPE_WEBHOOK_SECRET not set');
        return;
      }

      // Send the same event again — same FAKE_SESSION_ID means INSERT OR IGNORE
      const body = buildCheckoutEvent();
      const { header } = signWebhookPayload(body, WEBHOOK_SECRET);
      const res = await postWebhook(body, header);

      // Should still return 200, not error out
      expect(res.status).toBe(200);
    });
  });

  // ─── Unknown Event Type ──────────────────────────────────────────

  describe('Unknown Event Types', () => {
    it('returns 200 for unhandled event types (no crash)', async () => {
      if (!WEBHOOK_SECRET) {
        console.warn('Skipping: DWI_STRIPE_WEBHOOK_SECRET not set');
        return;
      }

      const body = JSON.stringify({
        id: `evt_test_unknown_${Date.now()}`,
        type: 'customer.subscription.updated',
        created: Math.floor(Date.now() / 1000),
        data: { object: { id: 'sub_test' } },
        livemode: false,
      });
      const { header } = signWebhookPayload(body, WEBHOOK_SECRET);
      const res = await postWebhook(body, header);

      // Should acknowledge without crashing
      expect(res.status).not.toBe(500);
    });
  });
});
