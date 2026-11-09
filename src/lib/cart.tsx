import { useContext, useEffect, useState, type ReactNode } from "react";
import { CartContext, type CartContextValue, type CartItem } from "@/lib/cart-context";
import { cartLineKey } from "@/lib/purchase-options";

export type { CartItem } from "@/lib/cart-context";
const KEY = "kickbox-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);
  const save = (next: CartItem[]) => {
    setItems(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };
  const value: CartContextValue = {
    items,
    add: (item) => {
      const found = items.find((i) => cartLineKey(i) === cartLineKey(item));
      save(
        found
          ? items.map((i) => (i === found ? { ...i, qty: i.qty + 1 } : i))
          : [...items, { ...item, qty: 1 }],
      );
    },
    setQty: (id, size, qty, lineKey) =>
      save(items.map((i) => (i.id === id && i.size === size && (!lineKey || cartLineKey(i) === lineKey) ? { ...i, qty: Math.max(1, qty) } : i))),
    remove: (id, size, lineKey) => save(items.filter((i) => !(i.id === id && i.size === size && (!lineKey || cartLineKey(i) === lineKey)))),
    clear: () => save([]),
    count: items.reduce((s, i) => s + i.qty, 0),
    total: items.reduce((s, i) => s + i.qty * i.price, 0),
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
}
