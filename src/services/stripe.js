// src/services/stripe.js
// Stripe API wrapper
// verifyStripeSignature copied exactly from src/index.js lines 13999-14017

export async function stripeRequest(env, method, endpoint, params = null) {
  const secretKey = env.STRIPE_MODE === "test" ? env.STRIPE_TEST_SECRET_KEY : env.STRIPE_SECRET_KEY;
  const options = {
    method,
    headers: {
      "Authorization": "Bearer " + secretKey,
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };
  if (params && method !== "GET") {
    options.body = new URLSearchParams(params).toString();
  }
  return fetch("https://api.stripe.com/v1" + endpoint, options);
}

export async function verifyStripeSignature(payload, sigHeader, secret) {
  try {
    const parts = Object.fromEntries(sigHeader.split(",").map((p) => p.split("=")));
    const timestamp = parts.t;
    const signatures = sigHeader.split(",").filter((p) => p.startsWith("v1=")).map((p) => p.slice(3));
    if (!timestamp || signatures.length === 0)
      return false;
    if (Math.abs(Date.now() / 1e3 - Number(timestamp)) > 300)
      return false;
    const signedPayload = `${timestamp}.${payload}`;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const sig = await crypto.subtle.sign("HMAC", key, enc.encode(signedPayload));
    const expected = Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
    return signatures.some((s) => s === expected);
  } catch (_) {
    return false;
  }
}
