import { expect, it } from "vitest";
import { checkoutTotal, directCheckoutItem, orderItemsSnapshot } from "@/lib/checkout";
import { checkoutDefaults, customizeItem, cartLineKey } from "@/lib/purchase-options";
import type { Product } from "@/lib/catalog";

const product: Product = { id: "shirt", name: "Shirt", description: "", price: 90, sport: "football", league: "La Liga", sizes: ["M", "L"], available: true, image_url: null, created_at: "2026-11-08T00:00:00Z" };
it("direct checkout buys only one selected product at its shekel price", () => {
  const item = directCheckoutItem(product, "M");
  expect(item).toMatchObject({ id: "shirt", size: "M", qty: 1, price: 90 });
  expect(checkoutTotal([item])).toBe(90);
});
it("requires a valid size for direct checkout", () => {
  expect(() => directCheckoutItem(product)).toThrow("Please choose a size");
  expect(() => directCheckoutItem(product, "XL")).toThrow("Please choose a size");
});
it("does not offer sold out products for direct checkout", () => {
  expect(() => directCheckoutItem({ ...product, available: false }, "M")).toThrow("sold out");
});
it("printing initially adds exactly five shekels per shirt", () => {
  const item = customizeItem(directCheckoutItem(product, "M"), { printing: true, patches: false, notes: "MESSI 10" }, checkoutDefaults);
  expect(item.price).toBe(95);
  expect(checkoutTotal([{ ...item, qty: 8 }])).toBe(760);
});
it("patches initially add exactly five shekels per shirt", () => {
  expect(customizeItem(directCheckoutItem(product, "L"), { printing: false, patches: true, notes: "" }, checkoutDefaults).price).toBe(95);
});
it("keeps free mixed-size and long-sleeve requests in the saved snapshot", () => {
  const item = customizeItem(directCheckoutItem(product, "M"), { printing: false, patches: false, notes: "3 M ועוד 5 L, חולצה ארוכה" }, checkoutDefaults);
  expect(item.price).toBe(90);
  expect(orderItemsSnapshot([item])[0]?.notes).toBe("3 M ועוד 5 L, חולצה ארוכה");
});
it("uses owner-edited fees and adds shipping once per order", () => {
  const item = customizeItem(directCheckoutItem(product, "M"), { printing: true, patches: true, notes: "" }, { printingPrice: 7, patchesPrice: 3, shippingPrice: 12 });
  expect(checkoutTotal([{ ...item, qty: 8 }], 12)).toBe(812);
  expect(checkoutTotal([], 12)).toBe(0);
  expect(orderItemsSnapshot([item])[0]).toMatchObject({ printing: true, patches: true, printingFee: 7, patchesFee: 3, basePrice: 90 });
});
it("does not merge different free requests or paid options", () => {
  const plain = directCheckoutItem(product, "M");
  expect(cartLineKey(plain)).not.toBe(cartLineKey({ ...plain, notes: "long sleeves" }));
  expect(cartLineKey(plain)).not.toBe(cartLineKey({ ...plain, printing: true }));
});