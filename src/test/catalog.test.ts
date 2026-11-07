import { describe, expect, it } from "vitest";
import { formatPrice } from "@/lib/catalog";

describe("store currency", () => {
  it("formats prices in Israeli shekels without converting the amount", () => {
    expect(formatPrice(49.9)).toBe("₪49.90");
    expect(formatPrice(0)).toBe("₪0.00");
  });
});