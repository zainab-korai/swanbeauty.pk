"use client";
// Customer order tracking: Order ID + phone number -> status, timeline, courier and tracking ID.
import { useCallback, useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import { SITE, CUSTOMER_STATUS } from "../lib/config";

const money = (n) => "Rs. " + String(n ?? 0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const fmt = (iso) => new Date(iso).toLocaleString("en-GB", { timeZone: "Asia/Karachi", day: "numeric", month: "short", hour: "numeric", minute: "2-digit", hour12: true });
const STEPS = [
  { key: "received", label: "Order received", has: ["new", "awaiting_payment"] },
  { key: "confirmed", label: "Confirmed", has: ["confirmed"] },
  { key: "shipped", label: "On its way", has: ["dispatched"] },
  { key: "delivered", label: "Delivered", has: ["delivered"] },
];
const stepIndex = (status) => (status === "delivered" ? 3 : status === "dispatched" ? 2 : status === "confirmed" ? 1 : 0);

export default function Track() {
  const [id, setId] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [o, setO] = useState(null);
  const [copied, setCopied] = useState(false);
  const last = useRef(null);

  const look = useCallback(async (i, p, quiet = false) => {
    if (!quiet) { setBusy(true); setErr(""); }
    try {
      const r = await fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: i, phone: p }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) { if (!quiet) { setO(null); setErr(d.error || "Something went wrong. Please try again."); } }
      else { setO(d.order); last.current = [i, p]; }
    } catch {
      if (!quiet) setErr("Network problem. Please check your connection and try again.");
    }
    if (!quiet) setBusy(false);
  }, []);

  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search).get("id");
      if (q) setId(q.toUpperCase());
    } catch {}
  }, []);

  // refresh quietly every minute while the page is open
  useEffect(() => {
    const t = setInterval(() => last.current && !document.hidden && look(last.current[0], last.current[1], true), 60000);
    return () => clearInterval(t);
  }, [look]);

  const submit = (e) => { e.preventDefault(); look(id, phone); };
  const copy = async () => {
    try { await navigator.clipboard.writeText(o.trackingId); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
  };

  const cs = o ? CUSTOMER_STATUS[o.status] || { label: o.status, text: "" } : null;
  const cancelled = o && o.status === "cancelled";
  const idx = o ? stepIndex(o.status) : 0;
  const when = (step) => {
    if (!o) return "";
    const h = (o.history || []).find((x) => step.has.includes(x.status));
    return h ? fmt(h.at) : "";
  };
  const wa = `https://wa.me/${SITE.phoneIntl}?text=${encodeURIComponent(o ? `Hi SWAN! I have a question about my order ${o.id}.` : "Hi SWAN!")}`;

  return (
    <main className="trk">
      <header className="trk-top">
        <a href="/" aria-label="SWAN home"><Logo height={64} /></a>
        <a className="btn btn-sm btn-ghost" href="/">Back to website</a>
      </header>

      <section className="trk-card">
        <p className="eyebrow">ORDER TRACKING</p>
        <h1>Where is my order?</h1>
        <p className="trk-lead">Enter the Order ID you received and the phone number you ordered with.</p>
        <form onSubmit={submit} className="trk-form">
          <label>Order ID<input required value={id} onChange={(e) => setId(e.target.value.toUpperCase())} placeholder="SW-261113-ABCD" autoComplete="off" /></label>
          <label>Phone number<input required inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="03XX XXXXXXX" autoComplete="tel" /></label>
          <button className="btn" disabled={busy}>{busy ? "Checking…" : "Track order"}</button>
        </form>
        {err && <div className="notice" role="alert">{err}</div>}
      </section>

      {o && (
        <section className="trk-card trk-result" aria-live="polite">
          <div className="trk-head">
            <div>
              <span className="trk-id">{o.id}</span>
              <h2>{cs.label}</h2>
              <p>{cs.text}</p>
            </div>
            <span className={`trk-pill st-${o.status}`}>{cs.label}</span>
          </div>

          {!cancelled && (
            <ol className="trk-steps">
              {STEPS.map((s, i) => (
                <li key={s.key} className={i < idx ? "done" : i === idx ? "now" : ""}>
                  <i>{i < idx || (i === idx && o.status === "delivered") ? "✓" : i + 1}</i>
                  <b>{s.label}</b>
                  <small>{when(s)}</small>
                </li>
              ))}
            </ol>
          )}

          {(o.courier || o.trackingId) && !cancelled && (
            <div className="trk-courier">
              <h3>Courier details</h3>
              {o.courier && <p><span>Courier</span><b>{o.courier}</b></p>}
              {o.trackingId && (
                <p>
                  <span>Tracking ID</span>
                  <b className="mono">{o.trackingId}</b>
                  <button type="button" className="trk-copy" onClick={copy}>{copied ? "Copied" : "Copy"}</button>
                </p>
              )}
              {o.trackingUrl && <a className="btn btn-sm" href={o.trackingUrl} target="_blank" rel="noopener noreferrer">Track on {o.courier || "courier"} website</a>}
              {!o.trackingUrl && o.trackingId && <small className="trk-hint">Open your courier's website or app and enter this tracking ID.</small>}
            </div>
          )}
          {o.status === "dispatched" && !o.trackingId && <div className="trk-courier"><small className="trk-hint">Your parcel is with the courier. We will add the tracking ID here shortly.</small></div>}

          <dl className="trk-sum">
            <div><dt>Product</dt><dd>{o.product} × {o.qty}</dd></div>
            <div><dt>Deliver to</dt><dd>{[o.city, o.province].filter(Boolean).join(", ")}</dd></div>
            <div><dt>Payment</dt><dd>{o.payment === "advance" ? "Advance payment" : "Cash on delivery"}</dd></div>
            <div><dt>Total</dt><dd>{money(o.total)}</dd></div>
          </dl>
          <a className="btn btn-sm btn-ghost" href={wa} target="_blank" rel="noopener noreferrer">Questions? WhatsApp us</a>
        </section>
      )}
    </main>
  );
}
