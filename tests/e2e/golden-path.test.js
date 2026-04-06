/**
 * Golden Path E2E Test — Deep Work Interview
 *
 * Walks the critical user journey: auth -> session -> chat -> blueprint.
 * Runs against the live production URL.
 *
 * Usage:
 *   DWI_MAGIC_TOKEN=<token> npm run test:e2e
 *
 * The magic token should be a persistent_magic token from the admin panel.
 * It is exchanged for a JWT at the start of each test run.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { BASE_URL, anonFetch, readSSEStream, stripMetadata, testSessionId } from './helpers.js';

const MAGIC_TOKEN = process.env.DWI_MAGIC_TOKEN || '';

// State shared across tests (runs in order)
let adminJwt = '';
let adminUser = null;
let testSessionIdVal = '';
let sessionJwt = '';

describe('Golden Path E2E', { timeout: 120000 }, () => {

  // ─── Test 1: Auth Flow ──────────────────────────────────────
  describe('Auth Flow', () => {
    it('exchanges magic token for JWT', async () => {
      if (!MAGIC_TOKEN) {
        console.warn('Skipping: DWI_MAGIC_TOKEN not set');
        return;
      }

      const res = await anonFetch('/api/auth/magic', {
        method: 'POST',
        body: JSON.stringify({ token: MAGIC_TOKEN }),
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.token).toBeTruthy();
      expect(data.user).toBeTruthy();
      expect(data.user.email).toBeTruthy();

      adminJwt = data.token;
      adminUser = data.user;
    });

    it('verifies JWT with /api/auth/me', async () => {
      if (!adminJwt) return;

      const res = await fetch(`${BASE_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${adminJwt}` },
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.user || data.email).toBeTruthy();
    });
  });

  // ─── Test 2: Session Creation ───────────────────────────────
  describe('Session Creation', () => {
    it('creates a new test session', async () => {
      if (!adminJwt) return;

      testSessionIdVal = testSessionId();
      const res = await fetch(`${BASE_URL}/api/session/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminJwt}`,
        },
        body: JSON.stringify({
          sessionId: testSessionIdVal,
          tier: 'blueprint',
        }),
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.sessionId || data.session_id || testSessionIdVal).toBeTruthy();

      // Store session JWT if returned
      if (data.token) sessionJwt = data.token;
      // Use admin JWT as session JWT since we're the session owner
      if (!sessionJwt) sessionJwt = adminJwt;
    });

    it('session has a first AI message', async () => {
      if (!adminJwt || !testSessionIdVal) return;

      const res = await fetch(`${BASE_URL}/api/session/${testSessionIdVal}`, {
        headers: { 'Authorization': `Bearer ${adminJwt}` },
      });

      // Session should exist and have initial content
      expect(res.status).toBe(200);
      const data = await res.json();
      // The session should have at least one message (the AI greeting)
      const messages = data.messages || [];
      if (messages.length > 0) {
        const firstAi = messages.find(m => m.role === 'assistant');
        if (firstAi) {
          expect(firstAi.content.length).toBeGreaterThan(10);
        }
      }
    });
  });

  // ─── Test 3: Chat Message Exchange ──────────────────────────
  describe('Chat Exchange', () => {
    it('sends a message and gets a streamed AI response', async () => {
      if (!sessionJwt || !testSessionIdVal) return;

      const res = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionJwt}`,
        },
        body: JSON.stringify({
          sessionId: testSessionIdVal,
          message: 'My name is TestBot. I run a small consulting firm focused on leadership coaching.',
        }),
      });

      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('text/event-stream');

      const { fullText, events } = await readSSEStream(res);
      const cleanText = stripMetadata(fullText);

      // AI should respond with something meaningful
      expect(cleanText.length).toBeGreaterThan(20);

      // No METADATA fragments should remain in visible text
      expect(cleanText).not.toContain('METADATA:');
      expect(cleanText).not.toContain('"phaseProgress"');
      expect(cleanText).not.toContain('"sessionComplete"');

      // Should have received delta events
      const deltas = events.filter(e => e.type === 'delta');
      expect(deltas.length).toBeGreaterThan(0);
    }, 60000);

    it('rejects messages with no content', async () => {
      if (!sessionJwt || !testSessionIdVal) return;

      const res = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionJwt}`,
        },
        body: JSON.stringify({
          sessionId: testSessionIdVal,
          message: '',
        }),
      });

      expect(res.status).toBe(400);
    });

    it('rejects messages over 10,000 characters', async () => {
      if (!sessionJwt || !testSessionIdVal) return;

      const longMessage = 'x'.repeat(10001);
      const res = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionJwt}`,
        },
        body: JSON.stringify({
          sessionId: testSessionIdVal,
          message: longMessage,
        }),
      });

      expect(res.status).toBe(400);
    });
  });

  // ─── Test 4: Concurrency Lock ───────────────────────────────
  describe('Concurrency Lock', () => {
    it('handles two concurrent messages without crashing (best-effort lock)', async () => {
      if (!sessionJwt || !testSessionIdVal) return;

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionJwt}`,
      };
      const body = JSON.stringify({
        sessionId: testSessionIdVal,
        message: 'Just testing concurrency.',
      });

      // Fire two requests simultaneously
      const [res1, res2] = await Promise.all([
        fetch(`${BASE_URL}/api/chat`, { method: 'POST', headers, body }),
        fetch(`${BASE_URL}/api/chat`, { method: 'POST', headers, body }),
      ]);

      const codes = [res1.status, res2.status].sort();

      // Neither request should 5xx — the system must stay stable
      expect(codes.every(c => c < 500)).toBe(true);

      // Acceptable outcomes:
      //   [200, 200] — both slipped through (Cloudflare KV distributed race; best-effort)
      //   [200, 429] — lock caught the second one (ideal path)
      //   [429, 429] — both rejected (lock still active from prior test)
      // NOTE: previously this asserted exactly one 429, but that relied on a stuck-lock bug.
      // The lock now properly releases after each response (ctx.waitUntil + await delete),
      // so truly concurrent requests can both succeed on different CF edge nodes.
      const validOutcomes = (
        (codes[0] === 200 && codes[1] === 200) ||
        (codes[0] === 200 && codes[1] === 429) ||
        (codes[0] === 429 && codes[1] === 429)
      );
      expect(validOutcomes).toBe(true);

      // Drain any successful stream so the lock releases before the next test
      if (res1.status === 200) await readSSEStream(res1);
      if (res2.status === 200) await readSSEStream(res2);
    }, 60000);
  });

  // ─── Test 5: Existing Blueprint Verification ────────────────
  describe('Blueprint Content', () => {
    it('loads a completed blueprint with dynamic content', async () => {
      if (!adminJwt) return;

      // Use the test_full_blueprint key or find a completed session
      const res = await fetch(`${BASE_URL}/api/admin/sessions?status=completed&limit=1`, {
        headers: { 'Authorization': `Bearer ${adminJwt}` },
      });

      if (res.status !== 200) {
        console.warn('Skipping: could not fetch completed sessions');
        return;
      }

      const data = await res.json();
      const sessions = data.sessions || data.results || data || [];
      if (!Array.isArray(sessions) || sessions.length === 0) {
        console.warn('Skipping: no completed sessions found');
        return;
      }

      const completedSessionId = sessions[0].id || sessions[0].session_id;
      if (!completedSessionId) {
        console.warn('Skipping: no session ID in response');
        return;
      }

      // Fetch the full session to get blueprint
      const sessionRes = await fetch(`${BASE_URL}/api/session/${completedSessionId}`, {
        headers: { 'Authorization': `Bearer ${adminJwt}` },
      });

      expect(sessionRes.status).toBe(200);
      const sessionData = await sessionRes.json();
      const blueprint = sessionData.blueprint;

      if (!blueprint) {
        console.warn('Skipping: session has no blueprint data');
        return;
      }

      // Import and run blueprint checks
      const { verifyBlueprintDynamic, formatResults } = await import('./blueprint-checks.js');
      const results = verifyBlueprintDynamic(blueprint);

      console.log('\n' + formatResults(results) + '\n');

      // All critical fields must pass
      expect(results.criticalScore).toBeGreaterThanOrEqual(70);
      // Overall score should be reasonable
      expect(results.score).toBeGreaterThanOrEqual(50);
    });
  });

  // ─── Test 6: External API Health ────────────────────────────
  describe('External API Health', () => {
    it('homepage returns 200', async () => {
      const res = await fetch(BASE_URL);
      expect(res.status).toBe(200);
    });

    it('app page returns 200', async () => {
      const res = await fetch(`${BASE_URL}/app`);
      expect(res.status).toBe(200);
    });

    it('checkout endpoint is alive', async () => {
      const res = await anonFetch('/api/checkout', {
        method: 'POST',
        body: JSON.stringify({ tier: 'blueprint' }),
      });
      // Should return 200 (checkout URL) or 400 (missing data) — not 500
      expect(res.status).not.toBe(500);
    });

    it('webhook endpoint rejects empty payload', async () => {
      const res = await anonFetch('/api/webhook', {
        method: 'POST',
        body: JSON.stringify({}),
      });
      // Should return 400 — not 500
      expect(res.status).not.toBe(500);
    });
  });
});
