import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import useProducts from "../hooks/useProducts";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { formatCOP } from "../lib/formatters";

export default function Product() {
  const { slug } = useParams();
  const { loading, error, getProductBySlug } = useProducts();
  const { addItem, openCart } = useCart();
  const { getEffectivePrice, profile } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product = getProductBySlug(slug ?? null);

  if (loading) {
    return (
      <div className="surface p-8 text-center">
        <p className="font-ui text-base font-semibold text-text-muted">Cargando producto…</p>
      </div>
    );
  }

  if (error) {
    return <div className="surface p-8 text-center text-error">{error}</div>;
  }

  if (!product) {
    return (
      <div className="space-y-8">
        <div className="surface p-8 text-center">
          <h1 className="font-display text-3xl font-bold text-text">
            Producto no encontrado
          </h1>
          <p className="mt-4 text-text-muted">
            Verifica la ruta o vuelve al catálogo.
          </p>
          <div className="mt-6 flex justify-center">
            <Link to="/catalog">
              <Button>Volver al catálogo</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const heroImage =
    product.images?.[0] ??
    "https://via.placeholder.com/960x540.png?text=Producto";

  const outOfStock = product.stock === 0;
  const maxQty = product.stock;
  const effectivePrice = getEffectivePrice(product);
  const hasSpecialPrice =
    profile?.customer_type === "negocio" &&
    profile.has_special_pricing &&
    effectivePrice !== product.price_retail;

  function handleAddToCart() {
    addItem(product!, quantity, effectivePrice);
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 2000);
  }

  function dec() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  function inc() {
    setQuantity((q) => Math.min(maxQty, q + 1));
  }

  return (
    <div className="space-y-6">
      {/* Hero image */}
      <section className="overflow-hidden rounded-2xl shadow-sm">
        <img
          src={heroImage}
          alt={product.name}
          className="h-[360px] w-full object-cover sm:h-[440px]"
        />
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_0.6fr]">
        {/* ── Details ── */}
        <article className="surface p-6 sm:p-8">
          {/* Category + unit */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{product.category?.name ?? "Sin categoría"}</Badge>
            <span className="rounded-full border border-border bg-bg px-3 py-1 font-ui text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted">
              {product.unit}
            </span>
          </div>

          <h1 className="font-display mt-5 text-3xl font-bold leading-tight text-text sm:text-4xl">
            {product.name}
          </h1>

          <p className="mt-4 max-w-3xl leading-7 text-text-muted">
            {product.description}
          </p>

          {/* Price + stock tiles */}
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-bg p-5">
              <p className="font-ui text-[11px] font-medium uppercase tracking-[0.14em] text-text-muted">
                Precio
              </p>
              {hasSpecialPrice ? (
                <>
                  <p className="mt-1 text-sm text-text-muted line-through">
                    {formatCOP(product.price_retail)}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="font-display text-3xl font-bold text-primary">
                      {formatCOP(effectivePrice)}
                    </p>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 font-ui text-[9px] font-bold uppercase tracking-wider text-primary">
                      Especial
                    </span>
                  </div>
                </>
              ) : (
                <p className="font-display mt-1.5 text-3xl font-bold text-text">
                  {formatCOP(effectivePrice)}
                </p>
              )}
            </div>

            <div className="rounded-xl border border-border bg-bg p-5">
              <p className="font-ui text-[11px] font-medium uppercase tracking-[0.14em] text-text-muted">
                Stock disponible
              </p>
              <p
                className={`font-display mt-1.5 text-3xl font-bold ${
                  outOfStock ? "text-error" : "text-text"
                }`}
              >
                {outOfStock ? "Agotado" : product.stock}
              </p>
            </div>
          </div>

          {/* Gallery */}
          {product.images.length > 1 && (
            <div className="mt-8">
              <h2 className="font-display text-lg font-bold text-text">
                Galería
              </h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="h-28 w-full rounded-xl object-cover"
                  />
                ))}
              </div>
            </div>
          )}
        </article>

        {/* ── Add to cart sidebar ── */}
        <aside className="surface p-6 sm:p-8">
          <p className="font-ui text-[11px] font-medium uppercase tracking-[0.14em] text-text-muted">
            Pedido
          </p>

          {hasSpecialPrice ? (
            <>
              <p className="mt-3 text-sm text-text-muted line-through">
                {formatCOP(product.price_retail)}
              </p>
              <p className="font-display text-3xl font-bold text-primary">
                {formatCOP(effectivePrice)}
              </p>
            </>
          ) : (
            <p className="font-display mt-3 text-3xl font-bold text-text">
              {formatCOP(effectivePrice)}
            </p>
          )}
          <p className="mt-1 text-sm text-text-muted">por {product.unit}</p>

          {/* Info chips */}
          <div className="mt-5 space-y-2.5">
            <div className="rounded-xl border border-border bg-bg p-4">
              <p className="font-ui text-[10px] font-medium uppercase tracking-wide text-text-muted">
                Categoría
              </p>
              <p className="mt-1 text-sm font-semibold text-text">
                {product.category?.name ?? "—"}
              </p>
            </div>
            {product.min_wholesale_qty && (
              <div className="rounded-xl border border-border bg-bg p-4">
                <p className="font-ui text-[10px] font-medium uppercase tracking-wide text-text-muted">
                  Mínimo para precio mayoreo
                </p>
                <p className="mt-1 text-sm font-semibold text-text">
                  {product.min_wholesale_qty} {product.unit}s
                </p>
              </div>
            )}
          </div>

          {/* Quantity selector */}
          {!outOfStock && (
            <div className="mt-6">
              <p className="mb-3 font-ui text-sm font-medium text-text">
                Cantidad
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={dec}
                  disabled={quantity <= 1}
                  aria-label="Disminuir cantidad"
                  className="flex h-12 w-12 items-center justify-center rounded-xl border border-border text-xl text-text transition-colors hover:bg-primary/8 hover:border-primary/20 disabled:opacity-40"
                >
                  −
                </button>
                <span className="font-display w-10 text-center text-xl font-bold text-text">
                  {quantity}
                </span>
                <button
                  onClick={inc}
                  disabled={quantity >= maxQty}
                  aria-label="Aumentar cantidad"
                  className="flex h-12 w-12 items-center justify-center rounded-xl border border-border text-xl text-text transition-colors hover:bg-primary/8 hover:border-primary/20 disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div className="mt-6">
            <Button
              className="w-full"
              onClick={handleAddToCart}
              disabled={outOfStock}
            >
              {outOfStock ? "Sin stock" : added ? "¡Agregado!" : "Agregar al carrito"}
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
