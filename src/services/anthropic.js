// src/services/anthropic.js
// Anthropic Claude API wrapper
// The actual call pattern is extracted from src/index.js — callers pass model, headers, body directly.
// This is a thin wrapper; business logic stays in route handlers.

export const MODEL_OPUS = "claude-opus-4-6";
export const MODEL_HAIKU = "claude-haiku-4-5-20251001";

export async function callAnthropic(env, { model, system, messages, max_tokens = 8192, stream = false, cacheSystem = false }) {
  const headers = {
    "x-api-key": env.ANTHROPIC_API_KEY,
    "anthropic-version": "2023-06-01",
    "content-type": "application/json"
  };

  if (stream) {
    headers["anthropic-beta"] = "prompt-caching-2024-07-31";
  }

  const systemPayload = cacheSystem && system
    ? [{ type: "text", text: system, cache_control: { type: "ephemeral" } }]
    : system;

  return fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers,
    body: JSON.stringify({ model, system: systemPayload, messages, max_tokens, stream })
  });
}
