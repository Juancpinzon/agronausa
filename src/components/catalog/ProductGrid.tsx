import Input from "../ui/Input";
import ProductCard from "./ProductCard";
import { ProductGridSkeleton } from "../ui/SkeletonLoader";
import type { Category, Product } from "../../types";

interface ProductGridProps {
  categories: Category[];
  products: Product[];
  selectedCategory: string;
  onCategoryChange: (slug: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  loading: boolean;
}

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER as string;
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hola, busco un producto en Agronausa y no lo encuentro en el catálogo 🌱"
)}`;

export default function ProductGrid({
  categories,
  products,
  selectedCategory,
  onCategoryChange,
  search,
  onSearchChange,
  loading,
}: ProductGridProps) {
  const hasFilters = search.trim().length > 0 || selectedCategory !== "all";

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
        <Input
          label="Buscar producto"
          name="search"
          placeholder="Ej. semilla, fertilizante, riego"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        <div className="flex flex-wrap items-center gap-2 rounded-3xl border border-border bg-white/90 p-3 shadow-sm">
          <button
            type="button"
            onClick={() => onCategoryChange("all")}
            className={`min-h-[44px] rounded-full px-4 py-2 text-sm font-semibold transition ${
              selectedCategory === "all"
                ? "bg-primary text-white"
                : "bg-surface text-text hover:bg-primary/8 hover:text-primary"
            }`}
          >
            Todas
          </button>
          {categories.map((category) => (
            <button
              type="button"
              key={category.id}
              onClick={() => onCategoryChange(category.slug)}
              className={`min-h-[44px] rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedCategory === category.slug
                  ? "bg-primary text-white"
                  : "bg-surface text-text hover:bg-primary/8 hover:text-primary"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content area */}
      {loading ? (
        <ProductGridSkeleton count={6} />
      ) : products.length === 0 ? (
        /* ── Empty State ─────────────────────────────────────────── */
        <div className="surface flex flex-col items-center gap-5 rounded-[2rem] p-10 text-center">
          {/* Ilustración semilla */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 80 80"
            className="h-20 w-20 opacity-60"
            aria-hidden="true"
          >
            <circle cx="40" cy="40" r="40" fill="#C4853A" opacity="0.12" />
            <path
              d="M40 62 C40 62 24 52 24 38 C24 29.16 31.16 22 40 22 C48.84 22 56 29.16 56 38 C56 52 40 62 40 62Z"
              fill="#2D6A1F"
              opacity="0.7"
            />
            <path
              d="M40 62 C40 62 40 42 40 28"
              stroke="#F9F6F0"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M40 44 C40 44 33 39 31 33"
              stroke="#F9F6F0"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M40 36 C40 36 46 32 48 27"
              stroke="#F9F6F0"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>

          <div className="space-y-2">
            <p className="text-xl font-bold text-text">
              {hasFilters
                ? "Sin resultados para tu búsqueda"
                : "El catálogo está vacío por ahora"}
            </p>
            <p className="text-sm text-text-muted max-w-sm mx-auto">
              {hasFilters
                ? "Intenta con otra categoría o cambia el término de búsqueda. También puedes consultar disponibilidad directamente."
                : "Pronto habrá productos disponibles. Mientras tanto, consúltanos directamente."}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {hasFilters && (
              <button
                type="button"
                onClick={() => {
                  onCategoryChange("all");
                  onSearchChange("");
                }}
                className="min-h-[48px] rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-text shadow-sm transition hover:bg-slate-50"
              >
                Limpiar filtros
              </button>
            )}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[48px] inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1ebe5d]"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-white"
                aria-hidden="true"
              >
                <path d="M12.003 2C6.478 2 2 6.478 2 12.003c0 1.756.478 3.404 1.312 4.826L2 22l5.296-1.294A9.956 9.956 0 0 0 12.003 22C17.528 22 22 17.522 22 12.003 22 6.478 17.528 2 12.003 2Zm0 18.17a8.145 8.145 0 0 1-4.298-1.198l-.307-.183-3.154.767.796-3.073-.2-.315A8.12 8.12 0 0 1 3.83 12.003c0-4.51 3.664-8.173 8.173-8.173 4.51 0 8.173 3.663 8.173 8.173 0 4.51-3.663 8.167-8.173 8.167Zm4.48-6.124c-.245-.122-1.453-.716-1.678-.797-.225-.082-.389-.122-.553.122-.163.245-.633.797-.776.96-.143.163-.286.184-.531.061-.245-.122-1.035-.381-1.972-1.217-.729-.65-1.22-1.452-1.363-1.697-.143-.245-.015-.378.107-.5.11-.11.245-.286.368-.43.122-.143.163-.245.245-.41.082-.163.041-.306-.02-.43-.061-.122-.553-1.33-.756-1.82-.2-.479-.4-.413-.554-.42l-.47-.009c-.163 0-.428.061-.654.306-.225.245-.858.839-.858 2.048 0 1.209.879 2.377 1.003 2.54.122.163 1.73 2.64 4.19 3.703.585.254 1.042.405 1.4.518.588.187 1.124.16 1.547.098.472-.07 1.452-.594 1.658-1.167.205-.573.205-1.065.143-1.167-.061-.102-.225-.163-.47-.286Z" />
              </svg>
              Consultar disponibilidad
            </a>
          </div>
        </div>
      ) : (
        /* ── Product grid ─────────────────────────────────────────── */
        <div className="grid gap-4 grid-cols-2 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
