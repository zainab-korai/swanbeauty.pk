// Flying bottle engine (plain DOM, no React).
//
// One fixed "flyer" element glides between "slots" while you scroll.
// A slot is any element with  data-flyer-slot  (empty div that reserves space in a section).
//   data-rot="-6"        base rotation in degrees
//   data-sweep="-10,10"  extra rotation across the slot's parent section (needs data-flyer-section on the section)
//
// The bottle lands exactly in each slot (position, size, rotation) and flies to the next one as you scroll.
// If two slots are very far apart, the bottle fades out in the middle so it never covers text.

const clamp = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n));
const smooth = (t) => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;

export function startFlight(flyer, { baseW = 120, baseH = 500, selector = "[data-flyer-slot]", ease = 0.2 } = {}) {
  let raf = 0;
  let slots = null;
  let slotsAt = 0;
  let cur = null;
  let target = null;

  const measure = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return null; // hidden on this breakpoint
    const sec = el.closest("[data-flyer-section]");
    let p = 0.5;
    if (sec) {
      const sr = sec.getBoundingClientRect();
      const span = sr.height - window.innerHeight;
      p = span > 0 ? clamp(-sr.top / span) : 0.5;
    }
    const [a, b] = (el.dataset.sweep || "0,0").split(",").map(Number);
    return {
      cx: r.left + r.width / 2,
      cy: r.top + r.height / 2,
      s: r.height / baseH,
      rot: (parseFloat(el.dataset.rot) || 0) + lerp(a || 0, b || 0, p),
    };
  };

  const computeTarget = () => {
    const vh = window.innerHeight;
    const now = performance.now();
    if (!slots || now - slotsAt > 1500) { slots = Array.from(document.querySelectorAll(selector)); slotsAt = now; }
    const ms = slots.map(measure).filter(Boolean);
    if (!ms.length) return null;
    let prev = null;
    let next = null;
    for (const m of ms) {
      m.d = m.cy - vh / 2;
      if (m.d <= 0) prev = m;
      else if (!next) next = m;
    }
    if (!prev) return { ...next, o: 1 };
    if (!next) return { ...prev, o: 1 };
    const gap = next.d - prev.d;
    const t = smooth(clamp(-prev.d / gap));
    let o = 1;
    if (gap > vh * 1.6) {
      const dist = Math.min(-prev.d, next.d);
      o = 1 - smooth(clamp((dist - vh * 0.5) / (vh * 0.4)));
    }
    return {
      cx: lerp(prev.cx, next.cx, t),
      cy: lerp(prev.cy, next.cy, t),
      s: lerp(prev.s, next.s, t) * lerp(0.85, 1, o),
      rot: lerp(prev.rot, next.rot, t),
      o,
    };
  };

  const apply = (v) => {
    flyer.style.transform = `translate3d(${(v.cx - baseW / 2).toFixed(1)}px, ${(v.cy - baseH / 2).toFixed(1)}px, 0) rotate(${v.rot.toFixed(2)}deg) scale(${v.s.toFixed(4)})`;
    flyer.style.opacity = v.o.toFixed(3);
  };

  const tick = () => {
    raf = 0;
    if (!target) return;
    if (!cur) cur = { ...target };
    let settled = true;
    for (const k of ["cx", "cy", "s", "rot", "o"]) {
      const diff = target[k] - cur[k];
      const eps = k === "s" || k === "o" ? 0.001 : 0.15;
      if (Math.abs(diff) > eps) {
        cur[k] += diff * ease;
        settled = false;
      } else cur[k] = target[k];
    }
    apply(cur);
    flyer.dataset.ready = "1";
    if (!settled) raf = requestAnimationFrame(tick);
  };

  const update = () => {
    target = computeTarget();
    if (!raf) raf = requestAnimationFrame(tick);
  };

  const snap = () => {
    cur = null;
    update();
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", snap);
  window.addEventListener("load", snap);
  const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
  ro && ro.observe(document.body);

  return () => {
    window.removeEventListener("scroll", update);
    window.removeEventListener("resize", snap);
    window.removeEventListener("load", snap);
    ro && ro.disconnect();
    cancelAnimationFrame(raf);
  };
}
