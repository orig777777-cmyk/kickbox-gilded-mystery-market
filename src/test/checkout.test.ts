import { expect, it } from "vitest";
import { checkoutTotal, directCheckoutItem } from "@/lib/checkout";
import type { Product } from "@/lib/catalog";

const product: Product = { id: "shirt", name: "Shirt", description: "", price: 90, sport: "football", league: "La Liga", sizes: ["M", "L"], available: true, image_url: null };
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