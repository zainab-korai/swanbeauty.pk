import { requireAdmin, json, isJson } from "../../../../../lib/auth";
import { getOrder, saveOrder, deleteOrder } from "../../../../../lib/store";
import { STATUSES } from "../../../../../lib/config";
import { cleanText } from "../../../../../lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(req, ctx) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  if (!isJson(req)) return json({ error: "Bad request." }, 400);
  const { id } = await ctx.params;
  let b;
  try { b = await req.json(); } catch { return json({ error: "Bad request." }, 400); }

  try {
    const order = await getOrder(id);
    if (!order) return json({ error: "Order not found. Please refresh the page." }, 404);

    let status = b.status;
    if (status !== undefined && !STATUSES.some((s) => s.id === status)) return json({ error: "Invalid status." }, 400);

    // courier + tracking (shown to the customer on /track)
    if (b.courier !== undefined) order.courier = cleanText(b.courier, 40);
    if (b.trackingId !== undefined) order.trackingId = cleanText(b.trackingId, 60);
    if (b.trackingUrl !== undefined) {
      const u = cleanText(b.trackingUrl, 300);
      order.trackingUrl = /^https?:\/\//i.test(u) ? u : "";
    }
    // a tracking ID means the parcel has gone: move a new/confirmed order to "Dispatched" automatically
    if (status === undefined && b.trackingId !== undefined && order.trackingId && (order.status === "new" || order.status === "confirmed")) status = "dispatched";

    if (status !== undefined) {
      if (order.status !== status) {
        order.history = [...(order.history || [{ status: order.status, at: order.createdAt }]), { status, at: new Date().toISOString() }];
      }
      order.status = status;
    }
    if (b.note !== undefined) order.note = String(b.note).replace(/[\u0000-\u001f\u007f]/g, " ").slice(0, 500);
    order.updatedAt = new Date().toISOString();
    await saveOrder(order);
    return json({ ok: true, order });
  } catch (e) {
    console.error("order update failed", e);
    return json({ error: "Could not save to the database: " + String(e && e.message ? e.message : e).slice(0, 120) }, 500);
  }
}

export async function DELETE(req, ctx) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  const { id } = await ctx.params;
  await deleteOrder(id);
  return json({ ok: true });
}
