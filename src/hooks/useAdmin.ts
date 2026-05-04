import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type {
  Category,
  Order,
  OrderStatus,
  Product,
  SpecialPricing,
  UserProfile,
} from "../types";

// ─── Dashboard ───────────────────────────────────────────────────────────────

export interface DashboardMetrics {
  ordersToday: number;
  pendingOrders: number;
  monthlyRevenue: number;
  lowStockProducts: number;
}

export function useAdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0]!;
    const tomorrow = new Date(now.getTime() + 86_400_000);
    const tomorrowStr = tomorrow.toISOString().split("T")[0]!;

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [todayRes, pendingRes, monthlyRes, lowStockRes] = await Promise.all([
      supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .gte("created_at", `${todayStr}T00:00:00Z`)
        .lt("created_at", `${tomorrowStr}T00:00:00Z`),
      supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("status", "pendiente"),
      supabase
        .from("orders")
        .select("total")
        .gte("created_at", startOfMonth.toISOString())
        .neq("status", "cancelado"),
      supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("active", true)
        .lte("stock", 5),
    ]);

    const monthlyRevenue = (monthlyRes.data ?? []).reduce(
      (sum, o) => sum + (o.total as number),
      0,
    );

    setMetrics({
      ordersToday: todayRes.count ?? 0,
      pendingOrders: pendingRes.count ?? 0,
      monthlyRevenue,
      lowStockProducts: lowStockRes.count ?? 0,
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { metrics, loading, refresh: load };
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export function useAdminOrders(statusFilter: OrderStatus | "todos" = "todos") {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (statusFilter !== "todos") {
      query = query.eq("status", statusFilter);
    }

    const { data, error } = await query;
    if (!error) setOrders((data ?? []) as Order[]);
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  async function updateStatus(orderId: string, status: OrderStatus) {
    const { error } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", orderId);
    if (error) throw new Error(error.message);
    await load();
  }

  async function updateAdminNotes(orderId: string, admin_notes: string) {
    const { error } = await supabase
      .from("orders")
      .update({ admin_notes, updated_at: new Date().toISOString() })
      .eq("id", orderId);
    if (error) throw new Error(error.message);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, admin_notes } : o)),
    );
  }

  return { orders, loading, updateStatus, updateAdminNotes, refresh: load };
}

// ─── Products ────────────────────────────────────────────────────────────────

export interface ProductFormData {
  name: string;
  description: string;
  category_id: string;
  price_retail: number;
  price_wholesale: number | null;
  min_wholesale_qty: number | null;
  unit: string;
  stock: number;
  active: boolean;
  featured: boolean;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function uploadProductImage(
  productId: string,
  file: File,
): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${productId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file, { upsert: false });
  if (error) throw new Error(error.message);
  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(path);
  return publicUrl;
}

export function useAdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [productsRes, categoriesRes] = await Promise.all([
      supabase
        .from("products")
        .select("*, category:categories(id, name, slug)")
        .order("name"),
      supabase
        .from("categories")
        .select("*")
        .eq("active", true)
        .order("sort_order"),
    ]);
    if (!productsRes.error) setProducts((productsRes.data ?? []) as Product[]);
    if (!categoriesRes.error)
      setCategories((categoriesRes.data ?? []) as Category[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveProduct(
    formData: ProductFormData,
    imageFiles: File[],
    existingId?: string,
    existingImages: string[] = [],
  ): Promise<void> {
    const slug = slugify(formData.name);

    if (existingId) {
      const newUrls = await Promise.all(
        imageFiles.map((f) => uploadProductImage(existingId, f)),
      );
      const images = [...existingImages, ...newUrls];
      const { error } = await supabase
        .from("products")
        .update({ ...formData, slug, images, updated_at: new Date().toISOString() })
        .eq("id", existingId);
      if (error) throw new Error(error.message);
    } else {
      const { data, error } = await supabase
        .from("products")
        .insert({ ...formData, slug, images: [], updated_at: new Date().toISOString() })
        .select()
        .single();
      if (error) throw new Error(error.message);

      const newId = (data as Product).id;
      if (imageFiles.length > 0) {
        const imageUrls = await Promise.all(
          imageFiles.map((f) => uploadProductImage(newId, f)),
        );
        await supabase
          .from("products")
          .update({ images: imageUrls })
          .eq("id", newId);
      }
    }

    await load();
  }

  async function removeImage(
    productId: string,
    imageUrl: string,
    currentImages: string[],
  ): Promise<void> {
    const pathPart = imageUrl.split("/product-images/")[1];
    if (pathPart) {
      await supabase.storage.from("product-images").remove([pathPart]);
    }
    const images = currentImages.filter((img) => img !== imageUrl);
    await supabase.from("products").update({ images }).eq("id", productId);
    await load();
  }

  return { products, categories, loading, saveProduct, removeImage, refresh: load };
}

// ─── Customers ───────────────────────────────────────────────────────────────

export function useAdminCustomers() {
  const [customers, setCustomers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setCustomers((data ?? []) as UserProfile[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function toggleSpecialPricing(customerId: string, value: boolean) {
    const { error } = await supabase
      .from("profiles")
      .update({ has_special_pricing: value })
      .eq("id", customerId);
    if (error) throw new Error(error.message);
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId ? { ...c, has_special_pricing: value } : c,
      ),
    );
  }

  return { customers, loading, toggleSpecialPricing, refresh: load };
}

// ─── Special Pricing ─────────────────────────────────────────────────────────

export function useSpecialPricing(customerId: string | null) {
  const [pricing, setPricing] = useState<SpecialPricing[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!customerId) return;
    setLoading(true);
    const { data } = await supabase
      .from("special_pricing")
      .select("*")
      .eq("customer_id", customerId);
    setPricing((data ?? []) as SpecialPricing[]);
    setLoading(false);
  }, [customerId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function upsertPrice(productId: string, price: number) {
    const existing = pricing.find((p) => p.product_id === productId);
    if (existing) {
      await supabase
        .from("special_pricing")
        .update({ price })
        .eq("id", existing.id);
    } else {
      await supabase.from("special_pricing").insert({
        customer_id: customerId,
        product_id: productId,
        price,
      });
    }
    await load();
  }

  async function deletePrice(id: string) {
    await supabase.from("special_pricing").delete().eq("id", id);
    setPricing((prev) => prev.filter((p) => p.id !== id));
  }

  return { pricing, loading, upsertPrice, deletePrice, refresh: load };
}
