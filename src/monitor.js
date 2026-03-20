const ALERT_EMAIL = 'james@jamesguldan.com';
const ALERT_COOLDOWN_MINUTES = 60; // Don't re-send same alert type within this window

// ════════════════════════════════════════════════════════
// ERROR LOGGING
// ════════════════════════════════════════════════════════

export async function logError(env, { endpoint, method, statusCode, errorType, errorMessage, stack, userId, sessionId, requestId }) {
  try {
    await env.DB.prepare(`
      INSERT INTO error_log (endpoint, method, status_code, error_type, error_message, stack, user_id, session_id, request_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(
      endpoint || null, method || null, statusCode || 500,
      errorType || 'unknown', (errorMessage || '').slice(0, 2000),
      (stack || '').slice(0, 4000),
      userId || null, sessionId || null, requestId || null
    ).run();
  } catch (e) {
    console.error('Failed to log error to D1:', e);
  }
}

// ════════════════════════════════════════════════════════
// METRICS
// ════════════════════════════════════════════════════════

export async function trackMetric(env, name, value, tags = null) {
  try {
    await env.DB.prepare(`
      INSERT INTO metrics (metric_name, metric_value, tags, created_at) VALUES (?, ?, ?, datetime('now'))
    `).bind(name, value, tags ? JSON.stringify(tags) : null).run();
  } catch (e) {
    console.error('Failed to track metric:', e);
  }
}

// ════════════════════════════════════════════════════════
// HEALTH CHECKS — Test every dependency
// ════════════════════════════════════════════════════════

export async function runFullHealthCheck(env) {
  const results = {};

  // 1. D1 Database
  results.d1 = await checkD1(env);

  // 2. KV Store
  results.kv = await checkKV(env);

  // 3. R2 Storage
  results.r2 = await checkR2(env);

  // 4. Stripe API
  results.stripe = await checkStripe(env);

  // 5. Anthropic API
  results.anthropic = await checkAnthropic(env);

  // 6. Resend Email API
  results.resend = await checkResend(env);

  // 7. Funnel Health
  results.funnel = await checkFunnelHealth(env);

  // 8. Error Rate
  results.errorRate = await checkErrorRate(env);

  // Store results
  for (const [checkType, result] of Object.entries(results)) {
    try {
      await env.DB.prepare(`
        INSERT INTO health_checks (check_type, status, latency_ms, details, created_at) VALUES (?, ?, ?, ?, datetime('now'))
      `).bind(checkType, result.status, result.latencyMs || 0, JSON.stringify(result)).run();
    } catch (e) { /* best effort */ }
  }

  // Determine overall status
  const allStatuses = Object.values(results).map(r => r.status);
  const overallStatus = allStatuses.includes('critical') ? 'critical'
    : allStatuses.includes('warning') ? 'warning' : 'healthy';

  return { status: overallStatus, checks: results, timestamp: new Date().toISOString() };
}

async function checkD1(env) {
  const start = Date.now();
  try {
    const row = await env.DB.prepare(`SELECT COUNT(*) as cnt FROM users`).first();
    return { status: 'healthy', latencyMs: Date.now() - start, userCount: row?.cnt || 0 };
  } catch (e) {
    return { status: 'critical', latencyMs: Date.now() - start, error: e.message };
  }
}

async function checkKV(env) {
  const start = Date.now();
  try {
    const testKey = '__health_check_' + Date.now();
    await env.SESSIONS.put(testKey, 'ok', { expirationTtl: 60 });
    const val = await env.SESSIONS.get(testKey);
    await env.SESSIONS.delete(testKey);
    return { status: val === 'ok' ? 'healthy' : 'warning', latencyMs: Date.now() - start };
  } catch (e) {
    return { status: 'critical', latencyMs: Date.now() - start, error: e.message };
  }
}

async function checkR2(env) {
  const start = Date.now();
  try {
    await env.UPLOADS.head('__nonexistent_health_check__');
    return { status: 'healthy', latencyMs: Date.now() - start };
  } catch (e) {
    // head() on missing key returns null, not an error. If we get here, R2 itself is down.
    return { status: 'warning', latencyMs: Date.now() - start, error: e.message };
  }
}

async function checkStripe(env) {
  if (!env.STRIPE_SECRET_KEY) return { status: 'warning', error: 'STRIPE_SECRET_KEY not configured' };
  const start = Date.now();
  try {
    const res = await fetch('https://api.stripe.com/v1/balance', {
      headers: { 'Authorization': 'Bearer ' + env.STRIPE_SECRET_KEY }
    });
    const latency = Date.now() - start;
    if (res.ok) return { status: 'healthy', latencyMs: latency };
    if (res.status === 429) return { status: 'warning', latencyMs: latency, error: 'Rate limited' };
    return { status: 'critical', latencyMs: latency, error: `HTTP ${res.status}` };
  } catch (e) {
    return { status: 'critical', latencyMs: Date.now() - start, error: e.message };
  }
}

async function checkAnthropic(env) {
  if (!env.ANTHROPIC_API_KEY) return { status: 'warning', error: 'ANTHROPIC_API_KEY not configured' };
  const start = Date.now();
  try {
    // Lightweight check: just hit the API with an invalid tiny request to verify auth works
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1, messages: [{ role: 'user', content: 'ping' }] })
    });
    const latency = Date.now() - start;
    if (res.ok || res.status === 200) return { status: 'healthy', latencyMs: latency };
    if (res.status === 429) return { status: 'warning', latencyMs: latency, error: 'Rate limited — approaching API ceiling' };
    if (res.status === 401) return { status: 'critical', latencyMs: latency, error: 'API key invalid or expired' };
    if (res.status === 529) return { status: 'warning', latencyMs: latency, error: 'Anthropic API overloaded' };
    return { status: 'warning', latencyMs: latency, error: `HTTP ${res.status}` };
  } catch (e) {
    return { status: 'critical', latencyMs: Date.now() - start, error: e.message };
  }
}

async function checkResend(env) {
  if (!env.RESEND_API_KEY) return { status: 'warning', error: 'RESEND_API_KEY not configured — emails disabled' };
  const start = Date.now();
  try {
    const res = await fetch('https://api.resend.com/domains', {
      headers: { 'Authorization': 'Bearer ' + env.RESEND_API_KEY }
    });
    const latency = Date.now() - start;
    if (res.ok) {
      const data = await res.json();
      return { status: 'healthy', latencyMs: latency, domains: data.data?.length || 0 };
    }
    if (res.status === 429) return { status: 'warning', latencyMs: latency, error: 'Approaching Resend rate limit' };
    return { status: 'critical', latencyMs: latency, error: `HTTP ${res.status}` };
  } catch (e) {
    return { status: 'critical', latencyMs: Date.now() - start, error: e.message };
  }
}

// ════════════════════════════════════════════════════════
// FUNNEL ANALYSIS
// ════════════════════════════════════════════════════════

export async function checkFunnelHealth(env) {
  try {
    // Check the last 20 sessions for completion patterns
    const recentSessions = await env.DB.prepare(`
      SELECT id, tier, phase, blueprint_generated, site_generated, created_at, completed_at,
             (julianday(COALESCE(completed_at, datetime('now'))) - julianday(created_at)) * 24 * 60 as duration_minutes
      FROM sessions ORDER BY created_at DESC LIMIT 20
    `).all();

    const sessions = recentSessions.results || [];
    if (sessions.length === 0) return { status: 'healthy', message: 'No sessions yet' };

    // Calculate funnel metrics
    const total = sessions.length;
    const stuckInPhase1 = sessions.filter(s => s.phase <= 1).length;
    const reachedMidpoint = sessions.filter(s => s.phase >= 4).length;
    const completed = sessions.filter(s => s.phase >= 8 || s.blueprint_generated).length;
    const completionRate = Math.round((completed / total) * 100);
    const dropOffRate = Math.round((stuckInPhase1 / total) * 100);

    // Check for concerning patterns
    const lastFive = sessions.slice(0, 5);
    const lastFiveAllStuck = lastFive.every(s => s.phase <= 2);
    const avgPhase = sessions.reduce((sum, s) => sum + s.phase, 0) / total;

    let status = 'healthy';
    let warnings = [];

    if (lastFiveAllStuck) {
      status = 'critical';
      warnings.push('Last 5 sessions all stuck in phase 1-2 — possible UX or API issue');
    }
    if (dropOffRate > 60) {
      status = status === 'critical' ? 'critical' : 'warning';
      warnings.push(`${dropOffRate}% drop-off rate in phase 1 — users may be confused or hitting errors`);
    }
    if (completionRate < 20 && total >= 5) {
      status = status === 'critical' ? 'critical' : 'warning';
      warnings.push(`Only ${completionRate}% completion rate across ${total} sessions`);
    }

    return {
      status,
      total,
      completionRate,
      dropOffRate,
      avgPhase: Math.round(avgPhase * 10) / 10,
      stuckInPhase1,
      reachedMidpoint,
      completed,
      warnings: warnings.length ? warnings : undefined,
      lastFivePhases: lastFive.map(s => s.phase)
    };
  } catch (e) {
    return { status: 'warning', error: e.message };
  }
}

// ════════════════════════════════════════════════════════
// ERROR RATE ANALYSIS
// ══════════════════════════════════════════��═════════════

async function checkErrorRate(env) {
  try {
    const hourAgo = await env.DB.prepare(`
      SELECT COUNT(*) as cnt FROM error_log WHERE created_at >= datetime('now', '-1 hour')
    `).first();
    const dayAgo = await env.DB.prepare(`
      SELECT COUNT(*) as cnt FROM error_log WHERE created_at >= datetime('now', '-24 hours')
    `).first();

    const lastHour = hourAgo?.cnt || 0;
    const last24h = dayAgo?.cnt || 0;

    // Top errors in the last 24h
    const topErrors = await env.DB.prepare(`
      SELECT endpoint, error_type, error_message, COUNT(*) as cnt
      FROM error_log WHERE created_at >= datetime('now', '-24 hours')
      GROUP BY endpoint, error_type ORDER BY cnt DESC LIMIT 5
    `).all();

    let status = 'healthy';
    let warnings = [];
    if (lastHour > 50) { status = 'critical'; warnings.push(`${lastHour} errors in the last hour — something is very wrong`); }
    else if (lastHour > 10) { status = 'warning'; warnings.push(`${lastHour} errors in the last hour — elevated error rate`); }
    if (last24h > 200) { status = status === 'critical' ? 'critical' : 'warning'; warnings.push(`${last24h} errors in the last 24 hours`); }

    return { status, lastHour, last24h, topErrors: topErrors.results || [], warnings: warnings.length ? warnings : undefined };
  } catch (e) {
    return { status: 'warning', error: e.message };
  }
}

// ════════════════════════════════════════════════════════
// API USAGE TRACKING
// ════════════════════════════════════════════════════════

export async function trackAPICall(env, provider, endpoint, statusCode, latencyMs, tokensUsed = null) {
  const tags = { provider, endpoint, statusCode: String(statusCode) };
  if (tokensUsed) tags.tokens = tokensUsed;
  await trackMetric(env, `api.${provider}.call`, latencyMs, tags);

  // Check for rate limit responses
  if (statusCode === 429) {
    await createAlert(env, {
      alertType: `rate_limit_${provider}`,
      severity: 'warning',
      title: `${provider} API Rate Limited`,
      message: `Hit rate limit on ${provider} (endpoint: ${endpoint}). Requests are being throttled. This may impact user experience.`
    });
  }
}

// ════════════════════════════════════════════════════════
// ALERT SYSTEM
// ════════════════════════════════════════════════════════

export async function createAlert(env, { alertType, severity, title, message }) {
  try {
    // Check cooldown — don't spam the same alert
    const recent = await env.DB.prepare(`
      SELECT id FROM alerts
      WHERE alert_type = ? AND created_at >= datetime('now', '-${ALERT_COOLDOWN_MINUTES} minutes')
      LIMIT 1
    `).bind(alertType).first();

    if (recent) return; // Already alerted recently

    // Store alert
    await env.DB.prepare(`
      INSERT INTO alerts (alert_type, severity, title, message, created_at) VALUES (?, ?, ?, ?, datetime('now'))
    `).bind(alertType, severity, title, message).run();

    // Send email if critical or warning
    if (env.RESEND_API_KEY && (severity === 'critical' || severity === 'warning')) {
      await sendAlertEmail(env, { alertType, severity, title, message });
    }
  } catch (e) {
    console.error('Failed to create alert:', e);
  }
}

async function sendAlertEmail(env, { alertType, severity, title, message }) {
  try {
    const isCritical = severity === 'critical';
    const html = getAlertEmailHTML({ alertType, severity, title, message, isCritical });

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + env.RESEND_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Deep Work Alerts <alerts@jamesguldan.com>',
        to: [ALERT_EMAIL],
        subject: `${isCritical ? '🔴' : '🟡'} [Deep Work] ${title}`,
        html
      })
    });

    // Mark as emailed
    await env.DB.prepare(`
      UPDATE alerts SET emailed = 1 WHERE alert_type = ? AND emailed = 0
    `).bind(alertType).run();
  } catch (e) {
    console.error('Failed to send alert email:', e);
  }
}

// ════════════════════════════════════════════════════════
// FUNNEL EVENT TRACKING (for real-time monitoring)
// ════════════════════════════════════════════════════════

export async function trackFunnelEvent(env, eventName, data = {}) {
  try {
    await trackMetric(env, `funnel.${eventName}`, 1, data);

    // Check for funnel-breaking patterns after key events
    if (eventName === 'payment_failed') {
      const recentFailures = await env.DB.prepare(`
        SELECT COUNT(*) as cnt FROM metrics
        WHERE metric_name = 'funnel.payment_failed' AND created_at >= datetime('now', '-1 hour')
      `).first();
      if ((recentFailures?.cnt || 0) >= 3) {
        await createAlert(env, {
          alertType: 'payment_failures_spike',
          severity: 'critical',
          title: 'Multiple Payment Failures',
          message: `${recentFailures.cnt} payment failures in the last hour. Stripe may be down or checkout is broken. Check immediately.`
        });
      }
    }

    if (eventName === 'ai_error') {
      const recentAIErrors = await env.DB.prepare(`
        SELECT COUNT(*) as cnt FROM metrics
        WHERE metric_name = 'funnel.ai_error' AND created_at >= datetime('now', '-30 minutes')
      `).first();
      if ((recentAIErrors?.cnt || 0) >= 5) {
        await createAlert(env, {
          alertType: 'ai_errors_spike',
          severity: 'critical',
          title: 'AI Chat Errors Spike',
          message: `${recentAIErrors.cnt} AI/chat errors in the last 30 minutes. Anthropic API may be down. Users are getting stuck mid-session.`
        });
      }
    }

    if (eventName === 'session_abandoned') {
      // Check if many sessions are being abandoned at the same phase
      const recent = await env.DB.prepare(`
        SELECT tags FROM metrics
        WHERE metric_name = 'funnel.session_abandoned' AND created_at >= datetime('now', '-24 hours')
        ORDER BY created_at DESC LIMIT 10
      `).all();
      const phases = (recent.results || []).map(r => {
        try { return JSON.parse(r.tags)?.phase; } catch { return null; }
      }).filter(Boolean);
      const phaseCount = {};
      phases.forEach(p => { phaseCount[p] = (phaseCount[p] || 0) + 1; });
      const hottestPhase = Object.entries(phaseCount).sort((a, b) => b[1] - a[1])[0];
      if (hottestPhase && hottestPhase[1] >= 3) {
        await createAlert(env, {
          alertType: `phase_${hottestPhase[0]}_dropoff`,
          severity: 'warning',
          title: `Users Dropping Off at Phase ${hottestPhase[0]}`,
          message: `${hottestPhase[1]} users abandoned their session at phase ${hottestPhase[0]} in the last 24 hours. This phase may have a UX or content issue.`
        });
      }
    }
  } catch (e) {
    console.error('Failed to track funnel event:', e);
  }
}

// ════════════════════════════════════════════════════════
// DAILY DIGEST (called by scheduled trigger or admin)
// ════════════════════════════════════════════════════════

export async function generateDailyDigest(env) {
  try {
    // Gather 24h stats
    const [sessions24h, errors24h, payments24h, completions24h, activeAlerts] = await Promise.all([
      env.DB.prepare(`SELECT COUNT(*) as cnt FROM sessions WHERE created_at >= datetime('now', '-24 hours')`).first(),
      env.DB.prepare(`SELECT COUNT(*) as cnt FROM error_log WHERE created_at >= datetime('now', '-24 hours')`).first(),
      env.DB.prepare(`SELECT COUNT(*) as cnt, COALESCE(SUM(amount),0) as total FROM payments WHERE status='succeeded' AND created_at >= datetime('now', '-24 hours')`).first(),
      env.DB.prepare(`SELECT COUNT(*) as cnt FROM sessions WHERE blueprint_generated = 1 AND created_at >= datetime('now', '-24 hours')`).first(),
      env.DB.prepare(`SELECT COUNT(*) as cnt FROM alerts WHERE resolved = 0`).first(),
    ]);

    // Funnel health
    const funnel = await checkFunnelHealth(env);

    // Top errors
    const topErrors = await env.DB.prepare(`
      SELECT endpoint, error_message, COUNT(*) as cnt
      FROM error_log WHERE created_at >= datetime('now', '-24 hours')
      GROUP BY endpoint, error_message ORDER BY cnt DESC LIMIT 3
    `).all();

    const digest = {
      period: 'Last 24 hours',
      newSessions: sessions24h?.cnt || 0,
      errorsLogged: errors24h?.cnt || 0,
      payments: payments24h?.cnt || 0,
      revenue: (payments24h?.total || 0) / 100,
      blueprintsCompleted: completions24h?.cnt || 0,
      unresolvedAlerts: activeAlerts?.cnt || 0,
      funnelCompletionRate: funnel.completionRate || 0,
      funnelWarnings: funnel.warnings || [],
      topErrors: (topErrors.results || []).map(e => `${e.endpoint}: ${e.error_message} (${e.cnt}x)`),
    };

    // Send digest email
    if (env.RESEND_API_KEY) {
      await sendDigestEmail(env, digest);
    }

    return digest;
  } catch (e) {
    console.error('Failed to generate digest:', e);
    return { error: e.message };
  }
}

async function sendDigestEmail(env, digest) {
  const html = getDigestEmailHTML(digest);
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + env.RESEND_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Deep Work Digest <digest@jamesguldan.com>',
        to: [ALERT_EMAIL],
        subject: `📊 Deep Work Daily — ${digest.newSessions} sessions, $${digest.revenue} revenue`,
        html
      })
    });
  } catch (e) {
    console.error('Failed to send digest email:', e);
  }
}

// ════════════════════════════════════════════════════════
// ADMIN MONITORING API HANDLERS
// ════════════════════════════════════════════════════════

export async function handleMonitoringDashboard(env) {
  const [healthResult, funnel, recentAlerts, recentErrors, apiMetrics] = await Promise.all([
    getLatestHealthChecks(env),
    checkFunnelHealth(env),
    env.DB.prepare(`SELECT * FROM alerts ORDER BY created_at DESC LIMIT 20`).all(),
    env.DB.prepare(`SELECT * FROM error_log ORDER BY created_at DESC LIMIT 20`).all(),
    env.DB.prepare(`
      SELECT metric_name, COUNT(*) as calls, AVG(metric_value) as avg_latency
      FROM metrics WHERE metric_name LIKE 'api.%' AND created_at >= datetime('now', '-24 hours')
      GROUP BY metric_name ORDER BY calls DESC
    `).all(),
  ]);

  return {
    health: healthResult,
    funnel,
    alerts: recentAlerts.results || [],
    errors: recentErrors.results || [],
    apiUsage: apiMetrics.results || [],
  };
}

async function getLatestHealthChecks(env) {
  const checks = await env.DB.prepare(`
    SELECT check_type, status, latency_ms, details, created_at
    FROM health_checks
    WHERE id IN (SELECT MAX(id) FROM health_checks GROUP BY check_type)
    ORDER BY check_type
  `).all();
  return checks.results || [];
}

// ════════════════════════════════════════════════════════
// EMAIL TEMPLATES
// ════════════════════════════════════════════════════════

function getAlertEmailHTML({ alertType, severity, title, message, isCritical }) {
  const bgColor = isCritical ? '#FEF2F2' : '#FFFBEB';
  const accentColor = isCritical ? '#DC2626' : '#D97706';
  const iconEmoji = isCritical ? '🔴' : '🟡';
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#FDFCFA;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<div style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.06);">
  <div style="background:${bgColor};padding:28px 32px;border-bottom:2px solid ${accentColor};">
    <p style="margin:0;font-size:14px;color:${accentColor};font-weight:600;text-transform:uppercase;letter-spacing:1px;">
      ${iconEmoji} ${severity} Alert
    </p>
    <h1 style="margin:8px 0 0;font-size:22px;color:#1a1a1a;font-weight:700;">${title}</h1>
  </div>
  <div style="padding:28px 32px;">
    <p style="margin:0 0 20px;font-size:15px;color:#444;line-height:1.6;">${message}</p>
    <div style="background:#F9FAFB;border-radius:8px;padding:14px 18px;font-size:13px;color:#666;">
      <strong>Alert type:</strong> ${alertType}<br>
      <strong>Time:</strong> ${new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC
    </div>
    <div style="margin-top:24px;text-align:center;">
      <a href="https://app.jamesguldan.com/admin" style="display:inline-block;background:#1a1a1a;color:#fff;padding:12px 32px;border-radius:100px;text-decoration:none;font-size:14px;font-weight:600;">Open Admin Dashboard →</a>
    </div>
  </div>
  <div style="padding:16px 32px;background:#FAFAF8;border-top:1px solid #EAE7E2;text-align:center;">
    <p style="margin:0;font-size:12px;color:#aaa;">Deep Work App by Align Growth LLC</p>
  </div>
</div>
</body></html>`;
}

function getDigestEmailHTML(digest) {
  const hasWarnings = digest.funnelWarnings.length > 0 || digest.errorsLogged > 10;
  const headerBg = hasWarnings ? '#FFFBEB' : '#F0FDF4';
  const headerColor = hasWarnings ? '#D97706' : '#16A34A';

  const warningHTML = digest.funnelWarnings.length ? digest.funnelWarnings.map(w =>
    `<div style="background:#FFFBEB;border-left:3px solid #D97706;padding:10px 14px;margin:8px 0;border-radius:0 6px 6px 0;font-size:14px;color:#92400E;">${w}</div>`
  ).join('') : '';

  const errorHTML = digest.topErrors.length ? '<h3 style="margin:20px 0 8px;font-size:15px;color:#1a1a1a;">Top Errors</h3>' +
    digest.topErrors.map(e => `<p style="margin:4px 0;font-size:13px;color:#666;font-family:monospace;">${e}</p>`).join('') : '';

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#FDFCFA;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<div style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.06);">
  <div style="background:${headerBg};padding:28px 32px;border-bottom:2px solid ${headerColor};">
    <p style="margin:0;font-size:14px;color:${headerColor};font-weight:600;text-transform:uppercase;letter-spacing:1px;">
      📊 Daily Digest
    </p>
    <h1 style="margin:8px 0 0;font-size:22px;color:#1a1a1a;font-weight:700;">Deep Work — ${digest.period}</h1>
  </div>
  <div style="padding:28px 32px;">
    <div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:20px;">
      ${statCard('Sessions', digest.newSessions)}
      ${statCard('Revenue', '$' + digest.revenue)}
      ${statCard('Blueprints', digest.blueprintsCompleted)}
      ${statCard('Errors', digest.errorsLogged)}
    </div>

    <div style="background:#F9FAFB;border-radius:10px;padding:16px 20px;margin:16px 0;">
      <h3 style="margin:0 0 8px;font-size:14px;color:#1a1a1a;">Funnel Health</h3>
      <p style="margin:0;font-size:14px;color:#666;">Completion rate: <strong>${digest.funnelCompletionRate}%</strong></p>
      <p style="margin:4px 0 0;font-size:14px;color:#666;">Unresolved alerts: <strong>${digest.unresolvedAlerts}</strong></p>
    </div>

    ${warningHTML}
    ${errorHTML}

    <div style="margin-top:24px;text-align:center;">
      <a href="https://app.jamesguldan.com/admin" style="display:inline-block;background:#1a1a1a;color:#fff;padding:12px 32px;border-radius:100px;text-decoration:none;font-size:14px;font-weight:600;">Open Admin Dashboard →</a>
    </div>
  </div>
  <div style="padding:16px 32px;background:#FAFAF8;border-top:1px solid #EAE7E2;text-align:center;">
    <p style="margin:0;font-size:12px;color:#aaa;">Deep Work App by Align Growth LLC</p>
  </div>
</div>
</body></html>`;
}

function statCard(label, value) {
  return `<div style="flex:1;min-width:100px;background:#F9FAFB;border-radius:10px;padding:14px 16px;text-align:center;">
    <p style="margin:0;font-size:24px;font-weight:700;color:#1a1a1a;">${value}</p>
    <p style="margin:4px 0 0;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">${label}</p>
  </div>`;
}

// ════════════════════════════════════════════════════════
// BEAUTIFUL ERROR PAGES (customer-facing)
// ════════════════════════════════════════════════════════

export function getErrorPageHTML(statusCode, title, message) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} — Deep Work</title>
<link rel="icon" type="image/x-icon" href="https://jamesguldan.com/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="https://jamesguldan.com/favicon.png">
<link rel="apple-touch-icon" sizes="180x180" href="https://jamesguldan.com/apple-touch-icon.png">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@600;700&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background: #FDFCFA; color: #1a1a1a; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; -webkit-font-smoothing: antialiased; }
  .error-card { max-width: 440px; width: 100%; text-align: center; }
  .error-code { font-family: 'Outfit', sans-serif; font-size: 72px; font-weight: 700; color: #EAE7E2; line-height: 1; margin-bottom: 16px; }
  .error-title { font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 700; margin-bottom: 8px; }
  .error-message { font-size: 15px; color: #666; line-height: 1.6; margin-bottom: 32px; }
  .error-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  .btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 28px; border-radius: 100px; font-size: 14px; font-weight: 600; text-decoration: none; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
  .btn-primary { background: #1a1a1a; color: #fff; }
  .btn-primary:hover { background: #333; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
  .btn-secondary { background: #fff; color: #1a1a1a; border: 1px solid #EAE7E2; }
  .btn-secondary:hover { border-color: #D8D3CB; background: #F9F7F4; }
  .support-note { margin-top: 40px; font-size: 13px; color: #999; }
  .support-note a { color: #c4703f; text-decoration: none; }
  .support-note a:hover { text-decoration: underline; }
</style>
</head>
<body>
  <div class="error-card">
    <div class="error-code">${statusCode}</div>
    <h1 class="error-title">${title}</h1>
    <p class="error-message">${message}</p>
    <div class="error-actions">
      <a href="/" class="btn btn-primary">Back to Home →</a>
      <a href="javascript:location.reload()" class="btn btn-secondary">Try Again</a>
    </div>
    <p class="support-note">Need help? <a href="mailto:james@jamesguldan.com">james@jamesguldan.com</a></p>
  </div>
</body>
</html>`;
}

export const ERROR_PAGES = {
  400: { title: 'Bad Request', message: "Something didn't look right with that request. Please try again or head back to the home page." },
  401: { title: 'Not Authorized', message: "You'll need to sign in to access this page. If you believe this is an error, try signing out and back in." },
  403: { title: 'Access Denied', message: "You don't have permission to view this page. If you think this is wrong, please reach out." },
  404: { title: 'Page Not Found', message: "We couldn't find what you were looking for. It may have been moved or no longer exists." },
  429: { title: 'Too Many Requests', message: "You're moving a bit fast. Please wait a moment and try again." },
  500: { title: 'Something Went Wrong', message: "We hit an unexpected bump. Our team has been notified and we're looking into it. Please try again in a moment." },
  502: { title: 'Service Unavailable', message: "One of our services is temporarily unavailable. Please try again in a few minutes." },
  503: { title: 'Temporarily Down', message: "We're doing some quick maintenance. Please check back in a few minutes." },
};

