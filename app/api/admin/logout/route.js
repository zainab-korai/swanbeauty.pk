import { sessionCookie, json } from "../../../../lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  return json({ ok: true }, 200, { "Set-Cookie": sessionCookie("", 0) });
}
