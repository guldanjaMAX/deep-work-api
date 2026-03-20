// ============================================================
// DEEP WORK APP — AUTH MODULE
// Password hashing, JWT tokens, magic links, middleware
// ============================================================

// ── PASSWORD HASHING (Web Crypto PBKDF2) ─────────────────

export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial, 256
  );
  const hashHex = toHex(new Uint8Array(bits));
  const saltHex = toHex(salt);
  return `pbkdf2:${saltHex}:${hashHex}`;
}

export async function verifyPassword(password, stored) {
  try {
    const [, saltHex, hashHex] = stored.split(':');
    const salt = fromHex(saltHex);
    const keyMaterial = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']
    );
    const bits = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
      keyMaterial, 256
    );
    return toHex(new Uint8Array(bits)) === hashHex;
  } catch {
    return false;
  }
}


// ── JWT-STYLE SESSION TOKENS (HMAC-SHA256) ────────────────

export async function createSessionToken(userId, role, secret) {
  const payload = {
    userId,
    role,
    iat: Date.now(),
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
  };
  const data = btoa(JSON.stringify(payload));
  const sig = await hmacSign(data, secret);
  return `${data}.${sig}`;
}

export async function verifySessionToken(token, secret) {
  try {
    const lastDot = token.lastIndexOf('.');
    if (lastDot === -1) return null;
    const data = token.slice(0, lastDot);
    const sig = token.slice(lastDot + 1);
    const valid = await hmacVerify(data, sig, secret);
    if (!valid) return null;
    const payload = JSON.parse(atob(data));
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}


// ── MAGIC LINK TOKENS ─────────────────────────────────────

export function generateMagicToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return toHex(bytes);
}

export async function storeMagicToken(env, token, userId, type = 'magic_login', ttlHours = 24) {
  const expires = new Date(Date.now() + ttlHours * 60 * 60 * 1000).toISOString();
  await env.DB.prepare(`
    INSERT INTO auth_tokens (token, user_id, type, expires_at, used, created_at)
    VALUES (?, ?, ?, ?, 0, datetime('now'))
  `).bind(token, userId, type, expires).run();
}

export async function consumeMagicToken(env, token) {
  const row = await env.DB.prepare(`
    SELECT * FROM auth_tokens WHERE token = ? AND used = 0 AND expires_at > datetime('now')
  `).bind(token).first();
  if (!row) return null;

  await env.DB.prepare(`UPDATE auth_tokens SET used = 1 WHERE token = ?`).bind(token).run();
  return row;
}


// ── USER HELPERS ──────────────────────────────────────────

export async function getUserByEmail(env, email) {
  return env.DB.prepare(`SELECT * FROM users WHERE email = ?`)
    .bind(email.toLowerCase().trim())
    .first();
}

export async function getUserById(env, userId) {
  return env.DB.prepare(`SELECT * FROM users WHERE id = ?`).bind(userId).first();
}

export async function createUser(env, { email, name, role = 'user', tier = null, stripeCustomerId = null }) {
  const id = `usr_${Date.now()}_${crypto.getRandomValues(new Uint8Array(4)).reduce((s,b)=>s+b.toString(16).padStart(2,'0'),'')}`;
  await env.DB.prepare(`
    INSERT INTO users (id, email, name, role, tier, stripe_customer_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
  `).bind(id, email.toLowerCase().trim(), name || '', role, tier, stripeCustomerId).run();
  return getUserById(env, id);
}

export async function updateUserPassword(env, userId, passwordHash) {
  await env.DB.prepare(`UPDATE users SET password_hash = ? WHERE id = ?`)
    .bind(passwordHash, userId).run();
}

export async function updateLastLogin(env, userId) {
  await env.DB.prepare(`UPDATE users SET last_login = datetime('now') WHERE id = ?`)
    .bind(userId).run();
}


// ── AUTH MIDDLEWARE ───────────────────────────────────────

export async function requireAuth(request, env) {
  const token = extractToken(request);
  if (!token) return null;
  const payload = await verifySessionToken(token, env.JWT_SECRET || 'dev-secret-change-me');
  if (!payload) return null;
  const user = await getUserById(env, payload.userId);
  return user || null;
}

export async function requireAdmin(request, env) {
  const user = await requireAuth(request, env);
  if (!user || user.role !== 'admin') return null;
  return user;
}

function extractToken(request) {
  // Check Authorization header
  const auth = request.headers.get('Authorization');
  if (auth?.startsWith('Bearer ')) return auth.slice(7);

  // Check cookie
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(/dw_session=([^;]+)/);
  if (match) return match[1];

  // Check query param (for magic links etc.)
  const url = new URL(request.url);
  return url.searchParams.get('token') || null;
}


// ── SETTINGS HELPERS ──────────────────────────────────────

export async function getSetting(env, key) {
  const row = await env.DB.prepare(`SELECT value FROM settings WHERE key = ?`).bind(key).first();
  return row?.value ?? null;
}

export async function setSetting(env, key, value) {
  await env.DB.prepare(`
    INSERT INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now'))
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
  `).bind(key, value).run();
}

export async function getAllSettings(env) {
  const { results } = await env.DB.prepare(`SELECT key, value FROM settings ORDER BY key`).all();
  return Object.fromEntries(results.map(r => [r.key, r.value]));
}


// ── CRYPTO UTILS ──────────────────────────────────────────

async function hmacSign(data, secret) {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return toHex(new Uint8Array(sig));
}

async function hmacVerify(data, sigHex, secret) {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
  );
  const sig = fromHex(sigHex);
  return crypto.subtle.verify('HMAC', key, sig, new TextEncoder().encode(data));
}

function toHex(bytes) {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

function fromHex(hex) {
  return new Uint8Array(hex.match(/.{2}/g).map(b => parseInt(b, 16)));
}
