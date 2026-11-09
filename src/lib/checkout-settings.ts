import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { checkoutDefaults, checkoutSettingsSchema } from "@/lib/purchase-options";

export const checkoutSettingsQuery = queryOptions({
  queryKey: ["checkout-settings"],
  queryFn: async () => {
    const { data, error } = await supabase.from("site_content").select("checkout_settings").eq("id", "home").maybeSingle();
    if (error) throw error;
    const parsed = checkoutSettingsSchema.safeParse(data?.checkout_settings ?? checkoutDefaults);
    return parsed.success ? parsed.data : checkoutDefaults;
  },
  staleTime: 60_000,
});