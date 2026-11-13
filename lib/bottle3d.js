// SWAN 3D bottle (Three.js). Loaded lazily by components/Bottle3D.js.
// Real-bottle look: translucent green gel + dark/yellow beads, clear glass, chrome band,
// clear collar ring, white pump with clear hook spout, label printed on the glass, hinged clear cap.
// World units: 1 unit = 100 px of the old SVG. Bottle spans y = -4.8 .. 4.74 (centered on 0).

import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export const CANVAS_W = 280;
export const CANVAS_H = 1000;

const TAU = Math.PI * 2;
const clamp = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n));
const lerp = (a, b, t) => a + (b - a) * t;
const rnd = (i, n) => {
  const x = Math.sin(i * 999 + n * 131) * 10000;
  return x - Math.floor(x);
};

/* closed rounded cylinder (lathe), centered on y = 0 */
function solid(r, h, cr, segs = 6) {
  const p = [new THREE.Vector2(0, -h / 2)];
  for (let i = 0; i <= segs; i++) {
    const a = -Math.PI / 2 + (i / segs) * (Math.PI / 2);
    p.push(new THREE.Vector2(r - cr + Math.cos(a) * cr, -h / 2 + cr + Math.sin(a) * cr));
  }
  for (let i = 0; i <= segs; i++) {
    const a = (i / segs) * (Math.PI / 2);
    p.push(new THREE.Vector2(r - cr + Math.cos(a) * cr, h / 2 - cr + Math.sin(a) * cr));
  }
  p.push(new THREE.Vector2(0, h / 2));
  return new THREE.LatheGeometry(p, 64);
}

/* ---------- label: real front + back artwork (public/images/label-front.png, label-back.png) ---------- */
const LABEL_R = 1.04; // sits just outside the glass (1.02)
const PX = 0.0033; // world units per label pixel (front 432x1534 px, back 450x1636 px)
const LABEL_CY = -1.95; // vertical centre of both panels
const PANELS = [
  { url: "/images/label-front.png", w: 432, h: 1534, center: 0 }, // faces the camera at start
  { url: "/images/label-back.png", w: 450, h: 1636, center: Math.PI }, // description, how to use, barcode
];

/* soft vertical window-reflection streak */
function streakTexture() {
  const c = document.createElement("canvas");
  c.width = 32;
  c.height = 256;
  const g = c.getContext("2d");
  const h = g.createLinearGradient(0, 0, 32, 0);
  h.addColorStop(0, "rgba(255,255,255,0)");
  h.addColorStop(0.5, "rgba(255,255,255,1)");
  h.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = h;
  g.fillRect(0, 0, 32, 256);
  g.globalCompositeOperation = "destination-in";
  const v = g.createLinearGradient(0, 0, 0, 256);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(0.12, "rgba(0,0,0,1)");
  v.addColorStop(0.85, "rgba(0,0,0,0.9)");
  v.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = v;
  g.fillRect(0, 0, 32, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function createBottle3D(container, { onReady } = {}) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch (e) {
    return null; // no WebGL: the SVG fallback stays
  }
  renderer.setPixelRatio(1); // the flyer is scaled down by CSS, so 1x is already crisp
  renderer.setSize(CANVAS_W, CANVAS_H, false);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  const canvas = renderer.domElement;
  canvas.className = "bottle3d-canvas";
  container.appendChild(canvas);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 1;

  // nearly orthographic camera, slightly above so the open cap is visible
  const camera = new THREE.PerspectiveCamera(12, CANVAS_W / CANVAS_H, 10, 120);
  camera.position.set(0, 5, 49.2);
  camera.lookAt(0, 0, 0);

  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(-4, 6, 8);
  const rim = new THREE.DirectionalLight(0xcfeaff, 1.4);
  rim.position.set(5, 2, -6);
  scene.add(key, rim, new THREE.HemisphereLight(0xffffff, 0xd8e8cc, 0.5));

  const bottle = new THREE.Group();
  scene.add(bottle);

  /* ---------- materials ---------- */
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, roughness: 0.04, metalness: 0, transparent: true, opacity: 0.16,
    clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 1.5, side: THREE.DoubleSide, depthWrite: false,
  });
  const gelMat = new THREE.MeshPhysicalMaterial({
    color: 0x38d01f, emissive: 0x137a0d, emissiveIntensity: 0.35, roughness: 0.18, metalness: 0,
    transparent: true, opacity: 0.66, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 1,
    side: THREE.DoubleSide, depthWrite: false,
  });
  const whiteMat = new THREE.MeshPhysicalMaterial({
    color: 0xf8f9f9, roughness: 0.32, metalness: 0, clearcoat: 0.7, clearcoatRoughness: 0.2, envMapIntensity: 1,
  });
  const clearMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, roughness: 0.06, transparent: true, opacity: 0.3, clearcoat: 1,
    envMapIntensity: 1.5, side: THREE.DoubleSide, depthWrite: false,
  });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe4e8ea, metalness: 1, roughness: 0.16, envMapIntensity: 1.7 });

  const add = (geo, mat, y = 0, order = 0, parent = bottle) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.y = y;
    m.renderOrder = order;
    parent.add(m);
    return m;
  };

  /* ---------- body ---------- */
  // gel (top at y 0.92) + beads, glass shell, thick clear base
  add(solid(0.96, 5.64, 0.26), gelMat, -1.9, 2);
  add(solid(1.02, 6.18, 0.3), glassMat, -1.71, 4);
  add(new THREE.CylinderGeometry(1.03, 1.03, 0.34, 64, 1, true), clearMat, -4.55, 4);

  // dip tube
  add(new THREE.CylinderGeometry(0.07, 0.07, 6.3, 20), new THREE.MeshPhysicalMaterial({
    color: 0xffffff, roughness: 0.1, transparent: true, opacity: 0.55, depthWrite: false,
  }), -1.4, 1);

  // beads (opaque, drawn before the gel so they show through it)
  const N = 460;
  const beads = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), new THREE.MeshStandardMaterial({ roughness: 0.45 }), N);
  const col = new THREE.Color();
  const bd = [];
  for (let i = 0; i < N; i++) {
    const dark = rnd(i, 4) > 0.3;
    const lower = rnd(i, 5) > 0.35;
    bd.push({
      rad: Math.sqrt(rnd(i, 1)) * 0.86,
      ang: rnd(i, 6) * TAU,
      y: lower ? -4.5 + rnd(i, 2) * 3.3 : -1.2 + rnd(i, 2) * 2.1,
      s: 0.022 + rnd(i, 3) * 0.04,
      ph: rnd(i, 7) * TAU,
    });
    beads.setColorAt(i, col.set(dark ? 0x174a12 : 0xe6e27a));
  }
  beads.instanceColor.needsUpdate = true;
  beads.renderOrder = 0;
  bottle.add(beads);
  const dummy = new THREE.Object3D();

  /* ---------- chrome band, collar, pump ---------- */
  add(new THREE.CylinderGeometry(0.97, 0.97, 0.32, 64), chromeMat, 1.47, 1);
  add(new THREE.CylinderGeometry(1.16, 1.16, 1.02, 64, 1, true), clearMat, 2.11, 4); // clear outer collar ring
  add(solid(0.9, 0.76, 0.12), whiteMat, 2.1, 1); // white inner collar
  add(new THREE.CylinderGeometry(0.14, 0.14, 1.2, 24), whiteMat, 2.5, 1); // static lower stem

  const head = new THREE.Group(); // pump head: moves down when pressed
  bottle.add(head);
  add(new THREE.CylinderGeometry(0.12, 0.12, 1.5, 24), whiteMat, 3.5, 1, head);
  add(solid(0.3, 0.52, 0.14), whiteMat, 4.48, 1, head);
  const spoutCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.2, 4.56, 0), new THREE.Vector3(-0.55, 4.6, 0), new THREE.Vector3(-0.86, 4.55, 0),
    new THREE.Vector3(-1.0, 4.38, 0), new THREE.Vector3(-1.0, 4.08, 0),
  ]);
  add(new THREE.TubeGeometry(spoutCurve, 28, 0.1, 14, false), clearMat, 0, 3, head);

  /* ---------- label printed on the glass: front panel + back panel ---------- */
  const loader = new THREE.TextureLoader();
  const labelTexes = [];
  const labelMats = [];
  PANELS.forEach((pn) => {
    const tex = loader.load(pn.url);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    labelTexes.push(tex);
    const mat = new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 0.55, depthWrite: false });
    labelMats.push(mat);
    const arc = (pn.w * PX) / LABEL_R;
    const geo = new THREE.CylinderGeometry(LABEL_R, LABEL_R, pn.h * PX, 72, 1, true, pn.center - arc / 2, arc);
    add(geo, mat, LABEL_CY, 3);
  });

  /* ---------- hinged clear cap ---------- */
  const cap = new THREE.Group();
  cap.position.set(0, 2.66, -1.45); // hinge sits behind the collar
  bottle.add(cap);
  const hood = [new THREE.Vector2(1.22, 0), new THREE.Vector2(1.22, 2.2)];
  for (let i = 1; i <= 8; i++) {
    const a = (i / 8) * (Math.PI / 2);
    hood.push(new THREE.Vector2(0.92 + Math.cos(a) * 0.3, 2.2 + Math.sin(a) * 0.3));
  }
  hood.push(new THREE.Vector2(0, 2.5));
  const capShell = new THREE.Mesh(new THREE.LatheGeometry(hood, 64), new THREE.MeshPhysicalMaterial({
    color: 0xffffff, roughness: 0.05, transparent: true, opacity: 0.26, clearcoat: 1,
    envMapIntensity: 1.6, side: THREE.DoubleSide, depthWrite: false,
  }));
  capShell.position.z = 1.45;
  capShell.renderOrder = 5;
  cap.add(capShell);
  const capBand = new THREE.Mesh(new THREE.CylinderGeometry(1.24, 1.24, 0.26, 64, 1, true), whiteMat);
  capBand.position.set(0, 0.13, 1.45);
  whiteMat.side = THREE.DoubleSide;
  cap.add(capBand);
  const arm = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.2, 0.34), whiteMat);
  arm.position.set(0, 0.1, 0.14);
  cap.add(arm);
  const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.7, 20), chromeMat);
  pin.rotation.z = Math.PI / 2;
  cap.add(pin);

  /* ---------- fixed window reflections (stay put while the bottle turns) ---------- */
  const streakTex = streakTexture();
  const streakMat = new THREE.MeshBasicMaterial({
    map: streakTex, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const s1 = new THREE.Mesh(new THREE.PlaneGeometry(0.17, 5.4), streakMat);
  s1.position.set(-0.58, -1.7, 1.3);
  const s2 = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 4.6), streakMat);
  s2.position.set(0.74, -1.9, 1.2);
  s1.renderOrder = s2.renderOrder = 8;
  scene.add(s1, s2);

  /* ---------- interaction state ---------- */
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const flyerEl = container.closest(".flyer");
  let hover = false, tapOpen = false, introOpen = false;
  let openX = 0, openV = 0; // cap spring (0 closed .. 1 open)
  let pressX = 0, pressTarget = 0, pressTimer = 0;
  let spin = 0, spinVel = 0, swirl = 0;
  let dragging = false, dragX = 0, introT = -1; // introT: 0..1 progress of the one-time full turn (shows the back label)
  let lastY = window.scrollY;

  const isVisible = () => {
    const o = flyerEl ? parseFloat(flyerEl.style.opacity) : 1;
    return Number.isNaN(o) ? true : o > 0.5;
  };
  const inside = (e) => {
    const r = container.getBoundingClientRect();
    return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
  };
  const onMove = (e) => {
    if (dragging) {
      spin += (e.clientX - dragX) * 0.012;
      dragX = e.clientX;
      return;
    }
    hover = e.pointerType === "mouse" && isVisible() && inside(e);
  };
  const onUp = () => (dragging = false);
  const onDown = (e) => {
    if (!isVisible() || !inside(e)) return;
    if (e.pointerType === "mouse") {
      dragging = true;
      dragX = e.clientX;
    }
    if (e.pointerType !== "mouse") {
      tapOpen = !tapOpen;
    } else if (openX > 0.7) {
      pressTarget = 1; // press the pump
      clearTimeout(pressTimer);
      pressTimer = setTimeout(() => (pressTarget = 0), 160);
    }
  };
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", onDown, { passive: true });
  window.addEventListener("pointerup", onUp, { passive: true });
  window.addEventListener("pointercancel", onUp, { passive: true });

  const timers = [];
  if (!reduce) {
    timers.push(setTimeout(() => (introOpen = true), 1400));
    timers.push(setTimeout(() => (introOpen = false), 3800));
    timers.push(setTimeout(() => (introT = 0), 4300)); // then one slow full turn: front, back, front
  }

  /* ---------- render loop ---------- */
  let raf = 0, last = performance.now(), t = 0, first = true;
  const frame = (now) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    t += dt;

    const sy = window.scrollY;
    const dy = clamp(sy - lastY, -40, 40);
    lastY = sy;
    if (!isVisible() && !first) return;

    // scroll spins the bottle, then it settles back to face the front
    if (!reduce) {
      spinVel = (spinVel + dy * 0.0002) * 0.92;
      spin += spinVel;
      if (!dragging && Math.abs(spinVel) < 0.012) spin += (Math.round(spin / TAU) * TAU - spin) * 0.05;
      swirl += 0.004 + Math.abs(spinVel) * 1.6;
    }
    const sway = reduce ? 0 : Math.sin(t * 0.7) * 0.26;
    let turn = 0;
    if (introT >= 0 && introT < 1) {
      introT = Math.min(1, introT + dt / 3.2);
      turn = TAU * (introT * introT * (3 - 2 * introT));
    }
    bottle.rotation.y = spin + sway + turn;
    // label looks dimmer when it is on the far side of the glass
    // each panel fades slightly when it turns away from the camera
    labelMats.forEach((m, i) => {
      const c = Math.cos(bottle.rotation.y + PANELS[i].center);
      m.opacity = 0.35 + 0.65 * clamp((c + 0.25) / 1.1);
    });

    // cap hinge spring, with a small bounce
    const want = hover || tapOpen || introOpen ? 1 : 0;
    openV = (openV + (want - openX) * 0.06) * 0.78;
    openX += openV;
    cap.rotation.x = -openX * 1.95;

    // pump press
    pressX += (pressTarget - pressX) * 0.35;
    head.position.y = -pressX * 0.3;

    // beads drift, faster while scrolling
    for (let i = 0; i < N; i++) {
      const b = bd[i];
      const a = b.ang + swirl * (0.5 + b.rad);
      dummy.position.set(Math.cos(a) * b.rad, b.y + Math.sin(t * 0.5 + b.ph) * 0.05, Math.sin(a) * b.rad);
      dummy.scale.setScalar(b.s);
      dummy.updateMatrix();
      beads.setMatrixAt(i, dummy.matrix);
    }
    beads.instanceMatrix.needsUpdate = true;

    renderer.render(scene, camera);
    if (first) {
      first = false;
      onReady && onReady();
    }
  };
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    timers.forEach(clearTimeout);
    clearTimeout(pressTimer);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerdown", onDown);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("pointercancel", onUp);
    scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
    });
    labelTexes.forEach((t) => t.dispose());
    streakTex.dispose();
    envTex.dispose();
    pmrem.dispose();
    renderer.dispose();
    if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
  };
}
