// src/services/resend.js
// Resend email API wrapper
// Extracted from src/index.js — all email sends go through this module

export async function sendEmail(env, { to, from, subject, html, replyTo, cc, bcc }) {
  const payload = { to, from, subject, html };
  if (replyTo) payload.reply_to = replyTo;
  if (cc) payload.cc = cc;
  if (bcc) payload.bcc = bcc;

  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + env.RESEND_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
}

export async function verifyDomain(env) {
  return fetch("https://api.resend.com/domains", {
    headers: { "Authorization": "Bearer " + env.RESEND_API_KEY }
  });
}
