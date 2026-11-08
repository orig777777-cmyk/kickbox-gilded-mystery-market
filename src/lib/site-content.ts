import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const homeDefaults = {
  eyebrow: "Mystery Box Collection",
  title: "Open the box.",
  highlight: "Find your legend.",
  description: "Premium football and basketball mystery boxes, curated from the world's biggest leagues.",
  footballButton: "Shop Football",
  basketballButton: "Shop Basketball",
  qualityTitle: "Authentic quality",
  qualityDescription: "Premium jerseys from top clubs",
  surpriseTitle: "Every box a surprise",
  surpriseDescription: "Pick your sport, league and size",
  shippingTitle: "Fast shipping",
  shippingDescription: "Packed with care and sent quickly",
  footballTitle: "Football",
  footballDescription: "Premier League · La Liga · Bundesliga · Serie A · Ligue 1",
  basketballTitle: "Basketball",
  basketballDescription: "NBA · EuroLeague · and more",
  latestTitle: "Latest Drops",
  heroImage: "",
};
export type HomeContent = typeof homeDefaults;
export const homeContentSchema = z.object({
  eyebrow: z.string().trim().max(150),
  title: z.string().trim().min(1).max(150),
  highlight: z.string().trim().max(150),
  description: z.string().trim().max(1000),
  footballButton: z.string().trim().min(1).max(60),
  basketballButton: z.string().trim().min(1).max(60),
  qualityTitle: z.string().trim().max(150),
  qualityDescription: z.string().trim().max(500),
  surpriseTitle: z.string().trim().max(150),
  surpriseDescription: z.string().trim().max(500),
  shippingTitle: z.string().trim().max(150),
  shippingDescription: z.string().trim().max(500),
  footballTitle: z.string().trim().max(150),
  footballDescription: z.string().trim().max(500),
  basketballTitle: z.string().trim().max(150),
  basketballDescription: z.string().trim().max(500),
  latestTitle: z.string().trim().max(150),
  heroImage: z.string().max(500),
});

export const siteContentQuery = queryOptions({
  queryKey: ["site-content"],
  queryFn: async () => {
    const { data, error } = await supabase.from("site_content").select("content").eq("id", "home").maybeSingle();
    if (error) throw error;
    const parsed = homeContentSchema.safeParse({ ...homeDefaults, ...(typeof data?.content === "object" && !Array.isArray(data.content) ? data?.content : {}) });
    const content = parsed.success ? parsed.data : homeDefaults;
    let imageSrc: string | null = null;
    if (content.heroImage) {
      const { data: image } = await supabase.storage.from("product-images").createSignedUrl(content.heroImage, 86400);
      imageSrc = image?.signedUrl ?? null;
    }
    return { content, imageSrc };
  },
  staleTime: 60_000,
});