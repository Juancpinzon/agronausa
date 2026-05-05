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
    "https://via.placeholder.com/640x420.png?text=Producto";

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
    <article className="surface group overflow-hidden rounded-[2rem] transition hover:-translate-y-1">
      <Link
        to={`/product/${product.slug}`}
        className="block overflow-hidden rounded-t-[2rem]"
      >
        <img
          src={image}
          alt={product.name}
          className="aspect-[4/5] w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-col gap-4 p-5">
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-3">
            <Link to={`/product/${product.slug}`} className="hover:underline">
              <h3 className="text-base font-semibold text-text leading-snug">
                {product.name}
              </h3>
            </Link>
            {product.category?.name ? (
              <span className="shrink-0 rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-accent">
                {product.category.name}
              </span>
            ) : null}
          </div>
          <p className="text-xs text-text-muted">{product.unit}</p>

          {hasSpecialPrice ? (
            <div className="space-y-0.5">
              <p className="text-xs text-text-muted line-through">
                {formatCOP(product.price_retail)}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-xl font-semibold text-primary font-mono">
                  {formatCOP(effectivePrice)}
                </p>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                  Precio especial
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xl font-semibold text-text font-mono">
              {formatCOP(effectivePrice)}
            </p>
          )}
        </div>

        <div className="mt-auto">
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {outOfStock ? (
              "Sin stock"
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                Agregar al carrito
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
