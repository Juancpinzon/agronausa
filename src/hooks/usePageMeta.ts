import { useEffect } from "react";

const BASE_TITLE = "Agronausa";

/**
 * Actualiza dinámicamente el título de la página y la meta-description.
 * Llamar al inicio de cada página que necesite SEO específico.
 *
 * @param title       Título específico de la página (sin el sufijo "Agronausa")
 * @param description Meta-description opcional. Si se omite, no modifica la existente.
 */
export function usePageMeta(title: string, description?: string): void {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE;
    document.title = fullTitle;

    if (description) {
      let meta = document.querySelector<HTMLMetaElement>(
        'meta[name="description"]'
      );
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", description);
    }

    // Restaurar título base al desmontar
    return () => {
      document.title = `${BASE_TITLE} — Catálogo agropecuario B2C y B2B`;
    };
  }, [title, description]);
}
