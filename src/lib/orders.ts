import { z } from "zod";
import type { Json } from "@/integrations/supabase/types";

const orderItemSchema = z.object({ id: z.string(), name: z.string(), size: z.string(), qty: z.number().int().positive(), price: z.number().nonnegative(), notes: z.string().optional(), printing: z.boolean().optional(), patches: z.boolean().optional(), basePrice: z.number().nonnegative().optional(), printingFee: z.number().nonnegative().optional(), patchesFee: z.number().nonnegative().optional() });
export function parseOrderItems(items: Json) {
  if (!Array.isArray(items)) return [];
  return items.flatMap((item) => {
    const parsed = orderItemSchema.safeParse(item);
    return parsed.success ? [parsed.data] : [];
  });
}