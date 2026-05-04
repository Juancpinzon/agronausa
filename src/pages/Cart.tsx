import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { formatCOP } from "../lib/formatters";
import Button from "../components/ui/Button";
import { usePageMeta } from "../hooks/usePageMeta";

export default function Cart() {
  const { items, itemCount, subtotal, removeItem, updateQty, clearCart } =
    useCart();

  usePageMeta("Tu carrito");

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
        {/* Ilustración carrito vacío */}
        <div className="relative flex h-28 w-28 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-accent/10" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            className="relative h-16 w-16 text-accent"
            aria-hidden="true"
          >
            <path
              d="M4 8h8l6 28h28l6-20H16"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <circle cx="26" cy="52" r="3" fill="currentColor" />
            <circle cx="46" cy="52" r="3" fill="currentColor" />
            <path
              d="M28 24h8M32 20v8"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.5"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-text">Tu carrito está vacío</h1>
          <p className="text-text-muted max-w-xs mx-auto">
            Añade productos del catálogo para comenzar tu pedido. ¿No encuentras lo que buscas?
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/catalog">
            <Button>Ver catálogo</Button>
          </Link>
          <a
            href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola, quiero consultar sobre un producto de Agronausa 🌱")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[48px] inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-text shadow-sm transition hover:bg-slate-50"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#25D366]" aria-hidden="true">
              <path d="M12.003 2C6.478 2 2 6.478 2 12.003c0 1.756.478 3.404 1.312 4.826L2 22l5.296-1.294A9.956 9.956 0 0 0 12.003 22C17.528 22 22 17.522 22 12.003 22 6.478 17.528 2 12.003 2Zm0 18.17a8.145 8.145 0 0 1-4.298-1.198l-.307-.183-3.154.767.796-3.073-.2-.315A8.12 8.12 0 0 1 3.83 12.003c0-4.51 3.664-8.173 8.173-8.173 4.51 0 8.173 3.663 8.173 8.173 0 4.51-3.663 8.167-8.173 8.167Z" />
            </svg>
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-accent">
            Carrito
          </p>
          <h1 className="text-3xl font-bold text-text">Tu pedido</h1>
        </div>
        <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-accent">
          {itemCount} {itemCount === 1 ? "artículo" : "artículos"}
        </span>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Items list */}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.product_id}
              className="surface flex gap-4 rounded-[2rem] p-5"
            >
              <img
                src={item.image_url}
                alt={item.product_name}
                className="h-24 w-24 flex-shrink-0 rounded-2xl object-cover"
              />
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <Link
                    to={`/product/${item.product_slug}`}
                    className="font-semibold text-text hover:underline"
                  >
                    {item.product_name}
                  </Link>
                  <button
                    onClick={() => removeItem(item.product_id)}
                    aria-label={`Quitar ${item.product_name}`}
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-text-muted transition hover:bg-red-50 hover:text-red-500"
                  >
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-text-muted">{item.unit}</p>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  {/* Quantity controls */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        updateQty(item.product_id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      aria-label="Disminuir"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text transition hover:bg-slate-100 disabled:opacity-40"
                    >
                      <span className="text-lg leading-none">−</span>
                    </button>
                    <span className="w-10 text-center text-sm font-semibold text-text font-mono">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQty(item.product_id, item.quantity + 1)
                      }
                      disabled={item.quantity >= item.stock}
                      aria-label="Aumentar"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text transition hover:bg-slate-100 disabled:opacity-40"
                    >
                      <span className="text-lg leading-none">+</span>
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-text-muted">
                      {formatCOP(item.price_applied)} × {item.quantity}
                    </p>
                    <p className="text-lg font-bold text-text font-mono">
                      {formatCOP(item.price_applied * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-end pt-2">
            <button
              onClick={clearCart}
              className="text-sm text-text-muted underline-offset-2 transition hover:text-error hover:underline"
            >
              Vaciar carrito
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="surface h-fit rounded-[2rem] p-6 space-y-5">
          <h2 className="text-lg font-bold text-text">Resumen</h2>
          <div className="space-y-3 border-b border-border pb-4">
            {items.map((item) => (
              <div key={item.product_id} className="flex justify-between text-sm">
                <span className="text-text-muted truncate pr-4">
                  {item.product_name} × {item.quantity}
                </span>
                <span className="font-semibold text-text shrink-0">
                  {formatCOP(item.price_applied * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <p className="font-semibold text-text">Total</p>
            <p className="text-2xl font-bold text-text font-mono">
              {formatCOP(subtotal)}
            </p>
          </div>
          <Link to="/checkout">
            <Button className="w-full">Ir al checkout →</Button>
          </Link>
          <Link
            to="/catalog"
            className="block w-full text-center text-sm text-text-muted transition hover:text-text"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
