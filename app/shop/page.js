import { Header, Footer, WhatsAppFab, RevealInit } from "../../components/StoreKit";
import { ICONS, waLink } from "../../components/ui";

export const metadata = {
  title: "Shop | SWAN Beauty Essence",
  description: "The SWAN shop is coming soon. For now, shop our Cleanser + Facewash.",
};

export default function Shop() {
  return (
    <>
      <Header active="shop" />
      <RevealInit />
      <main>
        <section className="s-hero soft">
          <div className="s-wrap s-soon">
            <span className="s-pill">Coming soon</span>
            <h1>The SWAN <em>Shop</em></h1>
            <p>We are getting more SWAN essentials ready. Categories and products will appear right here.</p>
            <div className="s-cta center">
              <a className="s-btn" href="/face-wash">Shop Face Wash</a>
              <a className="s-btn ghost" href={waLink("Hi SWAN! Please tell me when the shop opens.")} target="_blank" rel="noopener noreferrer">Tell me when it opens</a>
            </div>
          </div>
        </section>
        <section className="s-sec">
          <div className="s-wrap">
            <h2 className="s-title">Categories</h2>
            <div className="s-cats">
              <a href="/face-wash" className="s-cat reveal">
                <div className="s-cat-img">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/images/product-real-2.png" alt="" loading="lazy" decoding="async" /></div>
                <div className="s-cat-body"><h3>Face Wash</h3><p>Available now</p><span className="s-link">Shop now {ICONS.arrow}</span></div>
              </a>
              <div className="s-cat soon reveal" aria-disabled="true">
                <div className="s-cat-img soon-img"><span>{ICONS.lock}</span></div>
                <div className="s-cat-body"><span className="s-pill soft">Coming soon</span><h3>More categories</h3><p>New categories will be added here.</p></div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
