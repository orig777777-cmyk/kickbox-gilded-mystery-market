import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/kickbox-logo.png.asset.json";
import { useCart } from "@/lib/cart";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "All Products" },
  { to: "/football", label: "Football" },
  { to: "/basketball", label: "Basketball" },
] as const;

export function SiteHeader() {
  const { count } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchOpen(false);
    navigate({ to: "/shop", search: { q: q.trim() || undefined } });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        <div className="flex min-w-0 items-center gap-3">
          <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
          <Link to="/" className="shrink-0">
            <img src={logo.url} alt="KICKBOX" className="h-12 w-auto object-contain" />
          </Link>
        </div>
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: true }}
              className="text-sm font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-gold data-[status=active]:text-gold"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-4">
          <button aria-label="Search" onClick={() => setSearchOpen(!searchOpen)} className="hover:text-gold">
            <Search className="size-5" />
          </button>
          <Link to="/cart" aria-label="Cart" className="relative hover:text-gold">
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-gold text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
      {searchOpen && (
        <form onSubmit={submit} className="border-t border-border px-4 py-3">
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search mystery boxes..."
            className="mx-auto block w-full max-w-2xl rounded-md border border-input bg-card px-4 py-2 outline-none focus:border-gold"
          />
        </form>
      )}
      {open && (
        <nav className="flex flex-col border-t border-border px-4 py-2 md:hidden">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              activeOptions={{ exact: true }}
              className="py-3 font-semibold uppercase tracking-widest text-muted-foreground data-[status=active]:text-gold"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-10 text-sm text-muted-foreground sm:flex-row">
        <p className="font-display text-xl tracking-widest text-foreground">
          KICK<span className="text-gold">BOX</span>
        </p>
        <p>© {new Date().getFullYear()} KICKBOX. Football & Basketball Mystery Boxes.</p>
        <Link to="/admin" className="hover:text-gold">Admin</Link>
      </div>
    </footer>
  );
}
