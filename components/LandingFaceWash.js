"use client";

// Landing page for Meta (Facebook / Instagram) ads: one product, one goal, order on the same page.
import Logo from "./Logo";
import OrderForm from "./OrderForm";
import { RevealInit, LazyVideo, Reviews, MetaPixel, WhatsAppFab } from "./StoreKit";
import { ICONS, money, waLink } from "./ui";
import { SITE } from "../lib/config";

const why = [
  ["pores", "Deep cleans pores", "Salicylic Acid clears dirt and oil from within."],
  ["spark", "Anti-Acne Beads", "Gentle beads that burst with Vitamin D as you massage."],
  ["drop", "Smooth, fresh skin", "Glycolic Acid helps remove dead skin cells."],
];
const steps = [["Wet", "Splash your face with lukewarm water."], ["Massage", "Gently massage a small amount on damp skin."], ["Rinse", "Rinse well. Use 4–5 times a week."]];
const faq = [
  ["Is it for all skin types?", "Yes. It is dermatologically tested and pH-balanced. We still suggest a patch test before first use."],
  ["How do I pay?", "Choose Cash on Delivery and pay when the parcel arrives, or choose Advance Payment and we share the payment details on WhatsApp."],
  ["How long does delivery take?", "We send your order by courier across Pakistan. After dispatch you get a courier tracking ID."],
  ["How do I track my order?", "You get an Order ID after ordering. Enter it on the Track order page."],
];

export default function Landing() {
  return (
    <>
      <MetaPixel />
      <RevealInit />
      <header className="lp-head">
        <div className="s-wrap">
          <a href="/" aria-label="SWAN Beauty Essence"><Logo variant="brown" height={42} /></a>
          <a href="#order" className="s-btn sm">Order now</a>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="lp-hero">
          <div className="s-wrap lp-hero-in">
            <div>
              <span className="s-pill">Anti-Acne Beads Face Wash</span>
              <h1>Clearer-looking skin in <em>one easy step.</em></h1>
              <p className="lead">SWAN Cleanser + Facewash deep cleans pores, removes excess oil and helps prevent acne.</p>
              <ul className="lp-checks">
                <li>Cash on Delivery all across Pakistan</li>
                <li>Dermatologically tested · pH-balanced</li>
                <li>150 ml · 2-in-1 cleanser + face wash</li>
              </ul>
              <a className="s-btn block" href="#order">Order now · Pay on delivery</a>
            </div>
            <div className="s-hero-art">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/product-real-2.png" alt="SWAN Cleanser + Facewash bottle" width="900" height="1100" fetchPriority="high" decoding="async" />
            </div>
          </div>
        </section>

        {/* OFFER + ORDER (the customer orders right here) */}
        <section id="order" className="lp-offer">
          <div className="s-wrap">
            <div className="lp-offer-card">
              <h2>Cleanser + Facewash</h2>
              <div className="s-price-line"><b>{money(SITE.price)}</b><span>150 ml</span></div>
              <ul>
                <li>Delivery {money(SITE.deliveryCOD)} (Cash on Delivery)</li>
                <li>Delivered all across Pakistan</li>
              </ul>
            </div>
            <OrderForm />
          </div>
        </section>

        {/* WHY */}
        <section className="s-sec">
          <div className="s-wrap">
            <h2 className="s-title reveal">Why you will love it</h2>
            <div className="s-why">
              {why.map(([ic, t, d]) => <div key={t} className="s-why-i reveal"><span>{ICONS[ic]}</span><h3>{t}</h3><p>{d}</p></div>)}
            </div>
          </div>
        </section>

        <Reviews />

        {/* HOW TO USE */}
        <section className="s-sec">
          <div className="s-wrap s-how">
            <div className="s-how-video reveal"><LazyVideo src="/videos/ritual.mp4" /></div>
            <div className="s-how-copy">
              <h2 className="s-title left reveal">Easy as 1, 2, 3</h2>
              <ol className="s-steps">
                {steps.map(([t, d], i) => <li key={t} className="reveal"><span>{i + 1}</span><div><b>{t}</b><p>{d}</p></div></li>)}
              </ol>
              <p className="s-fine reveal">For external use only. Avoid the eyes. Patch test before first use.</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="s-sec tint">
          <div className="s-wrap narrow">
            <h2 className="s-title reveal">Quick answers</h2>
            <div className="s-faq reveal">{faq.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
            <p className="s-center"><a className="s-btn ghost sm" href={waLink("Hi SWAN, I have a question about the Cleanser + Facewash.")} target="_blank" rel="noopener noreferrer">Questions? WhatsApp us</a></p>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="s-band">
          <div className="s-wrap">
            <h2>Ready for a cleaner face?</h2>
            <p>Order in a minute. Pay when it arrives.</p>
            <a className="s-btn light" href="#order">Order now · {money(SITE.price)}</a>
          </div>
        </section>
      </main>

      <footer className="s-foot" style={{ paddingTop: "1.6rem" }}>
        <p className="s-copy" style={{ marginTop: 0 }}>© {new Date().getFullYear()} SWAN Beauty Essence · <a href="/" style={{ display: "inline" }}>Visit our store</a> · <a href="/track" style={{ display: "inline" }}>Track order</a></p>
      </footer>

      <div className="s-bar"><span><b>{money(SITE.price)}</b><small>Cash on Delivery</small></span><a className="s-btn sm" href="#order">Order now</a></div>
      <WhatsAppFab lift />
    </>
  );
}
