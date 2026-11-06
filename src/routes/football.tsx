import { createFileRoute } from "@tanstack/react-router";
import { parseShopSearch, ShopView } from "@/components/ShopView";

export const Route = createFileRoute("/football")({
  validateSearch: parseShopSearch,
  head: () => ({
    meta: [
      { title: "Football Mystery Boxes | KICKBOX" },
      { name: "description", content: "Football mystery boxes from the Premier League, La Liga, Bundesliga, Serie A and Ligue 1." },
      { property: "og:title", content: "Football Mystery Boxes | KICKBOX" },
      { property: "og:description", content: "Football mystery boxes from Europe's top leagues." },
    ],
  }),
  component: Page,
});

function Page() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <ShopView
      title="Football"
      fixedSport="football"
      search={search}
      onChange={(next) => navigate({ search: (prev) => ({ ...prev, ...next }), replace: true })}
    />
  );
}
