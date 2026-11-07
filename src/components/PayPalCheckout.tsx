import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/lib/cart";

// Publishable PayPal client ID (safe to ship in the browser).
const PAYPAL_CLIENT_ID =
  "BAAPqx-gFIOlo5OrPgp2zp6wLxqHFkJKDQNNu9rhv8691-CKJQ3c6lEh8dsG5edE_WO1e5Ltnz0Vf5c0YU";

export function PayPalCheckout() {
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", city: "", address: "" });
  const ready = Object.values(form).every((v) => v.trim().length > 1);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  return (
    <div className="mt-8 space-y-4 rounded-lg border border-border bg-card p-5">
      <h2 className="text-3xl">Shipping details</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input placeholder="Full name" value={form.name} onChange={set("name")} />
        <Input placeholder="Phone" type="tel" value={form.phone} onChange={set("phone")} />
        <Input placeholder="City" value={form.city} onChange={set("city")} />
        <Input placeholder="Street & number" value={form.address} onChange={set("address")} />
      </div>
      {!ready && <p className="text-sm text-muted-foreground">Fill in your details to pay.</p>}
      <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: "ILS", intent: "capture" }}>
        <PayPalButtons
          disabled={!ready}
          forceReRender={[total, ready]}
          style={{ layout: "vertical", color: "gold" }}
          createOrder={(_d, actions) =>
            actions.order.create({
              intent: "CAPTURE",
              purchase_units: [
                { description: "KICKBOX order", amount: { currency_code: "ILS", value: total.toFixed(2) } },
              ],
            })
          }
          onApprove={async (_d, actions) => {
            const res = await actions.order!.capture();
            const { error } = await supabase.from("orders").insert({
              paypal_order_id: res.id ?? "",
              customer_name: form.name,
              phone: form.phone,
              city: form.city,
              address: form.address,
              items: items.map(({ id, name, size, qty, price }) => ({ id, name, size, qty, price })),
              total,
              status: "paid",
            });
            if (error) toast.error("Payment received, but saving the order failed. Contact us.");
            clear();
            navigate({ to: "/order-success" });
          }}
          onError={() => toast.error("Payment failed. Please try again.")}
        />
      </PayPalScriptProvider>
    </div>
  );
}
