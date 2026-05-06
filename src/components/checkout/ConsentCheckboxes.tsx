import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export interface ConsentState {
  consentRequired: boolean;
  consentMarketing: boolean;
  policyVersion: string;
}

interface ConsentCheckboxesProps {
  onChange: (consent: ConsentState) => void;
}

export default function ConsentCheckboxes({ onChange }: ConsentCheckboxesProps) {
  const [required, setRequired] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const policyVersion = "v1.0-2026"; // Versión actual de la política

  useEffect(() => {
    onChange({
      consentRequired: required,
      consentMarketing: marketing,
      policyVersion,
    });
  }, [required, marketing, onChange]);

  return (
    <div className="space-y-4 rounded-xl border border-border bg-surface p-5 text-sm text-text shadow-sm">
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={required}
          onChange={(e) => setRequired(e.target.checked)}
          required
          className="mt-1 h-5 w-5 shrink-0 rounded border-border text-primary focus:ring-primary"
        />
        <span className="leading-relaxed">
          * Autorizo el tratamiento de mis datos personales para la gestión de mi pedido y cumplimiento legal, según la{" "}
          <Link
            to="/politica-privacidad"
            target="_blank"
            className="font-medium text-primary hover:text-primary/80 underline underline-offset-2"
          >
            política de tratamiento de datos
          </Link>{" "}
          (Ley 1581 de 2012).
        </span>
      </label>

      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={marketing}
          onChange={(e) => setMarketing(e.target.checked)}
          className="mt-1 h-5 w-5 shrink-0 rounded border-border text-primary focus:ring-primary"
        />
        <span className="leading-relaxed">
          Deseo recibir ofertas, promociones y novedades sobre los productos de Agronausa.
        </span>
      </label>
    </div>
  );
}
