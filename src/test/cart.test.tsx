import { render, screen, fireEvent } from "@testing-library/react";
import { expect, it } from "vitest";
import { CartProvider, useCart } from "@/lib/cart";

function CartConsumer() {
  const cart = useCart();
  return <button onClick={() => cart.add({ id: "box", name: "Box", price: 49.9, size: "M" })}>{cart.count}:{cart.total}</button>;
}

it("shares cart state between the provider and consumers", () => {
  localStorage.clear();
  render(<CartProvider><CartConsumer /></CartProvider>);
  fireEvent.click(screen.getByRole("button", { name: "0:0" }));
  expect(screen.getByRole("button", { name: "1:49.9" })).toBeDefined();
});