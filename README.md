# SWAN Beauty Essence: Website + Order Dashboard (Next.js)

## Run
```bash
npm install
npm run dev          # website:   http://localhost:3000
                     # dashboard: http://localhost:3000/admin
```

## Orders kaise kaam karte hain
- **Cash on Delivery:** customer website par form bharta hai, order seedha dashboard me aa jata hai (WhatsApp nahi khulta).
- **Advance Payment:** order dashboard me "Awaiting payment" ke taur par save hota hai, aur customer ke liye WhatsApp khulta hai jisme order ka auto message likha hota hai.
- Country sirf Pakistan. "Other country" chunne par message aata hai k abhi sirf Pakistan me delivery hai.
- Phone zaroori, email optional.

## Admin login (v7)
- Link: `/admin` (local: http://localhost:3000/admin, live: apni-website.com/admin)
- Email: `.env.local` wali `ADMIN_EMAIL`
- Password: pehli dafa `Swan@Admin2026`. Login ke baad foran badal lein (neeche "Password badalna").

## Bottle / label
- 3D bottle: `lib/bottle3d.js`. Front label `public/images/label-front.png`, back label `public/images/label-back.png`.
- Page khulte hi bottle ek baar ghoomti hai (back label dikhta hai). Desktop par mouse se kheench kar ghuma sakte hain.

## Dashboard (/admin)
- Login: sirf `.env.local` wali email + password se.
- Dikhata hai: order ID, time (Pakistan time), naam, phone (Call / WhatsApp button), email, address, city, quantity, payment type, total, device aur IP.
- Status badalna (New, Awaiting payment, Confirmed, Dispatched, Delivered, Cancelled), note likhna, search, filter, delete, CSV export.
- Har 20 second me khud refresh hota hai, naya order aane par beep aur tab title me (1) New order.

### Password badalna
```bash
node scripts/set-password.js "naya password"
```
Jo 2 lines print hon (`ADMIN_PASSWORD_HASH`, `SESSION_SECRET`), `.env.local` me purani lines ki jagah paste karein, aur server dobara chalayein.
Email badalni ho to `.env.local` me `ADMIN_EMAIL`.

### Orders kahan save hote hain
- Apne computer / VPS par: `.data/orders.json` (khud ban jata hai). Is folder ko delete na karein, aur backup rakhein.
- **Vercel par deploy karein to** disk nahi hoti, isliye free Upstash Redis lagayein:
  1. upstash.com par free account, "Create Database" (Redis).
  2. REST URL aur REST TOKEN copy karein.
  3. Vercel > Project > Settings > Environment Variables me ye 5 add karein:
     `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
  4. Redeploy.
- `.env.local` kisi ko share na karein aur GitHub par upload na karein (`.gitignore` me already hai).

## Price / delivery / WhatsApp number badalna
`lib/config.js`:
```js
price: 550, deliveryCOD: 350, deliveryAdvance: 99, phoneIntl: "923120089552"
```
Server khud price dobara calculate karta hai, isliye customer price badal nahi sakta. Website par number text me kahin nahi dikhta, sirf WhatsApp buttons me chhupa hai.

## Folder structure
```
app/            page.js (website), globals.css, layout.js, robots.js, icon.svg
app/admin/      dashboard page + styles
app/api/        orders (public), admin/login, admin/logout, admin/orders, admin/export
components/     Bottle.js, Logo.js
lib/            config.js, orders.js, store.js, auth.js, flyingBottle.js
public/images/  logos, product photos, illustrations
public/videos/  product.mp4
scripts/        set-password.js, make_images.py
```

## Images
`public/images/` me same naam se file rakhein (jpg, png, webp ya svg): `about-woman`, `ritual`, `model-1`, `model-2`, `model-3`.
