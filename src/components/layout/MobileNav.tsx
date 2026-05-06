import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";

export default function MobileNav() {
  const { user, profile, logout } = useAuth();
  const { itemCount, openCart } = useCart();
  const [open, setOpen] = useState(false);

  const isAdmin =
    (user?.user_metadata?.role as string | undefined) === "admin" ||
    (user?.app_metadata?.role as string | undefined) === "admin";

  function close() {
    setOpen(false);
  }

  return (
    <>
      {/* Bottom tab bar — only visible on mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-border bg-bg/95 backdrop-blur-md md:hidden">
        <NavLink
          to="/"
          end
          onClick={close}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-4 py-3 text-[10px] font-medium transition ${
              isActive ? "text-primary" : "text-text-muted"
            }`
          }
        >
          <HomeIcon />
          Inicio
        </NavLink>

        <NavLink
          to="/catalog"
          onClick={close}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-4 py-3 text-[10px] font-medium transition ${
              isActive ? "text-primary" : "text-text-muted"
            }`
          }
        >
          <CatalogIcon />
          Catálogo
        </NavLink>

        {/* Cart */}
        <button
          onClick={() => {
            close();
            openCart();
          }}
          className="relative flex flex-col items-center gap-0.5 px-4 py-3 text-[10px] font-medium text-text-muted"
        >
          <CartIcon />
          {itemCount > 0 && (
            <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white">
              {itemCount > 9 ? "9+" : itemCount}
            </span>
          )}
          Carrito
        </button>

        {/* More / hamburger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex flex-col items-center gap-0.5 px-4 py-3 text-[10px] font-medium text-text-muted"
        >
          <MenuIcon />
          Menú
        </button>
      </nav>

      {/* Slide-up drawer */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
            onClick={close}
          />

          {/* Sheet */}
          <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-surface shadow-2xl md:hidden">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-border" />
            </div>

            <div className="px-4 pb-8 pt-2 space-y-1">
              {user ? (
                <>
                  <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
                    {profile?.full_name ?? user.email}
                  </p>

                  <DrawerLink to="/account" onClick={close}>
                    Mi cuenta
                  </DrawerLink>

                  {isAdmin && (
                    <DrawerLink
                      to="/admin"
                      onClick={close}
                      accent
                    >
                      Panel Admin
                    </DrawerLink>
                  )}

                  <button
                    onClick={() => {
                      close();
                      void logout();
                    }}
                    className="flex w-full items-center rounded-2xl px-4 py-3.5 text-sm font-medium text-text-muted transition hover:bg-bg"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <DrawerLink to="/login" onClick={close}>
                    Iniciar sesión
                  </DrawerLink>
                  <DrawerLink to="/register" onClick={close}>
                    Crear cuenta
                  </DrawerLink>
                </>
              )}

              <div className="border-t border-border pt-1 mt-1">
                <DrawerLink to="/register?type=negocio" onClick={close} accent>
                  Soy distribuidor
                </DrawerLink>
                <DrawerLink to="/catalog" onClick={close}>
                  Catálogo
                </DrawerLink>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Spacer so page content isn't hidden behind bottom bar */}
      <div className="h-16 md:hidden" aria-hidden="true" />
    </>
  );
}

function DrawerLink({
  to,
  onClick,
  accent = false,
  children,
}: {
  to: string;
  onClick: () => void;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex w-full items-center rounded-2xl px-4 py-3.5 text-sm font-medium transition hover:bg-bg ${
        accent ? "text-accent" : "text-text"
      }`}
    >
      {children}
    </Link>
  );
}

function HomeIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
      />
    </svg>
  );
}

function CatalogIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </svg>
  );
}
