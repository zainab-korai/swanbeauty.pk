// Server-side order validation + building. The server recalculates every price itself.
import crypto from "crypto";
import { SITE, MAX_QTY, PROVINCES } from "./config";

const clean = (v, max) =>
  String(v ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);

// Accepts 0312 3456789, 0312-3456789, +92 312 3456789, 923123456789, 3123456789  ->  03123456789
export function normalizePhone(raw) {
  let n = String(raw ?? "").replace(/[^\d+]/g, "").replace(/^\+/, "");
  if (n.startsWith("92")) n = "0" + n.slice(2);
  else if (/^3\d{9}$/.test(n)) n = "0" + n;
  return /^03\d{9}$/.test(n) ? n : null;
}

const fail = (field, error) => ({ field, error });

export function validateOrder(b) {
  b = b && typeof b === "object" ? b : {};
  const name = clean(b.name, 80);
  if (name.length < 2) return fail("name", "Please enter your full name.");

  const phone = normalizePhone(b.phone);
  if (!phone) return fail("phone", "Please enter a valid Pakistani mobile number, e.g. 0312 3456789.");

  const email = clean(b.email, 120);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("email", "That email address doesn't look right. You can also leave it empty.");

  if (clean(b.country, 40) !== "Pakistan")
    return fail("country", "We currently deliver within Pakistan only. We don't ship internationally yet.");

  const province = clean(b.province, 40);
  if (!PROVINCES.includes(province)) return fail("province", "Please select your province.");

  const city = clean(b.city, 60);
  if (city.length < 2) return fail("city", "Please enter your city.");

  const address = clean(b.address, 300);
  if (address.length < 8) return fail("address", "Please enter your complete delivery address.");

  const qty = Number.parseInt(b.qty, 10);
  if (!(qty >= 1 && qty <= MAX_QTY)) return fail("qty", `Quantity must be between 1 and ${MAX_QTY}.`);

  const payment = b.payment === "advance" ? "advance" : b.payment === "cod" ? "cod" : null;
  if (!payment) return fail("payment", "Please choose a payment method.");

  return { data: { name, phone, email, country: "Pakistan", province, city, address, qty, payment } };
}

export const cleanText = clean;

// Order ID = "S" + 12 random digits, e.g. S482915067341 (long, unique, not guessable)
export function newOrderId() {
  return "S" + String(crypto.randomInt(0, 1e12)).padStart(12, "0");
}

// Customer typed ID -> canonical form. Accepts spaces/dashes/lowercase. Old "SW-..." IDs still work.
export function normalizeOrderId(raw) {
  const s = String(raw ?? "").trim().toUpperCase().replace(/\s+/g, "");
  if (/^SW-/.test(s)) return s.slice(0, 30);
  const c = s.replace(/[^A-Z0-9]/g, "");
  return /^S\d{12}$/.test(c) ? c : "";
}

export function buildOrder(data, meta = {}, id = newOrderId()) {
  const subtotal = SITE.price * data.qty;
  const delivery = data.payment === "advance" ? SITE.deliveryAdvance : SITE.deliveryCOD;
  return {
    id,
    createdAt: new Date().toISOString(),
    status: data.payment === "advance" ? "awaiting_payment" : "new",
    history: [{ status: data.payment === "advance" ? "awaiting_payment" : "new", at: new Date().toISOString() }],
    ...data,
    product: SITE.product,
    unitPrice: SITE.price,
    subtotal,
    delivery,
    total: subtotal + delivery,
    meta,
  };
}
