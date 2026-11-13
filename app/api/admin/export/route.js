import { requireAdmin } from "../../../../lib/auth";
import { listOrders } from "../../../../lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// protects against spreadsheet formula injection (=, +, -, @ at the start of a cell)
const cell = (v) => {
  let s = String(v ?? "");
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return `"${s.replace(/"/g, '""')}"`;
};

export async function GET(req) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  const orders = await listOrders();
  const head = ["Order ID", "Time (Pakistan)", "Status", "Name", "Phone", "Email", "Country", "City", "Address", "Qty", "Payment", "Products", "Delivery", "Total", "Device", "IP", "IP city", "Note"];
  const rows = orders.map((o) => [
    o.id,
    new Date(o.createdAt).toLocaleString("en-GB", { timeZone: "Asia/Karachi" }),
    o.status, o.name, o.phone, o.email, o.country, o.city, o.address, o.qty,
    o.payment === "advance" ? "Advance" : "Cash on Delivery",
    o.subtotal, o.delivery, o.total, o.meta?.device, o.meta?.ip, o.meta?.ipCity, o.note,
  ]);
  const csv = "﻿" + [head, ...rows].map((r) => r.map(cell).join(",")).join("\r\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="swan-orders-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
