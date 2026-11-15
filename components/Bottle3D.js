"use client";
// Real 3D bottle (Three.js). The old SVG bottle shows until WebGL is ready (and stays if WebGL is missing).
// Three.js only starts after the page has finished loading and the browser is idle, so the first paint is fast.
import { useEffect, useRef, useState } from "react";
import Bottle from "./Bottle";

export default function Bottle3D() {
  const mount = useRef(null);
  const [ready, setReady] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let dead = false;
    let dispose = null;
    let timer = 0;
    const start = () => {
      import("../lib/bottle3d")
        .then((m) => {
          if (dead || !mount.current) return;
          dispose = m.createBottle3D(mount.current, { onReady: () => !dead && setReady(true) });
        })
        .catch(() => {});
    };
    const later = () => {
      if ("requestIdleCallback" in window) timer = window.requestIdleCallback(start, { timeout: 2500 });
      else timer = setTimeout(start, 800);
    };
    if (document.readyState === "complete") later();
    else window.addEventListener("load", later, { once: true });
    return () => {
      dead = true;
      window.removeEventListener("load", later);
      if ("cancelIdleCallback" in window) window.cancelIdleCallback(timer);
      clearTimeout(timer);
      if (dispose) dispose();
    };
  }, []);

  // once the 3D bottle has faded in, drop the SVG fallback from the page completely
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => setGone(true), 900);
    return () => clearTimeout(t);
  }, [ready]);

  return (
    <>
      {!gone && (
        <div className="bottle-fallback" style={{ opacity: ready ? 0 : 1 }}>
          <Bottle />
        </div>
      )}
      <div ref={mount} className="bottle3d" style={{ opacity: ready ? 1 : 0 }} />
    </>
  );
}
