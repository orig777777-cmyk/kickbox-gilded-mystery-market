import { Link } from "@tanstack/react-router";
import { Package } from "lucide-react";
import { type Product } from "@/lib/catalog";
import { ProductPrice } from "@/components/ProductPrice";

export function ProductCard({ p }: { p: Product }) {
  return (
    <Link
      to="/product/$id"
      params={{ id: p.id }}
      className="group block overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-gold/60 hover:shadow-gold"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {p.imageSrc ? (
          <img src={p.imageSrc} alt={p.name} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="grid size-full place-items-center text-muted-foreground">
            <Package className="size-12" />
          </div>
        )}
        {!p.available && (
          <span className="absolute left-3 top-3 rounded bg-background/90 px-2 py-1 text-xs font-semibold uppercase">
            Sold out
          </span>
        )}
      </div>
      <div className="space-y-1 p-4">
        <p className="text-xs uppercase tracking-widest text-gold">
          {p.sport} · {p.league}
        </p>
        <h3 className="truncate font-sans text-base font-semibold tracking-normal">{p.name}</h3>
        <ProductPrice product={p} />
      </div>
    </Link>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-gold/30 bg-card/50 px-6 py-20 text-center">
      <div className="mb-6 grid size-20 place-items-center rounded-full border border-gold/40 bg-accent">
        <Package className="size-9 text-gold" />
      </div>
      <h3 className="text-4xl">{title}</h3>
      <p className="mt-2 max-w-md text-muted-foreground">{body}</p>
    </div>
  );
}
