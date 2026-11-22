// Plain helpers + icons (no "use client", so server pages can use them too).
import { SITE } from "../lib/config";

export const money = (n) => "Rs. " + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// Instagram page of SWAN (change here if the handle is different)
export const INSTAGRAM = "https://www.instagram.com/swanbeauty.pk/";
export const INSTAGRAM_NAME = "@swanbeauty.pk";
export const waLink = (text) => `https://wa.me/${SITE.phoneIntl}?text=${encodeURIComponent(text)}`;

const I = ({ d, extra }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />{extra}
  </svg>
);
export const ICONS = {
  cash: <I d="M3 7h18v10H3z" extra={<><circle cx="12" cy="12" r="2.6" /><path d="M6.5 10v4M17.5 10v4" /></>} />,
  truck: <I d="M3 7h11v9H3z" extra={<><path d="M14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="1.7" /><circle cx="17" cy="18" r="1.7" /></>} />,
  pin: <I d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z" extra={<circle cx="12" cy="10" r="2.5" />} />,
  shield: <I d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z" extra={<path d="M9 12l2 2 4-4" />} />,
  pores: <I d="M12 3a9 9 0 100 18 9 9 0 000-18z" extra={<><circle cx="9" cy="10" r="1.3" /><circle cx="15" cy="9" r="1.3" /><circle cx="12" cy="14.5" r="1.3" /></>} />,
  drop: <I d="M12 3c3 4 6 7 6 11a6 6 0 01-12 0c0-4 3-7 6-11z" />,
  spark: <I d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" extra={<path d="M19 17v4M17 19h4" />} />,
  bag: <I d="M5 8h14l-1 12H6z" extra={<path d="M9 8a3 3 0 016 0" />} />,
  lock: <I d="M6 11h12v9H6z" extra={<path d="M8.5 11V8a3.5 3.5 0 017 0v3" />} />,
  arrow: <I d="M5 12h14M13 6l6 6-6 6" />,
};

