"use client";

import { useEffect, useRef, useState } from "react";
import { SwanMark } from "../components/Bottle";
import Logo from "../components/Logo";
import Select from "../components/Select";
import { SITE, PROVINCES, MODEL_PHOTOS } from "../lib/config";

const money = (n) => "Rs. " + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

/* real photo from public/images/<file> */
function Photo({ file, alt, className = "" }) {
  return (
    <div className={`art ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/images/${file}`} alt={alt} width="800" height="1000" loading="lazy" decoding="async" />
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
    }, { threshold: 0.2 });
    io.observe(v);
    return () => io.disconnect();
  }, [src]);
  return <video ref={ref} muted loop playsInline preload="none" poster={poster} />;
}

/* small line icons */
const Icon = ({ d, extra }) => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />{extra}
  </svg>
);
const ICONS = {
  shield: <Icon d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z" extra={<path d="M9 12l2 2 4-4" />} />,
  cash: <Icon d="M3 7h18v10H3z" extra={<><circle cx="12" cy="12" r="2.6" /><path d="M6.5 10v4M17.5 10v4" /></>} />,
  truck: <Icon d="M3 7h11v9H3z" extra={<><path d="M14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="1.7" /><circle cx="17" cy="18" r="1.7" /></>} />,
  pin: <Icon d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z" extra={<circle cx="12" cy="10" r="2.5" />} />,
  pores: <Icon d="M12 3a9 9 0 100 18 9 9 0 000-18z" extra={<><circle cx="9" cy="10" r="1.3" /><circle cx="15" cy="9" r="1.3" /><circle cx="12" cy="14.5" r="1.3" /></>} />,
  drop: <Icon d="M12 3c3 4 6 7 6 11a6 6 0 01-12 0c0-4 3-7 6-11z" />,
  spark: <Icon d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" extra={<path d="M19 17v4M17 19h4" />} />,
};

/* ---------- content ---------- */
const concerns = [
  ["shield", "Breakouts & acne-prone skin", "Formulated with Salicylic Acid to help prevent acne."],
  ["pores", "Clogged pores", "Deep cleanses and unclogs pores, clearing away dirt from within."],
  ["drop", "Excess oil", "Removes excess oil for a fresher, cleaner feel."],
  ["spark", "Dull, rough-looking skin", "Glycolic Acid helps remove dead skin cells for a brighter, smoother complexion."],
];

const beadsSteps = [
  ["Cleanse", "A fresh lather lifts away dirt, oil and everyday build-up."],
  ["Exfoliate", "Gentle exfoliating beads help remove dead skin cells."],
  ["Nourish", "The beads burst with skin-loving vitamins as you massage."],
];

const stats = [["150 ml", "Bottle size"], ["3", "Active ingredients"], ["2-in-1", "Cleanser + face wash"], ["4–5×", "Times a week"]];

const ingredients = [
  { n: "Vitamin D", t: "Nourish", d: "Skin-loving vitamin goodness, released by every bead to leave skin feeling nourished and refreshed." },
  { n: "Salicylic Acid", t: "Unclog", d: "Works to deep cleanse and unclog pores while clearing away excess oil." },
  { n: "Glycolic Acid", t: "Renew", d: "Helps remove dead skin cells, revealing a brighter, smoother-looking complexion." },
];

const benefits = [
  ["Deep cleanses & unclogs pores", "Clears dirt and oil from deep within the pores."],
  ["Removes excess oil", "Keeps shine in check for a fresher, cleaner feel."],
  ["Helps prevent acne", "Formulated with Salicylic Acid to help prevent acne."],
  ["Anti-Acne Beads", "Gentle exfoliating beads that burst with skin-loving vitamins."],
  ["Brighter, smoother look", "Glycolic Acid helps remove dead skin cells for a smoother complexion."],
  ["Made for every skin type", "Dermatologically tested. pH-balanced. Paraben-free."],
];

const steps = [
  ["1", "Start with damp skin", "Wet your face with lukewarm water."],
  ["2", "Massage gently", "Gently massage a small amount onto damp skin. Avoid the eye area."],
  ["3", "Rinse thoroughly", "Rinse well with lukewarm water."],
  ["4", "Make it a habit", "For best results, use 4–5 times a week."],
];

const tips = [
  ["Patch test first", "Try a little on your inner arm or jaw before the first full use."],
  ["Sunscreen, every day", "Glycolic and Salicylic Acid can make skin more sun-sensitive, so use sunscreen in the morning."],
  ["Be gentle", "Massage softly. Scrubbing harder does not clean better and can irritate skin."],
  ["Moisturise after", "Pat dry and follow with a moisturiser to keep skin soft and balanced."],
];

const flow = [
  ["Place your order", "Choose Cash on Delivery or Advance Payment and fill in your details."],
  ["We confirm", "We contact you shortly to confirm your order."],
  ["Dispatched", "Your parcel goes with the courier. You get the courier name and tracking ID."],
  ["At your door", "Pay on delivery if you chose cash. Track any time with your Order ID."],
];

const marquee = ["Anti-Acne Beads", "Vitamin D", "Salicylic Acid", "Glycolic Acid", "pH-balanced", "Paraben-free", "For all skin types", "Dermatologically tested"];

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

/* ================= PAGE ================= */
export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  /* nav shadow (one cheap scroll listener) */
  useEffect(() => {
    let raf = 0;
    let was = false;
    const on = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const s = window.scrollY > 20;
        if (s !== was) { was = s; setScrolled(s); }
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  /* gentle fade-up on scroll */
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    if (typeof IntersectionObserver === "undefined") { els.forEach((el) => el.classList.add("in")); return; }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const wa = `https://wa.me/${SITE.phoneIntl}?text=${encodeURIComponent("Hi SWAN, I would like to order the Cleanser + Facewash.")}`;
  const track = [...marquee, ...marquee];

  return (
    <main>
      <div className="topbar">Delivering across Pakistan · <b>Cash on Delivery available</b></div>

      {/* NAV */}
      <header className={`nav ${scrolled ? "nav-solid" : ""}`}>
        <div className="nav-in">
          <a href="#top" aria-label="SWAN Beauty Essence"><Logo variant="brown" height={56} /></a>
          <nav aria-label="Main">
            <a href="#benefits">Benefits</a>
            <a href="#ingredients">Ingredients</a>
            <a href="#how">How to use</a>
            <a href="#label">Label</a>
            <a href="#faq">FAQ</a>
            <a href="/track">Track order</a>
          </nav>
          <a href="#order" className="btn btn-sm">Order now</a>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Anti-Acne Beads · 2-in-1 Formula</p>
          <h1>Clear skin.<br /><em>Confident you.</em></h1>
          <p className="lead">
            SWAN Cleanser + Facewash has gentle exfoliating beads that burst with Vitamin D, Salicylic Acid and Glycolic Acid.
            One bottle, one simple step, made for all skin types.
          </p>
          <div className="cta">
            <a className="btn" href="#order">Order now · {money(SITE.price)}</a>
            <a className="btn btn-ghost" href={wa} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
          </div>
          <ul className="hero-points">
            <li>Dermatologically tested</li>
            <li>pH-balanced</li>
            <li>Paraben-free</li>
          </ul>
        </div>

        <div className="hero-stage">
          <i className="bead b1" aria-hidden="true" /><i className="bead b2" aria-hidden="true" /><i className="bead b3" aria-hidden="true" />
          <div className="hero-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/product-real-2.jpg" alt="SWAN Cleanser + Facewash bottle with green gel and Anti-Acne Beads" width="900" height="1896" fetchPriority="high" decoding="async" />
          </div>
          <span className="stag s1">Vitamin D</span>
          <span className="stag s2">Salicylic Acid</span>
          <span className="stag s3">Glycolic Acid</span>
          <span className="hero-size">150 ml</span>
        </div>
      </section>

      {/* ASSURANCE */}
      <div className="assure">
        {[
          ["cash", "Cash on Delivery", "Pay when it arrives"],
          ["truck", "Delivery across Pakistan", "Courier to your door"],
          ["pin", "Track your order", "Order ID + courier tracking"],
          ["shield", "Dermatologically tested", "pH-balanced, paraben-free"],
        ].map(([ic, t, d]) => (
          <div key={t} className="reveal"><span className="ico">{ICONS[ic]}</span><div><b>{t}</b><small>{d}</small></div></div>
        ))}
      </div>

      {/* TICKER */}
      <div className="marq" aria-hidden="true">
        <div className="marq-track">{track.map((t, i) => <span key={i}>{t}<i>✦</i></span>)}</div>
      </div>

      {/* MADE FOR */}
      <section className="sec">
        <div className="head">
          <p className="eyebrow reveal">MADE FOR</p>
          <h2 className="reveal">Skin that needs a <em>proper clean.</em></h2>
          <p className="sub reveal">If any of these sound familiar, this bottle is for you.</p>
        </div>
        <div className="grid4">
          {concerns.map(([ic, t, d]) => (
            <article key={t} className="card concern reveal">
              <span className="ico">{ICONS[ic]}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </article>
          ))}
        </div>
      </section>

      {/* HOW THE BEADS WORK */}
      <section className="sec dark beads-sec">
        <div className="head">
          <p className="eyebrow reveal">THE BEAD DIFFERENCE</p>
          <h2 className="reveal">Cleanse. Exfoliate. <em>Nourish.</em></h2>
          <p className="sub reveal">Three things happen in the one minute you spend washing your face.</p>
        </div>
        <div className="grid3">
          {beadsSteps.map(([t, d], i) => (
            <article key={t} className="bstep reveal">
              <span className="bnum">{i + 1}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="sec about">
        <div className="about-art reveal">
          <div className="about-card">
            <Logo variant="brown" height={130} />
            <span className="aline" aria-hidden="true" />
            <p className="aq">Grace on the surface.<br />Care underneath.</p>
            <ul>
              <li>Anti-Acne Beads</li>
              <li>2-in-1 Formula</li>
              <li>150 ml</li>
            </ul>
          </div>
        </div>
        <div className="about-copy">
          <p className="eyebrow reveal">ABOUT SWAN</p>
          <h2 className="reveal">Skincare that feels <em>graceful</em> and works hard.</h2>
          <p className="reveal">
            SWAN is built on one idea: care should feel as good as it works. We start with a single, focused essential and make it properly.
          </p>
          <p className="reveal">
            Our first creation, Cleanser + Facewash, brings Anti-Acne Beads and three purposeful actives into one bottle. One step. No clutter. A cleaner face, every day.
          </p>
          <div className="values">
            {[["Graceful", "A gentle touch, noticeable results"], ["Intentional", "Every ingredient has a purpose"], ["Effortless", "One bottle, one simple routine"]].map(([a, b]) => (
              <div key={a} className="value reveal"><h4>{a}</h4><p>{b}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section id="benefits" className="sec tint">
        <div className="head">
          <p className="eyebrow reveal">WHY SWAN</p>
          <h2 className="reveal">One bottle. <em>Two jobs.</em></h2>
          <p className="sub reveal">Cleanser and exfoliating beads in a single, easy step.</p>
        </div>
        <div className="grid3">
          {benefits.map(([t, d], i) => (
            <article key={t} className="card reveal">
              <span className="num">{String(i + 1).padStart(2, "0")}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </article>
          ))}
        </div>
      </section>

      {/* STATS */}
      <div className="stats">
        {stats.map(([n, l]) => (
          <div key={l} className="reveal"><b>{n}</b><span>{l}</span></div>
        ))}
      </div>

      {/* INGREDIENTS */}
      <section id="ingredients" className="sec">
        <div className="head">
          <p className="eyebrow reveal">WHAT'S INSIDE</p>
          <h2 className="reveal">Simple, <em>purposeful</em> ingredients.</h2>
        </div>
        <div className="grid3">
          {ingredients.map((g) => (
            <article key={g.n} className="card ing reveal">
              <span className="chipt">{g.t}</span>
              <h3>{g.n}</h3>
              <p>{g.d}</p>
            </article>
          ))}
        </div>
        <p className="inci reveal"><b>Full ingredients:</b> Salicylic Acid, Glycolic Acid, Vitamin D, Citric Acid, Polyquaternium-7, Coco-Glucoside, Fragrance, SLES, Aqua, Glycerin.</p>
      </section>

      {/* HOW TO USE */}
      <section id="how" className="sec tint how">
        <div className="how-art reveal">
          <div className="photo-arch">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/product-real-3.jpg" alt="Holding the SWAN Cleanser + Facewash bottle" width="900" height="1896" loading="lazy" decoding="async" />
          </div>
        </div>
        <div className="how-copy">
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

      {/* TIPS */}
      <section className="sec">
        <div className="head">
          <p className="eyebrow reveal">GOOD HABITS</p>
          <h2 className="reveal">Get the <em>best results.</em></h2>
          <p className="sub reveal">Small habits that help your skin look its best.</p>
        </div>
        <div className="grid4">
          {tips.map(([t, d], i) => (
            <article key={t} className="card tip reveal">
              <span className="num">{i + 1}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </article>
          ))}
        </div>
        <p className="inci reveal">If you have persistent or severe acne, please see a dermatologist.</p>
      </section>

      {/* LABEL */}
      <section id="label" className="sec tint">
        <div className="head">
          <p className="eyebrow reveal">ON THE LABEL</p>
          <h2 className="reveal">Read it <em>before you buy.</em></h2>
          <p className="sub reveal">Front and back of the bottle: description, how to use and full ingredients.</p>
        </div>
        <div className="label-row">
          <figure className="lbl reveal">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/label-front.webp" alt="Front label: Cleanser + Face wash, Anti-Acne Beads, 2-in-1 Formula" width="432" height="1501" loading="lazy" decoding="async" />
            <figcaption>Front</figcaption>
          </figure>
          <figure className="lbl reveal">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/label-back.webp" alt="Back label: description, how to use, ingredients and marketed by" width="450" height="1608" loading="lazy" decoding="async" />
            <figcaption>Back</figcaption>
          </figure>
        </div>
      </section>

      {/* REAL BOTTLE */}
      <section className="sec real">
        <div className="real-copy">
          <p className="eyebrow reveal">THE REAL BOTTLE</p>
          <h2 className="reveal">Real gel. Real beads. <em>Real bottle.</em></h2>
          <p className="reveal">See exactly what you are getting: clear green gel, Anti-Acne Beads suspended inside, and a smooth white pump.</p>
          <ul className="ticks">
            {["Clear bottle, so you see the gel and beads", "Smooth pump, one press is enough", "150 ml · For all skin types"].map((t) => (
              <li key={t} className="reveal"><i aria-hidden="true">✓</i>{t}</li>
            ))}
          </ul>
        </div>
        <div className="real-media">
          <div className="phone reveal"><LazyVideo src="/videos/product.mp4" poster="/images/product-real-1.jpg" /></div>
          <div className="phone photo reveal">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/hero-bottle.jpg" alt="Close-up of the SWAN gel, beads and label" width="900" height="1536" loading="lazy" decoding="async" />
          </div>
        </div>
      </section>

      {/* FACES (real model photos, optional: see MODEL_PHOTOS in lib/config.js) */}
      {MODEL_PHOTOS.length > 0 && (
        <section className="sec tint faces">
          <div className="head">
            <p className="eyebrow reveal">FOR EVERY SKIN</p>
            <h2 className="reveal">Clear skin. <em>Confident</em> you.</h2>
          </div>
          <div className="faces-row">
            {MODEL_PHOTOS.map((f, i) => <Photo key={f} file={f} alt={`SWAN customer ${i + 1}`} className="reveal" />)}
          </div>
        </section>
      )}

      {/* HOW ORDERING WORKS */}
      <section className="sec">
        <div className="head">
          <p className="eyebrow reveal">EASY ORDERING</p>
          <h2 className="reveal">From order to <em>your door.</em></h2>
        </div>
        <ol className="flow">
          {flow.map(([t, d], i) => (
            <li key={t} className="reveal"><span>{i + 1}</span><h4>{t}</h4><p>{d}</p></li>
          ))}
        </ol>
        <p className="center reveal"><a className="btn btn-ghost btn-sm" href="/track">Track an order</a></p>
      </section>

      {/* FAQ */}
      <section id="faq" className="sec tint faq">
        <div className="head">
          <p className="eyebrow reveal">GOOD TO KNOW</p>
          <h2 className="reveal">Quick <em>answers.</em></h2>
        </div>
        <div className="faq-list reveal">
          {[
            ["Is it suitable for all skin types?", "Yes. SWAN Cleanser + Facewash is made for all skin types, dermatologically tested and pH-balanced. We still recommend a patch test before first use."],
            ["How often should I use it?", "For best results, use it 4–5 times a week. Gently massage a small amount onto damp skin, avoiding the eye area, then rinse thoroughly with lukewarm water."],
            ["What are the Anti-Acne Beads?", "Gentle exfoliating beads that burst with skin-loving vitamins as you massage, helping remove dirt, oil and dead skin cells."],
            ["What if my skin feels irritated?", "Stop using it and rinse well with water. Skin can be sensitive to acids, which is why we recommend a patch test first. If irritation continues, please see a doctor."],
            ["How do I order?", "Choose Cash on Delivery to place your order right here and pay when it arrives. Or choose Advance Payment: WhatsApp opens with your order ready to send, and we share the payment details."],
            ["How can I track my order?", "After you order you get an Order ID. Open Track order, enter the ID and your phone number, and you will see the status and your courier tracking ID once it is dispatched."],
            ["Do you deliver outside Pakistan?", "Not yet. We currently deliver within Pakistan only."],
          ].map(([q, a]) => (
            <details key={q}><summary>{q}</summary><p>{a}</p></details>
          ))}
        </div>
      </section>

      {/* ORDER */}
      <section id="order" className="sec order">
        <div className="head">
          <p className="eyebrow reveal">ORDER NOW</p>
          <h2 className="reveal">One essential. <em>One simple price.</em></h2>
        </div>
        <div className="order-grid">
          <div className="price-card reveal">
            <span className="badge">New launch</span>
            <h3>Cleanser + Facewash</h3>
            <p className="sub">Anti-Acne Beads · 2-in-1 Formula · 150 ml</p>
            <div className="big">{money(SITE.price)}</div>
            <ul className="ship">
              <li><span>Delivery · Cash on Delivery</span><b>{money(SITE.deliveryCOD)}</b></li>
              <li className="hot"><span>Delivery · Advance Payment</span><b>{money(SITE.deliveryAdvance)}</b></li>
            </ul>
            <p className="geo">Delivering all across Pakistan. We currently deliver within Pakistan only.</p>
            <div className="price-actions">
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-ghost">Questions? WhatsApp us</a>
              <a href="/track" className="btn btn-sm btn-ghost">Track my order</a>
            </div>
          </div>
          <div className="reveal"><OrderForm /></div>
        </div>
        <p className="more reveal"><SwanMark size={22} color="#825830" /> More SWAN essentials are on the way.</p>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="foot-grid">
          <div className="foot-brand">
            <Logo variant="cream" height={84} />
            <p>Grace on the surface. Care underneath.</p>
          </div>
          <div>
            <h5>Explore</h5>
            <a href="#benefits">Benefits</a>
            <a href="#ingredients">Ingredients</a>
            <a href="#how">How to use</a>
            <a href="#label">On the label</a>
            <a href="#faq">FAQ</a>
          </div>
          <div>
            <h5>Help</h5>
            <a href="#order">Order now</a>
            <a href="/track">Track your order</a>
            <a href={wa} target="_blank" rel="noopener noreferrer">WhatsApp us</a>
          </div>
          <div>
            <h5>Delivery</h5>
            <p>All across Pakistan.</p>
            <p>Cash on Delivery or Advance Payment.</p>
          </div>
        </div>
        <p className="small">© {new Date().getFullYear()} SWAN Beauty Essence. All rights reserved. <a href="#top">Back to top ↑</a></p>
      </footer>

      {/* mobile order bar + floating WhatsApp */}
      <div className="mbar"><span><b>{money(SITE.price)}</b> · Cleanser + Facewash</span><a className="btn btn-sm" href="#order">Order now</a></div>
      <a className="wa" href={wa} target="_blank" rel="noopener noreferrer" aria-label="Order on WhatsApp">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="#fff" aria-hidden="true">
          <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 1.8a8.2 8.2 0 1 1-4.2 15.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0 1 12 3.8z" />
          <path d="M8.6 7.4c-.3.3-.6 1-.3 1.9.6 1.7 2.5 3.7 4.6 4.6.9.4 1.6.3 1.9 0l.8-.9c.2-.3.2-.6-.1-.8l-1.4-.9c-.2-.1-.5-.1-.7.1l-.5.5c-.9-.4-1.8-1.3-2.2-2.2l.5-.5c.2-.2.2-.5.1-.7l-.8-1.5c-.2-.3-.6-.3-.9-.1z" />
        </svg>
      </a>
    </main>
  );
}
