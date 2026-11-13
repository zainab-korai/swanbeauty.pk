"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Logo from "../../components/Logo";
import { STATUSES } from "../../lib/config";

const money = (n) => "Rs. " + String(n ?? 0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const statusLabel = (id) => (STATUSES.find((s) => s.id === id) || { label: id }).label;
const fmtTime = (iso) => new Date(iso).toLocaleString("en-GB", { timeZone: "Asia/Karachi", day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true });
const pkDay = (d) => new Date(d).toLocaleDateString("en-CA", { timeZone: "Asia/Karachi" });
const ago = (iso) => {
  const m = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hr ago`;
  return `${Math.round(h / 24)} day${Math.round(h / 24) > 1 ? "s" : ""} ago`;
};
const waLink = (phone, text = "") => `https://wa.me/92${String(phone).replace(/^0/, "")}${text ? "?text=" + encodeURIComponent(text) : ""}`;

function beep() {
  try {
    const C = window.AudioContext || window.webkitAudioContext;
    const c = new C();
    const o = c.createOscillator();
    const g = c.createGain();
    o.connect(g); g.connect(c.destination);
    o.frequency.value = 880;
    g.gain.setValueAtTime(0.0001, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.25, c.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.6);
    o.start(); o.stop(c.currentTime + 0.6);
  } catch {}
}

/* ---------------- login ---------------- */
function Login({ onDone }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setErr("");
    try {
      const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) setErr(d.error || "Could not sign in.");
      else onDone();
    } catch {
      setErr("Network error. Please try again.");
    }
    setBusy(false);
  };

  return (
    <div className="ad-login">
      <form onSubmit={submit} className="ad-login-card">
        <Logo height={84} />
        <h1>Admin</h1>
        <p>Sign in to view your orders.</p>
        <label>Email<input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label>Password<input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        {err && <div className="ad-err" role="alert">{err}</div>}
        <button className="ad-btn" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </div>
  );
}

/* ---------------- one order ---------------- */
function OrderCard({ o, onStatus, onDelete, onNote }) {
  const [note, setNote] = useState(o.note || "");
  const isNew = o.status === "new" || o.status === "awaiting_payment";
  const adv = o.payment === "advance";
  return (
    <article className={`ad-order ${isNew ? "is-new" : ""} st-${o.status}`}>
      <header>
        <div>
          <b className="ad-id">{o.id}</b>
          <span className="ad-time">{fmtTime(o.createdAt)} · {ago(o.createdAt)}</span>
        </div>
        <select value={o.status} onChange={(e) => onStatus(o.id, e.target.value)} aria-label="Order status" className={`ad-status st-${o.status}`}>
          {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </header>

      <div className="ad-cols">
        <section>
          <h4>Customer</h4>
          <p className="ad-name">{o.name}</p>
          <p><a href={`tel:+92${o.phone.replace(/^0/, "")}`}>{o.phone}</a></p>
          {o.email && <p><a href={`mailto:${o.email}`}>{o.email}</a></p>}
          <div className="ad-actions">
            <a className="ad-chip" href={`tel:+92${o.phone.replace(/^0/, "")}`}>Call</a>
            <a className="ad-chip wapp" target="_blank" rel="noopener noreferrer" href={waLink(o.phone, `Hi ${o.name}, this is SWAN Beauty Essence about your order ${o.id}.`)}>WhatsApp</a>
          </div>
        </section>
        <section>
          <h4>Deliver to</h4>
          <p>{o.address}</p>
          <p>{o.city}, {o.country}</p>
          {(o.meta?.ipCity || o.meta?.device) && (
            <p className="ad-dim">Ordered from {[o.meta?.device, o.meta?.ipCity && `near ${o.meta.ipCity}`].filter(Boolean).join(" · ")}{o.meta?.ip ? ` · IP ${o.meta.ip}` : ""}</p>
          )}
        </section>
        <section>
          <h4>Order</h4>
          <p>{o.product} × <b>{o.qty}</b></p>
          <p><span className={`ad-pay ${adv ? "adv" : "cod"}`}>{adv ? "Advance payment" : "Cash on delivery"}</span></p>
          <p className="ad-dim">Products {money(o.subtotal)} + delivery {money(o.delivery)}</p>
          <p className="ad-total">{money(o.total)}</p>
        </section>
      </div>

      <footer>
        <input value={note} onChange={(e) => setNote(e.target.value)} onBlur={() => note !== (o.note || "") && onNote(o.id, note)} placeholder="Add a note (e.g. called, payment received, tracking no.)" maxLength={500} aria-label="Note" />
        <button className="ad-link danger" onClick={() => confirm(`Delete order ${o.id}? This cannot be undone.`) && onDelete(o.id)}>Delete</button>
      </footer>
    </article>
  );
}

/* ---------------- dashboard ---------------- */
function Dashboard({ onLoggedOut }) {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");
  const [storage, setStorage] = useState("");
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [updated, setUpdated] = useState(null);
  const known = useRef(null);

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/orders", { cache: "no-store" });
      if (r.status === 401) return onLoggedOut();
      const d = await r.json();
      if (!r.ok) { setError(d.error || "Could not load orders."); return; }
      setError(""); setStorage(d.storage);
      const ids = new Set(d.orders.map((o) => o.id));
      if (known.current) {
        const fresh = d.orders.filter((o) => !known.current.has(o.id)).length;
        if (fresh > 0) { beep(); document.title = `(${fresh}) New order · SWAN Admin`; setTimeout(() => (document.title = "SWAN Admin"), 8000); }
      }
      known.current = ids;
      setOrders(d.orders); setUpdated(new Date());
    } catch {
      setError("Network error. Retrying…");
    }
  }, [onLoggedOut]);

  useEffect(() => {
    load();
    const t = setInterval(load, 20000);
    return () => clearInterval(t);
  }, [load]);

  const patch = async (id, body) => {
    const r = await fetch(`/api/admin/orders/${encodeURIComponent(id)}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (r.status === 401) return onLoggedOut();
    if (r.ok) { const d = await r.json(); setOrders((list) => list.map((o) => (o.id === id ? d.order : o))); }
  };
  const remove = async (id) => {
    const r = await fetch(`/api/admin/orders/${encodeURIComponent(id)}`, { method: "DELETE" });
    if (r.ok) setOrders((list) => list.filter((o) => o.id !== id));
  };
  const logout = async () => { await fetch("/api/admin/logout", { method: "POST" }); onLoggedOut(); };

  const stats = useMemo(() => {
    const list = orders || [];
    const today = pkDay(new Date());
    const active = list.filter((o) => o.status !== "cancelled");
    return {
      total: list.length,
      today: list.filter((o) => pkDay(o.createdAt) === today).length,
      fresh: list.filter((o) => o.status === "new").length,
      awaiting: list.filter((o) => o.status === "awaiting_payment").length,
      value: active.reduce((s, o) => s + o.total, 0),
    };
  }, [orders]);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (orders || []).filter((o) => (filter === "all" || o.status === filter) && (!s || [o.id, o.name, o.phone, o.city, o.address, o.email].join(" ").toLowerCase().includes(s)));
  }, [orders, filter, q]);

  const count = (id) => (orders || []).filter((o) => o.status === id).length;

  return (
    <div className="ad-wrap">
      <header className="ad-top">
        <Logo height={58} />
        <div className="ad-top-r">
          <span className="ad-dim">{updated ? `Updated ${updated.toLocaleTimeString("en-GB", { timeZone: "Asia/Karachi", hour: "numeric", minute: "2-digit", hour12: true })}` : ""}</span>
          <button className="ad-link" onClick={load}>Refresh</button>
          <a className="ad-link" href="/api/admin/export">Export CSV</a>
          <button className="ad-link" onClick={logout}>Log out</button>
        </div>
      </header>

      {storage === "file" && typeof window !== "undefined" && !/localhost|127\.0\.0\.1/.test(window.location.hostname) && (
        <div className="ad-warn">Orders are saved in a local file. On Vercel or similar hosting this is temporary. Connect Upstash Redis (see README) so orders are never lost.</div>
      )}
      {error && <div className="ad-err" role="alert">{error}</div>}

      <section className="ad-stats">
        <div><b>{stats.fresh + stats.awaiting}</b><span>Need action</span></div>
        <div><b>{stats.today}</b><span>Today</span></div>
        <div><b>{stats.total}</b><span>All orders</span></div>
        <div><b>{money(stats.value)}</b><span>Order value (excl. cancelled)</span></div>
      </section>

      <section className="ad-tools">
        <div className="ad-chips">
          <button className={filter === "all" ? "on" : ""} onClick={() => setFilter("all")}>All <i>{orders ? orders.length : 0}</i></button>
          {STATUSES.map((s) => (
            <button key={s.id} className={filter === s.id ? "on" : ""} onClick={() => setFilter(s.id)}>{s.label} <i>{count(s.id)}</i></button>
          ))}
        </div>
        <input className="ad-search" placeholder="Search name, phone, city, order ID…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search orders" />
      </section>

      {orders === null ? (
        <p className="ad-empty">Loading orders…</p>
      ) : shown.length === 0 ? (
        <p className="ad-empty">{orders.length === 0 ? "No orders yet. New orders will appear here automatically." : "No orders match this filter."}</p>
      ) : (
        <div className="ad-list">
          {shown.map((o) => (
            <OrderCard key={o.id} o={o} onStatus={(id, status) => patch(id, { status })} onNote={(id, note) => patch(id, { note })} onDelete={remove} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- page ---------------- */
export default function AdminPage() {
  const [view, setView] = useState("loading"); // loading | login | ready

  useEffect(() => {
    fetch("/api/admin/orders", { cache: "no-store" })
      .then((r) => setView(r.status === 401 ? "login" : "ready"))
      .catch(() => setView("login"));
  }, []);

  if (view === "loading") return <div className="ad-login"><p className="ad-dim">Loading…</p></div>;
  if (view === "login") return <Login onDone={() => setView("ready")} />;
  return <Dashboard onLoggedOut={() => setView("login")} />;
}
