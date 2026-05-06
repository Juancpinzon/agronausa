import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import type { Supplier } from "../types";

export interface SupplierFormData {
  name: string;
  contact_name?: string;
  phone?: string;
  email?: string;
  category_ids: string[];
  notes?: string;
  active: boolean;
}

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("suppliers")
      .select("*")
      .order("name");
    
    if (error) {
      console.error("Error loading suppliers:", error);
    } else {
      setSuppliers((data ?? []) as Supplier[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveSupplier(formData: SupplierFormData, existingId?: string) {
    if (existingId) {
      const { error } = await supabase
        .from("suppliers")
        .update({ ...formData, updated_at: new Date().toISOString() })
        .eq("id", existingId);
      if (error) throw new Error("Error updating supplier: " + error.message);
    } else {
      const { error } = await supabase
        .from("suppliers")
        .insert({ ...formData, updated_at: new Date().toISOString() });
      if (error) throw new Error("Error creating supplier: " + error.message);
    }
    await load();
  }

  async function toggleSupplierActive(id: string, active: boolean) {
    const { error } = await supabase
      .from("suppliers")
      .update({ active, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw new Error("Error toggling supplier: " + error.message);
    setSuppliers((prev) => prev.map((s) => (s.id === id ? { ...s, active } : s)));
  }

  return { suppliers, loading, saveSupplier, toggleSupplierActive, refresh: load };
}
