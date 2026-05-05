import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useProducts from "../hooks/useProducts";
import ProductGrid from "../components/catalog/ProductGrid";
import { usePageMeta } from "../hooks/usePageMeta";

export default function Catalog() {
  const {
    categories,
    products,
    selectedCategory,
    setSelectedCategory,
    search,
    setSearch,
    loading,
    error,
  } = useProducts();

  const [searchParams] = useSearchParams();

  // Aplica el filtro de categoría desde el query param al montar la página
  useEffect(() => {
    const categoriaParam = searchParams.get("categoria");
    if (categoriaParam) {
      setSelectedCategory(categoriaParam);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  usePageMeta(
    "Catálogo de productos",
    "Explora todos los insumos agrícolas, semillas, fertilizantes y herramientas de Agronausa. Sin registro requerido."
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-accent">
            Catálogo
          </p>
          <h1 className="text-3xl font-bold text-text">Todos los productos</h1>
          <p className="mt-2 text-sm text-text-muted">
            Explora productos agrícolas sin necesidad de iniciar sesión.
          </p>
        </div>
        <div className="rounded-3xl bg-surface px-5 py-3 text-sm font-medium text-text shadow-sm">
          {loading ? "Cargando..." : `${products.length} productos disponibles`}
        </div>
      </header>

      {error ? (
        <div className="surface rounded-[2rem] p-8 text-center text-red-600">
          {error}
        </div>
      ) : (
        <ProductGrid
          categories={categories}
          products={products}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          search={search}
          onSearchChange={setSearch}
          loading={loading}
        />
      )}
    </div>
  );
}
