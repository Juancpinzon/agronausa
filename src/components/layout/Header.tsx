import { NavLink, Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
  { label: "Inicio", to: "/" },
  { label: "Catálogo", to: "/catalog" },
];

export default function Header() {
  const { itemCount, openCart } = useCart();
  const { user, profile, logout } = useAuth();

  const isAdmin =
    (user?.user_metadata?.role as string | undefined) === "admin" ||
    (user?.app_metadata?.role as string | undefined) === "admin";

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-2 sm:px-6 lg:px-8">
        {/* Logo */}
        <NavLink className="text-xl font-bold text-text" to="/">
          Agronausa
        </NavLink>

        {/* Desktop nav — tight, right after logo */}
        <nav className="hidden flex-1 items-center gap-0.5 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-text hover:bg-slate-100"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-accent text-white"
                    : "text-accent hover:bg-accent/10"
                }`
              }
            >
              Admin
            </NavLink>
          )}
        </nav>

        {/* Right side actions */}
        <div className="ml-auto flex items-center gap-1">
          {/* Auth — desktop only */}
          {user ? (
            <div className="hidden items-center gap-1 md:flex">
              <Link
                to="/account"
                className="rounded-full px-3 py-2 text-sm font-medium text-text transition hover:bg-slate-100"
              >
                {profile?.full_name?.split(" ")[0] ?? "Mi cuenta"}
              </Link>
              <button
                onClick={() => void logout()}
                className="rounded-full px-3 py-2 text-sm font-medium text-text-muted transition hover:bg-slate-100"
              >
                Salir
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden rounded-full px-3 py-2 text-sm font-medium text-text transition hover:bg-slate-100 md:block"
            >
              Ingresar
            </Link>
          )}

          {/* Cart */}
          <button
            onClick={openCart}
            aria-label={`Abrir carrito — ${itemCount} ${itemCount === 1 ? "artículo" : "artículos"}`}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-text transition hover:bg-slate-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
