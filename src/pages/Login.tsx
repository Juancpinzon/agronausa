import { useState, FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from =
    (location.state as { from?: string } | null)?.from ?? "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al iniciar sesión"
      );
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center py-12">
      <div className="w-full max-w-md space-y-8">
        <header className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-accent">
            Bienvenido
          </p>
          <h1 className="mt-1 text-3xl font-bold text-text">Iniciar sesión</h1>
          <p className="mt-2 text-sm text-text-muted">
            ¿No tienes cuenta?{" "}
            <Link
              to="/register"
              className="font-semibold text-primary hover:underline"
            >
              Regístrate aquí
            </Link>
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="surface rounded-[2rem] p-8 space-y-5"
        >
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <Input
            label="Correo electrónico"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            required
            autoComplete="email"
          />

          <Input
            label="Contraseña"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>

        <p className="text-center text-sm text-text-muted">
          También puedes{" "}
          <Link to="/catalog" className="font-medium underline text-primary">
            explorar el catálogo sin cuenta
          </Link>
        </p>
      </div>
    </div>
  );
}
