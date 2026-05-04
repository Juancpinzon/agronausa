import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { formatCOP } from "../../lib/formatters";

export default function CartDrawer() {
  const { items, itemCount, subtotal, isOpen, closeCart, removeItem, updateQty } =
    useCart();

  // Prevent body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden="true"
        onClick={closeCart}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-label="Carrito de compras"
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-text">Tu carrito</h2>
            {itemCount > 0 && (
              <p className="text-sm text-text-muted">
                {itemCount} {itemCount === 1 ? "artículo" : "artículos"}
              </p>
            )}
          </div>
          <button
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="flex h-10 w-10 items-center justify-center rounded-full text-text-muted transition hover:bg-slate-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
              <span className="text-5xl">🛒</span>
              <p className="text-lg font-semibold text-text">
                Tu carrito está vacío
              </p>
              <p className="text-sm text-text-muted">
                Agrega productos del catálogo para comenzar tu pedido.
              </p>
              <button
                onClick={closeCart}
                className="mt-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
              >
                Ver catálogo
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.product_id}
                  className="flex gap-4 rounded-3xl border border-border bg-white p-4 shadow-sm"
                >
                  <img
                    src={item.image_url}
                    alt={item.product_name}
                    className="h-20 w-20 flex-shrink-0 rounded-2xl object-cover"
                  />
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/product/${item.product_slug}`}
                        onClick={closeCart}
                        className="text-sm font-semibold text-text hover:underline"
                      >
                        {item.product_name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.product_id)}
                        aria-label={`Quitar ${item.product_name}`}
                        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-text-muted transition hover:bg-red-50 hover:text-red-500"
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
                    <p className="text-xs text-text-muted">{item.unit}</p>
                    <div className="flex items-center justify-between">
                      {/* Quantity controls */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            updateQty(item.product_id, item.quantity - 1)
                          }
                          aria-label="Disminuir cantidad"
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-text transition hover:bg-slate-100 disabled:opacity-40"
                          disabled={item.quantity <= 1}
                        >
                          <span className="text-lg leading-none">−</span>
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-text">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQty(item.product_id, item.quantity + 1)
                          }
                          aria-label="Aumentar cantidad"
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-text transition hover:bg-slate-100 disabled:opacity-40"
                          disabled={item.quantity >= item.stock}
                        >
                          <span className="text-lg leading-none">+</span>
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-text">
                        {formatCOP(item.price_applied * item.quantity)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border px-6 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-base font-semibold text-text">Subtotal</p>
              <p className="text-xl font-bold text-text">{formatCOP(subtotal)}</p>
            </div>
            <Link
              to="/checkout"
              onClick={closeCart}
              className="flex h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              Ir al checkout →
            </Link>
            <button
              onClick={closeCart}
              className="w-full text-center text-sm text-text-muted transition hover:text-text"
            >
              Continuar comprando
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
