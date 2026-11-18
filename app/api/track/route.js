// Public: customer checks an order with the Order ID only (long random ID + rate limit stop guessing).
import { getOrder } from "../../../lib/store";
import { normalizeOrderId } from "../../../lib/orders";
import { json, isJson, clientIp, allow } from "../../../lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  if (!isJson(req)) return json({ error: "Bad request." }, 400);
  if (!allow("track:" + clientIp(req), 15, 10 * 60 * 1000)) return json({ error: "Too many attempts. Please wait a few minutes and try again." }, 429);
  let b;
  try { b = await req.json(); } catch { return json({ error: "Bad request." }, 400); }

  const id = normalizeOrderId(b.id);
  const notFound = json({ error: "We couldn't find an order with that Order ID. Please check it and try again." }, 404);
  if (!id) return notFound;

  const o = await getOrder(id);
  if (!o) return notFound;

  // only what the customer needs: no IP, device, notes or admin data
  return json({
    ok: true,
    order: {
      id: o.id, createdAt: o.createdAt, status: o.status,
      history: (o.history && o.history.length ? o.history : [{ status: o.status, at: o.createdAt }]),
      product: o.product, qty: o.qty, total: o.total, payment: o.payment,
      province: o.province || "", city: o.city,
      courier: o.courier || "", trackingId: o.trackingId || "", trackingUrl: o.trackingUrl || "",
    },
  });
}
