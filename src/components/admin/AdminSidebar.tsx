import { NavLink, Link } from "react-router-dom";
import { useAlerts } from "../../hooks/useAlerts";
import { 
  LayoutDashboard, 
  Bell, 
  ShoppingCart, 
  Users, 
  BarChart, 
  Package, 
  FolderTree, 
  ClipboardList, 
  Truck, 
  UserCog, 
  Settings,
  Store
} from "lucide-react";

export default function AdminSidebar() {
  const { criticalCount } = useAlerts();

  return (
    <aside className="flex h-full w-64 flex-col overflow-y-auto border-r border-border bg-surface">
      <div className="border-b border-border p-6">
        <h2 className="mb-4 font-display text-xl font-bold text-text">Admin Panel</h2>
        <Link
          to="/"
          className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg border border-primary/30 font-ui font-medium text-primary transition-colors hover:bg-primary/8"
        >
          <Store size={18} />
          Ir a la Tienda
        </Link>
      </div>

      <nav className="flex flex-col gap-6 p-4 pb-8">
        {/* CONTROL DE MANDO */}
        <div>
          <h3 className="mb-2 px-3 font-ui text-[10px] font-bold uppercase tracking-wider text-text-muted">
            Control de Mando
          </h3>
          <ul className="space-y-1">
            <li>
              <NavItem to="/admin" icon={<LayoutDashboard size={20} />} label="Tablero (KPIs)" end />
            </li>
            <li>
              <NavItem
                to="/admin/alerts"
                icon={<Bell size={20} />}
                label="Alertas Críticas"
                badge={criticalCount}
              />
            </li>
          </ul>
        </div>

        {/* VENTAS Y OPERACIONES */}
        <div>
          <h3 className="mb-2 px-3 font-ui text-[10px] font-bold uppercase tracking-wider text-text-muted">
            Ventas y Operaciones
          </h3>
          <ul className="space-y-1">
            <li>
              <NavItem to="/admin/orders" icon={<ShoppingCart size={20} />} label="Gestión de Pedidos" />
            </li>
            <li>
              <NavItem to="/admin/customers" icon={<Users size={20} />} label="Cartera de Clientes" />
            </li>
            <li>
              <NavItem to="/admin/analytics" icon={<BarChart size={20} />} label="Análisis Financiero" />
            </li>
          </ul>
        </div>

        {/* CATÁLOGO */}
        <div>
          <h3 className="mb-2 px-3 font-ui text-[10px] font-bold uppercase tracking-wider text-text-muted">
            Catálogo
          </h3>
          <ul className="space-y-1">
            <li>
              <NavItem to="/admin/products" icon={<Package size={20} />} label="Productos" />
            </li>
            <li>
              <NavItem to="/admin/categories" icon={<FolderTree size={20} />} label="Categorías" />
            </li>
            <li>
              <NavItem to="/admin/inventory" icon={<ClipboardList size={20} />} label="Inventario" />
            </li>
          </ul>
        </div>

        {/* PROVEEDORES */}
        <div>
          <h3 className="mb-2 px-3 font-ui text-[10px] font-bold uppercase tracking-wider text-text-muted">
            Proveedores
          </h3>
          <ul className="space-y-1">
            <li>
              <NavItem to="/admin/suppliers" icon={<Truck size={20} />} label="Gestión de Proveedores" />
            </li>
          </ul>
        </div>

        {/* SISTEMA */}
        <div>
          <h3 className="mb-2 px-3 font-ui text-[10px] font-bold uppercase tracking-wider text-text-muted">
            Sistema
          </h3>
          <ul className="space-y-1">
            <li>
              <NavItem to="/admin/users" icon={<UserCog size={20} />} label="Usuarios y Roles" />
            </li>
            <li>
              <NavItem to="/admin/settings" icon={<Settings size={20} />} label="Configuración Maestra" />
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
}

function NavItem({
  to,
  icon,
  label,
  badge,
  end,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  end?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex min-h-[48px] items-center gap-3 rounded-lg px-3 transition-colors ${
          isActive
            ? "bg-primary/10 font-medium text-primary"
            : "text-text-muted hover:bg-black/5 hover:text-text"
        }`
      }
    >
      <span className="flex h-5 w-5 items-center justify-center text-current opacity-80">{icon}</span>
      <span className="flex-1 font-ui text-sm">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-error text-[10px] font-bold text-white">
          {badge}
        </span>
      )}
    </NavLink>
  );
}
