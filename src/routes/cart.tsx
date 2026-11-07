import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { PayPalCheckout } from "@/components/PayPalCheckout";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ProductCard";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/catalog";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart | KICKBOX" },
      { name: "description", content: "Review the mystery boxes in your KICKBOX cart." },
      { property: "og:title", content: "Your Cart | KICKBOX" },
      { property: "og:description", content: "Review the mystery boxes in your KICKBOX cart." },
    ],
  }),
  component: Cart,
});

function Cart() {
  const { items, setQty, remove, total } = useCart();
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-6xl">Your Cart</h1>
      {items.length === 0 ? (
        <div className="mt-8 space-y-6 text-center">
          <EmptyState title="Your cart is empty" body="Find your next mystery box." />
          <Button asChild variant="gold"><Link to="/shop">Shop now</Link></Button>
        </div>
      ) : (
        <>
          <ul className="mt-8 divide-y divide-border rounded-lg border border-border bg-card">
            {items.map((i) => (
              <li key={i.id + i.size} className="flex items-center gap-4 p-4">
                <div className="size-16 shrink-0 overflow-hidden rounded bg-muted">
                  {i.imageSrc && <img src={i.imageSrc} alt="" className="size-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{i.name}</p>
                  <p className="text-sm text-muted-foreground">Size {i.size} · {formatPrice(i.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button aria-label="Decrease" onClick={() => setQty(i.id, i.size, i.qty - 1)}><Minus className="size-4" /></button>
                  <span className="w-6 text-center">{i.qty}</span>
                  <button aria-label="Increase" onClick={() => setQty(i.id, i.size, i.qty + 1)}><Plus className="size-4" /></button>
                </div>
                <button aria-label="Remove" onClick={() => remove(i.id, i.size)} className="text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center justify-between">
            <p className="font-display text-3xl">Total <span className="text-gold">{formatPrice(total)}</span></p>
          </div>
          <PayPalCheckout />
        </>
      )}
    </div>
  );
}
