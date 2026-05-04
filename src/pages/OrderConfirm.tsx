import { useLocation, Link, Navigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { formatCOP } from "../lib/formatters";

interface LocationState {
  orderNumber: string;
  total: number;
  customerName: string;
}

export default function OrderConfirm() {
  const { state } = useLocation();
  const s = state as LocationState | null;

  // Guard: if the user lands here directly without an order, redirect
  if (!s?.orderNumber) {
    return <Navigate to="/catalog" replace />;
  }

  const whatsapp = import.meta.env["VITE_WHATSAPP_NUMBER"] as string | undefined;
  const waUrl = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(
        `Hola Agronausa, acabo de hacer el pedido ${s.orderNumber}. ¿Podrían confirmarme el estado?`
      )}`
    : undefined;

  return (
    <div className="mx-auto max-w-2xl space-y-8 py-8">
      <div className="surface rounded-[2rem] p-8 text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="h-8 w-8 text-success"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>

        <p className="text-sm uppercase tracking-[0.3em] text-accent">
          Confirmación
        </p>
        <h1 className="text-4xl font-bold text-text">¡Pedido recibido!</h1>

        {s.customerName && (
          <p className="text-text-muted">
            Gracias, <strong>{s.customerName}</strong>. Tu pedido fue registrado
            correctamente.
          </p>
        )}

        {/* Order number highlight */}
        <div className="mx-auto mt-2 inline-block rounded-3xl bg-primary/5 px-8 py-4">
          <p className="text-xs uppercase tracking-[0.25em] text-text-muted">
            Número de pedido
          </p>
          <p className="mt-1 text-3xl font-bold text-primary font-mono">
            {s.orderNumber}
          </p>
        </div>

        {s.total > 0 && (
          <p className="text-text-muted">
            Total:{" "}
            <span className="font-semibold text-text">{formatCOP(s.total)}</span>
          </p>
        )}

        <p className="text-sm text-text-muted pt-2">
          David revisará tu pedido y se pondrá en contacto contigo para
          coordinar la entrega y el pago.
        </p>

        <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-center">
          <Link to="/catalog">
            <Button>Seguir comprando</Button>
          </Link>
          {waUrl && (
            <a href={waUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="mr-2 h-4 w-4 text-[#25D366]"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Consultar por WhatsApp
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
