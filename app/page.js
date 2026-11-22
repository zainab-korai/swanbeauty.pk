// Home: a simple storefront. Two categories: Face Wash (live) and Shop (coming soon).
import { Header, Footer, WhatsAppFab, RevealInit, LazyVideo, Reviews } from "../components/StoreKit";
import { ICONS, money } from "../components/ui";
import { SITE } from "../lib/config";

const trust = [
  ["cash", "Cash on Delivery", "Pay when it arrives"],
  ["truck", "All Pakistan", "Courier to your door"],
  ["shield", "Dermatologically tested", "pH-balanced"],
  ["pin", "Track your order", "With your Order ID"],
];

const why = [
  ["pores", "Deep cleans pores", "Salicylic Acid clears dirt and oil from within."],
  ["spark", "Anti-Acne Beads", "Gentle beads that burst with Vitamin D as you massage."],
  ["drop", "Smooth, fresh skin", "Glycolic Acid helps remove dead skin cells."],
];

const steps = [
  ["Wet", "Splash your face with lukewarm water."],
  ["Massage", "Gently massage a small amount on damp skin."],
  ["Rinse", "Rinse well. Use 4–5 times a week."],
];

const faq = [
  ["Is it for all skin types?", "Yes. It is dermatologically tested and pH-balanced. We still suggest a patch test before first use."],
  ["How do I order?", "Open Face Wash, fill in the short form and choose Cash on Delivery or Advance Payment. That's it."],
  ["How do I track my order?", "You get an Order ID after ordering. Open Track order and enter it to see your status and courier tracking ID."],
  ["Do you deliver outside Pakistan?", "Not yet. We deliver within Pakistan only."],
];

export default function Home() {
  return (
    <>
      <Header />
      <RevealInit />
      <main>
        {/* HERO */}
        <section className="s-hero">
          <div className="s-wrap s-hero-in">
            <div className="s-hero-copy">
              <span className="s-pill">New launch</span>
              <h1>Clear skin starts with a <em>clean face.</em></h1>
              <p>SWAN Cleanser + Facewash with Anti-Acne Beads. One bottle, one easy step.</p>
              <p className="s-meta">150 ml · 2-in-1 · Anti-Acne Beads</p>
              <div className="s-cta">
                <a className="s-btn" href="/face-wash#order">Order now</a>
                <a className="s-btn ghost" href="/face-wash">See details</a>
              </div>
            </div>
            <div className="s-hero-art">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/product-real-2.png" alt="SWAN Cleanser + Facewash bottle" width="900" height="1100" fetchPriority="high" decoding="async" />
            </div>
          </div>
        </section>

        {/* TRUST */}
        <div className="s-wrap">
          <ul className="s-trust">
            {trust.map(([ic, t, d]) => <li key={t}><span>{ICONS[ic]}</span><div><b>{t}</b><small>{d}</small></div></li>)}
          </ul>
        </div>

        {/* CATEGORIES */}
        <section className="s-sec">
          <div className="s-wrap">
            <h2 className="s-title reveal">Shop by category</h2>
            <div className="s-cats">
              <a href="/face-wash" className="s-cat reveal">
                <div className="s-cat-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/product-real-2.png" alt="" loading="lazy" decoding="async" />
                </div>
                <div className="s-cat-body">
                  <h3>Face Wash</h3>
                  <p>Cleanser + Facewash</p>
                  <span className="s-link">Shop now {ICONS.arrow}</span>
                </div>
              </a>
              <a href="/shop" className="s-cat soon reveal">
                <div className="s-cat-img soon-img"><span>{ICONS.bag}</span></div>
                <div className="s-cat-body">
                  <span className="s-pill soft">Coming soon</span>
                  <h3>Shop</h3>
                  <p>More SWAN essentials are on the way.</p>
                  <span className="s-link">Learn more {ICONS.arrow}</span>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* FEATURED PRODUCT */}
        <section className="s-sec tint">
          <div className="s-wrap">
            <h2 className="s-title reveal">Our first essential</h2>
            <article className="s-feat reveal">
              <a href="/face-wash" className="s-feat-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/hero-image.png" alt="SWAN Cleanser + Facewash" loading="lazy" decoding="async" />
              </a>
              <div className="s-feat-body">
                <h3>Cleanser + Facewash</h3>
                <p className="s-sub">Anti-Acne Beads · 2-in-1 Formula · 150 ml</p>
                <div className="s-price-line"><b>{money(SITE.price)}</b><span>+ delivery {money(SITE.deliveryCOD)} (COD)</span></div>
                <ul className="s-ticks">
                  <li>Deep cleanses and unclogs pores</li>
                  <li>Removes excess oil</li>
                  <li>Helps prevent acne</li>
                </ul>
                <div className="s-cta">
                  <a className="s-btn" href="/face-wash#order">Order now</a>
                  <a className="s-btn ghost" href="/face-wash">View product</a>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* WHY */}
        <section className="s-sec">
          <div className="s-wrap">
            <h2 className="s-title reveal">Why you will love it</h2>
            <div className="s-why">
              {why.map(([ic, t, d]) => (
                <div key={t} className="s-why-i reveal"><span>{ICONS[ic]}</span><h3>{t}</h3><p>{d}</p></div>
              ))}
            </div>
          </div>
        </section>

        <Reviews />

        {/* HOW TO USE */}
        <section className="s-sec tint">
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
        <section className="s-sec">
          <div className="s-wrap narrow">
            <h2 className="s-title reveal">Quick answers</h2>
            <div className="s-faq reveal">
              {faq.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="s-band">
          <div className="s-wrap">
            <h2>Ready for clearer-looking skin?</h2>
            <p>Order in a minute. Pay when it arrives.</p>
            <a className="s-btn light" href="/face-wash#order">Order now · {money(SITE.price)}</a>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
