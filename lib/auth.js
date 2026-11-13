// Admin auth (server only). Single admin: ADMIN_EMAIL + ADMIN_PASSWORD_HASH from .env.local.
// Session = signed, httpOnly cookie. No external packages.
import crypto from "crypto";

export const COOKIE = "swan_admin";
const DAYS = 7;

/* password hashing (scrypt). Format: scrypt:<saltHex>:<hashHex>  (no "$" so .env files don't mangle it) */
export function hashPassword(pw, saltHex = crypto.randomBytes(16).toString("hex")) {
  const h = crypto.scryptSync(String(pw), Buffer.from(saltHex, "hex"), 64).toString("hex");
  return `scrypt:${saltHex}:${h}`;
}
export function verifyPassword(pw, stored) {
  try {
    const [, salt, hash] = String(stored).split(":");
    const a = crypto.scryptSync(String(pw), Buffer.from(salt, "hex"), 64);
    const b = Buffer.from(hash, "hex");
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export const adminConfigured = () =>
  Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD_HASH && process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 16);

const b64u = (s) => Buffer.from(s).toString("base64url");
const sign = (payload) => crypto.createHmac("sha256", process.env.SESSION_SECRET).update(payload).digest("base64url");
const safeEq = (a, b) => {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

export function checkLogin(email, password) {
  const emailOk = safeEq(String(email || "").trim().toLowerCase(), String(process.env.ADMIN_EMAIL || "").trim().toLowerCase());
  const passOk = verifyPassword(password || "", process.env.ADMIN_PASSWORD_HASH || "scrypt:00:00"); // always runs scrypt
  return emailOk && passOk;
}

export function makeSession() {
  const payload = b64u(JSON.stringify({ e: process.env.ADMIN_EMAIL.trim().toLowerCase(), exp: Date.now() + DAYS * 864e5 }));
  return `${payload}.${sign(payload)}`;
}

function getCookie(req, name) {
  const raw = req.headers.get("cookie") || "";
  for (const part of raw.split(";")) {
    const i = part.indexOf("=");
    if (i > 0 && part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
  }
  return null;
}

export function isAdmin(req) {
  if (!adminConfigured()) return false;
  const tok = getCookie(req, COOKIE);
  if (!tok) return false;
  const [payload, sig] = tok.split(".");
  if (!payload || !sig || !safeEq(sig, sign(payload))) return false;
  try {
    const s = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return s.exp > Date.now() && s.e === process.env.ADMIN_EMAIL.trim().toLowerCase();
  } catch {
    return false;
  }
}

export function sessionCookie(value, maxAgeSec = DAYS * 86400) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAgeSec}${secure}`;
}

/* ---- small helpers shared by routes ---- */
export const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...headers },
  });

export const isJson = (req) => (req.headers.get("content-type") || "").toLowerCase().startsWith("application/json");

export const clientIp = (req) =>
  (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";

// in-memory limiter (per server instance): enough to stop casual spam / password guessing
const hits = new Map();
export function allow(key, limit, windowMs) {
  const now = Date.now();
  const arr = (hits.get(key) || []).filter((t) => now - t < windowMs);
  if (arr.length >= limit) {
    hits.set(key, arr);
    return false;
  }
  arr.push(now);
  hits.set(key, arr);
  if (hits.size > 5000) hits.clear();
  return true;
}

export function requireAdmin(req) {
  return isAdmin(req) ? null : json({ error: "Unauthorized" }, 401);
}
