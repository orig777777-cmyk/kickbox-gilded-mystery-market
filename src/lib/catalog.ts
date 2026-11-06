export type Sport = "football" | "basketball";

export const LEAGUES: Record<Sport, string[]> = {
  football: ["Premier League", "La Liga", "Bundesliga", "Serie A", "Ligue 1", "International", "Other"],
  basketball: ["NBA", "EuroLeague", "Israeli Premier League", "International", "Other"],
};

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

export const SORTS = {
  newest: "Newest",
  price_asc: "Price: Low to High",
  price_desc: "Price: High to Low",
} as const;
export type SortKey = keyof typeof SORTS;

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  sport: Sport;
  league: string;
  sizes: string[];
  image_url: string | null;
  available: boolean;
  created_at: string;
  imageSrc?: string | null;
};

export type Filters = {
  sport?: Sport | undefined;
  league?: string | undefined;
  q?: string | undefined;
  sort?: SortKey | undefined;
  size?: string | undefined;
  min?: number | undefined;
  max?: number | undefined;
};

/** Pure filtering/sorting used by the shop pages. */
export function applyFilters(products: Product[], f: Filters): Product[] {
  const q = f.q?.trim().toLowerCase();
  const out = products.filter((p) => {
    if (f.sport && p.sport !== f.sport) return false;
    if (f.league && p.league !== f.league) return false;
    if (f.size && !p.sizes.includes(f.size)) return false;
    if (f.min != null && p.price < f.min) return false;
    if (f.max != null && p.price > f.max) return false;
    if (q && !p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q))
      return false;
    return true;
  });
  const sort = f.sort ?? "newest";
  out.sort((a, b) =>
    sort === "price_asc"
      ? a.price - b.price
      : sort === "price_desc"
        ? b.price - a.price
        : b.created_at.localeCompare(a.created_at),
  );
  return out;
}

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
