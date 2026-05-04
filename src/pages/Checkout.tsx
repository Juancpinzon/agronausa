import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useOrders, validateStock } from "../hooks/useOrders";
import { formatCOP } from "../lib/formatters";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import type { StockConflict } from "../types";

interface FormFields {
  full_name: string;
  email: string;
  phone: string;
  department: string;
  city: string;
  address_line: string;
  notes: string;
}

const COLOMBIAN_DEPARTMENTS = [
  "Amazonas", "Antioquia", "Arauca", "Atlántico", "Bolívar",
  "Boyacá", "Caldas", "Caquetá", "Casanare", "Cauca",
  "Cesar", "Chocó", "Córdoba", "Cundinamarca", "Guainía",
  "Guaviare", "Huila", "La Guajira", "Magdalena", "Meta",
  "Nariño", "Norte de Santander", "Putumayo", "Quindío",
  "Risaralda", "San Andrés y Providencia", "Santander",
  "Sucre", "Tolima", "Valle del Cauca", "Vaupés", "Vichada",
];

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { createOrder } = useOrders();

  const [fields, setFields] = useState<FormFields>({
    full_name: "",
    email: "",
    phone: "",
    department: "",
    city: "",
    address_line: "",
    notes: "",
  });
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [stockConflicts, setStockConflicts] = useState<StockConflict[]>([]);
  const [serverError, setServerError] = useState("");

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
        <span className="text-5xl">🛒</span>
        <h1 className="text-2xl font-bold text-text">
          No hay productos en el carrito
        </h1>
        <Link to="/catalog">
          <Button>Ver catálogo</Button>
        </Link>
      </div>
    );
  }

  function set(field: keyof FormFields, value: string) {
    setFields((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStockConflicts([]);
    setServerError("");
    setSubmitting(true);

    try {
      // 1. Validate stock in real time
      const conflicts = await validateStock(items);
      if (conflicts.length > 0) {
        setStockConflicts(conflicts);
        setSubmitting(false);
        return;
      }

      // 2. Create order in Supabase
      const order = await createOrder({
        cartItems: items,
        customer: {
          full_name: fields.full_name,
          email: fields.email,
          phone: fields.phone,
        },
        shippingAddress: {
          department: fields.department,
          city: fields.city,
          address_line: fields.address_line,
        },
        notes: fields.notes || undefined,
      });

      // 3. Clear cart and go to confirmation
      clearCart();
      navigate("/order-confirm", {
        state: {
          orderNumber: order.order_number,
          total: order.total,
          customerName: fields.full_name,
        },
      });
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Error al crear el pedido"
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm uppercase tracking-[0.3em] text-accent">
          Checkout
        </p>
        <h1 className="text-3xl font-bold text-text">Datos de envío</h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Stock conflicts alert */}
          {stockConflicts.length > 0 && (
            <div className="rounded-3xl border border-orange-200 bg-orange-50 p-5">
              <div className="flex items-center gap-2 mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-orange-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="font-semibold text-orange-700">
                  Hay productos con stock insuficiente
                </p>
              </div>
              <ul className="space-y-2">
                {stockConflicts.map((c) => (
                  <li
                    key={c.product_id}
                    className="flex items-center justify-between gap-3 text-sm rounded-2xl bg-white/60 px-4 py-2.5"
                  >
                    <span className="font-medium text-orange-800">{c.product_name}</span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {c.available === 0 ? (
                        <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                          Agotado
                        </span>
                      ) : (
                        <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-700">
                          Disponible: {c.available}
                        </span>
                      )}
                      <span className="text-xs text-orange-600">Pediste: {c.requested}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <Link
                to="/cart"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-orange-700 underline underline-offset-2"
              >
                Ajustar carrito
              </Link>
            </div>
          )}

          {/* Server error */}
          {serverError && (
            <div className="flex gap-4 rounded-3xl border border-red-200 bg-red-50 p-5">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856C18.07 19 19 17.862 19 16.5c0-.513-.16-1.001-.458-1.409L13.542 5.1C13.13 4.41 12.59 4 12 4s-1.13.41-1.542 1.1L5.458 15.091C5.16 15.499 5 15.987 5 16.5c0 1.362.93 2.5 2.062 2.5z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-red-700">Error al procesar el pedido</p>
                <p className="mt-1 text-sm text-red-600">{serverError}</p>
                <button
                  type="button"
                  onClick={() => setServerError("")}
                  className="mt-2 text-sm font-semibold text-red-700 underline underline-offset-2 hover:text-red-800"
                >
                  Reintentar
                </button>
              </div>
            </div>
          )}

          <div className="surface rounded-[2rem] p-6 space-y-5">
            <h2 className="font-semibold text-text">Información de contacto</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Nombre completo *"
                name="full_name"
                value={fields.full_name}
                onChange={(e) => set("full_name", e.target.value)}
                placeholder="Ej. María Gómez"
                required
              />
              <Input
                label="Email *"
                name="email"
                type="email"
                value={fields.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="Ej. maria@mail.com"
                required
              />
            </div>
            <Input
              label="Teléfono *"
              name="phone"
              type="tel"
              value={fields.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="Ej. 3001234567"
              required
            />
          </div>

          <div className="surface rounded-[2rem] p-6 space-y-5">
            <h2 className="font-semibold text-text">Dirección de envío</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block space-y-2 text-sm">
                <span className="font-medium text-text">Departamento *</span>
                <select
                  name="department"
                  value={fields.department}
                  onChange={(e) => set("department", e.target.value)}
                  required
                  className="w-full rounded-3xl border border-border bg-white px-4 py-3 text-sm text-text shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                >
                  <option value="">Selecciona un departamento</option>
                  {COLOMBIAN_DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </label>
              <Input
                label="Ciudad / Municipio *"
                name="city"
                value={fields.city}
                onChange={(e) => set("city", e.target.value)}
                placeholder="Ej. Bogotá"
                required
              />
            </div>
            <Input
              label="Dirección *"
              name="address_line"
              value={fields.address_line}
              onChange={(e) => set("address_line", e.target.value)}
              placeholder="Calle 123 #45-67, Barrio El Campo"
              required
            />
            <label className="block space-y-2 text-sm">
              <span className="font-medium text-text">
                Notas adicionales (opcional)
              </span>
              <textarea
                name="notes"
                value={fields.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="Indicaciones de entrega, referencias, etc."
                rows={3}
                className="w-full rounded-3xl border border-border bg-white px-4 py-3 text-sm text-text shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
              />
            </label>
          </div>

          {/* Privacy */}
          <label className="flex cursor-pointer items-start gap-3 rounded-3xl border border-border bg-white p-4 text-sm text-text shadow-sm">
            <input
              type="checkbox"
              checked={privacyAccepted}
              onChange={(e) => setPrivacyAccepted(e.target.checked)}
              required
              className="mt-1 h-5 w-5 rounded border-border text-primary focus:ring-primary"
            />
            <span>
              He leído y acepto la{" "}
              <Link
                to="/politica-privacidad"
                target="_blank"
                className="font-medium underline text-primary hover:text-primary/80"
              >
                política de tratamiento de datos personales
              </Link>
            </span>
          </label>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={submitting || !privacyAccepted}
              className="min-w-[200px]"
            >
              {submitting ? "Enviando pedido..." : "Confirmar pedido"}
            </Button>
          </div>
        </form>

        {/* Order summary */}
        <div className="h-fit space-y-4">
          <button
            type="button"
            onClick={() => setSummaryOpen((v) => !v)}
            className="flex w-full items-center justify-between rounded-[2rem] border border-border bg-white p-5 font-semibold text-text shadow-sm transition hover:bg-slate-50 lg:hidden"
          >
            <span>Ver resumen del pedido</span>
            <span className="text-accent font-bold">{formatCOP(subtotal)}</span>
          </button>

          <div
            className={`surface rounded-[2rem] p-6 space-y-4 lg:block ${summaryOpen ? "block" : "hidden"}`}
          >
            <h2 className="font-semibold text-text">Resumen</h2>
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.product_id}
                  className="flex items-center gap-3 text-sm"
                >
                  <img
                    src={item.image_url}
                    alt={item.product_name}
                    className="h-10 w-10 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-text">
                      {item.product_name}
                    </p>
                    <p className="text-text-muted">× {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-text shrink-0">
                    {formatCOP(item.price_applied * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="border-t border-border pt-4 flex items-center justify-between">
              <p className="font-semibold text-text">Total</p>
              <p className="text-2xl font-bold text-text font-mono">
                {formatCOP(subtotal)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
