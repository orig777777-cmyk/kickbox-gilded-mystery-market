import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/catalog";
import type { CheckoutSettings, PurchaseOptions as Options } from "@/lib/purchase-options";

export function PurchaseOptions({ value, onChange, settings, disabled }: { value: Options; onChange: (value: Options) => void; settings: CheckoutSettings; disabled: boolean }) {
  return <div className="mt-6 space-y-4 border-t border-border pt-5" dir="rtl">
    <label className="flex items-center gap-3 text-sm"><Checkbox disabled={disabled} checked={value.printing} onCheckedChange={(checked) => onChange({ ...value, printing: checked === true })} />הדפסת שם ומספר <span className="mr-auto shrink-0 text-gold">+{formatPrice(settings.printingPrice)}</span></label>
    <label className="flex items-center gap-3 text-sm"><Checkbox disabled={disabled} checked={value.patches} onCheckedChange={(checked) => onChange({ ...value, patches: checked === true })} />פאצ׳ים <span className="mr-auto shrink-0 text-gold">+{formatPrice(settings.patchesPrice)}</span></label>
    <div><label htmlFor="product-notes" className="mb-2 block text-sm">הערות ובקשות מיוחדות</label><Textarea id="product-notes" maxLength={2000} rows={3} value={value.notes} onChange={(e) => onChange({ ...value, notes: e.target.value })} placeholder="שם ומספר, חולצה ארוכה, או 3 חולצות M ו־5 חולצות L…" /></div>
  </div>;
}