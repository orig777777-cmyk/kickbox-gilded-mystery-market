import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "./catalog";

const BUCKET = "product-images";

async function withImages(rows: Product[]): Promise<Product[]> {
  const paths = rows.map((r) => r.image_url).filter((p): p is string => !!p);
  if (!paths.length) return rows;
  const { data } = await supabase.storage.from(BUCKET).createSignedUrls(paths, 60 * 60 * 24);
  const map = new Map((data ?? []).map((d) => [d.path, d.signedUrl]));
  return rows.map((r) => ({ ...r, imageSrc: r.image_url ? (map.get(r.image_url) ?? null) : null }));
}

export const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return withImages((data ?? []).map((d) => ({ ...d, price: Number(d.price) })) as Product[]);
  },
});

export async function uploadProductImage(file: File) {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type });
  if (error) throw error;
  return path;
}

export async function removeProductImage(path: string | null) {
  if (path) await supabase.storage.from(BUCKET).remove([path]);
}
