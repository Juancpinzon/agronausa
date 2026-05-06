import SettingsForm from "../../components/admin/SettingsForm";

export default function Settings() {
  return (
    <div className="space-y-6">
      <header>
        <p className="font-ui text-[11px] font-medium uppercase tracking-[0.14em] text-accent">
          Admin / Sistema
        </p>
        <h1 className="font-display text-3xl font-bold text-text">
          Configuración Maestra
        </h1>
      </header>

      <SettingsForm />
    </div>
  );
}
