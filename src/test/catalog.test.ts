import { describe, expect, it } from "vitest";
import { formatPrice, saleOriginalPrice } from "@/lib/catalog";

describe("store currency", () => {
  it("formats prices in Israeli shekels without converting the amount", () => {
    expect(formatPrice(49.9)).toBe("₪49.90");
    expect(formatPrice(0)).toBe("₪0.00");
  });
  it("only exposes a genuine higher previous price and keeps payable price unchanged", () => {
    const product = { price: 90, original_price: 120 };
    expect(saleOriginalPrice(product)).toBe(120);
    expect(product.price).toBe(90);
    expect(saleOriginalPrice({ price: 90 })).toBeNull();
    expect(saleOriginalPrice({ price: 90, original_price: 90 })).toBeNull();
    expect(saleOriginalPrice({ price: 90, original_price: 65 })).toBeNull();
  });
});