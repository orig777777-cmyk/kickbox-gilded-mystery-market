import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Package } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ProductCard";
import { formatPrice } from "@/lib/catalog";
import { productsQuery } from "@/lib/products";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/product/$id")({
  head: () => ({
    meta: [
      { title: "Mystery Box | KICKBOX" },
      { name: "description", content: "KICKBOX premium mystery box details." },
      { property: "og:title", content: "Mystery Box | KICKBOX" },
      { property: "og:description", content: "KICKBOX premium mystery box details." },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const { data = [], isLoading } = useQuery(productsQuery);
  const p = data.find((x) => x.id === id);
  const [size, setSize] = useState<string>();
  const cart = useCart();

  if (isLoading) return <div className="p-20 text-center text-muted-foreground">Loading…</div>;
  if (!p)
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState title="Box not found" body="This mystery box isn't available." />
      </div>
    );

  const needsSize = p.sizes.length > 0;
  const add = () => {
    if (needsSize && !size) return toast.error("Please choose a size");
    cart.add({ id: p.id, name: p.name, price: p.price, size: size ?? "-", imageSrc: p.imageSrc });
    toast.success("Added to cart");
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-2">
      <div className="aspect-square overflow-hidden rounded-lg border border-border bg-muted">
        {p.imageSrc ? <img src={p.imageSrc} alt={p.name} className="size-full object-cover" /> : <div className="grid size-full place-items-center"><Package className="size-16 text-muted-foreground" /></div>}
      </div>
      <div>
        <Link to={p.sport === "football" ? "/football" : "/basketball"} className="text-xs font-semibold uppercase tracking-widest text-gold">
          {p.sport} · {p.league}
        </Link>
        <h1 className="mt-2 text-5xl">{p.name}</h1>
        <p className="mt-3 font-display text-4xl text-gold">{formatPrice(p.price)}</p>
        <p className="mt-6 whitespace-pre-line text-muted-foreground">{p.description}</p>
        {needsSize && (
          <div className="mt-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest">Size</p>
            <div className="flex flex-wrap gap-2">
              {p.sizes.map((s) => (
                <button key={s} onClick={() => setSize(s)} className={`min-w-12 rounded border px-3 py-2 text-sm ${size === s ? "border-gold bg-gold text-primary-foreground" : "border-border hover:border-gold/60"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        <Button variant="gold" size="lg" className="mt-8 w-full" disabled={!p.available} onClick={add}>
          {p.available ? "Add to cart" : "Sold out"}
        </Button>
      </div>
    </div>
  );
}
