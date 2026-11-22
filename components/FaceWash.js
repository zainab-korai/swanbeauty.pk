"use client";

import { useState } from "react";
import { Header, Footer, WhatsAppFab, RevealInit, LazyVideo, Reviews } from "./StoreKit";
import { ICONS, money, waLink } from "./ui";
import OrderForm from "./OrderForm";
import { SITE } from "../lib/config";

const GALLERY = [
  ["/images/product-real-2.png", "SWAN Cleanser + Facewash bottle"],
  ["/images/hero-image.png", "SWAN gel and Anti-Acne Beads"],
  ["/images/product-real-33.png", "Holding the SWAN bottle"],
];

const points = [
  ["pores", "Deep cleanses and unclogs pores"],
  ["drop", "Removes excess oil"],
  ["shield", "Helps prevent acne"],
  ["spark", "Gentle exfoliating Anti-Acne Beads"],
];

const steps = [
  "Wet your face with lukewarm water.",
  "Gently massage a small amount onto damp skin. Avoid the eye area.",
  "Rinse thoroughly with lukewarm water.",
  "For best results, use 4–5 times a week.",
];

const ingredients = [
  ["Vitamin D", "Nourish", "Released by every bead to leave skin feeling nourished and refreshed."],
  ["Salicylic Acid", "Unclog", "Deep cleanses pores and clears away excess oil."],
  ["Glycolic Acid", "Renew", "Helps remove dead skin cells for a brighter, smoother look."],
];

const faq = [
  ["Is it suitable for all skin types?", "Yes. It is dermatologically tested and pH-balanced. We still recommend a patch test before first use."],
  ["How often should I use it?", "4–5 times a week for best results. Use sunscreen in the morning, as acids can make skin more sun-sensitive."],
  ["What if my skin feels irritated?", "Stop using it and rinse well with water. If irritation continues, please see a doctor."],
  ["How do I track my order?", "After ordering you get an Order ID. Open Track order and enter it to see your status and courier tracking ID."],
  ["Do you deliver outside Pakistan?", "Not yet. We deliver within Pakistan only."],
];

export default function FaceWash() {
  const [i, setI] = useState(0);
  return (
    <>
      <Header active="face" />
      <RevealInit />
      <main className="s-pd">
        <div className="s-wrap">
          <p className="s-crumb"><a href="/">Home</a> / <span>Face Wash</span></p>

          <div className="s-pd-grid">
            {/* gallery */}
            <div className="s-gal">
              <div className="s-gal-main">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img key={i} src={GALLERY[i][0]} alt={GALLERY[i][1]} width="900" height="1100" decoding="async" fetchPriority={i === 0 ? "high" : "auto"} />
              </div>
              <div className="s-thumbs">
                {GALLERY.map(([src, alt], k) => (
                  <button key={src} type="button" className={k === i ? "on" : ""} onClick={() => setI(k)} aria-label={`Photo ${k + 1}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" loading="lazy" decoding="async" />
                  </button>
                ))}
              </div>
            </div>

            {/* buy box */}
            <div className="s-buy">
              <span className="s-pill soft">New launch</span>
              <h1>Cleanser + Facewash</h1>
              <p className="s-sub">Anti-Acne Beads · 2-in-1 Formula · 150 ml</p>
              <div className="s-price-line big"><b>{money(SITE.price)}</b><span>+ delivery {money(SITE.deliveryCOD)} (COD)</span></div>
              <ul className="s-points">
                {points.map(([ic, t]) => <li key={t}><span>{ICONS[ic]}</span>{t}</li>)}
              </ul>
              <div id="order" className="s-form-anchor"><OrderForm /></div>
              <ul className="s-mini">
                <li>{ICONS.cash}<span>Cash on Delivery</span></li>
                <li>{ICONS.truck}<span>All Pakistan</span></li>
                <li>{ICONS.pin}<span>Order tracking</span></li>
              </ul>
            </div>
          </div>

          {/* details */}
          <div className="s-acc">
            <details open>
              <summary>Description</summary>
              <div>
                <p>SWAN Cleanser + Facewash has gentle exfoliating beads that burst with Vitamin D, Salicylic Acid and Glycolic Acid. It cleanses, exfoliates and nourishes in one easy step, and is made for all skin types.</p>
              </div>
            </details>
            <details>
              <summary>How to use</summary>
              <div>
                <ol className="s-olist">{steps.map((t) => <li key={t}>{t}</li>)}</ol>
                <p className="s-fine">For external use only. Avoid contact with eyes. Patch test before first use.</p>
              </div>
            </details>
            <details>
              <summary>Ingredients</summary>
              <div>
                <div className="s-ing">
                  {ingredients.map(([n, t, d]) => <div key={n}><span className="s-pill soft">{t}</span><b>{n}</b><p>{d}</p></div>)}
                </div>
                <p className="s-fine"><b>Full ingredients:</b> Salicylic Acid, Glycolic Acid, Vitamin D, Citric Acid, Polyquaternium-7, Coco-Glucoside, Fragrance, SLES, Aqua, Glycerin.</p>
              </div>
            </details>
            <details>
              <summary>Delivery &amp; payment</summary>
              <div>
                <ul className="s-olist plain">
                  <li><b>Cash on Delivery:</b> delivery {money(SITE.deliveryCOD)}. Pay when your order arrives.</li>
                  <li><b>Advance Payment:</b> delivery {money(SITE.deliveryAdvance)}. WhatsApp opens with your order ready; we share the payment details.</li>
                  <li>We deliver across Pakistan. Track with your Order ID on the <a href="/track">Track order</a> page.</li>
                </ul>
              </div>
            </details>
          </div>

        </div>
        <Reviews />
        <div className="s-wrap">
          {/* video */}
          <section className="s-sec tight">
            <div className="s-how">
              <div className="s-how-video reveal"><LazyVideo src="/videos/ritual.mp4" /></div>
              <div className="s-how-copy reveal">
                <h2 className="s-title left">See how easy it is</h2>
                <p>Wet, massage, rinse. One bottle and about a minute is all it takes.</p>
                <a className="s-btn" href="#order">Order now · {money(SITE.price)}</a>
              </div>
            </div>
          </section>

          {/* faq */}
          <section className="s-sec tight">
            <h2 className="s-title">Quick answers</h2>
            <div className="s-faq narrow">
              {faq.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
            </div>
            <p className="s-center"><a className="s-btn ghost sm" href={waLink("Hi SWAN, I have a question about the Cleanser + Facewash.")} target="_blank" rel="noopener noreferrer">Still have a question? WhatsApp us</a></p>
          </section>
        </div>
      </main>
      <Footer />
      <div className="s-bar"><span><b>{money(SITE.price)}</b><small>Cleanser + Facewash</small></span><a className="s-btn sm" href="#order">Order now</a></div>
      <WhatsAppFab lift />
    </>
  );
}
