import { createHash } from "node:crypto";

const fail = (error: string, status: number) => Response.json({ error }, { status });
export async function POST(request: Request) {
  const env = process.env;
  if (!env.RESEND_API_KEY || !env.CONTACT_FROM || !env.CONTACT_TO || !env.CONTACT_ORIGIN || !env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) return fail("Message delivery is not configured yet.", 503);
  if (request.headers.get("origin") !== env.CONTACT_ORIGIN) return fail("Request origin is not allowed.", 403);
  if (!request.headers.get("content-type")?.startsWith("application/json")) return fail("Expected JSON.", 415);
  // Bound bytes while reading; Content-Length alone is not trustworthy.
  const reader = request.body?.getReader();
  if (!reader) return fail("Missing message.", 400);
  let bytes = 0; const chunks: Uint8Array[] = [];
  try {
    while (true) { const { done, value } = await reader.read(); if (done) break; bytes += value.byteLength; if (bytes > 16000) { await reader.cancel(); return fail("Message is too large.", 413); } chunks.push(value); }
    const raw = Buffer.concat(chunks).toString("utf8");
    let body: Record<string, unknown>;
    try { body = JSON.parse(raw); } catch { return fail("Invalid message format.", 400); }
    if (!body || typeof body !== "object" || Array.isArray(body)) return fail("Invalid message.", 400);
    const field = (name: string) => typeof body[name] === "string" ? (body[name] as string).trim() : "";
    const name = field("name"), email = field("email"), subject = field("subject"), message = field("message");
    if (field("website")) return fail("Unable to accept this request.", 400);
    if (name.length < 2 || name.length > 100 || subject.length < 3 || subject.length > 150 || message.length < 20 || message.length > 5000 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /[\r\n]/.test(name + email + subject)) return fail("Check your name, email, subject, and message (20–5,000 characters).", 400);
    // Atomic shared limit: 3 per address / 10 min, and 30 total / hour.
    // Global cap remains effective even without a trusted client-IP header.
    const key = createHash("sha256").update(email.toLowerCase()).digest("hex");
    const script = "local a=redis.call('INCR',KEYS[1]); if a==1 then redis.call('EXPIRE',KEYS[1],600) end; local b=redis.call('INCR',KEYS[2]); if b==1 then redis.call('EXPIRE',KEYS[2],3600) end; if a>3 or b>30 then return 0 end; return 1";
    const limit = await fetch(env.UPSTASH_REDIS_REST_URL, { method: "POST", headers: { Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`, "Content-Type": "application/json" }, body: JSON.stringify(["EVAL", script, "2", `portfolio:contact:${key}`, "portfolio:contact:global"]), signal: AbortSignal.timeout(5000), cache: "no-store" });
    if (!limit.ok) return fail("Delivery is temporarily unavailable. Please try later.", 503);
    const quota = await limit.json();
    if (quota.error || typeof quota.result !== "number") return fail("Delivery is temporarily unavailable.", 503);
    if (quota.result !== 1) return fail("Too many requests. Please try again later.", 429);
    const delivery = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: env.CONTACT_FROM, to: [env.CONTACT_TO], reply_to: email, subject: `Portfolio: ${subject}`, text: `From: ${name} <${email}>\n\n${message}` }), signal: AbortSignal.timeout(10000) });
    const result = await delivery.json();
    if (!delivery.ok || !result.id) return fail("The message could not be sent. Please try again later.", 502);
    return Response.json({ accepted: true });
  } catch { return fail("Connection unavailable. Please try again later.", 503); }
}

