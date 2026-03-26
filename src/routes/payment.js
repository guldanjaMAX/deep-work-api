// src/routes/payment.js
// Payment and Stripe route handlers

export async function handleCreatePaymentIntent(request, env) {
  try {
    const body = await request.json();
    const { tiers } = body;
    if (!Array.isArray(tiers) || tiers.length === 0) {
      return jsonCORS({ error: "Invalid tiers" }, 400, request);
    }
    const PRICES = { blueprint: 6700, site: 13e3, call: 13e3 };
    const amount = tiers.reduce((sum, t) => sum + (PRICES[t] || 0), 0);
    if (amount === 0)
      return jsonCORS({ error: "Invalid tiers: no known products" }, 400, request);
    const { secretKey, publishableKey, testMode } = getStripeKeys(request, env);
    if (!secretKey)
      return jsonCORS({ error: "Stripe not configured" }, 500, request);
    const params = new URLSearchParams({
      amount: amount.toString(),
      currency: "usd",
      "metadata[tiers]": tiers.join(","),
      "payment_method_types[]": "card"
    });
    const res = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    });
    const pi = await res.json();
    if (!pi.client_secret) {
      return jsonCORS({ error: pi.error?.message || "Failed to create payment intent" }, 500, request);
    }
    return jsonCORS({ clientSecret: pi.client_secret, publishableKey, amount, paymentIntentId: pi.id, testMode }, 200, request);
  } catch (e) {
    return jsonCORS({ error: e.message }, 500, request);
  }
}

export async function handleFulfillPayment(request, env) {
  try {
    const { paymentIntentId, email, tiers, name, phone } = await request.json();
    if (!paymentIntentId || !email) {
      return json({ error: "Missing paymentIntentId or email" }, 400);
    }
    const { secretKey, testMode } = getStripeKeys(request, env);
    let verified = testMode;
    let resolvedTiers = tiers || ["blueprint"];
    if (!testMode) {
      try {
        const res = await fetch(`https://api.stripe.com/v1/payment_intents/${paymentIntentId}`, {
          headers: { "Authorization": `Bearer ${secretKey}` }
        });
        const pi = await res.json();
        verified = pi.status === "succeeded";
        if (pi.metadata?.tiers)
          resolvedTiers = pi.metadata.tiers.split(",");
      } catch (e) {
        verified = false;
      }
    }
    if (!verified) {
      return json({ error: "Payment not verified" }, 402);
    }
    const tier = resolvedTiers[0] || "blueprint";
    let user = null;
    try {
      user = await createUser(env, { email, name: name || "", tier, stripeCustomerId: null });
    } catch (e) {
      user = await getUserByEmail(env, email);
    }
    if (user && phone) {
      try {
        await env.DB.prepare("UPDATE users SET phone = ? WHERE id = ?").bind(phone, user.id).run();
      } catch (e) {
      }
    }
    const appOrigin = env.APP_ORIGIN || "https://love.jamesguldan.com";
    let sessionUrl = appOrigin;
    try {
      const token = await generateMagicToken();
      const userId = user ? user.id : email;
      await storeMagicToken(env, token, userId);
      sessionUrl = `${appOrigin}/magic?token=${token}&redirect=/app`;
    } catch (e) {
    }
    return jsonCORS({ success: true, sessionUrl }, 200, request);
  } catch (e) {
    return jsonCORS({ error: e.message }, 500, request);
  }
}

export async function handlePaymentStatus(request, env, url) {
  const piId = url.searchParams.get("pi");
  if (!piId)
    return json({ error: "Missing pi parameter" }, 400);
  const { secretKey, testMode } = getStripeKeys(request, env);
  try {
    const res = await fetch(`https://api.stripe.com/v1/payment_intents/${piId}`, {
      headers: { "Authorization": `Bearer ${secretKey}` }
    });
    const pi = await res.json();
    return json({ status: pi.status, testMode });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}

export async function handleCheckout(request, env) {
  const body = await request.json();
  const { tier, sessionId: existingSessionId } = body;
  const PRICE_MAP = {
    blueprint: "price_1TCXL7FArNSFW9mB5DDauxQg",
    call: "price_1TCXL8FArNSFW9mBBtiWVRCb",
    site: "price_1TCpHrFArNSFW9mBu0kQISZi"
  };
  const priceId = PRICE_MAP[tier];
  if (!priceId)
    return json({ error: "Invalid tier" }, 400);
  const origin = new URL(request.url).origin;
  const existingParam = existingSessionId ? `&existing_session=${existingSessionId}` : "";
  const successUrl = `${origin}/payment-success?tier=${tier}&session_id={CHECKOUT_SESSION_ID}${existingParam}`;
  const cancelUrl = `${origin}/`;
  const params = new URLSearchParams({
    "payment_method_types[]": "card",
    "line_items[0][price]": priceId,
    "line_items[0][quantity]": "1",
    "mode": "payment",
    "success_url": successUrl,
    "cancel_url": cancelUrl,
    "metadata[tier]": tier
  });
  if (existingSessionId)
    params.set("metadata[existing_session_id]", existingSessionId);
  const apiStart = Date.now();
  const idempotencyKey = `checkout_${tier}_${existingSessionId || Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const res = await stripePost(env, "/v1/checkout/sessions", params, { "Idempotency-Key": idempotencyKey });
  trackAPICall(env, "stripe", "/v1/checkout/sessions", res.status, Date.now() - apiStart);
  trackFunnelEvent(env, "checkout_started", { tier });
  const session = await res.json();
  if (session.url) {
    return json({ url: session.url });
  }
  await logError(env, { endpoint: "/api/checkout", method: "POST", statusCode: 500, errorType: "stripe_checkout", errorMessage: JSON.stringify(session.error) });
  await trackFunnelEvent(env, "payment_failed", { tier, error: session.error?.message });
  return json({ error: "Failed to create checkout session", detail: session.error }, 500);
}

export async function handleWebhook(request, env) {
  const body = await request.text();
  if (!env.STRIPE_WEBHOOK_SECRET) {
    await logError(env, { endpoint: "/api/webhook", method: "POST", statusCode: 500, errorType: "config_error", errorMessage: "STRIPE_WEBHOOK_SECRET not configured" });
    return json({ error: "Webhook verification not configured" }, 500);
  }
  const sigHeader = request.headers.get("stripe-signature") || "";
  const valid = await verifyStripeSignature(body, sigHeader, env.STRIPE_WEBHOOK_SECRET);
  if (!valid) {
    await logError(env, { endpoint: "/api/webhook", method: "POST", statusCode: 400, errorType: "invalid_stripe_signature", errorMessage: "Webhook signature mismatch" });
    return json({ error: "Invalid signature" }, 400);
  }
  try {
    const event = JSON.parse(body);
    if (event.type === "checkout.session.completed") {
      const s = event.data.object;
      await logEvent(env, null, "stripe_payment_completed", {
        checkoutId: s.id,
        tier: s.metadata?.tier,
        amount: s.amount_total
      });
    }
  } catch (e) {
    await logError(env, { endpoint: "/api/webhook", method: "POST", statusCode: 400, errorType: "json_parse_error", errorMessage: e.message }).catch(() => {
    });
    return json({ error: "Invalid webhook payload" }, 400);
  }
  return json({ received: true });
}
