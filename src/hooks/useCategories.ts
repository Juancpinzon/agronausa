import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import type { Category } from "../types";

export interface CategoryFormData {
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  sort_order: number;
  active: boolean;
}

async function uploadCategoryImage(
  categoryId: string,
  file: File,
): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `categories/${categoryId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file, { upsert: false });
  if (error) throw new Error(error.message);
  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(path);
  return publicUrl;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order");
    
    if (error) {
      console.error("Error loading categories:", error);
    } else {
      setCategories((data ?? []) as Category[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveCategory(formData: CategoryFormData, imageFile?: File, existingId?: string) {
    let categoryId = existingId;
    let finalImageUrl = formData.image_url;

    if (existingId) {
      if (imageFile) {
        finalImageUrl = await uploadCategoryImage(existingId, imageFile);
      }
      const { error } = await supabase
        .from("categories")
        .update({ ...formData, image_url: finalImageUrl })
        .eq("id", existingId);
      if (error) throw new Error("Error updating category: " + error.message);
    } else {
      const { data, error } = await supabase
        .from("categories")
        .insert({ ...formData })
        .select()
        .single();
      if (error) throw new Error("Error creating category: " + error.message);
      
      categoryId = (data as Category).id;
      if (imageFile) {
        const publicUrl = await uploadCategoryImage(categoryId, imageFile);
        await supabase
          .from("categories")
          .update({ image_url: publicUrl })
          .eq("id", categoryId);
      }
    }
    await load();
  }

  async function reorderCategories(orderedIds: string[]) {
    const newCategories = [...categories].sort((a, b) => {
      return orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id);
    });
    setCategories(newCategories);

    const promises = orderedIds.map((id, index) => 
      supabase.from("categories").update({ sort_order: index }).eq("id", id)
    );
    await Promise.all(promises);
    await load();
  }

  async function deleteCategory(id: string) {
    const { count, error: countError } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("category_id", id)
      .eq("active", true);

    if (countError) throw new Error("Error checking category products: " + countError.message);
    
    if (count && count > 0) {
      throw new Error("No se puede eliminar una categoría que tenga productos activos.");
    }

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);
      
    if (error) throw new Error("Error deleting category: " + error.message);
    await load();
  }

  async function removeCategoryImage(categoryId: string, imageUrl: string) {
    const pathPart = imageUrl.split("/product-images/")[1];
    if (pathPart) {
      const { error } = await supabase.storage.from("product-images").remove([decodeURIComponent(pathPart)]);
      if (error) console.error("Storage remove error:", error);
    }
    const { error } = await supabase.from("categories").update({ image_url: "" }).eq("id", categoryId);
    if (error) throw new Error("Error updating DB in removeCategoryImage: " + error.message);
    await load();
  }

  return { categories, loading, saveCategory, reorderCategories, deleteCategory, removeCategoryImage, refresh: load };
}
