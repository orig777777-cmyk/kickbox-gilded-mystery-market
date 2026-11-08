import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/catalog";
import { parseOrderItems } from "@/lib/orders";

export function AdminOrders({ userId }: { userId: string }) {
  const [search, setSearch] = useState("");
  const orders = useQuery({
    queryKey: ["admin-orders", userId],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("id,customer_name,phone,city,address,items,total,status,created_at,paypal_order_id").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    refetchInterval: 30_000,
  });
  const rows = (orders.data ?? []).filter((o) => [o.customer_name, o.phone, o.city, o.address, o.paypal_order_id].some((value) => value.toLowerCase().includes(search.toLowerCase())));
  return (
    <section className="mt-6 space-y-5" dir="rtl">
      <div className="flex items-center gap-3">
        <Input aria-label="חיפוש הזמנות" placeholder="חיפוש לפי שם, טלפון, כתובת או הזמנה" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button variant="goldOutline" size="icon" title="רענון הזמנות" aria-label="רענון הזמנות" disabled={orders.isFetching} onClick={() => orders.refetch()}><RefreshCw className={orders.isFetching ? "animate-spin" : ""} /></Button>
      </div>
      {orders.isPending ? <p className="py-10 text-muted-foreground">טוען הזמנות…</p> : orders.isError ? <p className="py-10 text-destructive">לא ניתן לטעון את ההזמנות. נסה לרענן.</p> : rows.length === 0 ? <p className="py-10 text-muted-foreground">{search ? "לא נמצאו הזמנות מתאימות" : "אין הזמנות עדיין"}</p> : (
        <div className="space-y-4">
          {rows.map((order) => (
            <article key={order.id} className="rounded-lg border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
                <div><h2 className="font-sans text-lg font-semibold">{order.customer_name}</h2><p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleString("he-IL")}</p></div>
                <p className="text-xl font-semibold text-gold">{formatPrice(order.total)}</p>
              </div>
              <dl className="my-4 grid gap-4 sm:grid-cols-2">
                <div><dt className="text-xs text-muted-foreground">טלפון</dt><dd><a className="text-gold" href={`tel:${order.phone}`} dir="ltr">{order.phone}</a></dd></div>
                <div><dt className="text-xs text-muted-foreground">כתובת משלוח</dt><dd className="break-words">{order.address}, {order.city}</dd></div>
              </dl>
              <ul className="divide-y divide-border">{parseOrderItems(order.items).map((item, index) => <li key={`${item.id}-${item.size}-${index}`} className="flex flex-wrap justify-between gap-2 py-2 text-sm"><span>{item.name} · מידה {item.size} · כמות {item.qty}</span><span>{formatPrice(item.price * item.qty)}</span></li>)}</ul>
              <p className="mt-3 break-all text-xs text-muted-foreground">PayPal: {order.paypal_order_id}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}