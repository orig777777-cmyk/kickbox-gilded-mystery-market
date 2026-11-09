import { createContext } from "react";

export type CartItem = { id: string; name: string; price: number; size: string; qty: number; imageSrc?: string | null | undefined; notes?: string; printing?: boolean; patches?: boolean; basePrice?: number; printingFee?: number; patchesFee?: number };

export type CartContextValue = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">) => void;
  setQty: (id: string, size: string, qty: number, lineKey?: string) => void;
  remove: (id: string, size: string, lineKey?: string) => void;
  clear: () => void;
  count: number;
  total: number;
};

// Keep context identity separate from components refreshed during development.
export const CartContext = createContext<CartContextValue | null>(null);