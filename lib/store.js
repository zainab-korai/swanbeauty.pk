// Order storage (server only).
//  - Default: JSON file  .data/orders.json   (works on your computer or any server/VPS with a disk)
//  - On Vercel (no disk): set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN (free Upstash Redis). No extra package needed.
import fs from "fs/promises";
import path from "path";

const KEY = "swan:orders";
const FILE = () => path.join(process.cwd(), ".data", "orders.json");
const upstash = () => {
  // Vercel's Upstash integration may name the variables UPSTASH_REDIS_REST_* or KV_REST_API_*; both work.
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return url && token ? { url, token } : null;
};

export const storageInfo = () => (upstash() ? "upstash" : "file");

async function redis(cmd) {
  const { url, token } = upstash();
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
    cache: "no-store",
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok || j.error) throw new Error(j.error || `Upstash error ${res.status}`);
  return j.result;
}

/* ---- file backend (serialised so two orders never overwrite each other) ---- */
let chain = Promise.resolve();
const locked = (fn) => {
  const p = chain.then(fn, fn);
  chain = p.catch(() => {});
  return p;
};
async function readFileOrders() {
  try {
    const arr = JSON.parse(await fs.readFile(FILE(), "utf8"));
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
async function writeFileOrders(list) {
  const f = FILE();
  await fs.mkdir(path.dirname(f), { recursive: true });
  const tmp = f + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(list, null, 2));
  await fs.rename(tmp, f);
}

const byNewest = (a, b) => (a.createdAt < b.createdAt ? 1 : -1);

export async function listOrders() {
  if (upstash()) {
    const flat = (await redis(["HGETALL", KEY])) || [];
    const out = [];
    for (let i = 1; i < flat.length; i += 2) {
      try { out.push(JSON.parse(flat[i])); } catch {}
    }
    return out.sort(byNewest);
  }
  return (await locked(readFileOrders)).sort(byNewest);
}

export async function getOrder(id) {
  if (upstash()) {
    const raw = await redis(["HGET", KEY, id]);
    return raw ? JSON.parse(raw) : null;
  }
  return (await locked(readFileOrders)).find((o) => o.id === id) || null;
}

export async function saveOrder(order) {
  if (upstash()) {
    await redis(["HSET", KEY, order.id, JSON.stringify(order)]);
    return order;
  }
  return locked(async () => {
    const list = await readFileOrders();
    const i = list.findIndex((o) => o.id === order.id);
    if (i >= 0) list[i] = order;
    else list.push(order);
    await writeFileOrders(list);
    return order;
  });
}

export async function deleteOrder(id) {
  if (upstash()) {
    await redis(["HDEL", KEY, id]);
    return true;
  }
  return locked(async () => {
    const list = await readFileOrders();
    await writeFileOrders(list.filter((o) => o.id !== id));
    return true;
  });
}
