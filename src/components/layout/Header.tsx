import { NavLink, Link, useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
  { label: "Inicio", to: "/" },
  { label: "Catálogo", to: "/catalog" },
];

function LeafMark() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="14" cy="14" r="14" fill="#2D6A1F" opacity="0.08" />
      <path
        d="M14 22C14 22 8 17.5 8 12.5C8 9.46 10.69 7 14 7C17.31 7 20 9.46 20 12.5C20 17.5 14 22 14 22Z"
        fill="#2D6A1F"
      />
      <path
        d="M14 22L14 11"
        stroke="#F9F6F0"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M14 15.5C14 15.5 11.5 13.5 10.5 11"
        stroke="#F9F6F0"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M14 13C14 13 16 11.5 16.5 9.5"
        stroke="#F9F6F0"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Header() {
  const { itemCount, openCart } = useCart();
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();

  const isAdmin =
    (user?.user_metadata?.role as string | undefined) === "admin" ||
    (user?.app_metadata?.role as string | undefined) === "admin";

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <NavLink
          to="/"
          className="flex shrink-0 items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-lg"
        >
          <LeafMark />
          <span className="font-display text-[1.15rem] font-bold tracking-tight text-text">
            Agronausa
          </span>
        </NavLink>

        {/* Nav principal - visible en cualquier posición */}
        <nav className="flex flex-1 items-center gap-0.5 sm:gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-2 py-1.5 text-[13px] sm:px-3.5 sm:py-2 sm:text-sm font-medium font-ui transition-colors ${
                  isActive
                    ? "text-primary bg-primary/8"
                    : "text-text hover:bg-primary/8 hover:text-primary"
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
                `rounded-full px-2 py-1.5 text-[13px] sm:px-3.5 sm:py-2 sm:text-sm font-medium font-ui transition-colors ${
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
          <Link
            to="/register?type=negocio"
            className="hidden rounded-full px-3.5 py-2 text-sm font-medium font-ui text-text-muted transition-colors hover:bg-primary/8 hover:text-primary md:block"
          >
            Soy distribuidor
          </Link>

          {user ? (
            <div className="hidden items-center gap-1 md:flex">
              <Link
                to="/account"
                className="rounded-full px-3.5 py-2 text-sm font-medium font-ui text-text transition-colors hover:bg-primary/8 hover:text-primary"
              >
                {profile?.full_name?.split(" ")[0] ?? "Mi cuenta"}
              </Link>
              <button
                onClick={() => void logout().then(() => navigate("/ingresar"))}
                className="rounded-full px-3.5 py-2 text-sm font-medium font-ui text-text-muted transition-colors hover:bg-red-500/10 hover:text-red-500"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden rounded-full px-3.5 py-2 text-sm font-medium font-ui text-text transition-colors hover:bg-primary/8 hover:text-primary md:block"
            >
              Ingresar
            </Link>
          )}

          {/* Cart */}
          <button
            onClick={openCart}
            aria-label={`Abrir carrito — ${itemCount} ${itemCount === 1 ? "artículo" : "artículos"}`}
            className="relative flex h-11 w-11 items-center justify-center rounded-full text-text transition-colors hover:bg-primary/8 hover:text-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="h-[22px] w-[22px]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-accent text-[9px] font-bold leading-none text-white ring-2 ring-bg">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
