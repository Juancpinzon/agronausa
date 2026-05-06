import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";
import { formatCOP } from "../lib/formatters";
import type { Order, OrderStatus } from "../types";
import Button from "../components/ui/Button";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pendiente:      "Pendiente",
  confirmado:     "Confirmado",
  en_preparacion: "En preparación",
  despachado:     "Despachado",
  entregado:      "Entregado",
  cancelado:      "Cancelado",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pendiente:      "bg-warning/12 text-warning border border-warning/25",
  confirmado:     "bg-primary/10 text-primary border border-primary/20",
  en_preparacion: "bg-accent/12 text-accent border border-accent/25",
  despachado:     "bg-primary/18 text-primary border border-primary/30",
  entregado:      "bg-success/10 text-success border border-success/25",
  cancelado:      "bg-error/10 text-error border border-error/20",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `hace ${days}d`;
}

export default function Account() {
  const { user, profile, loading: authLoading, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!user) return;
    setOrdersLoading(true);
    supabase
      .from("orders")
      .select("*")
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders((data as Order[]) ?? []);
        setOrdersLoading(false);
      });
  }, [user]);

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
  }

  if (authLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-text-muted">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 py-12 text-center">
        <span className="text-5xl">🔐</span>
        <div>
          <h1 className="font-display text-2xl font-bold text-text">Mi cuenta</h1>
          <p className="mt-2 text-text-muted">Inicia sesión para ver tu historial de pedidos.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/login"><Button>Iniciar sesión</Button></Link>
          <Link to="/register"><Button variant="secondary">Crear cuenta</Button></Link>
        </div>
        <p className="text-sm text-text-muted">
          También puedes{" "}
          <Link to="/catalog" className="font-medium text-primary underline">explorar el catálogo</Link>{" "}
          sin necesidad de cuenta.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-ui text-[11px] font-medium uppercase tracking-[0.14em] text-accent">
            Mi cuenta
          </p>
          <h1 className="font-display text-3xl font-bold text-text">
            {profile?.full_name || user.email}
          </h1>
          {profile?.customer_type === "negocio" && (
            <p className="mt-1 text-sm text-text-muted">
              {profile.business_name ?? "Negocio"} · Cliente B2B
              {profile.has_special_pricing && (
                <span className="ml-2 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 font-ui text-xs font-semibold text-primary">
                  Precios especiales
                </span>
              )}
            </p>
          )}
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="self-start rounded-full border border-border px-4 py-2 font-ui text-sm font-medium text-text-muted transition-colors hover:border-primary/20 hover:bg-primary/8 hover:text-primary sm:self-auto"
        >
          {loggingOut ? "Saliendo..." : "Cerrar sesión"}
        </button>
      </header>

      {/* Profile card */}
      <section className="surface p-6">
        <h2 className="font-display mb-4 font-bold text-text">Datos de la cuenta</h2>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-ui text-[10px] font-medium uppercase tracking-wide text-text-muted">Correo</dt>
            <dd className="mt-0.5 font-medium text-text">{user.email}</dd>
          </div>
          {profile?.phone && (
            <div>
              <dt className="font-ui text-[10px] font-medium uppercase tracking-wide text-text-muted">Teléfono</dt>
              <dd className="mt-0.5 font-medium text-text">{profile.phone}</dd>
            </div>
          )}
          <div>
            <dt className="font-ui text-[10px] font-medium uppercase tracking-wide text-text-muted">Tipo de cliente</dt>
            <dd className="mt-0.5 font-medium text-text capitalize">
              {profile?.customer_type === "negocio" ? "Empresa / Negocio" : "Persona natural"}
            </dd>
          </div>
          {profile?.nit && (
            <div>
              <dt className="font-ui text-[10px] font-medium uppercase tracking-wide text-text-muted">NIT</dt>
              <dd className="mt-0.5 font-medium text-text">{profile.nit}</dd>
            </div>
          )}
        </dl>
      </section>

      {/* Order history */}
      <section className="space-y-4">
        <h2 className="font-display text-lg font-bold text-text">Mis pedidos</h2>

        {ordersLoading ? (
          <div className="surface p-6 text-center text-text-muted">Cargando pedidos...</div>
        ) : orders.length === 0 ? (
          <div className="surface space-y-4 p-8 text-center">
            <p className="text-text-muted">Aún no tienes pedidos registrados en esta cuenta.</p>
            <Link to="/catalog"><Button>Ver catálogo</Button></Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {orders.map((order) => (
              <li
                key={order.id}
                className="surface flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-bold text-text">
                      {order.order_number}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 font-ui text-[10px] font-semibold ${STATUS_COLORS[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted">
                    {order.items.length}{" "}
                    {order.items.length === 1 ? "producto" : "productos"} · {timeAgo(order.created_at)}
                  </p>
                  {order.notes && (
                    <p className="text-xs italic text-text-muted">"{order.notes}"</p>
                  )}
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-display text-xl font-bold text-text">
                    {formatCOP(order.total)}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1 sm:justify-end">
                    {order.items.slice(0, 3).map((item, i) => (
                      <span key={i} className="rounded-full border border-border bg-bg px-2 py-0.5 font-ui text-[10px] text-text-muted">
                        {item.product_name} ×{item.quantity}
                      </span>
                    ))}
                    {order.items.length > 3 && (
                      <span className="rounded-full border border-border bg-bg px-2 py-0.5 font-ui text-[10px] text-text-muted">
                        +{order.items.length - 3} más
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
