"use client";
// Themed dropdown (brown + gold) so the open list matches the site instead of the browser's white list.
import { useEffect, useId, useRef, useState } from "react";

export default function Select({ value, onChange, options, placeholder = "Select", label, invalid = false }) {
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(-1);
  const root = useRef(null);
  const listId = useId();
  const items = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  const current = items.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const off = (e) => root.current && !root.current.contains(e.target) && setOpen(false);
    document.addEventListener("pointerdown", off);
    return () => document.removeEventListener("pointerdown", off);
  }, [open]);

  const choose = (v) => {
    onChange(v);
    setOpen(false);
  };
  const toggle = () => {
    setHi(Math.max(0, items.findIndex((o) => o.value === value)));
    setOpen((o) => !o);
  };
  const onKey = (e) => {
    if (e.key === "Escape") return setOpen(false);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) return toggle();
      setHi((h) => (h + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!open) toggle();
      else if (hi >= 0) choose(items[hi].value);
    } else if (e.key === "Tab") setOpen(false);
  };

  return (
    <div className={`sel ${open ? "open" : ""} ${invalid ? "bad" : ""}`} ref={root}>
      <button type="button" className="sel-btn" aria-haspopup="listbox" aria-expanded={open} aria-controls={listId} aria-label={label} onClick={toggle} onKeyDown={onKey}>
        <span className={current ? "" : "ph"}>{current ? current.label : placeholder}</span>
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 5.2l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {open && (
        <ul className="sel-list" id={listId} role="listbox">
          {items.map((o, i) => (
            <li key={o.value} role="option" aria-selected={o.value === value} className={`${o.value === value ? "on" : ""} ${i === hi ? "hi" : ""}`} onMouseEnter={() => setHi(i)} onPointerDown={(e) => { e.preventDefault(); choose(o.value); }}>
              {o.label}
              {o.value === value && <b aria-hidden="true">✓</b>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
