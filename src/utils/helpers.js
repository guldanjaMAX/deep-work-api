// src/utils/helpers.js
// Shared response helpers — extracted from monolith src/index.js lines 13274-13366

export const ALLOWED_ORIGINS = [
  "https://love.jamesguldan.com",
  "https://jamesguldan.com",
  "https://dev.jamesguldan-site.pages.dev"
];

export function getCORSHeaders(request) {
  const origin = request && request.headers && request.headers.get("Origin") || "";
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : "https://love.jamesguldan.com";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Vary": "Origin"
  };
}

export const SEC_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(self), geolocation=()"
};

export function htmlHeaders(extra = {}) {
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com",
    "font-src https://fonts.googleapis.com https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://api.stripe.com https://api.resend.com https://api.anthropic.com",
    "frame-src 'self' https://js.stripe.com",
    "object-src 'none'",
    "base-uri 'self'"
  ].join("; ");
  return { "Content-Type": "text/html;charset=UTF-8", "Cache-Control": "no-store, no-cache, must-revalidate", "Content-Security-Policy": csp, ...SEC_HEADERS, ...extra };
}

// json() uses CORS headers — needs request for origin-aware CORS
export function json(data, status = 200, request = null) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...getCORSHeaders(request) }
  });
}
