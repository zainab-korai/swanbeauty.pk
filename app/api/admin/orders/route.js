import { requireAdmin, json } from "../../../../lib/auth";
import { listOrders, storageInfo } from "../../../../lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    return json({ orders: await listOrders(), storage: storageInfo() });
  } catch (e) {
    console.error(e);
    return json({ error: "Could not read orders. If this is Vercel, connect Upstash Redis (see README)." }, 500);
  }
}
