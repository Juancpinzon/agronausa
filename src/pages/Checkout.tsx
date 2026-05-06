import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useOrders, validateStock } from "../hooks/useOrders";
import { formatCOP } from "../lib/formatters";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import ConsentCheckboxes, { ConsentState } from "../components/checkout/ConsentCheckboxes";
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

const selectClass =
  "w-full rounded-xl border border-border bg-white px-4 py-3 font-body text-sm text-text shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10";

const textareaClass =
  "w-full resize-none rounded-xl border border-border bg-white px-4 py-3 font-body text-sm text-text shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { createOrder } = useOrders();

  const [fields, setFields] = useState<FormFields>({
    full_name: "", email: "", phone: "",
    department: "", city: "", address_line: "", notes: "",
  });
  const [consent, setConsent] = useState<ConsentState>({
    consentRequired: false, consentMarketing: false, policyVersion: "",
  });
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [stockConflicts, setStockConflicts] = useState<StockConflict[]>([]);
  const [serverError, setServerError] = useState("");

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
        <span className="text-5xl">🛒</span>
        <h1 className="font-display text-2xl font-bold text-text">
          No hay productos en el carrito
        </h1>
        <Link to="/catalog"><Button>Ver catálogo</Button></Link>
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
      const conflicts = await validateStock(items);
      if (conflicts.length > 0) {
        setStockConflicts(conflicts);
        setSubmitting(false);
        return;
      }
      const order = await createOrder({
        cartItems: items,
        customer: { full_name: fields.full_name, email: fields.email, phone: fields.phone },
        shippingAddress: { department: fields.department, city: fields.city, address_line: fields.address_line },
        notes: fields.notes || undefined,
        consentRequired: consent.consentRequired,
        consentMarketing: consent.consentMarketing,
        policyVersion: consent.policyVersion,
      });
      clearCart();
      navigate("/order-confirm", {
        state: { orderNumber: order.order_number, total: order.total, customerName: fields.full_name },
      });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Error al crear el pedido");
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="font-ui text-[11px] font-medium uppercase tracking-[0.14em] text-accent">
          Checkout
        </p>
        <h1 className="font-display text-3xl font-bold text-text">Datos de envío</h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Stock conflicts */}
          {stockConflicts.length > 0 && (
            <div className="rounded-2xl border border-warning/30 bg-warning/8 p-5">
              <div className="mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-ui font-semibold text-warning">Hay productos con stock insuficiente</p>
              </div>
              <ul className="space-y-2">
                {stockConflicts.map((c) => (
                  <li key={c.product_id} className="flex items-center justify-between gap-3 rounded-xl bg-surface/70 px-4 py-2.5 text-sm">
                    <span className="font-medium text-text">{c.product_name}</span>
                    <div className="flex shrink-0 items-center gap-2">
                      {c.available === 0
                        ? <span className="rounded-full bg-error/10 px-2.5 py-0.5 font-ui text-xs font-semibold text-error">Agotado</span>
                        : <span className="rounded-full bg-warning/15 px-2.5 py-0.5 font-ui text-xs font-semibold text-warning">Disponible: {c.available}</span>
                      }
                      <span className="text-xs text-text-muted">Pediste: {c.requested}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <Link to="/cart" className="mt-4 inline-flex items-center gap-1 font-ui text-sm font-semibold text-warning underline underline-offset-2">
                Ajustar carrito
              </Link>
            </div>
          )}

          {/* Server error */}
          {serverError && (
            <div className="flex gap-4 rounded-2xl border border-error/20 bg-error/5 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856C18.07 19 19 17.862 19 16.5c0-.513-.16-1.001-.458-1.409L13.542 5.1C13.13 4.41 12.59 4 12 4s-1.13.41-1.542 1.1L5.458 15.091C5.16 15.499 5 15.987 5 16.5c0 1.362.93 2.5 2.062 2.5z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-ui font-semibold text-error">Error al procesar el pedido</p>
                <p className="mt-1 text-sm text-error/80">{serverError}</p>
                <button type="button" onClick={() => setServerError("")} className="mt-2 font-ui text-sm font-semibold text-error underline underline-offset-2 hover:opacity-80">
                  Reintentar
                </button>
              </div>
            </div>
          )}

          {/* Contact info */}
          <div className="surface space-y-5 p-6">
            <h2 className="font-display font-bold text-text">Información de contacto</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Nombre completo *" name="full_name" value={fields.full_name} onChange={(e) => set("full_name", e.target.value)} placeholder="Ej. María Gómez" required />
              <Input label="Email *" name="email" type="email" value={fields.email} onChange={(e) => set("email", e.target.value)} placeholder="Ej. maria@mail.com" required />
            </div>
            <Input label="Teléfono *" name="phone" type="tel" value={fields.phone} onChange={(e) => set("phone", e.target.value)} placeholder="Ej. 3001234567" required />
          </div>

          {/* Shipping address */}
          <div className="surface space-y-5 p-6">
            <h2 className="font-display font-bold text-text">Dirección de envío</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block space-y-2 text-sm">
                <span className="font-ui font-medium text-text">Departamento *</span>
                <select name="department" value={fields.department} onChange={(e) => set("department", e.target.value)} required className={selectClass}>
                  <option value="">Selecciona un departamento</option>
                  {COLOMBIAN_DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </label>
              <Input label="Ciudad / Municipio *" name="city" value={fields.city} onChange={(e) => set("city", e.target.value)} placeholder="Ej. Bogotá" required />
            </div>
            <Input label="Dirección *" name="address_line" value={fields.address_line} onChange={(e) => set("address_line", e.target.value)} placeholder="Calle 123 #45-67, Barrio El Campo" required />
            <label className="block space-y-2 text-sm">
              <span className="font-ui font-medium text-text">Notas adicionales (opcional)</span>
              <textarea name="notes" value={fields.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Indicaciones de entrega, referencias, etc." rows={3} className={textareaClass} />
            </label>
          </div>

          {/* Consent */}
          <ConsentCheckboxes onChange={setConsent} />

          <div className="flex justify-end">
            <Button type="submit" disabled={submitting || !consent.consentRequired} className="min-w-[200px]">
              {submitting ? "Enviando pedido..." : "Confirmar pedido"}
            </Button>
          </div>
        </form>

        {/* Order summary */}
        <div className="h-fit space-y-3">
          <button
            type="button"
            onClick={() => setSummaryOpen((v) => !v)}
            className="flex w-full items-center justify-between rounded-2xl border border-border bg-surface p-5 font-ui font-semibold text-text shadow-sm transition-colors hover:bg-primary/8 lg:hidden"
          >
            <span>Ver resumen del pedido</span>
            <span className="font-display font-bold text-accent">{formatCOP(subtotal)}</span>
          </button>

          <div className={`surface space-y-4 p-6 lg:block ${summaryOpen ? "block" : "hidden"}`}>
            <h2 className="font-display font-bold text-text">Resumen</h2>
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.product_id} className="flex items-center gap-3 text-sm">
                  <img src={item.image_url} alt={item.product_name} className="h-10 w-10 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-text">{item.product_name}</p>
                    <p className="text-text-muted">× {item.quantity}</p>
                  </div>
                  <p className="shrink-0 font-semibold text-text">
                    {formatCOP(item.price_applied * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <p className="font-ui font-semibold text-text">Total</p>
              <p className="font-display text-2xl font-bold text-text">{formatCOP(subtotal)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
