import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Category, Product } from "../types";

export default function useProducts() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCatalog = async () => {
      setLoading(true);
      const [categoriesRes, productsRes] = await Promise.all([
        supabase
          .from("categories")
          .select(
            "id, name, slug, description, image_url, sort_order, active, created_at",
          )
          .eq("active", true)
          .order("sort_order", { ascending: true }),
        supabase
          .from("products")
          .select("*, category:categories(id, name, slug)")
          .eq("active", true)
          .order("name", { ascending: true }),
      ]);

      if (categoriesRes.error) {
        setError(categoriesRes.error.message);
      } else if (productsRes.error) {
        setError(productsRes.error.message);
      } else {
        setCategories(categoriesRes.data ?? []);
        setProducts(productsRes.data ?? []);
        setError(null);
      }

      setLoading(false);
    };

  useEffect(() => {
    loadCatalog();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory !== "all") {
      result = result.filter(
        (product) => product.category?.slug === selectedCategory,
      );
    }

    const query = search.trim().toLowerCase();
    if (query) {
      result = result.filter((product) => {
        const nameMatch = product.name.toLowerCase().includes(query);
        const descriptionMatch = product.description
          ?.toLowerCase()
          .includes(query);
        const categoryMatch = product.category?.name
          .toLowerCase()
          .includes(query);
        return nameMatch || Boolean(descriptionMatch) || Boolean(categoryMatch);
      });
    }

    return result;
  }, [products, selectedCategory, search]);

  const getProductBySlug = (slug?: string | null) =>
    products.find((product) => product.slug === slug);

  return {
    categories,
    products: filteredProducts,
    rawProducts: products,
    selectedCategory,
    setSelectedCategory,
    search,
    setSearch,
    loading,
    error,
    getProductBySlug,
    refreshProducts: loadCatalog,
  };
}
