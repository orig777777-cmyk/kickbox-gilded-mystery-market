import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Crown, Gift, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, ProductCard } from "@/components/ProductCard";
import { productsQuery } from "@/lib/products";
import hero from "@/assets/hero-box.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KICKBOX | Premium Football & Basketball Mystery Boxes" },
      { name: "description", content: "Premium football and basketball jersey mystery boxes. Open the box, find your legend." },
      { property: "og:title", content: "KICKBOX | Premium Football & Basketball Mystery Boxes" },
      { property: "og:description", content: "Premium football and basketball jersey mystery boxes." },
    ],
  }),
  component: Index,
});

function Index() {
  const { data = [], isLoading } = useQuery(productsQuery);
  const latest = data.slice(0, 4);

  return (
    <>
      <section className="relative overflow-hidden bg-hero">
        <img src={hero} alt="" className="absolute inset-0 size-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="relative mx-auto flex min-h-[560px] max-w-7xl flex-col justify-center px-4 py-20">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-gold">Mystery Box Collection</p>
          <h1 className="max-w-2xl text-6xl leading-[0.9] sm:text-8xl">
            Open the box. <span className="text-gold-gradient">Find your legend.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">
            Premium football and basketball mystery boxes, curated from the world's biggest leagues.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="gold" size="lg"><Link to="/football">Shop Football</Link></Button>
            <Button asChild variant="goldOutline" size="lg"><Link to="/basketball">Shop Basketball</Link></Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-14 sm:grid-cols-3">
        {[
          { icon: Crown, t: "Authentic quality", d: "Premium jerseys from top clubs" },
          { icon: Gift, t: "Every box a surprise", d: "Pick your sport, league and size" },
          { icon: Truck, t: "Fast shipping", d: "Packed with care and sent quickly" },
        ].map(({ icon: Icon, t, d }) => (
          <div key={t} className="flex items-center gap-4 rounded-lg border border-border bg-card p-5">
            <Icon className="size-8 shrink-0 text-gold" />
            <div>
              <p className="font-semibold">{t}</p>
              <p className="text-sm text-muted-foreground">{d}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2">
        {([["/football", "Football", "Premier League · La Liga · Bundesliga · Serie A · Ligue 1"], ["/basketball", "Basketball", "NBA · EuroLeague · and more"]] as const).map(([to, t, d]) => (
          <Link key={to} to={to} className="group relative overflow-hidden rounded-lg border border-border bg-card p-10 transition-colors hover:border-gold">
            <h2 className="text-6xl transition-colors group-hover:text-gold">{t}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-gold">Shop now →</p>
          </Link>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-16">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-5xl">Latest Drops</h2>
          <Link to="/shop" className="text-sm font-semibold uppercase tracking-widest text-gold">View all</Link>
        </div>
        {!isLoading && latest.length === 0 ? (
          <EmptyState title="New drops coming soon" body="Our first mystery boxes are being packed. Check back shortly." />
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {latest.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        )}
      </section>
    </>
  );
}
