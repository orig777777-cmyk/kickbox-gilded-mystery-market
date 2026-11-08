import { z } from "zod";
import type { Json } from "@/integrations/supabase/types";

const orderItemSchema = z.object({ id: z.string(), name: z.string(), size: z.string(), qty: z.number().int().positive(), price: z.number().nonnegative() });
export function parseOrderItems(items: Json) {
  if (!Array.isArray(items)) return [];
  return items.flatMap((item) => {
    const parsed = orderItemSchema.safeParse(item);
    return parsed.success ? [parsed.data] : [];
  });
}