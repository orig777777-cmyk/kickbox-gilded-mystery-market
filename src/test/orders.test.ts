import { expect, it } from "vitest";
import { parseOrderItems } from "@/lib/orders";
it("reads customer selected product, size and quantity from saved orders", () => {
  expect(parseOrderItems([{ id: "shirt", name: "Shirt", size: "L", qty: 2, price: 90 }])).toEqual([{ id: "shirt", name: "Shirt", size: "L", qty: 2, price: 90 }]);
});
it("reads the exact requests and paid extras for supplier fulfillment", () => {
  expect(parseOrderItems([{ id: "shirt", name: "Shirt", size: "M", qty: 8, price: 100, notes: "3 M, 5 L, MESSI 10", printing: true, patches: true, printingFee: 5, patchesFee: 5 }])[0]).toMatchObject({ notes: "3 M, 5 L, MESSI 10", printing: true, patches: true, printingFee: 5, patchesFee: 5 });
});