import { useState } from "react";
import Button from "../ui/Button";
import type { AdminUser } from "../../hooks/useAdminUsers";

interface AdminUserRowProps {
  user: AdminUser;
  onToggleAdmin: (userId: string, isAdmin: boolean) => Promise<void>;
  isAdminEmail?: boolean; // True si este es el admin principal (no se puede degradar)
}

export default function AdminUserRow({ user, onToggleAdmin, isAdminEmail }: AdminUserRowProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = user.role === "admin";
  
  const primaryText = user.email || user.full_name;
  const secondaryText = user.customer_type === "negocio" 
    ? `${user.business_name || user.full_name} · B2B`
    : `${user.full_name}`;

  const handleToggle = async () => {
    try {
      setLoading(true);
      setError(null);
      await onToggleAdmin(user.id, !isAdmin);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="surface p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200">
      <div>
        <p className="font-semibold text-text">{primaryText}</p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <p className="text-sm text-text-muted">{secondaryText}</p>
          
          {isAdmin ? (
            <span className="shrink-0 rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent font-medium">
              🔑 Admin
            </span>
          ) : user.customer_type === "persona" ? (
            <span className="shrink-0 rounded-full bg-text-muted/10 px-2 py-0.5 text-xs text-text-muted font-medium">
              👤 Cliente / Potencial empleado
            </span>
          ) : (
            <span className="shrink-0 rounded-full bg-text-muted/10 px-2 py-0.5 text-xs text-text-muted font-medium">
              (cliente — sin acceso admin)
            </span>
          )}
        </div>
        {error && <p className="text-xs text-error mt-2">{error}</p>}
      </div>

      {!isAdminEmail && (
        <Button 
          onClick={handleToggle} 
          disabled={loading}
          className={`shrink-0 ${isAdmin ? "bg-error hover:bg-error/90 text-white" : "bg-bg text-text hover:bg-border"}`}
        >
          {loading ? "Cambiando..." : isAdmin ? "Quitar acceso admin" : "Dar acceso admin"}
        </Button>
      )}
      
      {isAdminEmail && (
        <div className="text-sm text-text-muted font-medium italic sm:text-right">
          Admin principal
        </div>
      )}
    </div>
  );
}
