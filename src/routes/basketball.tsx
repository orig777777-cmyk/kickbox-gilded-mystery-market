import { createFileRoute } from "@tanstack/react-router";
import { parseShopSearch, ShopView } from "@/components/ShopView";

export const Route = createFileRoute("/basketball")({
  validateSearch: parseShopSearch,
  head: () => ({
    meta: [
      { title: "Basketball Mystery Boxes | KICKBOX" },
      { name: "description", content: "Basketball mystery boxes from the NBA, EuroLeague and more." },
      { property: "og:title", content: "Basketball Mystery Boxes | KICKBOX" },
      { property: "og:description", content: "Basketball mystery boxes from the NBA, EuroLeague and more." },
    ],
  }),
  component: Page,
});

function Page() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <ShopView
      title="Basketball"
      fixedSport="basketball"
      search={search}
      onChange={(next) => navigate({ search: (prev) => ({ ...prev, ...next }), replace: true })}
    />
  );
}
