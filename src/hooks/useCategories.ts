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

  async function saveCategory(formData: CategoryFormData, existingId?: string) {
    if (existingId) {
      const { error } = await supabase
        .from("categories")
        .update({ ...formData })
        .eq("id", existingId);
      if (error) throw new Error("Error updating category: " + error.message);
    } else {
      const { error } = await supabase
        .from("categories")
        .insert({ ...formData });
      if (error) throw new Error("Error creating category: " + error.message);
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

  return { categories, loading, saveCategory, reorderCategories, deleteCategory, refresh: load };
}
