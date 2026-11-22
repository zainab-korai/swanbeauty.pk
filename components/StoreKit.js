"use client";

// Shared pieces for the storefront (header, footer, icons, small helpers).
import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import { SITE } from "../lib/config";
import Script from "next/script";
import { money, waLink, INSTAGRAM, INSTAGRAM_NAME } from "./ui";
import "../app/store.css";

/* ---- fade-in on scroll (one observer for the whole page) ---- */
export function RevealInit() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.in)");
    if (typeof IntersectionObserver === "undefined") { els.forEach((el) => el.classList.add("in")); return; }
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.08, rootMargin: "0px 0px -4% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}

/* ---- video that only plays while visible. focus = which part of the picture stays in the frame ---- */
export function LazyVideo({ src, focus = "40% 50%" }) {
  const ref = useRef(null);
  useEffect(() => {
    const v = ref.current;
    if (!v || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }, { threshold: 0.25 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return <video ref={ref} src={src} muted loop playsInline preload="metadata" style={{ objectPosition: focus }} />;
}

/* ---- header ---- */
export function Header({ active }) {
  const [open, setOpen] = useState(false);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);
  const links = [
    ["/face-wash", "Face Wash", "face"],
    ["/shop", "Shop", "shop", "Soon"],
    ["/track", "Track order", "track"],
  ];
  return (
    <>
      <MetaPixel />
      <div className="s-ann">Cash on Delivery · Delivery across Pakistan</div>
      <header className="s-head">
        <div className="s-wrap s-head-in">
          <button className="s-burger" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}><i /><i /><i /></button>
          <a href="/" className="s-logo" aria-label="SWAN Beauty Essence home"><Logo variant="brown" height={46} /></a>
          <nav className="s-nav" aria-label="Main">
            {links.map(([h, t, k, tag]) => (
              <a key={h} href={h} className={active === k ? "on" : ""}>{t}{tag && <small>{tag}</small>}</a>
            ))}
          </nav>
          <a href="/face-wash#order" className="s-btn sm s-head-cta">Order now</a>
        </div>
      </header>
      {open && (
        <div className="s-drawer" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="s-drawer-bg" onClick={() => setOpen(false)} />
          <div className="s-drawer-panel">
            <button className="s-x" aria-label="Close menu" onClick={() => setOpen(false)}>✕</button>
            <Logo variant="brown" height={52} />
            <a href="/" onClick={() => setOpen(false)}>Home</a>
            {links.map(([h, t, , tag]) => <a key={h} href={h} onClick={() => setOpen(false)}>{t}{tag && <small>{tag}</small>}</a>)}
            <a href={waLink("Hi SWAN!")} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>Chat on WhatsApp</a>
            <a href="/face-wash#order" className="s-btn block" onClick={() => setOpen(false)}>Order now · {money(SITE.price)}</a>
          </div>
        </div>
      )}
    </>
  );
}

/* ---- floating WhatsApp + footer ---- */
export function WhatsAppFab({ lift }) {
  return (
    <a className={`s-wa ${lift ? "lift" : ""}`} href={waLink("Hi SWAN, I have a question.")} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
      <svg viewBox="0 0 24 24" width="26" height="26" fill="#fff" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 1.8a8.2 8.2 0 1 1-4.2 15.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0 1 12 3.8z" />
        <path d="M8.6 7.4c-.3.3-.6 1-.3 1.9.6 1.7 2.5 3.7 4.6 4.6.9.4 1.6.3 1.9 0l.8-.9c.2-.3.2-.6-.1-.8l-1.4-.9c-.2-.1-.5-.1-.7.1l-.5.5c-.9-.4-1.8-1.3-2.2-2.2l.5-.5c.2-.2.2-.5.1-.7l-.8-1.5c-.2-.3-.6-.3-.9-.1z" />
      </svg>
    </a>
  );
}

export function Footer() {
  return (
    <footer className="s-foot">
      <div className="s-wrap s-foot-grid">
        <div className="s-foot-brand">
          <Logo variant="cream" height={72} />
          <p>Grace on the surface. Care underneath.</p>
        </div>
        <div>
          <h5>Shop</h5>
          <a href="/face-wash">Face Wash</a>
          <a href="/shop">All products <small>Soon</small></a>
        </div>
        <div>
          <h5>Help</h5>
          <a href="/track">Track your order</a>
          <a href={waLink("Hi SWAN!")} target="_blank" rel="noopener noreferrer">WhatsApp us</a>
        </div>
        <div>
          <h5>Delivery</h5>
          <p>All across Pakistan.</p>
          <p>Cash on Delivery or Advance Payment.</p>
        </div>
      </div>
      <p className="s-copy">© {new Date().getFullYear()} SWAN Beauty Essence. All rights reserved.</p>
    </footer>
  );
}

/* ---- Meta (Facebook) Pixel: only loads when NEXT_PUBLIC_META_PIXEL_ID is set in Vercel ---- */
export function MetaPixel() {
  const id = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  if (!id) return null;
  return (
    <Script id="meta-pixel" strategy="afterInteractive">{`
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${id.replace(/[^0-9]/g, "")}');fbq('track','PageView');`}</Script>
  );
}

/* ---- customer feedback screenshots: public/images/review1.jpeg + review2.jpeg (.jpg / .png also work) ---- */
const EXTS = ["jpeg", "jpg", "png", "JPEG", "JPG", "webp"];
function ReviewImg({ name, alt }) {
  const [k, setK] = useState(0);
  const [gone, setGone] = useState(false);
  if (gone) return null;
  const src = `/images/${name}.${EXTS[k]}`;
  return (
    <a href={src} target="_blank" rel="noopener noreferrer" className="s-rv">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => (k + 1 < EXTS.length ? setK(k + 1) : setGone(true))} />
    </a>
  );
}
export function Reviews({ title = "Customer feedback" }) {
  return (
    <section className="s-sec tint">
      <div className="s-wrap">
        <h2 className="s-title reveal">{title}</h2>
        <p className="s-sub s-center-sub reveal">Real messages from our customers.</p>
        <div className="s-rvs reveal">
          <ReviewImg name="review1" alt="Customer feedback 1" />
          <ReviewImg name="review2" alt="Customer feedback 2" />
        </div>
        <p className="s-center reveal">
          <a className="s-btn ghost" href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Check our Instagram {INSTAGRAM_NAME}</a>
        </p>
      </div>
    </section>
  );
}
