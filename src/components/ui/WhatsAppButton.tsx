import { useLocation } from "react-router-dom";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER as string;

const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hola, estoy en Agronausa y me gustaría consultar sobre un producto 🌱"
);

const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

/**
 * Botón flotante de WhatsApp.
 * Regla de negocio: oculto en /checkout para no interrumpir el embudo de conversión.
 */
export default function WhatsAppButton() {
  const { pathname } = useLocation();

  // Ocultar en checkout para no distraer al usuario en el embudo de conversión
  if (pathname === "/checkout") return null;

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Consultar por WhatsApp"
      title="Consultar por WhatsApp"
      className="
        group
        fixed bottom-6 right-5 z-40
        flex h-14 w-14 items-center justify-center
        rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/40
        transition-all duration-300
        hover:scale-110 hover:shadow-xl hover:shadow-[#25D366]/50
        focus:outline-none focus:ring-4 focus:ring-[#25D366]/40
        sm:bottom-8 sm:right-8
      "
    >
      {/* Pulse ring animation */}
      <span
        className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping"
        aria-hidden="true"
      />

      {/* WhatsApp icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="relative h-7 w-7 fill-white transition-transform duration-300 group-hover:scale-110"
        aria-hidden="true"
      >
        <path d="M16.004 2.667C8.637 2.667 2.667 8.637 2.667 16c0 2.344.638 4.543 1.749 6.435L2.667 29.333l7.09-1.726A13.273 13.273 0 0 0 16.004 29.333c7.367 0 13.333-5.97 13.333-13.333 0-7.363-5.966-13.333-13.333-13.333Zm0 24.267a11.09 11.09 0 0 1-5.737-1.598l-.411-.244-4.209 1.025 1.063-4.1-.267-.42a11.06 11.06 0 0 1-1.773-6.597c0-6.136 4.997-11.133 11.133-11.133 6.137 0 11.134 4.997 11.134 11.133S22.14 26.934 16.004 26.934Zm6.106-8.332c-.335-.168-1.98-.977-2.287-1.088-.307-.112-.53-.168-.752.168-.223.336-.864 1.088-1.059 1.311-.196.224-.392.252-.727.084-.335-.168-1.413-.52-2.691-1.66-.994-.887-1.665-1.982-1.86-2.317-.196-.336-.02-.517.147-.684.151-.15.335-.392.503-.588.168-.196.223-.336.335-.56.112-.223.056-.419-.028-.588-.084-.168-.752-1.813-1.03-2.484-.271-.652-.546-.563-.752-.574l-.64-.011c-.223 0-.587.084-.895.419-.307.336-1.174 1.147-1.174 2.796 0 1.648 1.202 3.24 1.37 3.464.167.223 2.362 3.605 5.722 5.054.8.346 1.424.552 1.91.706.803.255 1.534.219 2.112.133.644-.096 1.981-.81 2.261-1.592.28-.782.28-1.453.196-1.592-.083-.14-.307-.224-.641-.392Z" />
      </svg>

      {/* Tooltip */}
      <span
        className="
          absolute right-16 top-1/2 -translate-y-1/2
          whitespace-nowrap rounded-xl
          bg-[#2C1A0E] px-3 py-1.5
          text-xs font-semibold text-white shadow-md
          opacity-0 transition-opacity duration-200
          group-hover:opacity-100
          pointer-events-none
        "
        aria-hidden="true"
      >
        Consultar por WhatsApp
      </span>
    </a>
  );
}
