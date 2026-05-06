import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../lib/constants";
import useProducts from "../hooks/useProducts";
import { 
  Leaf, 
  Wrench, 
  Package, 
  Droplets, 
  Bug, 
  Sprout, 
  Bird, 
  MoreHorizontal,
  ChevronRight,
  ArrowRight
} from "lucide-react";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&q=85&auto=format&fit=crop";

// Unsplash fallbacks for categories
const CATEGORY_FALLBACKS: Record<string, string> = {
  "lácteos y quesos": "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400",
  "mieles y derivados": "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400",
  "frutas y verduras": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400",
  "hongos": "https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=400",
  "huevos y aves": "https://images.unsplash.com/photo-1569127959161-2b1297b2d9a6?w=400",
  "panela y derivados": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
  "café y cacao": "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400",
  "otros": "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=400",
};

const getCategoryFallback = (name: string) => {
  const n = name.toLowerCase();
  for (const [key, url] of Object.entries(CATEGORY_FALLBACKS)) {
    if (n.includes(key.split(" ")[0]!)) return url;
  }
  return CATEGORY_FALLBACKS["otros"];
};

export default function Home() {
  const { categories, rawProducts, loading } = useProducts();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const featuredProducts = useMemo(() => {
    return rawProducts.filter(p => p.featured).slice(0, 4);
  }, [rawProducts]);

  const displayCategories = useMemo(() => {
    return categories.slice(0, 8);
  }, [categories]);

  const heroItemClass = `hero-item${visible ? " is-visible" : ""}`;

  return (
    <div className="font-body min-h-screen bg-bg pb-12">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative flex h-[45.6vh] min-h-[380px] flex-col justify-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})`, backgroundPosition: "center 40%" }}
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(28,15,5,0.95) 0%, rgba(28,15,5,0.7) 40%, rgba(28,15,5,0.3) 100%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 sm:px-10">
          <div className="max-w-xl">
            <p
              className={`${heroItemClass} font-ui text-[11px] font-bold uppercase tracking-[0.2em] text-accent`}
              style={{ transitionDelay: "0.08s", marginBottom: "0.75rem" }}
            >
              Agronausa
            </p>

            <h1
              className={`${heroItemClass} font-display font-black text-white`}
              style={{
                fontSize: "clamp(2.5rem, 6vw, 3.5rem)",
                lineHeight: 1,
                letterSpacing: "-0.03em",
                transitionDelay: "0.18s",
                marginBottom: "0.5rem",
              }}
            >
              Insumos del campo
              <br />
              <span className="text-accent italic">colombiano.</span>
            </h1>
          </div>
        </div>
      </section>

      {/* ── CATEGORÍAS ─────────────────────────────────────────── */}
      <section className="mx-auto mt-16 max-w-6xl px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-black text-text">Categorías</h2>
            <div className="mt-1 h-1 w-12 bg-accent rounded-full" />
          </div>
          <Link to={ROUTES.catalog} className="text-sm font-bold text-accent hover:underline">
            Ver todas
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {loading ? (
            Array(8).fill(0).map((_, i) => (
              <div key={i} className="h-[120px] w-full animate-pulse rounded-2xl bg-surface sm:w-[160px]" />
            ))
          ) : (
            displayCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`${ROUTES.catalog}?categoria=${cat.slug}`}
                className="group relative flex h-[120px] min-h-[120px] w-full min-w-[160px] items-center justify-center overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-[160px]"
              >
                {/* Background Image */}
                <img 
                  src={cat.image_url || getCategoryFallback(cat.name)} 
                  alt={cat.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Dark Overlay (40%) */}
                <div className="absolute inset-0 bg-black/40" />

                {/* Content */}
                <div className="relative z-10 px-4 py-2">
                  <span className="text-center font-ui text-[11px] font-bold uppercase tracking-wider leading-tight text-white drop-shadow-md">
                    {cat.name}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* ── PRODUCTOS DESTACADOS ───────────────────────────────── */}
      <section className="mx-auto mt-20 max-w-6xl px-6">
        <div className="mb-8">
          <h2 className="font-display text-2xl font-black text-text">Productos destacados</h2>
          <div className="mt-1 h-1 w-12 bg-accent rounded-full" />
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="flex flex-col gap-3 animate-pulse">
                <div className="aspect-square rounded-2xl bg-surface" />
                <div className="h-4 w-3/4 rounded bg-surface" />
                <div className="h-3 w-1/2 rounded bg-surface" />
              </div>
            ))
          ) : featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <Link 
                key={product.id} 
                to={`${ROUTES.catalog}?producto=${product.slug}`}
                className="group flex flex-col gap-3"
              >
                <div className="aspect-square overflow-hidden rounded-2xl bg-surface border border-border">
                  <img 
                    src={product.images?.[0] || "https://via.placeholder.com/400"} 
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div>
                  <h3 className="font-display font-bold text-text group-hover:text-accent transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="font-mono text-sm font-semibold text-accent">
                    ${product.price_retail.toLocaleString('es-CO')} COP
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="col-span-full py-10 text-center text-text-muted italic">
              Explora nuestro catálogo para ver todos los productos.
            </p>
          )}
        </div>
      </section>


    </div>
  );
}
