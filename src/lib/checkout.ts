import type { CartItem } from "@/lib/cart-context";
import type { Product } from "@/lib/catalog";

export function directCheckoutItem(product: Product, size?: string): CartItem {
  if (!product.available) throw new Error("This product is sold out");
  if (product.sizes.length && (!size || !product.sizes.includes(size))) throw new Error("Please choose a size");
  return { id: product.id, name: product.name, price: product.price, size: size ?? "-", qty: 1, imageSrc: product.imageSrc };
}

export function checkoutTotal(items: CartItem[], shipping = 0) {
  return Math.round((items.reduce((sum, item) => sum + item.price * item.qty, 0) + (items.length ? shipping : 0)) * 100) / 100;
}