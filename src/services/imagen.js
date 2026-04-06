// src/services/imagen.js
// Google Imagen / Gemini image generation via the Gemini proxy worker
// Proxy URL: https://gemini-proxy.james-d13.workers.dev
// Auth: GEMINI_PROXY_TOKEN env var

const PROXY_URL = "https://gemini-proxy.james-d13.workers.dev";

export async function generateImage(env, prompt, options = {}) {
  const { model = "imagen-4.0-generate-001", sampleCount = 1, aspectRatio = "1:1", personGeneration = "allow_adult" } = options;
  const token = env.GEMINI_PROXY_TOKEN || "";

  const res = await fetch(`${PROXY_URL}/v1beta/models/${model}:predict`, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      instances: [{ prompt }],
      parameters: { sampleCount, aspectRatio, personGeneration }
    })
  });

  return res;
}

export async function geminiCall(url, body, env) {
  const token = env.GEMINI_PROXY_TOKEN || "";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) return null;
  return res.json();
}
