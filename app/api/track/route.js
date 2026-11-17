// Public: customer checks an order with Order ID OR phone number (either one is enough).
import { getOrder, getOrdersByPhone } from "../../../lib/store";
import { normalizePhone } from "../../../lib/orders";
import { json, isJson, clientIp, allow } from "../../../lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// only what the customer needs: no IP, device, notes or admin data
function publicOrder(o) {
  return {
    id: o.id, createdAt: o.createdAt, status: o.status,
    history: (o.history && o.history.length ? o.history : [{ status: o.status, at: o.createdAt }]),
    product: o.product, qty: o.qty, total: o.total, payment: o.payment,
    province: o.province || "", city: o.city,
    courier: o.courier || "", trackingId: o.trackingId || "", trackingUrl: o.trackingUrl || "",
  };
}

export async function POST(req) {
  if (!isJson(req)) return json({ error: "Bad request." }, 400);
  if (!allow("track:" + clientIp(req), 20, 10 * 60 * 1000)) return json({ error: "Too many attempts. Please wait a few minutes and try again." }, 429);
  let b;
  try { b = await req.json(); } catch { return json({ error: "Bad request." }, 400); }

  const rawId = String(b.id || "").trim();
  const rawPhone = String(b.phone || "").trim();
  const id = rawId.toUpperCase().replace(/\s+/g, "").slice(0, 30);
  const phone = rawPhone ? normalizePhone(rawPhone) : "";

  const notFound = json({ error: "We couldn't find an order with those details. Please check and try again." }, 404);

  // at least one of the two is required
  if (!rawId && !rawPhone) return json({ error: "Please enter your Order ID or your phone number." }, 400);

  // user typed something but it was invalid
  if ((rawId && !id) || (rawPhone && !phone)) return notFound;

  let orders = [];

  if (id) {
    // Order ID given (phone optional). If phone is also given, it must match.
    const o = await getOrder(id);
    if (!o) return notFound;
    if (phone && o.phone !== phone) return notFound;
    orders = [o];
  } else {
    // Phone only: may return several orders, newest first
    const list = (await getOrdersByPhone(phone)) || [];
    orders = list
      .filter((o) => o && o.phone === phone)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);
    if (!orders.length) return notFound;
  }

  const out = orders.map(publicOrder);
  // `order` = latest/single (old format), `orders` = full list (for phone-only search)
  return json({ ok: true, order: out[0], orders: out });
}