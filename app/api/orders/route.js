// Public: customer places an order (Cash on Delivery or Advance Payment).
import { validateOrder, buildOrder, newOrderId } from "../../../lib/orders";
import { saveOrder, getOrder } from "../../../lib/store";
import { json, isJson, clientIp, allow } from "../../../lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const dec = (v) => { try { return decodeURIComponent(v || ""); } catch { return v || ""; } };

export async function POST(req) {
  if (!isJson(req)) return json({ error: "Bad request." }, 400);
  const ip = clientIp(req);
  if (!allow("order:" + ip, 6, 10 * 60 * 1000)) return json({ error: "Too many attempts. Please wait a few minutes and try again." }, 429);

  let body;
  try { body = await req.json(); } catch { return json({ error: "Bad request." }, 400); }

  if (body && body.website) return json({ ok: true, id: "SW-OK" }); // honeypot: bots fill hidden field

  const v = validateOrder(body);
  if (v.error) return json({ error: v.error, field: v.field }, 400);

  const ua = (req.headers.get("user-agent") || "").slice(0, 220);
  const meta = {
    ip,
    device: /Mobi|Android|iPhone|iPad/i.test(ua) ? "Mobile" : "Desktop",
    userAgent: ua,
    ipCity: dec(req.headers.get("x-vercel-ip-city") || req.headers.get("cf-ipcity")),
    ipCountry: req.headers.get("x-vercel-ip-country") || req.headers.get("cf-ipcountry") || "",
    referrer: (req.headers.get("referer") || "").slice(0, 200),
  };

  try {
    let id = newOrderId();
    for (let i = 0; i < 3 && (await getOrder(id)); i++) id = newOrderId();
    const order = buildOrder(v.data, meta, id);
    await saveOrder(order);
    return json({ ok: true, id: order.id, total: order.total, delivery: order.delivery, subtotal: order.subtotal });
  } catch (e) {
    console.error("order save failed:", e);
    return json({ error: "We couldn't save your order right now. Please order on WhatsApp instead." }, 500);
  }
}
