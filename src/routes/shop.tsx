import { createFileRoute } from "@tanstack/react-router";
import { parseShopSearch, ShopView } from "@/components/ShopView";

export const Route = createFileRoute("/shop")({
  validateSearch: parseShopSearch,
  head: () => ({
    meta: [
      { title: "All Mystery Boxes | KICKBOX" },
      { name: "description", content: "Browse every KICKBOX football and basketball mystery box. Filter by league, size and price." },
      { property: "og:title", content: "All Mystery Boxes | KICKBOX" },
      { property: "og:description", content: "Browse every KICKBOX football and basketball mystery box." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Shop,
});

function Shop() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <ShopView
      title="All Products"
      search={search}
      onChange={(next) => navigate({ search: (prev) => ({ ...prev, ...next }), replace: true })}
    />
  );
}
