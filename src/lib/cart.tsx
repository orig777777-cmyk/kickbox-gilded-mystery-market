import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type CartItem = { id: string; name: string; price: number; size: string; qty: number; imageSrc?: string | null | undefined };

type Ctx = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">) => void;
  setQty: (id: string, size: string, qty: number) => void;
  remove: (id: string, size: string) => void;
  clear: () => void;
  count: number;
  total: number;
};

const CartContext = createContext<Ctx | null>(null);
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
  const value: Ctx = {
    items,
    add: (item) => {
      const found = items.find((i) => i.id === item.id && i.size === item.size);
      save(
        found
          ? items.map((i) => (i === found ? { ...i, qty: i.qty + 1 } : i))
          : [...items, { ...item, qty: 1 }],
      );
    },
    setQty: (id, size, qty) =>
      save(items.map((i) => (i.id === id && i.size === size ? { ...i, qty: Math.max(1, qty) } : i))),
    remove: (id, size) => save(items.filter((i) => !(i.id === id && i.size === size))),
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
