import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { applyFilters, LEAGUES, SIZES, SORTS, type Filters, type SortKey, type Sport } from "@/lib/catalog";
import { productsQuery } from "@/lib/products";
import { EmptyState, ProductCard } from "./ProductCard";

export type ShopSearch = Filters;

export function parseShopSearch(s: Record<string, unknown>): ShopSearch {
  const str = (v: unknown) => (typeof v === "string" && v ? v : undefined);
  const num = (v: unknown) => {
    const n = Number(v);
    return v !== undefined && v !== "" && Number.isFinite(n) ? n : undefined;
  };
  const sport = s["sport"] === "football" || s["sport"] === "basketball" ? s["sport"] : undefined;
  const sort = str(s["sort"]) && str(s["sort"])! in SORTS ? (s["sort"] as SortKey) : undefined;
  return { sport, league: str(s["league"]), q: str(s["q"]), sort, size: str(s["size"]), min: num(s["min"]), max: num(s["max"]) };
}

const selectCls =
  "w-full rounded-md border border-input bg-card px-3 py-2 text-sm outline-none focus:border-gold";

export function ShopView({
  title,
  fixedSport,
  search,
  onChange,
}: {
  title: string;
  fixedSport?: Sport;
  search: ShopSearch;
  onChange: (next: Partial<ShopSearch>) => void;
}) {
  const { data = [], isLoading } = useQuery(productsQuery);
  const sport = fixedSport ?? search.sport;
  const results = applyFilters(data, { ...search, sport });
  const leagues = sport ? LEAGUES[sport] : [...LEAGUES.football, ...LEAGUES.basketball].filter((v, i, a) => a.indexOf(v) === i);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-5xl sm:text-6xl">{title}</h1>
      <p className="mt-1 text-muted-foreground">
        {isLoading ? "Loading…" : `${results.length} ${results.length === 1 ? "box" : "boxes"}`}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              defaultValue={search.q}
              key={search.q}
              onChange={(e) => onChange({ q: e.target.value || undefined })}
              placeholder="Search name or description"
              className={`${selectCls} pl-9`}
            />
          </div>
          {!fixedSport && (
            <Field label="Category">
              <select className={selectCls} value={search.sport ?? ""} onChange={(e) => onChange({ sport: (e.target.value || undefined) as Sport | undefined, league: undefined })}>
                <option value="">All Products</option>
                <option value="football">Football</option>
                <option value="basketball">Basketball</option>
              </select>
            </Field>
          )}
          <Field label="League">
            <div className="flex flex-wrap gap-2">
              <Chip active={!search.league} onClick={() => onChange({ league: undefined })}>All</Chip>
              {leagues.map((l) => (
                <Chip key={l} active={search.league === l} onClick={() => onChange({ league: l })}>{l}</Chip>
              ))}
            </div>
          </Field>
          <Field label="Size">
            <div className="flex flex-wrap gap-2">
              <Chip active={!search.size} onClick={() => onChange({ size: undefined })}>Any</Chip>
              {SIZES.map((s) => (
                <Chip key={s} active={search.size === s} onClick={() => onChange({ size: s })}>{s}</Chip>
              ))}
            </div>
          </Field>
          <Field label="Price">
            <div className="flex gap-2">
              <input type="number" min={0} placeholder="Min" defaultValue={search.min} className={selectCls} onChange={(e) => onChange({ min: e.target.value === "" ? undefined : Number(e.target.value) })} />
              <input type="number" min={0} placeholder="Max" defaultValue={search.max} className={selectCls} onChange={(e) => onChange({ max: e.target.value === "" ? undefined : Number(e.target.value) })} />
            </div>
          </Field>
        </aside>

        <section>
          <div className="mb-5 flex justify-end">
            <select className={`${selectCls} w-auto`} value={search.sort ?? "newest"} onChange={(e) => onChange({ sort: e.target.value as SortKey })}>
              {Object.entries(SORTS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          {!isLoading && results.length === 0 ? (
            data.length === 0 ? (
              <EmptyState title="New drops coming soon" body="Our mystery boxes are being packed. Check back shortly for the first release." />
            ) : (
              <EmptyState title="No matches" body="Try a different search, league, size or price range." />
            )
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {results.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gold">{label}</p>
      {children}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs transition-colors ${active ? "border-gold bg-gold text-primary-foreground" : "border-border text-muted-foreground hover:border-gold/60 hover:text-foreground"}`}
    >
      {children}
    </button>
  );
}
