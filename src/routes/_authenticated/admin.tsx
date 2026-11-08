import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice, LEAGUES, SIZES, type Product, type Sport } from "@/lib/catalog";
import { productsQuery, removeProductImage, uploadProductImage } from "@/lib/products";
import { AdminOrders } from "@/components/AdminOrders";
import { AdminContent } from "@/components/AdminContent";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard | KICKBOX" },
      { name: "description", content: "Manage KICKBOX products." },
      { property: "og:title", content: "Admin Dashboard | KICKBOX" },
      { property: "og:description", content: "Manage KICKBOX products." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

function Admin() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const role = useQuery({
    queryKey: ["is-admin", user.id],
    queryFn: async () => {
      const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      return !!data;
    },
  });
  const { data = [], isLoading } = useQuery({ ...productsQuery, enabled: role.data === true });
  const [editing, setEditing] = useState<Product | "new" | null>(null);

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  if (role.isLoading) return <div className="p-20 text-center text-muted-foreground">Loading…</div>;
  if (!role.data)
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-5xl">No access</h1>
        <p className="mt-2 text-muted-foreground">This account is not a store admin.</p>
        <Button variant="goldOutline" className="mt-6" onClick={signOut}>Sign out</Button>
      </div>
    );

  const toggle = async (p: Product) => {
    const { error } = await supabase.from("products").update({ available: !p.available }).eq("id", p.id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["products"] });
  };
  const del = async (p: Product) => {
    if (!confirm(`Delete "${p.name}"?`)) return;
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) { toast.error(error.message); return; }
    await removeProductImage(p.image_url);
    qc.invalidateQueries({ queryKey: ["products"] });
    toast.success("Product deleted");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-5xl">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="goldOutline" onClick={signOut}>Sign out</Button>
          <Button variant="gold" onClick={() => setEditing("new")}><Plus /> Add product</Button>
        </div>
      </div>

      <Tabs defaultValue="products" className="mt-8">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="products">מוצרים</TabsTrigger>
          <TabsTrigger value="orders">הזמנות</TabsTrigger>
          <TabsTrigger value="content">עריכת האתר</TabsTrigger>
        </TabsList>
        <TabsContent value="orders"><AdminOrders userId={user.id} /></TabsContent>
        <TabsContent value="content"><AdminContent /></TabsContent>
        <TabsContent value="products">
      <div className="mt-6 overflow-hidden rounded-lg border border-border bg-card">
        {isLoading ? (
          <p className="p-10 text-center text-muted-foreground">Loading…</p>
        ) : data.length === 0 ? (
          <p className="p-10 text-center text-muted-foreground">No products yet. Click “Add product” to create your first mystery box.</p>
        ) : (
          <ul className="divide-y divide-border">
            {data.map((p) => (
              <li key={p.id} className="flex items-center gap-4 p-4">
                <div className="size-14 shrink-0 overflow-hidden rounded bg-muted">
                  {p.imageSrc && <img src={p.imageSrc} alt="" className="size-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{p.name}</p>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    {p.sport} · {p.league} · {formatPrice(p.price)}
                  </p>
                </div>
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Switch checked={p.available} onCheckedChange={() => toggle(p)} />
                  <span className="hidden sm:inline">{p.available ? "Available" : "Hidden"}</span>
                </label>
                <button aria-label="Edit" onClick={() => setEditing(p)} className="hover:text-gold"><Pencil className="size-4" /></button>
                <button aria-label="Delete" onClick={() => del(p)} className="hover:text-destructive"><Trash2 className="size-4" /></button>
              </li>
            ))}
          </ul>
        )}
      </div>
        </TabsContent>
      </Tabs>

      <Dialog open={editing !== null} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl">{editing === "new" ? "Add product" : "Edit product"}</DialogTitle>
          </DialogHeader>
          {editing !== null && (
            <ProductForm
              product={editing === "new" ? null : editing}
              onDone={() => {
                setEditing(null);
                qc.invalidateQueries({ queryKey: ["products"] });
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(150),
  description: z.string().trim().max(3000),
  price: z.number({ invalid_type_error: "Price is required" }).min(0).max(100000),
  sport: z.enum(["football", "basketball"]),
  league: z.string().min(1, "Choose a league"),
  sizes: z.array(z.string()),
  available: z.boolean(),
});

function ProductForm({ product, onDone }: { product: Product | null; onDone: () => void }) {
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [sport, setSport] = useState<Sport>(product?.sport ?? "football");
  const [league, setLeague] = useState(product?.league ?? "");
  const [sizes, setSizes] = useState<string[]>(product?.sizes ?? []);
  const [available, setAvailable] = useState(product?.available ?? true);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ name, description, price: price === "" ? NaN : Number(price), sport, league, sizes, available });
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "Invalid input"); return; }
    setBusy(true);
    try {
      let image_url = product?.image_url ?? null;
      if (file) {
        image_url = await uploadProductImage(file);
        if (product?.image_url) await removeProductImage(product.image_url);
      }
      const row = { ...parsed.data, image_url };
      const { error } = product
        ? await supabase.from("products").update(row).eq("id", product.id)
        : await supabase.from("products").insert(row);
      if (error) throw error;
      toast.success(product ? "Product updated" : "Product added");
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  const input = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold";
  const label = "mb-1 block text-xs font-semibold uppercase tracking-widest text-gold";

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className={label}>Image</label>
        {(file || product?.imageSrc) && (
          <img src={file ? URL.createObjectURL(file) : product?.imageSrc ?? undefined} alt="" className="mb-2 h-32 w-32 rounded object-cover" />
        )}
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="text-sm" />
      </div>
      <div>
        <label className={label}>Name</label>
        <input className={input} value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label className={label}>Description</label>
        <textarea rows={4} className={input} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={label}>Price (ILS · ₪)</label>
          <input type="number" step="0.01" min="0" className={input} value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div>
          <label className={label}>Sport</label>
          <select className={input} value={sport} onChange={(e) => { setSport(e.target.value as Sport); setLeague(""); }}>
            <option value="football">Football</option>
            <option value="basketball">Basketball</option>
          </select>
        </div>
      </div>
      <div>
        <label className={label}>League</label>
        <select className={input} value={league} onChange={(e) => setLeague(e.target.value)}>
          <option value="">Choose a league</option>
          {LEAGUES[sport].map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>
      <div>
        <label className={label}>Sizes</label>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => {
            const on = sizes.includes(s);
            return (
              <button type="button" key={s} onClick={() => setSizes(on ? sizes.filter((x) => x !== s) : [...sizes, s])}
                className={`rounded border px-3 py-1 text-sm ${on ? "border-gold bg-gold text-primary-foreground" : "border-border"}`}>
                {s}
              </button>
            );
          })}
        </div>
      </div>
      <label className="flex items-center gap-3 text-sm">
        <Switch checked={available} onCheckedChange={setAvailable} /> Available for sale
      </label>
      <Button variant="gold" className="w-full" disabled={busy}>{busy ? "Saving…" : "Save product"}</Button>
    </form>
  );
}
