// Shared settings (safe for browser AND server). Price / delivery / WhatsApp number yahan se badlein.
export const SITE = {
  price: 550,
  deliveryCOD: 350,
  deliveryAdvance: 99,
  phoneIntl: "923120089552", // WhatsApp number (92 + number without leading 0). Website par text ki tarah nahi dikhta.
  product: "Cleanser + Facewash (150 ml)",
};

export const MAX_QTY = 10;

export const STATUSES = [
  { id: "new", label: "New" },
  { id: "awaiting_payment", label: "Awaiting payment" },
  { id: "confirmed", label: "Confirmed" },
  { id: "dispatched", label: "Dispatched" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

export const PROVINCES = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Islamabad Capital Territory",
  "Azad Jammu & Kashmir",
  "Gilgit-Baltistan",
];

// Courier list for the dispatch box in the admin panel. "Other" lets you type any courier name.
export const COURIERS = ["TCS", "Leopards", "M&P", "PostEx", "Trax", "BlueEX", "Call Courier", "Pakistan Post", "Other"];

// What the customer sees on the tracking page for each status.
export const CUSTOMER_STATUS = {
  new: { label: "Order received", text: "We have received your order and will confirm it shortly." },
  awaiting_payment: { label: "Awaiting payment", text: "We are waiting for your advance payment. We dispatch as soon as it is received." },
  confirmed: { label: "Confirmed", text: "Your order is confirmed and is being packed with care." },
  dispatched: { label: "On its way", text: "Your parcel has been handed to the courier. Use the tracking ID below to follow it." },
  delivered: { label: "Delivered", text: "Your order has been delivered. Thank you for choosing SWAN." },
  cancelled: { label: "Cancelled", text: "This order was cancelled. Please WhatsApp us if you have any questions." },
};
