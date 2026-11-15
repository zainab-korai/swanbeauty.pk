"use client";

import { useEffect, useRef, useState } from "react";
import { SwanMark } from "../components/Bottle";
import Bottle3D from "../components/Bottle3D";
import Logo from "../components/Logo";
import Select from "../components/Select";
import { startFlight } from "../lib/flyingBottle";
import { SITE, PROVINCES } from "../lib/config";

const money = (n) => "Rs. " + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const clamp = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n));

/* Image slot: public/images/<name>.jpg -> png -> webp -> svg (jo pehle mile) */
const EXTS = ["jpg", "png", "webp", "svg"];
function Picture({ name, alt, className = "" }) {
  const [i, setI] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const im = ref.current;
    if (im && im.complete && im.naturalWidth === 0) setI((x) => x + 1);
  }, [i]);
  return (
    <div className={`media ${className}`}>
      {i < EXTS.length ? (
        <img key={i} ref={ref} src={`/images/${name}.${EXTS[i]}`} alt={alt} onError={() => setI((x) => x + 1)} loading="lazy" />
      ) : (
        <div className="media-ph"><SwanMark size={54} color="#b08a5a" /></div>
      )}
    </div>
  );
}

/* video that only loads and plays while it is on screen (saves CPU, battery and data) */
function LazyVideo({ src, poster }) {
  const ref = useRef(null);
  useEffect(() => {
    const v = ref.current;
    if (!v || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { if (!v.src) v.src = src; v.play().catch(() => {}); } else v.pause();
    }, { threshold: 0.15 });
    io.observe(v);
    return () => io.disconnect();
  }, [src]);
  return <video ref={ref} muted loop playsInline preload="none" poster={poster} />;
}

/* public/videos/ritual.mp4 ho to video chalegi, warna image */
function RitualMedia() {
  const [hasVideo, setHasVideo] = useState(false);
  useEffect(() => {
    fetch("/videos/ritual.mp4", { method: "HEAD" })
      .then((r) => setHasVideo(r.ok && (r.headers.get("content-type") || "").includes("video")))
      .catch(() => setHasVideo(false));
  }, []);
  if (hasVideo) {
    return (
      <div className="media wide">
        <LazyVideo src="/videos/ritual.mp4" />
      </div>
    );
  }
  return <Picture name="ritual" alt="Woman applying SWAN Cleanser + Facewash" className="wide" />;
}

/* ---------- content ---------- */
const ingredients = [
  { n: "Vitamin D", t: "Nourish", d: "Skin-loving vitamin goodness, released by every bead to leave skin feeling nourished and refreshed." },
  { n: "Salicylic Acid", t: "Unclog", d: "Works to deep cleanse and unclog pores while clearing away excess oil." },
  { n: "Glycolic Acid", t: "Renew", d: "Helps remove dead skin cells, revealing a brighter, smoother-looking complexion." },
];

const benefits = [
  ["Deep Cleanses & Unclogs Pores", "Clears dirt and oil from deep within the pores."],
  ["Removes Excess Oil", "Keeps shine in check for a fresher, cleaner feel."],
  ["Helps Prevent Acne", "Formulated with Salicylic Acid to help prevent acne."],
  ["Anti-Acne Beads", "Gentle exfoliating beads that burst with skin-loving vitamins."],
  ["Brighter, Smoother Look", "Glycolic Acid helps remove dead skin cells for a smoother complexion."],
  ["Made for Every Skin Type", "Dermatologically tested. pH-balanced. Paraben-free."],
];

const steps = [
  ["01", "Start with damp skin", "Wet your face with lukewarm water."],
  ["02", "Massage gently", "Gently massage a small amount onto damp skin. Avoid the eye area."],
  ["03", "Rinse thoroughly", "Rinse well with lukewarm water."],
  ["04", "Make it a habit", "For best results, use 4–5 times a week."],
];

const trust = ["Dermatologically Tested", "pH-Balanced", "Paraben-Free", "For All Skin Types", "Anti-Acne Beads"];

/* ---------- the bottle that flies between sections ---------- */
function Flyer() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const stop = startFlight(el, { baseW: 280, baseH: 1000 });
    const onMove = (e) => {
      el.style.setProperty("--ry", ((e.clientX / window.innerWidth - 0.5) * 2 * 10).toFixed(1) + "deg");
      el.style.setProperty("--rx", ((e.clientY / window.innerHeight - 0.5) * -2 * 7).toFixed(1) + "deg");
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      stop();
      window.removeEventListener("mousemove", onMove);
    };
  }, []);
  return (
    <div ref={ref} className="flyer" aria-hidden="true">
      <div className="flyer-tilt">
        <div className="flyer-float">
          <Bottle3D />
        </div>
      </div>
    </div>
  );
}

/* shared hook: progress (0..1) through a tall sticky section */
function useSectionProgress() {
  const ref = useRef(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const run = () => {
      raf = 0;
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < -vh * 0.5 || r.top > vh * 1.5) return; // far away: nothing to animate
      const span = r.height - vh;
      const v = span > 0 ? clamp(-r.top / span) : 0;
      setP((old) => (Math.abs(old - v) < 0.004 && v !== 0 && v !== 1 ? old : Math.round(v * 1000) / 1000));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(run); };
    run();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);
  return [ref, p];
}

/* ---------- WORDS MATTER: board that rewrites itself while you scroll ---------- */
const BEFORE = "Oily skin. Clogged pores. Breakouts.";
const AFTER = "Clear skin. Confident you.";
function Board() {
  const [ref, p] = useSectionProgress();
  const strike = clamp((p - 0.16) / 0.22);
  const typed = clamp((p - 0.42) / 0.38);
  const n = Math.round(typed * AFTER.length);
  const done = p > 0.88;
  return (
    <section ref={ref} className="boardsec" data-flyer-section>
      <div className="stick">
        <div className="board-grid">
          <div className="board-col">
            <p className="eyebrow">THE SWAN WAY</p>
            <div className={`board ${n > 0 ? "rewritten" : ""}`}>
              <div className="board-line before" style={{ opacity: 1 - strike * 0.65 }}>
                <span className="struck" style={{ "--s": strike }}>{BEFORE}</span>
              </div>
              <div className="board-line after">
                <span>{AFTER.slice(0, n)}</span>
                <b className="caret" style={{ opacity: n > 0 && !done ? 1 : 0 }} />
                <span className="ghost">{AFTER.slice(n)}</span>
              </div>
            </div>
          </div>
          <div className="board-slot">
            <div className="slot slot-board" data-flyer-slot data-rot="4" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- product story: ingredients while the bottle rotates ---------- */
function Story() {
  const [ref, p] = useSectionProgress();
  const active = Math.min(2, Math.floor(p * 3));
  return (
    <section id="product" ref={ref} className="story" data-flyer-section>
      <div className="stick">
        <div className="story-bg" style={{ "--p": p }} />
        <p className="eyebrow story-eyebrow">THE 2-IN-1 FORMULA</p>
        <div className="slot slot-story" data-flyer-slot data-rot="0" data-sweep="-9,9">
          <div className="ring" style={{ transform: `rotate(${p * 360}deg)` }} />
        </div>
        <div className="story-panels">
          {ingredients.map((g, i) => (
            <div key={g.n} className={`panel ${active === i ? "on" : ""} ${i % 2 ? "right" : "left"}`}>
              <span className="num">0{i + 1}</span>
              <h3>{g.n}</h3>
              <h5>{g.t}</h5>
              <p>{g.d}</p>
            </div>
          ))}
        </div>
        <div className="dots">
          {ingredients.map((_, i) => <b key={i} className={active === i ? "on" : ""} />)}
        </div>
      </div>
    </section>
  );
}

/* ---------- order form ----------
   Cash on Delivery  -> order is placed right here and lands in the admin dashboard.
   Advance payment   -> order is saved, then WhatsApp opens with the order message ready to send. */
const waUrl = (text) => `https://wa.me/${SITE.phoneIntl}?text=${encodeURIComponent(text)}`;

function OrderForm() {
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
        {done.id && <p className="oid-hint">Save this ID. You can follow your order any time with your ID and phone number.</p>}
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
        <label>Email <small>(optional)</small><input type="email" value={f.email} onChange={set("email")} autoComplete="email" placeholder="you@example.com" /></label>
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

/* ================= PAGE ================= */
export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  /* parallax + progress bar + nav state */
  useEffect(() => {
    let raf = 0;
    let wasScrolled = false;
    const bar = document.querySelector(".progress");
    const els = Array.from(document.querySelectorAll("[data-speed]"));
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const y = window.scrollY;
      if (y > 40 !== wasScrolled) { wasScrolled = y > 40; setScrolled(wasScrolled); }
      const max = document.documentElement.scrollHeight - vh;
      if (bar) bar.style.transform = `scaleX(${max > 0 ? (y / max).toFixed(4) : 0})`;
      const phone = window.innerWidth < 800; // parallax is skipped on phones: smoother scrolling
      els.forEach((el) => {
        if (phone) { if (el.style.transform) el.style.transform = ""; return; }
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -300 || r.top > vh + 300) return; // off screen
        const center = r.top + r.height / 2 - vh / 2;
        el.style.transform = `translate3d(0, ${(-center * parseFloat(el.dataset.speed)).toFixed(1)}px, 0)`;
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /* reveal on scroll */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const wa = `https://wa.me/${SITE.phoneIntl}?text=${encodeURIComponent("Hi SWAN, I would like to order the Cleanser + Facewash.")}`;

  return (
    <main>
      <div className="progress" />
      <Flyer />

      {/* NAV */}
      <header className={`nav ${scrolled ? "nav-solid" : ""}`}>
        <div className="topbar">
          Delivering across Pakistan · <b>Cash on Delivery available</b>
        </div>
        <div className="nav-row">
          <a href="#top" className="brand" aria-label="SWAN Beauty Essence">
            <Logo height={scrolled ? 56 : 74} />
          </a>
          <nav>
            <a href="#about">About</a>
            <a href="#product">Formula</a>
            <a href="#ingredients">Ingredients</a>
            <a href="#order">Order</a>
            <a href="/track">Track order</a>
          </nav>
          <a href="#order" className="btn btn-sm">Order Now</a>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="hero">
        <div className="orb orb-1"><div data-speed="0.25" className="orb-in" /></div>
        <div className="orb orb-2"><div data-speed="-0.15" className="orb-in" /></div>
        <div className="bubbles">
          {Array.from({ length: 18 }).map((_, i) => (
            <i key={i} style={{ "--i": i, left: `${(i * 53) % 100}%` }} />
          ))}
        </div>

        <div className="hero-text">
          <p className="eyebrow fade-up" style={{ "--d": "0.1s" }}>NEW LAUNCH · ANTI-ACNE BEADS</p>
          <h1>
            <span className="ln"><span style={{ "--d": "0.2s" }}>Clear skin.</span></span>
            <span className="ln"><span style={{ "--d": "0.35s" }}><em>Confident you.</em></span></span>
          </h1>
          <p className="lead fade-up" style={{ "--d": "0.55s" }}>
            A 2-in-1 cleanser and facewash with Vitamin D, Salicylic Acid and
            Glycolic Acid. It deep cleanses, unclogs pores and removes excess oil.
          </p>
          <p className="hero-meta fade-up" style={{ "--d": "0.65s" }}>150 ml · Anti-Acne Beads · Delivered across Pakistan</p>
          <div className="cta fade-up" style={{ "--d": "0.75s" }}>
            <a href="#order" className="btn">Order Now</a>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">WhatsApp us</a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="arch" />
          <div className="slot slot-hero" data-flyer-slot data-rot="-4" />
          <div className="chip chip-a">Vitamin D</div>
          <div className="chip chip-b">Salicylic Acid</div>
          <div className="chip chip-c">Glycolic Acid</div>
        </div>

        <a href="#about" className="scroll-cue"><span /> Scroll</a>
      </section>

      {/* MARQUEE */}
      <div className="marquee" aria-hidden="true">
        <div className="track">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k}>
              {["Anti-Acne Beads", "2-in-1 Formula", "Vitamin D", "Deep Cleanse", "Salicylic Acid", "Clear Skin, Confident You", "Glycolic Acid", "150 ml", "Delivered Across Pakistan"].map((t) => (
                <span key={t + k}>{t} <b>✦</b></span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* TRUST */}
      <div className="trust">
        {trust.map((t) => <span key={t}><i>✦</i> {t}</span>)}
      </div>

      <Board />

      {/* ABOUT */}
      <section id="about" className="about">
        <div className="about-art">
          <div className="reveal"><Picture name="about-woman" alt="Woman with fresh, clear skin" className="tall" /></div>
          <div className="float-card" data-speed="-0.12">
            <SwanMark size={38} />
            <p>Grace on the surface.<br />Care underneath.</p>
          </div>
          <div className="slot slot-about" data-flyer-slot data-rot="7" />
        </div>
        <div className="about-copy">
          <p className="eyebrow reveal">ABOUT SWAN</p>
          <h2 className="reveal">Skincare that feels <em>elegant</em> and works hard.</h2>
          <p className="reveal">
            SWAN is built on one idea: care should feel as good as it works. We
            start with a single, focused essential and make it properly.
          </p>
          <p className="reveal">
            Our first creation, Cleanser + Facewash, brings Anti-Acne Beads and
            three purposeful actives into one bottle. One step. No clutter. A
            cleaner face, every day.
          </p>
          <div className="values">
            {[
              ["Graceful", "A gentle touch, noticeable results"],
              ["Intentional", "Every ingredient has a purpose"],
              ["Effortless", "One bottle, one simple routine"],
            ].map(([a, b]) => (
              <div key={a} className="reveal value"><h4>{a}</h4><p>{b}</p></div>
            ))}
          </div>
        </div>
      </section>

      <Story />

      {/* REAL PRODUCT */}
      <section className="real">
        <div className="real-copy">
          <p className="eyebrow reveal">THE REAL BOTTLE</p>
          <h2 className="reveal">Real gel. Real beads. <em>Real bottle.</em></h2>
          <p className="reveal">
            See exactly what you are getting: clear green gel, Anti-Acne Beads
            suspended inside, and a smooth white pump.
          </p>
          <ul className="ticks">
            {["Clear bottle, so you see the gel and beads", "Smooth pump, one press is enough", "150 ml · For all skin types"].map((t) => (
              <li key={t} className="reveal"><i>✦</i>{t}</li>
            ))}
          </ul>
        </div>
        <div className="real-media">
          <div className="phone reveal" data-speed="-0.05">
            <LazyVideo src="/videos/product.mp4" poster="/images/product-real-1.jpg" />
          </div>
          <div className="photo p1" data-speed="0.08"><Picture name="product-real-2" alt="SWAN Cleanser + Facewash in hand" /></div>
          <div className="photo p2" data-speed="-0.08"><Picture name="product-detail" alt="Close-up of the gel, beads and label" /></div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="benefits">
        <div className="head">
          <p className="eyebrow reveal">WHY SWAN</p>
          <h2 className="reveal">One bottle. <em>Two jobs.</em></h2>
        </div>
        <div className="grid">
          {benefits.map(([t, d], i) => (
            <article key={t} className="card reveal" style={{ transitionDelay: `${(i % 3) * 0.1}s` }}>
              <span className="idx">{String(i + 1).padStart(2, "0")}</span>
              <h4>{t}</h4>
              <p>{d}</p>
            </article>
          ))}
        </div>
      </section>

      {/* INGREDIENTS */}
      <section id="ingredients" className="inside">
        <div className="head">
          <p className="eyebrow reveal">WHAT'S INSIDE</p>
          <h2 className="reveal">Simple, <em>purposeful</em> ingredients.</h2>
        </div>
        <div className="actives">
          {ingredients.map((g) => (
            <div key={g.n} className="active-card reveal">
              <h4>{g.n}</h4>
              <h5>{g.t}</h5>
              <p>{g.d}</p>
            </div>
          ))}
        </div>
        <div className="inci reveal">
          <h5>Full ingredients</h5>
          <p>Salicylic Acid, Glycolic Acid, Vitamin D, Citric Acid, Polyquaternium-7, Coco-Glucoside, Fragrance, SLES, Aqua, Glycerin.</p>
        </div>
      </section>

      {/* RITUAL */}
      <section id="ritual" className="ritual">
        <div className="ritual-media">
          <div data-speed="0.1"><RitualMedia /></div>
        </div>
        <div className="ritual-copy">
          <p className="eyebrow reveal">HOW TO USE</p>
          <h2 className="reveal">Four steps, <em>one clean face.</em></h2>
          <ol>
            {steps.map(([n, t, d]) => (
              <li key={n} className="reveal"><span>{n}</span><div><h4>{t}</h4><p>{d}</p></div></li>
            ))}
          </ol>
          <p className="note reveal">For external use only. Avoid contact with eyes. Please patch test before first use.</p>
        </div>
      </section>

      {/* GALLERY */}
      <section className="gallery">
        <div className="g1" data-speed="0.08"><Picture name="model-1" alt="Fresh face after cleansing" /></div>
        <div className="g2" data-speed="-0.1"><Picture name="model-2" alt="Using SWAN Cleanser + Facewash" /></div>
        <div className="g3" data-speed="0.14"><Picture name="model-3" alt="Clear, radiant skin" /></div>
        <h2 className="gallery-title reveal">Clear skin. <em>Confident</em> you.</h2>
      </section>

      {/* FAQ */}
      <section className="faq">
        <div className="head">
          <p className="eyebrow reveal">GOOD TO KNOW</p>
          <h2 className="reveal">Quick <em>answers.</em></h2>
        </div>
        <div className="faq-list reveal">
          {[
            ["Is it suitable for all skin types?", "Yes. SWAN Cleanser + Facewash is made for all skin types, dermatologically tested and pH-balanced. We still recommend a patch test before first use."],
            ["How often should I use it?", "For best results, use it 4–5 times a week. Gently massage a small amount onto damp skin, avoiding the eye area, then rinse thoroughly with lukewarm water."],
            ["How do I order?", "Choose Cash on Delivery to place your order right here and pay when it arrives. Or choose Advance Payment: WhatsApp opens with your order ready to send, and we share the payment details."],
            ["Do you deliver outside Pakistan?", "Not yet. We currently deliver within Pakistan only."],
          ].map(([q, a]) => (
            <details key={q}><summary>{q}</summary><p>{a}</p></details>
          ))}
        </div>
      </section>

      {/* ORDER */}
      <section id="order" className="order">
        <div className="head">
          <p className="eyebrow reveal">ORDER NOW</p>
          <h2 className="reveal">One essential. <em>One simple price.</em></h2>
        </div>
        <div className="order-grid">
          <div className="price-card reveal">
            <span className="tag live-tag">New Launch</span>
            <div className="slot slot-order" data-flyer-slot data-rot="-3" />
            <div className="price-info">
              <h4>Cleanser + Facewash</h4>
              <p className="sub">Anti-Acne Beads · 2-in-1 Formula · 150 ml</p>
              <div className="big">{money(SITE.price)}</div>
              <ul className="ship">
                <li><span>Delivery · Cash on Delivery</span><b>{money(SITE.deliveryCOD)}</b></li>
                <li className="hot"><span>Delivery · Advance Payment</span><b>{money(SITE.deliveryAdvance)}</b></li>
              </ul>
              <p className="geo">Delivering all across Pakistan. We currently deliver within Pakistan only. International shipping is not available yet.</p>
              <div className="contact">
                <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-ghost">Questions? WhatsApp us</a>
              </div>
            </div>
          </div>
          <div className="reveal"><OrderForm /></div>
        </div>
        <p className="more reveal"><SwanMark size={22} color="#c9a26a" /> More SWAN essentials are on the way.</p>
      </section>

      {/* FOOTER */}
      <footer>
        <Logo height={84} />
        <p className="f-contact">
          Order &amp; support · <a href={wa} target="_blank" rel="noopener noreferrer">Chat with us on WhatsApp</a>
        </p>
        <p>Delivering across Pakistan only.</p>
        <p className="small">© {new Date().getFullYear()} SWAN Beauty Essence. All rights reserved.</p>
      </footer>

      {/* floating WhatsApp */}
      <a className="wa" href={wa} target="_blank" rel="noopener noreferrer" aria-label="Order on WhatsApp">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="#fff" aria-hidden="true">
          <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 1.8a8.2 8.2 0 1 1-4.2 15.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0 1 12 3.8z" />
          <path d="M8.6 7.4c-.3.3-.6 1-.3 1.9.6 1.7 2.5 3.7 4.6 4.6.9.4 1.6.3 1.9 0l.8-.9c.2-.3.2-.6-.1-.8l-1.4-.9c-.2-.1-.5-.1-.7.1l-.5.5c-.9-.4-1.8-1.3-2.2-2.2l.5-.5c.2-.2.2-.5.1-.7l-.8-1.5c-.2-.3-.6-.3-.9-.1z" />
        </svg>
      </a>
    </main>
  );
}
