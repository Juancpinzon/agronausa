import { useAdminUsers } from "../../hooks/useAdminUsers";
import { useSettings } from "../../hooks/useSettings";
import AdminUserRow from "../../components/admin/AdminUserRow";

export default function AdminUsers() {
  const { users, loading, setAdminRole } = useAdminUsers();
  const { settings, loading: settingsLoading } = useSettings();

  if (loading || settingsLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  // Verificamos si alguien es el root_admin para bloquearle perder los permisos
  const rootAdminEmail = settings?.admin_email;

  const admins = users.filter(u => u.role === "admin");
  const others = users.filter(u => u.role !== "admin");

  return (
    <div className="space-y-6">
      <header>
        <p className="font-ui text-[11px] font-medium uppercase tracking-[0.14em] text-accent">
          Admin / Sistema
        </p>
        <h1 className="font-display text-3xl font-bold text-text">Usuarios y Roles</h1>
      </header>

      <div className="space-y-3">
        {admins.map(user => (
          <AdminUserRow 
            key={user.id} 
            user={user} 
            onToggleAdmin={setAdminRole}
            isAdminEmail={rootAdminEmail ? ((user as any).email === rootAdminEmail || user.full_name === rootAdminEmail) : false}
          />
        ))}
        {others.map(user => (
          <AdminUserRow 
            key={user.id} 
            user={user} 
            onToggleAdmin={setAdminRole}
          />
        ))}
        
        {users.length === 0 && (
          <div className="surface p-12 text-center text-text-muted">
            No hay usuarios registrados.
          </div>
        )}
      </div>
    </div>
  );
}
