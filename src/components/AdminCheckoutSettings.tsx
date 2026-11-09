import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { checkoutSettingsQuery } from "@/lib/checkout-settings";
import { checkoutSettingsSchema, type CheckoutSettings } from "@/lib/purchase-options";

export function AdminCheckoutSettings() {
  const query = useQuery(checkoutSettingsQuery);
  if (query.isPending) return <p>טוען מחירי תוספות…</p>;
  if (query.isError) return <p className="text-destructive">לא ניתן לטעון מחירי תוספות.</p>;
  return <SettingsForm initial={query.data} />;
}
function SettingsForm({ initial }: { initial: CheckoutSettings }) {
  const [form, setForm] = useState({ printingPrice: String(initial.printingPrice), patchesPrice: String(initial.patchesPrice), shippingPrice: String(initial.shippingPrice) });
  const [busy, setBusy] = useState(false);
  const qc = useQueryClient();
  return <form className="mt-6 space-y-4 border-b border-border pb-6" dir="rtl" onSubmit={async (e) => {
    e.preventDefault();
    const parsed = checkoutSettingsSchema.safeParse(Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim() ? Number(value) : NaN])));
    if (!parsed.success) { toast.error("הזן מחירים תקינים"); return; }
    setBusy(true);
    try {
      const { error } = await supabase.from("site_content").upsert({ id: "home", checkout_settings: parsed.data, updated_at: new Date().toISOString() });
      if (error) throw error;
      await qc.invalidateQueries({ queryKey: ["checkout-settings"] });
      toast.success("מחירי התוספות והמשלוח נשמרו");
    } catch { toast.error("השמירה נכשלה"); } finally { setBusy(false); }
  }}>
    <h2 className="text-2xl">תוספות ומשלוח</h2>
    <div className="grid gap-4 sm:grid-cols-3">{([{ key: "printingPrice", label: "שם ומספר (₪ לחולצה)" }, { key: "patchesPrice", label: "פאצ׳ים (₪ לחולצה)" }, { key: "shippingPrice", label: "משלוח (₪ להזמנה)" }] as const).map(({ key, label }) => <div key={key}><label htmlFor={key} className="mb-2 block text-sm">{label}</label><Input id={key} type="number" min="0" step="0.01" required value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} /></div>)}</div>
    <Button variant="gold" disabled={busy}>שמירת מחירי תוספות</Button>
  </form>;
}