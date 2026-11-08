import { expect, it } from "vitest";
import { parseOrderItems } from "@/lib/orders";
it("reads customer selected product, size and quantity from saved orders", () => {
  expect(parseOrderItems([{ id: "shirt", name: "Shirt", size: "L", qty: 2, price: 90 }])).toEqual([{ id: "shirt", name: "Shirt", size: "L", qty: 2, price: 90 }]);
});