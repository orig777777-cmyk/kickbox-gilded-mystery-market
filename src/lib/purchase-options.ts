import { z } from "zod";
import type { CartItem } from "@/lib/cart-context";

export const checkoutSettingsSchema = z.object({
  printingPrice: z.number().min(0).max(100000).default(5),
  patchesPrice: z.number().min(0).max(100000).default(5),
  shippingPrice: z.number().min(0).max(100000).default(0),
});
export type CheckoutSettings = z.infer<typeof checkoutSettingsSchema>;
export const checkoutDefaults: CheckoutSettings = { printingPrice: 5, patchesPrice: 5, shippingPrice: 0 };
export type PurchaseOptions = { notes: string; printing: boolean; patches: boolean };
export function customizeItem(item: CartItem, options: PurchaseOptions, settings: CheckoutSettings): CartItem {
  const printingFee = options.printing ? settings.printingPrice : 0;
  const patchesFee = options.patches ? settings.patchesPrice : 0;
  return { ...item, notes: options.notes.trim(), printing: options.printing, patches: options.patches, printingFee, patchesFee, basePrice: item.price, price: Math.round((item.price + printingFee + patchesFee) * 100) / 100 };
}
export function cartLineKey(item: Pick<CartItem, "id" | "size" | "notes" | "printing" | "patches" | "price">) {
  return JSON.stringify([item.id, item.size, item.notes ?? "", !!item.printing, !!item.patches, item.price]);
}