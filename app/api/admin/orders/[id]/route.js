import { requireAdmin, json, isJson } from "../../../../../lib/auth";
import { getOrder, saveOrder, deleteOrder } from "../../../../../lib/store";
import { STATUSES } from "../../../../../lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(req, ctx) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  if (!isJson(req)) return json({ error: "Bad request." }, 400);
  const { id } = await ctx.params;
  let b;
  try { b = await req.json(); } catch { return json({ error: "Bad request." }, 400); }

  const order = await getOrder(id);
  if (!order) return json({ error: "Order not found." }, 404);

  if (b.status !== undefined) {
    if (!STATUSES.some((s) => s.id === b.status)) return json({ error: "Invalid status." }, 400);
    order.status = b.status;
  }
  if (b.note !== undefined) order.note = String(b.note).replace(/[\u0000-\u001f\u007f]/g, " ").slice(0, 500);
  order.updatedAt = new Date().toISOString();
  await saveOrder(order);
  return json({ ok: true, order });
}

export async function DELETE(req, ctx) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  const { id } = await ctx.params;
  await deleteOrder(id);
  return json({ ok: true });
}
