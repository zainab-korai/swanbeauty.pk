"use client";
// Real 3D bottle (Three.js). The old SVG bottle stays visible until WebGL is ready,
// and stays as the fallback if WebGL is not available.
import { useEffect, useRef, useState } from "react";
import Bottle from "./Bottle";

export default function Bottle3D() {
  const mount = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let dead = false;
    let dispose = null;
    import("../lib/bottle3d")
      .then((m) => {
        if (dead || !mount.current) return;
        dispose = m.createBottle3D(mount.current, { onReady: () => !dead && setReady(true) });
      })
      .catch(() => {});
    return () => {
      dead = true;
      if (dispose) dispose();
    };
  }, []);

  return (
    <>
      <div className="bottle-fallback" style={{ opacity: ready ? 0 : 1 }}>
        <Bottle />
      </div>
      <div ref={mount} className="bottle3d" style={{ opacity: ready ? 1 : 0 }} />
    </>
  );
}
