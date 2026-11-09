import { formatPrice, saleOriginalPrice, type Product } from "@/lib/catalog";

export function ProductPrice({ product, large = false }: { product: Product; large?: boolean }) {
  const original = saleOriginalPrice(product);
  return <div className={`flex flex-wrap items-baseline gap-3 font-display ${large ? "text-4xl" : "text-2xl"}`}>
    <span className="text-gold">{formatPrice(product.price)}</span>
    {original !== null && <><del className="text-lg text-muted-foreground" aria-label="מחיר קודם">{formatPrice(original)}</del><span className="font-sans text-xs font-semibold text-gold">מבצע</span></>}
  </div>;
}