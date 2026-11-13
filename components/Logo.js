// SWAN logo. Files live in /public/images/
//   logo-brown.png  -> for light backgrounds (transparent PNG made from your logo)
//   logo-cream.png  -> for the dark brown section
//   logo.png        -> your original logo file
export default function Logo({ variant = "brown", height = 56, className = "" }) {
  return (
    <img
      src={`/images/logo-${variant}.png`}
      alt="SWAN Beauty Essence"
      className={`logo ${className}`}
      style={{ height, width: "auto" }}
    />
  );
}
