import { adminConfigured, checkLogin, makeSession, sessionCookie, json, isJson, clientIp, allow } from "../../../../lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  if (!adminConfigured()) return json({ error: "Admin is not configured yet. Check .env.local (see README)." }, 500);
  if (!isJson(req)) return json({ error: "Bad request." }, 400);
  if (!allow("login:" + clientIp(req), 8, 15 * 60 * 1000)) return json({ error: "Too many attempts. Try again in 15 minutes." }, 429);

  let b;
  try { b = await req.json(); } catch { return json({ error: "Bad request." }, 400); }

  if (!checkLogin(b.email, b.password)) {
    await new Promise((r) => setTimeout(r, 700)); // slow down guessing
    return json({ error: "Incorrect email or password." }, 401);
  }
  return json({ ok: true }, 200, { "Set-Cookie": sessionCookie(makeSession()) });
}
