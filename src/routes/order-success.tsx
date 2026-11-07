import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/order-success")({
  head: () => ({
    meta: [
      { title: "Order Confirmed | KICKBOX" },
      { name: "description", content: "Your KICKBOX order was paid successfully." },
      { property: "og:title", content: "Order Confirmed | KICKBOX" },
      { property: "og:description", content: "Your KICKBOX order was paid successfully." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="text-6xl">Thank you!</h1>
      <p className="mt-4 text-muted-foreground">Your payment went through. We'll contact you soon about shipping.</p>
      <Button asChild variant="gold" className="mt-8"><Link to="/shop">Keep shopping</Link></Button>
    </div>
  ),
});
