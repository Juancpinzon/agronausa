import { Link } from "react-router-dom";
import { useAdminDashboard } from "../../hooks/useAdmin";
import { formatCOP } from "../../lib/formatters";
import { ROUTES } from "../../lib/constants";

export default function Dashboard() {
  const { metrics, loading, refresh } = useAdminDashboard();

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between">
        <div>
          <p className="font-ui text-[11px] font-medium uppercase tracking-[0.14em] text-accent">Admin</p>
          <h1 className="font-display text-3xl font-bold text-text">Panel de control</h1>
        </div>
        <button
          onClick={() => void refresh()}
          className="mt-1 rounded-full border border-border bg-surface px-4 py-2 font-ui text-sm text-text-muted transition-colors hover:bg-primary/8 hover:text-primary hover:border-primary/20"
        >
          ↻ Actualizar
        </button>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard
          label="Pedidos hoy"
          value={loading ? "—" : String(metrics?.ordersToday ?? 0)}
          highlight="primary"
        />
        <MetricCard
          label="Pendientes"
          value={loading ? "—" : String(metrics?.pendingOrders ?? 0)}
          highlight={metrics && metrics.pendingOrders > 0 ? "warning" : "none"}
        />
        <MetricCard
          label="Ingresos del mes"
          value={loading ? "—" : formatCOP(metrics?.monthlyRevenue ?? 0)}
          highlight="none"
          small
        />
        <MetricCard
          label="Bajo stock"
          value={loading ? "—" : String(metrics?.lowStockProducts ?? 0)}
          highlight={
            metrics && metrics.lowStockProducts > 0 ? "error" : "none"
          }
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Link
          to={ROUTES.adminOrders}
          className="surface block p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(45,106,31,0.12)] active:translate-y-0"
        >
          <p className="mb-2 text-2xl">📦</p>
          <h2 className="font-display mb-0.5 text-base font-bold">Pedidos</h2>
          <p className="text-sm text-text-muted">Revisa y actualiza estados</p>
        </Link>
        <Link
          to={ROUTES.adminProducts}
          className="surface block p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(45,106,31,0.12)] active:translate-y-0"
        >
          <p className="mb-2 text-2xl">🌱</p>
          <h2 className="font-display mb-0.5 text-base font-bold">Productos</h2>
          <p className="text-sm text-text-muted">Gestiona stock, fotos y precios</p>
        </Link>
        <Link
          to={ROUTES.adminCustomers}
          className="surface block p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(45,106,31,0.12)] active:translate-y-0"
        >
          <p className="mb-2 text-2xl">👥</p>
          <h2 className="font-display mb-0.5 text-base font-bold">Clientes</h2>
          <p className="text-sm text-text-muted">Condiciones B2B y precios especiales</p>
        </Link>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  highlight = "none",
  small = false,
}: {
  label: string;
  value: string;
  highlight?: "primary" | "warning" | "error" | "none";
  small?: boolean;
}) {
  const valueColor =
    highlight === "primary"
      ? "text-primary"
      : highlight === "warning"
        ? "text-warning"
        : highlight === "error"
          ? "text-error"
          : "text-text";

  const borderColor =
    highlight === "warning"
      ? "border-warning/40"
      : highlight === "error"
        ? "border-error/40"
        : "border-border";

  return (
    <div className={`surface p-4 sm:p-5 border ${borderColor}`}>
      <p className="font-ui mb-1 text-[10px] font-medium uppercase tracking-[0.12em] text-text-muted">
        {label}
      </p>
      <p
        className={`font-display font-bold leading-tight ${valueColor} ${small ? "text-xl" : "text-3xl"}`}
      >
        {value}
      </p>
    </div>
  );
}
