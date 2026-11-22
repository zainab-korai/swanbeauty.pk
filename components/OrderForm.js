"use client";

import { useState } from "react";
import Select from "./Select";
import { SITE, PROVINCES } from "../lib/config";

const money = (n) => "Rs. " + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const waUrl = (text) => `https://wa.me/${SITE.phoneIntl}?text=${encodeURIComponent(text)}`;

export default function OrderForm() {
  const empty = { name: "", phone: "", email: "", country: "Pakistan", province: "", city: "", address: "", website: "" };
  const [qty, setQty] = useState(1);
  const [pay, setPay] = useState("cod");
  const [f, setF] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(null);

  const abroad = f.country !== "Pakistan";
  const adv = pay === "advance";
  const delivery = adv ? SITE.deliveryAdvance : SITE.deliveryCOD;
  const sub = SITE.price * qty;
  const total = sub + delivery;
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (abroad || busy) return;
    if (!f.province) { setErr("Please select your province."); return; }
    setErr("");
    setBusy(true);

    // open the tab now (inside the click) so the browser doesn't block WhatsApp later
    let win = null;
    if (adv) { try { win = window.open("about:blank", "_blank"); } catch {} }
    const goWA = (text) => {
      const url = waUrl(text);
      if (win && !win.closed) win.location.href = url;
      else window.location.href = url;
    };
    const message = (id) =>
      [
        "Hi SWAN! I would like to place an order with advance payment.",
        "",
        id ? `Order ID: ${id}` : null,
        `Product: ${SITE.product} x ${qty}`,
        `Name: ${f.name}`,
        `Phone: ${f.phone}`,
        `Province: ${f.province}`,
        `City: ${f.city}`,
        `Address: ${f.address}`,
        `Total: ${money(total)} (products ${money(sub)} + delivery ${money(delivery)})`,
        "",
        "Please share the payment details.",
      ].filter((x) => x !== null).join("\n");

    try {
      const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, qty, payment: pay }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status >= 500 && adv) { goWA(message(null)); setDone({ id: null, adv: true, total, name: f.name }); }
        else { if (win) win.close(); setErr(data.error || "Something went wrong. Please try again."); }
      } else {
        try { window.fbq && window.fbq("track", "Purchase", { value: data.total, currency: "PKR" }); } catch {}
        if (adv) goWA(message(data.id));
        setDone({ id: data.id, adv, total: data.total, name: f.name });
      }
    } catch {
      if (adv) { goWA(message(null)); setDone({ id: null, adv: true, total, name: f.name }); }
      else setErr("Network problem. Please check your connection and try again.");
    }
    setBusy(false);
  };

  if (done) {
    return (
      <div className="order-form done">
        <div className="tick">✓</div>
        <h3>{done.adv ? "Almost there!" : "Order placed!"}</h3>
        <p>
          {done.adv
            ? "Your order is ready on WhatsApp. Just press send, and we will share the payment details. We dispatch as soon as the payment is received."
            : `Thank you, ${done.name}. We will contact you shortly to confirm your order. You pay ${money(done.total)} in cash when it arrives.`}
        </p>
        {done.id && <p className="oid">Order ID <b>{done.id}</b></p>}
        {done.id && <p className="oid-hint">Save this ID. You can follow your order any time with just this Order ID.</p>}
        {done.id && <a className="btn btn-sm" href={`/track?id=${encodeURIComponent(done.id)}`}>Track my order</a>}
        <button type="button" className="btn btn-ghost" onClick={() => { setDone(null); setF(empty); setQty(1); setPay("cod"); }}>Place another order</button>
      </div>
    );
  }

  return (
    <form className="order-form" onSubmit={submit} noValidate={false}>
      <h3>Place your order</h3>
      <div className="fields">
        <label>Full name<input required value={f.name} onChange={set("name")} autoComplete="name" placeholder="Your name" /></label>
        <label>Phone / WhatsApp<input required inputMode="tel" value={f.phone} onChange={set("phone")} autoComplete="tel" placeholder="03XX XXXXXXX" /></label>
        <label><span>Email <small>(optional)</small></span><input type="email" value={f.email} onChange={set("email")} autoComplete="email" placeholder="you@example.com" /></label>
        <div className="fld">Country
          <Select label="Country" value={f.country} onChange={(v) => setF({ ...f, country: v })} options={[{ value: "Pakistan", label: "Pakistan" }, { value: "Other", label: "Outside Pakistan" }]} />
        </div>
        <div className="fld">Province
          <Select label="Province" value={f.province} onChange={(v) => setF({ ...f, province: v })} options={PROVINCES} placeholder="Select your province" invalid={!f.province && !!err} />
        </div>
        {abroad && <div className="notice wide" role="alert">We're not delivering to other countries just yet. For now, SWAN is available only within Pakistan. Choose Pakistan to continue.</div>}
        <label>City<input required value={f.city} onChange={set("city")} autoComplete="address-level2" placeholder="Karachi, Lahore, Islamabad..." /></label>
        <label className="qty">Quantity
          <span className="stepper">
            <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease">−</button>
            <b>{qty}</b>
            <button type="button" onClick={() => setQty(Math.min(10, qty + 1))} aria-label="Increase">+</button>
          </span>
        </label>
        <label className="wide">Delivery address<textarea required rows={2} value={f.address} onChange={set("address")} autoComplete="street-address" placeholder="House no., street, area" /></label>
        {/* hidden honeypot: real people never see it */}
        <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={f.website} onChange={set("website")} name="website" />
      </div>

      <div className="pay">
        <label className={pay === "cod" ? "on" : ""}>
          <input type="radio" name="pay" checked={pay === "cod"} onChange={() => setPay("cod")} />
          <span><b>Cash on Delivery</b><em>Delivery {money(SITE.deliveryCOD)}</em></span>
        </label>
        <label className={pay === "advance" ? "on" : ""}>
          <input type="radio" name="pay" checked={pay === "advance"} onChange={() => setPay("advance")} />
          <span><b>Advance Payment</b><em>Delivery only {money(SITE.deliveryAdvance)}</em></span>
          <i className="save">Save {money(SITE.deliveryCOD - SITE.deliveryAdvance)}</i>
        </label>
      </div>

      <dl className="sum">
        <div><dt>Cleanser + Facewash × {qty}</dt><dd>{money(sub)}</dd></div>
        <div><dt>Delivery</dt><dd>{money(delivery)}</dd></div>
        <div className="total"><dt>Total</dt><dd>{money(total)}</dd></div>
      </dl>

      {err && <div className="notice" role="alert">{err}</div>}
      <button className="btn btn-block" disabled={abroad || busy}>{busy ? "Please wait…" : adv ? "Order on WhatsApp" : "Place Order"}</button>
      <p className="fine">
        {adv
          ? "WhatsApp will open with your order filled in. Press send, and we will share the payment details."
          : "Pay in cash when your order arrives. No advance needed."}
      </p>
    </form>
  );
}

