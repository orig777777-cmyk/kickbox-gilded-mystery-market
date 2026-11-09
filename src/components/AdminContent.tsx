import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { uploadProductImage, removeProductImage } from "@/lib/products";
import { homeContentSchema, siteContentQuery, type HomeContent } from "@/lib/site-content";
import hero from "@/assets/hero-box.jpg";
import { AdminCheckoutSettings } from "@/components/AdminCheckoutSettings";

const fields: { key: keyof HomeContent; label: string }[] = [
  { key: "eyebrow", label: "כותרת קטנה" }, { key: "title", label: "כותרת ראשית" }, { key: "highlight", label: "כותרת מודגשת" }, { key: "description", label: "תיאור ראשי" },
  { key: "footballButton", label: "כפתור כדורגל" }, { key: "basketballButton", label: "כפתור כדורסל" },
  { key: "qualityTitle", label: "כותרת איכות" }, { key: "qualityDescription", label: "תיאור איכות" }, { key: "surpriseTitle", label: "כותרת הפתעה" }, { key: "surpriseDescription", label: "תיאור הפתעה" }, { key: "shippingTitle", label: "כותרת משלוח" }, { key: "shippingDescription", label: "תיאור משלוח" },
  { key: "footballTitle", label: "כותרת קטגוריית כדורגל" }, { key: "footballDescription", label: "תיאור קטגוריית כדורגל" }, { key: "basketballTitle", label: "כותרת קטגוריית כדורסל" }, { key: "basketballDescription", label: "תיאור קטגוריית כדורסל" }, { key: "latestTitle", label: "כותרת מוצרים חדשים" },
];

export function AdminContent() {
  const query = useQuery(siteContentQuery);
  if (query.isPending) return <p className="py-10">טוען…</p>;
  if (query.isError) return <p className="py-10 text-destructive">לא ניתן לטעון את תוכן האתר.</p>;
  return <><AdminCheckoutSettings /><ContentForm initial={query.data.content} imageSrc={query.data.imageSrc ?? hero} /></>;
}

function ContentForm({ initial, imageSrc }: { initial: HomeContent; imageSrc: string }) {
  const qc = useQueryClient();
  const [form, setForm] = useState(initial);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>();
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!file) { setPreview(undefined); return; }
    const url = URL.createObjectURL(file); setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = homeContentSchema.safeParse(form);
    if (!parsed.success) { toast.error("בדוק שהכותרות מלאות והטקסטים אינם ארוכים מדי"); return; }
    if (file && (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024)) { toast.error("בחר תמונה עד 5MB"); return; }
    setBusy(true);
    let uploaded: string | undefined;
    try {
      if (file) uploaded = await uploadProductImage(file);
      const content = { ...parsed.data, heroImage: uploaded ?? parsed.data.heroImage };
      const { error } = await supabase.from("site_content").upsert({ id: "home", content, updated_at: new Date().toISOString() });
      if (error) throw error;
      setForm(content); setFile(null);
      await qc.invalidateQueries({ queryKey: ["site-content"] });
      toast.success("השינויים נשמרו באתר");
    } catch {
      if (uploaded) await removeProductImage(uploaded);
      toast.error("השמירה נכשלה. נסה שוב.");
    } finally { setBusy(false); }
  };
  return (
    <form onSubmit={save} className="mt-6 max-w-3xl space-y-6" dir="rtl">
      <div><label htmlFor="home-image" className="mb-2 block text-sm font-semibold">תמונה ראשית</label><img src={preview ?? imageSrc} alt="תמונה ראשית" className="mb-3 aspect-video w-full rounded-lg object-cover" /><Input id="home-image" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></div>
      <div className="grid gap-4 sm:grid-cols-2">{fields.map(({ key, label }) => <div key={key} className={key === "description" ? "sm:col-span-2" : ""}><label htmlFor={`home-${key}`} className="mb-1 block text-sm text-muted-foreground">{label}</label>{key.includes("escription") ? <Textarea id={`home-${key}`} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} /> : <Input id={`home-${key}`} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />}</div>)}</div>
      <Button variant="gold" disabled={busy} type="submit">{busy ? "שומר…" : "שמירת שינויים"}</Button>
    </form>
  );
}