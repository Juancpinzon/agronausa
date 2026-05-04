import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import useProducts from "../hooks/useProducts";
import { useCart } from "../hooks/useCart";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { formatCOP } from "../lib/formatters";

export default function Product() {
  const { slug } = useParams();
  const { loading, error, getProductBySlug } = useProducts();
  const { addItem, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product = getProductBySlug(slug ?? null);

  if (loading) {
    return (
      <div className="surface p-8 text-center">
        <p className="text-lg font-semibold text-text">Cargando producto...</p>
      </div>
    );
  }

  if (error) {
    return <div className="surface p-8 text-center text-red-600">{error}</div>;
  }

  if (!product) {
    return (
      <div className="space-y-8">
        <div className="surface p-8 text-center">
          <h1 className="text-3xl font-bold text-text">
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

  function handleAddToCart() {
    addItem(product!, quantity);
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
    <div className="space-y-8">
      <section className="surface overflow-hidden rounded-[2rem] p-0 shadow-sm">
        <img
          src={heroImage}
          alt={product.name}
          className="h-[420px] w-full object-cover"
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Details */}
        <article className="surface rounded-[2rem] p-8">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{product.category?.name ?? "Sin categoría"}</Badge>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
              {product.unit}
            </span>
          </div>
          <h1 className="mt-6 text-4xl font-bold text-text">{product.name}</h1>
          <p className="mt-4 max-w-3xl leading-7 text-text-muted">
            {product.description}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="surface rounded-3xl p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-text-muted">
                Precio
              </p>
              <p className="mt-2 text-3xl font-semibold text-text font-mono">
                {formatCOP(product.price_retail)}
              </p>
            </div>
            <div className="surface rounded-3xl p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-text-muted">
                Stock disponible
              </p>
              <p
                className={`mt-2 text-3xl font-semibold ${outOfStock ? "text-error" : "text-text"}`}
              >
                {outOfStock ? "Agotado" : product.stock}
              </p>
            </div>
          </div>

          {product.images.length > 1 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-text">Galería</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="h-28 w-full rounded-3xl object-cover"
                  />
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Add to cart */}
        <aside className="surface rounded-[2rem] p-8">
          <p className="text-sm uppercase tracking-[0.25em] text-text-muted">
            Pedido
          </p>
          <p className="mt-4 text-3xl font-bold text-text font-mono">
            {formatCOP(product.price_retail)}
          </p>
          <p className="mt-1 text-sm text-text-muted">por {product.unit}</p>

          <div className="mt-6 space-y-4">
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-xs text-text-muted">Categoría</p>
              <p className="mt-1 font-semibold text-text">
                {product.category?.name ?? "—"}
              </p>
            </div>
            {product.min_wholesale_qty && (
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-xs text-text-muted">
                  Mínimo para precio mayoreo
                </p>
                <p className="mt-1 font-semibold text-text">
                  {product.min_wholesale_qty} {product.unit}s
                </p>
              </div>
            )}
          </div>

          {/* Quantity selector */}
          {!outOfStock && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-text">Cantidad</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={dec}
                  disabled={quantity <= 1}
                  aria-label="Disminuir cantidad"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-border text-lg text-text transition hover:bg-slate-100 disabled:opacity-40"
                >
                  −
                </button>
                <span className="w-12 text-center text-lg font-semibold text-text font-mono">
                  {quantity}
                </span>
                <button
                  onClick={inc}
                  disabled={quantity >= maxQty}
                  aria-label="Aumentar cantidad"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-border text-lg text-text transition hover:bg-slate-100 disabled:opacity-40"
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
              {outOfStock
                ? "Sin stock"
                : added
                  ? "¡Agregado!"
                  : "Agregar al carrito"}
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
