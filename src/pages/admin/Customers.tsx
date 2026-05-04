import { useState } from "react";
import {
  useAdminCustomers,
  useAdminProducts,
  useSpecialPricing,
} from "../../hooks/useAdmin";
import { formatCOP } from "../../lib/formatters";
import type { UserProfile } from "../../types";

export default function Customers() {
  const { customers, loading, toggleSpecialPricing } = useAdminCustomers();
  const [selectedCustomer, setSelectedCustomer] = useState<UserProfile | null>(
    null,
  );
  const [toggling, setToggling] = useState<string | null>(null);

  async function handleToggle(customer: UserProfile) {
    setToggling(customer.id);
    try {
      await toggleSpecialPricing(customer.id, !customer.has_special_pricing);
    } finally {
      setToggling(null);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-[0.3em] text-accent">
          Admin / Clientes
        </p>
        <h1 className="text-3xl font-bold text-text">Clientes</h1>
      </header>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      {!loading && customers.length === 0 && (
        <div className="surface p-12 text-center text-text-muted">
          No hay clientes registrados aún.
        </div>
      )}

      <div className="space-y-2">
        {customers.map((customer) => (
          <div key={customer.id} className="surface p-4">
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-text">{customer.full_name}</p>
                {customer.business_name && (
                  <p className="text-sm text-text-muted">
                    {customer.business_name}
                  </p>
                )}
                <p className="mt-0.5 text-xs text-text-muted">
                  {customer.customer_type === "negocio"
                    ? "Negocio / distribuidor"
                    : "Persona natural"}{" "}
                  · {customer.phone}
                </p>
              </div>

              {customer.customer_type === "negocio" && (
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <button
                    onClick={() => void handleToggle(customer)}
                    disabled={toggling === customer.id}
                    className={`min-h-[44px] rounded-full px-3 text-xs font-semibold transition ${
                      customer.has_special_pricing
                        ? "border border-primary/20 bg-primary/10 text-primary"
                        : "border border-border bg-surface text-text-muted hover:bg-bg"
                    } disabled:opacity-50`}
                  >
                    {toggling === customer.id
                      ? "..."
                      : customer.has_special_pricing
                        ? "✓ Precios especiales"
                        : "Sin precios esp."}
                  </button>

                  {customer.has_special_pricing && (
                    <button
                      onClick={() => setSelectedCustomer(customer)}
                      className="min-h-[44px] rounded-full border border-accent/20 bg-accent/10 px-3 text-xs font-semibold text-accent transition hover:bg-accent/20"
                    >
                      Gestionar precios
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedCustomer && (
        <SpecialPricingModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
}

function SpecialPricingModal({
  customer,
  onClose,
}: {
  customer: UserProfile;
  onClose: () => void;
}) {
  const { pricing, loading: loadingPricing, upsertPrice, deletePrice } =
    useSpecialPricing(customer.id);
  const { products, loading: loadingProducts } = useAdminProducts();

  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [priceInput, setPriceInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeProducts = products.filter((p) => p.active);

  function startEdit(productId: string) {
    const existing = pricing.find((p) => p.product_id === productId);
    setPriceInput(existing ? String(existing.price) : "");
    setEditingProductId(productId);
    setError(null);
  }

  function cancelEdit() {
    setEditingProductId(null);
    setPriceInput("");
  }

  async function handleSave(productId: string) {
    if (!priceInput) return;
    setSaving(true);
    setError(null);
    try {
      await upsertPrice(productId, Number(priceInput));
      cancelEdit();
    } catch (e) {
      setError(String(e));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este precio especial?")) return;
    await deletePrice(id);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-surface shadow-xl sm:rounded-3xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div>
            <p className="font-semibold text-text">{customer.full_name}</p>
            {customer.business_name && (
              <p className="text-xs text-text-muted">{customer.business_name}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-text-muted hover:bg-bg"
          >
            ×
          </button>
        </div>

        {error && (
          <p className="mx-4 mt-3 rounded-xl bg-error/10 p-3 text-sm text-error">
            {error}
          </p>
        )}

        {/* Product list */}
        <div className="flex-1 overflow-y-auto p-4">
          {(loadingPricing || loadingProducts) && (
            <div className="flex justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}

          {!loadingPricing && !loadingProducts && activeProducts.length === 0 && (
            <p className="py-8 text-center text-sm text-text-muted">
              No hay productos activos.
            </p>
          )}

          <div className="space-y-2">
            {!loadingPricing &&
              !loadingProducts &&
              activeProducts.map((product) => {
                const special = pricing.find(
                  (p) => p.product_id === product.id,
                );
                const isEditing = editingProductId === product.id;

                return (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 rounded-2xl border border-border p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-text">
                        {product.name}
                      </p>
                      <p className="text-xs text-text-muted">
                        Detal: {formatCOP(product.price_retail)}
                        {special && (
                          <span className="ml-2 font-semibold text-primary">
                            → {formatCOP(special.price)}
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      {isEditing ? (
                        <>
                          <input
                            type="number"
                            value={priceInput}
                            onChange={(e) => setPriceInput(e.target.value)}
                            placeholder="Precio..."
                            min={0}
                            autoFocus
                            className="w-28 rounded-xl border border-border px-2 py-2.5 text-sm focus:border-primary focus:outline-none"
                          />
                          <button
                            onClick={() => void handleSave(product.id)}
                            disabled={saving || !priceInput}
                            className="min-h-[44px] rounded-xl bg-primary px-3 text-sm font-semibold text-white disabled:opacity-50"
                          >
                            {saving ? "..." : "Ok"}
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="min-h-[44px] rounded-xl border border-border px-2 text-sm text-text-muted hover:bg-bg"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(product.id)}
                            className="min-h-[44px] rounded-xl border border-border px-3 text-sm text-text hover:bg-bg"
                          >
                            {special ? "Editar" : "Asignar"}
                          </button>
                          {special && (
                            <button
                              onClick={() => void handleDelete(special.id)}
                              className="min-h-[44px] rounded-xl px-2 text-sm text-error hover:bg-error/10"
                            >
                              ✕
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
