import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

type CustomerType = "persona" | "negocio";

interface FormFields {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  customer_type: CustomerType;
  business_name: string;
  nit: string;
}

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [fields, setFields] = useState<FormFields>({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    customer_type: "persona",
    business_name: "",
    nit: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function set(key: keyof FormFields, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (fields.password !== fields.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (fields.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (
      fields.customer_type === "negocio" &&
      !fields.business_name.trim()
    ) {
      setError("Ingresa el nombre de tu empresa o negocio.");
      return;
    }

    setLoading(true);
    try {
      await register({
        email: fields.email,
        password: fields.password,
        full_name: fields.full_name,
        phone: fields.phone,
        customer_type: fields.customer_type,
        business_name: fields.business_name || undefined,
        nit: fields.nit || undefined,
      });
      // Supabase may require email confirmation depending on project settings.
      // Show a message and redirect to login so the user confirms before accessing.
      setSuccessMessage(
        "¡Cuenta creada! Revisa tu correo para confirmar tu registro, luego inicia sesión."
      );
      setTimeout(() => navigate("/login"), 4000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al crear la cuenta"
      );
      setLoading(false);
    }
  }

  if (successMessage) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center py-12">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="surface p-8">
            <span className="text-5xl">✉️</span>
            <h2 className="mt-4 text-xl font-bold text-text">
              ¡Registro exitoso!
            </h2>
            <p className="mt-2 text-sm text-text-muted">{successMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center py-12">
      <div className="w-full max-w-lg space-y-8">
        <header className="text-center">
          <p className="font-ui text-[11px] font-medium uppercase tracking-[0.14em] text-accent">
            Crear cuenta
          </p>
          <h1 className="font-display mt-1 text-3xl font-bold text-text">Regístrate</h1>
          <p className="mt-2 text-sm text-text-muted">
            ¿Ya tienes cuenta?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary hover:underline"
            >
              Inicia sesión
            </Link>
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="surface p-8 space-y-5"
        >
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Tipo de cliente */}
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-text">
              Tipo de cliente
            </legend>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  {
                    value: "persona" as CustomerType,
                    label: "Persona natural",
                    desc: "Compra para uso personal",
                  },
                  {
                    value: "negocio" as CustomerType,
                    label: "Empresa / Negocio",
                    desc: "Distribuidor o comprador B2B",
                  },
                ] as const
              ).map((opt) => (
                <label
                  key={opt.value}
                  className={`flex cursor-pointer flex-col gap-1 rounded-2xl border-2 p-4 transition ${
                    fields.customer_type === opt.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="customer_type"
                    value={opt.value}
                    checked={fields.customer_type === opt.value}
                    onChange={() => set("customer_type", opt.value)}
                    className="sr-only"
                  />
                  <span className="text-sm font-semibold text-text">
                    {opt.label}
                  </span>
                  <span className="text-xs text-text-muted">{opt.desc}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Nombre completo *"
              name="full_name"
              value={fields.full_name}
              onChange={(e) => set("full_name", e.target.value)}
              placeholder="María García"
              required
              autoComplete="name"
            />
            <Input
              label="Teléfono *"
              name="phone"
              type="tel"
              value={fields.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="3001234567"
              required
            />
          </div>

          {/* Campos adicionales para negocios */}
          {fields.customer_type === "negocio" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Nombre del negocio *"
                name="business_name"
                value={fields.business_name}
                onChange={(e) => set("business_name", e.target.value)}
                placeholder="Distribuciones El Campo"
                required
              />
              <Input
                label="NIT (opcional)"
                name="nit"
                value={fields.nit}
                onChange={(e) => set("nit", e.target.value)}
                placeholder="900.123.456-7"
              />
            </div>
          )}

          <Input
            label="Correo electrónico *"
            name="email"
            type="email"
            value={fields.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="tu@correo.com"
            required
            autoComplete="email"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Contraseña *"
              name="password"
              type="password"
              value={fields.password}
              onChange={(e) => set("password", e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              autoComplete="new-password"
            />
            <Input
              label="Confirmar contraseña *"
              name="confirmPassword"
              type="password"
              value={fields.confirmPassword}
              onChange={(e) => set("confirmPassword", e.target.value)}
              placeholder="Repite tu contraseña"
              required
              autoComplete="new-password"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
        </form>
      </div>
    </div>
  );
}
