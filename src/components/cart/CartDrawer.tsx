import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { formatCOP } from "../../lib/formatters";

export default function CartDrawer() {
  const { items, itemCount, subtotal, isOpen, closeCart, removeItem, updateQty } =
    useCart();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
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
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-surface shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="font-display text-lg font-bold text-text">Tu carrito</h2>
            {itemCount > 0 && (
              <p className="text-sm text-text-muted">
                {itemCount} {itemCount === 1 ? "artículo" : "artículos"}
              </p>
            )}
          </div>
          <button
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="flex h-10 w-10 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-primary/8 hover:text-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
              <span className="text-5xl">🛒</span>
              <p className="font-display text-lg font-bold text-text">
                Tu carrito está vacío
              </p>
              <p className="text-sm text-text-muted">
                Agrega productos del catálogo para comenzar tu pedido.
              </p>
              <button
                onClick={closeCart}
                className="mt-2 rounded-full bg-primary px-5 py-3 font-ui text-sm font-semibold text-white transition hover:bg-[#245517]"
              >
                Ver catálogo
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.product_id}
                  className="flex gap-3 rounded-2xl border border-border bg-bg p-3 shadow-sm"
                >
                  <img
                    src={item.image_url}
                    alt={item.product_name}
                    className="h-20 w-20 flex-shrink-0 rounded-xl object-cover"
                  />
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/product/${item.product_slug}`}
                        onClick={closeCart}
                        className="text-sm font-semibold text-text transition-colors hover:text-primary"
                      >
                        {item.product_name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.product_id)}
                        aria-label={`Quitar ${item.product_name}`}
                        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-error/10 hover:text-error"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <p className="font-ui text-[10px] font-medium uppercase tracking-wide text-text-muted">
                      {item.unit}
                    </p>
                    <div className="flex items-center justify-between">
                      {/* Quantity controls */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQty(item.product_id, item.quantity - 1)}
                          aria-label="Disminuir cantidad"
                          disabled={item.quantity <= 1}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text transition-colors hover:bg-primary/8 hover:border-primary/20 disabled:opacity-40"
                        >
                          <span className="text-base leading-none">−</span>
                        </button>
                        <span className="w-8 text-center font-display text-sm font-bold text-text">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.product_id, item.quantity + 1)}
                          aria-label="Aumentar cantidad"
                          disabled={item.quantity >= item.stock}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text transition-colors hover:bg-primary/8 hover:border-primary/20 disabled:opacity-40"
                        >
                          <span className="text-base leading-none">+</span>
                        </button>
                      </div>
                      <p className="font-display text-sm font-bold text-text">
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
          <div className="space-y-4 border-t border-border px-6 py-5">
            <div className="flex items-center justify-between">
              <p className="font-ui text-base font-semibold text-text">Subtotal</p>
              <p className="font-display text-2xl font-bold text-text">
                {formatCOP(subtotal)}
              </p>
            </div>
            <Link
              to="/checkout"
              onClick={closeCart}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-primary font-ui text-sm font-semibold text-white transition hover:bg-[#245517] active:scale-[0.99]"
            >
              Ir al checkout →
            </Link>
            <button
              onClick={closeCart}
              className="w-full text-center font-ui text-sm text-text-muted transition-colors hover:text-text"
            >
              Continuar comprando
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
