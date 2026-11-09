import type { CartItem } from "@/lib/cart-context";
import { formatPrice } from "@/lib/catalog";
import { checkoutTotal } from "@/lib/checkout";

export function CheckoutSummary({ items, shipping }: { items: CartItem[]; shipping: number }) {
  const base = items.reduce((sum, item) => sum + (item.basePrice ?? item.price) * item.qty, 0);
  const extras = checkoutTotal(items) - base;
  return <div className="space-y-3 border-y border-border py-4" dir="rtl">
    <h3 className="font-sans text-base font-semibold">סיכום הזמנה</h3>
    {items.map((item, index) => <div key={index} className="text-sm"><p className="break-words">{item.name} · מידה {item.size} · כמות {item.qty}</p>{(item.printing || item.patches) && <p className="text-muted-foreground">{[item.printing && "הדפסת שם ומספר", item.patches && "פאצ׳ים"].filter(Boolean).join(" · ")}</p>}{item.notes && <p className="whitespace-pre-wrap break-words text-muted-foreground">{item.notes}</p>}</div>)}
    <div className="flex justify-between gap-3 text-sm"><span>פריטים</span><span>{formatPrice(base)}</span></div>
    {extras > 0 && <div className="flex justify-between gap-3 text-sm"><span>תוספות</span><span>{formatPrice(extras)}</span></div>}
    <div className="flex justify-between gap-3 text-sm"><span>משלוח</span><span>{shipping === 0 ? "חינם" : formatPrice(shipping)}</span></div>
    <div className="flex justify-between gap-3 border-t border-border pt-3 text-lg font-semibold"><span>סה״כ לתשלום</span><span className="text-gold">{formatPrice(checkoutTotal(items, shipping))}</span></div>
  </div>;
}