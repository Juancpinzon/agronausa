import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-white py-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 text-sm text-text-muted sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <p>© 2026 Agronausa. Catálogo agropecuario B2C y B2B.</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <span>Diseño pensado para campo y móvil.</span>
          <Link to="/politica-de-privacidad" className="underline hover:text-text">
            Política de privacidad
          </Link>
          <Link to="/terminos-y-condiciones" className="underline hover:text-text">
            Términos y condiciones
          </Link>
        </div>
      </div>
    </footer>
  );
}
