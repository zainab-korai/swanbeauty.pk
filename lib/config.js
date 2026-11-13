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
