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
price: 999, deliveryCOD: 350, deliveryAdvance: 99, phoneIntl: "923120089552"
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


## Order tracking (v8)
- Customer page: `/track`. Customer enters only the Order ID (format `S` + 12 digits, e.g. S482915067341; long and random so it cannot be guessed).
  After ordering, the thank-you box also has a "Track my order" button.
- Customer sees: status steps (Order received, Confirmed, On its way, Delivered), courier name, tracking ID (with Copy button) and an optional courier link.
- Admin (`/admin`): every order has a "Courier & tracking" box. Choose courier (TCS, Leopards, M&P, PostEx, Trax, BlueEX, Call Courier, Pakistan Post, Other), type the tracking ID, optional courier link, press "Save tracking".
  Use "Send tracking on WhatsApp" to message the customer the courier + tracking ID + `/track` link.
- Status flow: New / Awaiting payment -> Confirmed -> Dispatched -> Delivered (or Cancelled). Every change is time-stamped and shown to the customer.
- Order form: Country (Pakistan / Outside Pakistan), Province list (7), themed dropdowns. Orders now store the province and show it in admin + CSV.

## Speed (v8)
- Removed the full-screen blend overlay, blur filters and backdrop-filter blurs, the main causes of lag.
- 3D bottle starts after the page has loaded, draws a smaller canvas, caps frame rate (50 fps laptop, 30 fps phone) and uses a lighter mode on phones / low-power laptops.
- Images shrunk (labels are now `.webp`), video plays only while visible, parallax is off on phones.


## New look (v9)
- Clean ivory + emerald design. One 3D bottle in the first screen only (drag to turn, hover/tap the cap, it only draws while on screen). No flying bottle, no scroll tricks.
- Illustrations (Pakistani women with dupatta, jhumke, maang tikka): `public/images/about-woman.svg`, `ritual.svg`, `model-1.svg`, `model-2.svg`, `model-3.svg`. They are original artwork, not photos.
- To use real photos: put them in `public/images/` and change `.svg` to `.jpg` in the `<Art name=... />` lines in `app/page.js`.
- Old product photos (`product-real-*.jpg`, `product-detail.jpg`) are still in `public/images/` but not used now.


## v10
- 3D bottle removed (and the `three` package). The hero now shows your real product photo (`public/images/product-real-2.jpg`).
- Colours follow the logo: cream `#FDF8EE`, brown `#825830`, gold `#C9A26A`, dark brown `#4A2E14`, with a small touch of gel green on the "beads".
- New sections: Made for, Cleanse/Exfoliate/Nourish, stats strip, Good habits, On the label (front + back), How ordering works, bigger FAQ, full footer, mobile "Order now" bar.
- `public/images/label-front.webp` and `label-back.webp` come from your label artwork.
- The "tree hydrated but some attributes didn't match" console warning comes from a browser extension (e.g. Grammarly) adding attributes to `<body>`. It is harmless; `layout.js` now silences it with `suppressHydrationWarning`.


## v11
- Price Rs. 999 (`lib/config.js`: price 999, deliveryCOD 350, deliveryAdvance 99). Change them there, the server recalculates every order itself.
- Cartoon illustrations removed. The site now uses your real product photos.
- Real model photos: put files like `model-1.jpg` in `public/images/` and list them in `MODEL_PHOTOS` in `lib/config.js`. A "For every skin" section appears automatically.

## v12 - Order ID aur tracking
- Naya Order ID: `S` + 12 digits (e.g. `S482915067341`). Har order ka alag, random.
- `/track` par ab sirf Order ID chahiye (phone number nahi). Purane `SW-...` IDs bhi chalte hain.
- ID bhool jaye to Admin panel > search box mein customer ka naam / phone / city likhein, order card par uski ID likhi hoti hai.
