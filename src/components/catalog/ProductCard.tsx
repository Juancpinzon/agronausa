import { Link } from "react-router-dom";
import type { Product } from "../../types";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import { formatCOP } from "../../lib/formatters";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, openCart } = useCart();
  const { getEffectivePrice, profile } = useAuth();

  const image =
    product.images?.[0] ??
    "https://via.placeholder.com/640x800.png?text=Producto";

  const outOfStock = product.stock === 0;
  const effectivePrice = getEffectivePrice(product);
  const hasSpecialPrice =
    profile?.customer_type === "negocio" &&
    profile.has_special_pricing &&
    effectivePrice !== product.price_retail;

  function handleAddToCart() {
    addItem(product, 1, effectivePrice);
    openCart();
  }

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_40px_-8px_rgba(45,106,31,0.2)]">
      {/* ── Image ── */}
      <Link
        to={`/product/${product.slug}`}
        className="relative block overflow-hidden"
        tabIndex={-1}
        aria-hidden="true"
      >
        <img
          src={image}
          alt={product.name}
          className="aspect-[4/5] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />

        {/* Category badge — floats top-left over image */}
        {product.category?.name && (
          <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted backdrop-blur-sm">
            {product.category.name}
          </span>
        )}

        {/* Out-of-stock wash */}
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-bg/70 backdrop-blur-[2px]">
            <span className="rounded-full bg-surface px-4 py-1.5 text-xs font-semibold text-text-muted shadow-sm ring-1 ring-border">
              Sin stock
            </span>
          </div>
        )}

        {/* Featured badge */}
        {product.featured && !outOfStock && (
          <span className="absolute right-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            Destacado
          </span>
        )}
      </Link>

      {/* ── Info ── */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Name + unit */}
        <div className="space-y-0.5">
          <Link
            to={`/product/${product.slug}`}
            className="group/link block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
          >
            <h3 className="font-display text-[1rem] font-bold leading-snug text-text line-clamp-2 group-hover/link:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-[11px] font-medium text-text-muted font-ui uppercase tracking-wide">
            por {product.unit}
          </p>
        </div>

        {/* Price — Fraunces makes numerals feel premium */}
        <div className="mt-auto space-y-0.5">
          {hasSpecialPrice ? (
            <>
              <p className="font-body text-xs text-text-muted line-through">
                {formatCOP(product.price_retail)}
              </p>
              <div className="flex items-baseline gap-2">
                <p className="font-display text-2xl font-bold leading-none text-primary">
                  {formatCOP(effectivePrice)}
                </p>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
                  Precio especial
                </span>
              </div>
            </>
          ) : (
            <p className="font-display text-2xl font-bold leading-none text-text">
              {formatCOP(effectivePrice)}
            </p>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={handleAddToCart}
          disabled={outOfStock}
          className={`mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold font-ui transition-all ${
            outOfStock
              ? "cursor-not-allowed bg-border text-text-muted"
              : "bg-primary text-white hover:bg-[#245517] active:scale-[0.98]"
          }`}
        >
          {!outOfStock && (
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M7 1.5V12.5M1.5 7H12.5"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          )}
          {outOfStock ? "Sin stock" : "Agregar"}
        </button>
      </div>
    </article>
  );
}
