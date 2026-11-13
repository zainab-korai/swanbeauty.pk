// Usage:  node scripts/set-password.js "your new password"
// Prints the lines to paste into .env.local (or into Vercel > Settings > Environment Variables).
const crypto = require("crypto");
const pw = process.argv[2];
if (!pw || pw.length < 8) {
  console.error('Usage: node scripts/set-password.js "new password (min 8 characters)"');
  process.exit(1);
}
const salt = crypto.randomBytes(16).toString("hex");
const hash = crypto.scryptSync(pw, Buffer.from(salt, "hex"), 64).toString("hex");
console.log("ADMIN_PASSWORD_HASH=scrypt:" + salt + ":" + hash);
console.log("SESSION_SECRET=" + crypto.randomBytes(32).toString("hex") + "   # changing this logs everyone out");
