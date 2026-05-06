import { useState } from "react";
import { useAdminOrders } from "../../hooks/useAdmin";
import { formatCOP } from "../../lib/formatters";
import type { Order, OrderStatus } from "../../types";

const STATUS_TABS: Array<{ value: OrderStatus | "todos"; label: string }> = [
  { value: "todos", label: "Todos" },
  { value: "pendiente", label: "Pendiente" },
  { value: "confirmado", label: "Confirmado" },
  { value: "en_preparacion", label: "Preparación" },
  { value: "despachado", label: "Despachado" },
  { value: "entregado", label: "Entregado" },
  { value: "cancelado", label: "Cancelado" },
];

const STATUS_STYLES: Record<OrderStatus, string> = {
  pendiente:      "bg-warning/12 text-warning border border-warning/25",
  confirmado:     "bg-primary/10 text-primary border border-primary/20",
  en_preparacion: "bg-accent/12 text-accent border border-accent/25",
  despachado:     "bg-primary/18 text-primary border border-primary/30",
  entregado:      "bg-success/10 text-success border border-success/25",
  cancelado:      "bg-error/10 text-error border border-error/20",
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pendiente: "Pendiente",
  confirmado: "Confirmado",
  en_preparacion: "En preparación",
  despachado: "Despachado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

const ALL_STATUSES: OrderStatus[] = [
  "pendiente",
  "confirmado",
  "en_preparacion",
  "despachado",
  "entregado",
  "cancelado",
];

export default function Orders() {
  const [activeTab, setActiveTab] = useState<OrderStatus | "todos">("todos");
  const { orders, loading, updateStatus, updateAdminNotes } =
    useAdminOrders(activeTab);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function toggle(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="space-y-5">
      <header>
        <p className="font-ui text-[11px] font-medium uppercase tracking-[0.14em] text-accent">
          Admin / Pedidos
        </p>
        <h1 className="font-display text-3xl font-bold text-text">Pedidos</h1>
      </header>

      {/* Status filter */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setActiveTab(tab.value);
              setExpandedId(null);
            }}
            className={`min-h-[48px] shrink-0 rounded-full px-4 font-ui text-sm font-semibold transition-colors ${
              activeTab === tab.value
                ? "bg-primary text-white"
                : "border border-border bg-surface text-text hover:bg-primary/8 hover:text-primary hover:border-primary/20"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      {!loading && orders.length === 0 && (
        <div className="surface p-12 text-center text-text-muted">
          No hay pedidos en este estado.
        </div>
      )}

      <div className="space-y-3">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            expanded={expandedId === order.id}
            onToggle={() => toggle(order.id)}
            onUpdateStatus={updateStatus}
            onUpdateNotes={updateAdminNotes}
          />
        ))}
      </div>
    </div>
  );
}

function OrderCard({
  order,
  expanded,
  onToggle,
  onUpdateStatus,
  onUpdateNotes,
}: {
  order: Order;
  expanded: boolean;
  onToggle: () => void;
  onUpdateStatus: (id: string, status: OrderStatus) => Promise<void>;
  onUpdateNotes: (id: string, notes: string) => Promise<void>;
}) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    order.status,
  );
  const [notes, setNotes] = useState(order.admin_notes ?? "");
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cs = order.customer_snapshot;
  const timeAgo = formatTimeAgo(order.created_at);
  const itemCount = order.items.length;

  async function handleStatusSave() {
    if (selectedStatus === order.status) return;
    setSavingStatus(true);
    setError(null);
    try {
      await onUpdateStatus(order.id, selectedStatus);
    } catch (e) {
      setError(String(e));
    } finally {
      setSavingStatus(false);
    }
  }

  async function handleNotesSave() {
    setSavingNotes(true);
    setError(null);
    try {
      await onUpdateNotes(order.id, notes);
    } catch (e) {
      setError(String(e));
    } finally {
      setSavingNotes(false);
    }
  }

  return (
    <div className="surface overflow-hidden">
      {/* Summary row — always visible */}
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 p-4 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm font-semibold">
              {order.order_number}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[order.status]}`}
            >
              {STATUS_LABELS[order.status]}
            </span>
          </div>
          <p className="mt-0.5 truncate text-sm text-text-muted">
            {cs.business_name ?? cs.full_name} · {timeAgo}
          </p>
          <p className="mt-0.5 text-sm font-semibold">
            {formatCOP(order.total)} ·{" "}
            {itemCount === 1 ? "1 producto" : `${itemCount} productos`}
          </p>
        </div>
        <span className="shrink-0 text-text-muted transition-transform duration-200" style={{ display: 'inline-block', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="space-y-5 border-t border-border px-4 pb-5 pt-4">
          {error && (
            <p className="rounded-xl bg-error/10 p-3 text-sm text-error">
              {error}
            </p>
          )}

          {/* Customer */}
          <section>
            <SectionLabel>Cliente</SectionLabel>
            <div className="space-y-0.5 text-sm">
              <p className="font-medium">{cs.full_name}</p>
              {cs.business_name && (
                <p className="text-text-muted">{cs.business_name}</p>
              )}
              <p className="text-text-muted">{cs.email}</p>
              <p className="text-text-muted">{cs.phone}</p>
            </div>
          </section>

          {/* Items */}
          <section>
            <SectionLabel>Productos</SectionLabel>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-text">
                    {item.quantity} {item.unit} × {item.product_name}
                  </span>
                  <span className="ml-2 shrink-0 font-display font-bold">
                    {formatCOP(item.subtotal)}
                  </span>
                </div>
              ))}
              <div className="mt-2 flex justify-between border-t border-border pt-2 text-sm font-semibold">
                <span>Total</span>
                <span className="font-display font-bold">{formatCOP(order.total)}</span>
              </div>
            </div>
          </section>

          {/* Address */}
          <section>
            <SectionLabel>Dirección de envío</SectionLabel>
            <div className="space-y-0.5 text-sm text-text-muted">
              <p>{order.shipping_address.address_line}</p>
              <p>
                {order.shipping_address.city},{" "}
                {order.shipping_address.department}
              </p>
              {order.shipping_address.reference && (
                <p className="italic">{order.shipping_address.reference}</p>
              )}
            </div>
          </section>

          {/* Customer notes */}
          {order.notes && (
            <section>
              <SectionLabel>Nota del cliente</SectionLabel>
              <p className="text-sm text-text-muted">{order.notes}</p>
            </section>
          )}

          {/* Status change */}
          <section>
            <SectionLabel>Cambiar estado</SectionLabel>
            <div className="flex gap-2">
              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value as OrderStatus)
                }
                className="min-h-[48px] flex-1 rounded-2xl border border-border bg-white px-3 text-sm text-text focus:border-primary focus:outline-none"
              >
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
              <button
                onClick={() => void handleStatusSave()}
                disabled={savingStatus || selectedStatus === order.status}
                className="min-h-[48px] rounded-2xl bg-primary px-4 text-sm font-semibold text-white transition disabled:opacity-50"
              >
                {savingStatus ? "..." : "Guardar"}
              </button>
            </div>
          </section>

          {/* Admin notes */}
          <section>
            <SectionLabel>Nota interna</SectionLabel>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Solo visible para el admin..."
              rows={3}
              className="w-full resize-none rounded-2xl border border-border bg-white px-3 py-3 text-sm text-text focus:border-primary focus:outline-none"
            />
            <button
              onClick={() => void handleNotesSave()}
              disabled={savingNotes}
              className="mt-2 min-h-[48px] w-full rounded-2xl border border-border bg-surface text-sm font-semibold hover:bg-bg disabled:opacity-50 transition"
            >
              {savingNotes ? "Guardando..." : "Guardar nota"}
            </button>
          </section>
        </div>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="mb-2 font-ui text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted">
      {children}
    </p>
  );
}

function formatTimeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `hace ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `hace ${days}d`;
}
