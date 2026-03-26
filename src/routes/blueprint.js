// src/routes/blueprint.js
// Blueprint route handlers

export async function handleBlueprintPDF(request, env) {
  const body = await request.json();
  const { sessionId } = body;
  const raw = await env.SESSIONS.get(sessionId);
  if (!raw)
    return json({ error: "Session not found" }, 404);
  const session = JSON.parse(raw);
  const exportHtml = buildBrandGuideHTML(session.blueprint, session);
  return new Response(exportHtml, {
    headers: {
      "Content-Type": "text/html;charset=UTF-8",
      ...CORS
    }
  });
}
