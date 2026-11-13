// SWAN Cleanser + Facewash: SVG bottle drawn from the real product video.
// Clear bottle, green gel with dark Anti-Acne Beads, white pump, label printed on the glass.
// viewBox is 240 x 1000 (ratio 0.24). Logo print uses /public/images/logo-dark.png.

const rnd = (i, n) => {
  const x = Math.sin(i * 999 + n * 131) * 10000;
  return x - Math.floor(x);
};
const f = (n) => Math.round(n * 100) / 100; // rounded: server and browser output stay identical

const beads = Array.from({ length: 120 }, (_, i) => {
  const lower = rnd(i, 5) > 0.35; // more beads toward the bottom, like the real bottle
  return {
    x: f(30 + rnd(i, 1) * 180),
    y: f(lower ? 640 + rnd(i, 2) * 330 : 430 + rnd(i, 2) * 220),
    r: f(1.4 + rnd(i, 3) * 2.8),
    dark: rnd(i, 4) > 0.28,
  };
});

export function SwanMark({ size = 60, color = "#8A5A2B" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <path d="M40 12 L44 6 L50 12 L56 6 L60 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="40" cy="11" r="1.6" fill={color} />
      <circle cx="50" cy="10" r="1.6" fill={color} />
      <circle cx="60" cy="11" r="1.6" fill={color} />
      <path d="M62 30 C62 18 38 18 38 32 C38 46 66 50 66 66 C66 80 44 86 28 80" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <path d="M62 30 L72 33 L64 37" fill={color} stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 46 C28 56 44 56 56 54" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <path d="M16 58 C30 66 44 64 54 62" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M22 70 C34 76 44 72 50 70" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function Bottle({ className = "" }) {
  const ink = "#1c2a1e";
  return (
    <svg className={`bottle ${className}`} viewBox="0 0 240 1000" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="SWAN Cleanser plus Facewash, 150 ml">
      <defs>
        <linearGradient id="bGel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a9dc78" />
          <stop offset="0.12" stopColor="#5cc43f" />
          <stop offset="0.6" stopColor="#4fbf33" />
          <stop offset="1" stopColor="#7fd245" />
        </linearGradient>
        <linearGradient id="bShade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.28" />
          <stop offset="0.18" stopColor="#fff" stopOpacity="0.12" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.9" stopColor="#000" stopOpacity="0.22" />
          <stop offset="1" stopColor="#000" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="bChrome" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7d8387" />
          <stop offset="0.25" stopColor="#f4f6f7" />
          <stop offset="0.5" stopColor="#b9bec2" />
          <stop offset="0.78" stopColor="#ffffff" />
          <stop offset="1" stopColor="#80868a" />
        </linearGradient>
        <linearGradient id="bWhite" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#d9dcde" />
          <stop offset="0.3" stopColor="#ffffff" />
          <stop offset="0.75" stopColor="#f1f2f3" />
          <stop offset="1" stopColor="#c9cdd0" />
        </linearGradient>
        <clipPath id="bBody">
          <rect x="18" y="362" width="204" height="618" rx="30" />
        </clipPath>
      </defs>

      {/* pump: stem + actuator + clear spout */}
      <rect x="107" y="70" width="26" height="190" fill="url(#bWhite)" />
      <rect x="92" y="26" width="56" height="52" rx="14" fill="url(#bWhite)" stroke="#d3d7da" />
      <path d="M96 40 H50 Q20 40 20 70 V92 H48 V72 Q48 66 54 66 H96Z" fill="#ffffff" fillOpacity="0.55" stroke="#cfd5d9" />
      <rect x="20" y="82" width="28" height="12" rx="3" fill="#fff" />

      {/* collar: clear outer ring + white inner */}
      <rect x="4" y="238" width="232" height="102" rx="12" fill="#fff" fillOpacity="0.28" stroke="#cdd4d8" />
      <rect x="30" y="252" width="180" height="76" rx="10" fill="url(#bWhite)" stroke="#d6d9db" />
      <rect x="24" y="338" width="192" height="30" rx="4" fill="url(#bChrome)" />

      {/* body */}
      <rect x="18" y="362" width="204" height="618" rx="30" fill="#e4f2dc" />
      <g clipPath="url(#bBody)">
        <rect x="18" y="408" width="204" height="580" fill="url(#bGel)" />
        <rect x="18" y="362" width="204" height="52" fill="#d8efc8" opacity="0.8" />
        {beads.map((b, i) => (
          <circle key={i} cx={b.x} cy={b.y} r={b.r} fill={b.dark ? "#1d5a17" : "#e3f58a"} opacity={b.dark ? 0.7 : 0.85} />
        ))}
        <rect x="18" y="362" width="204" height="618" fill="url(#bShade)" />
        <rect x="36" y="380" width="13" height="560" rx="6.5" fill="#fff" opacity="0.3" />
        <rect x="196" y="400" width="5" height="500" rx="2.5" fill="#fff" opacity="0.16" />
      </g>
      <rect x="18" y="362" width="204" height="618" rx="30" fill="none" stroke="#fff" strokeOpacity="0.35" />

      {/* label printed on glass */}
      <image href="/images/logo-dark.png" x="42" y="470" width="156" height="101" opacity="0.9" />
      <text x="120" y="630" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="31" fill={ink} opacity="0.9">Cleanser +</text>
      <text x="120" y="668" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="31" fill={ink} opacity="0.9">Face wash</text>
      <rect x="46" y="684" width="148" height="28" rx="14" fill="none" stroke={ink} strokeOpacity="0.8" strokeWidth="1.4" />
      <text x="120" y="703" textAnchor="middle" fontFamily="Georgia, serif" fontSize="14.5" fill={ink} opacity="0.9">Anti-Acne Beads</text>
      <text x="120" y="738" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="13.5" fill={ink} opacity="0.88">2-in-1 Formula</text>
      <g fontFamily="Arial, sans-serif" fontSize="11" fill={ink} opacity="0.85">
        <text x="52" y="764">Vitamin D</text>
        <text x="52" y="780">Salicylic Acid</text>
        <text x="52" y="796">Glycolic Acid</text>
      </g>
      <g fontFamily="Arial, sans-serif" fontSize="8.2" fill={ink} opacity="0.82">
        <text x="58" y="822">Deep Cleanses</text>
        <text x="58" y="833">&amp; Unclogs Pores</text>
        <text x="58" y="852">Removes Excess Oil</text>
        <text x="58" y="863">&amp; Helps Prevent Acne</text>
        <text x="58" y="882">With Vitamin D,</text>
        <text x="58" y="893">Salicylic Acid &amp; Glycolic Acid</text>
      </g>
      <g fontFamily="Georgia, serif" fontStyle="italic" fontSize="14" fill={ink} opacity="0.88">
        <text x="48" y="925">Clear Skin,</text>
        <text x="48" y="942">Confident You</text>
      </g>
      <text x="196" y="965" textAnchor="end" fontFamily="Arial, sans-serif" fontSize="6.6" fill={ink} opacity="0.8">For All Skin Types · 150 mL</text>
    </svg>
  );
}
