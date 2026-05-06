import { useState, useEffect } from "react";
import { useSettings } from "../../hooks/useSettings";
import Button from "../ui/Button";
import Input from "../ui/Input";
import type { AppSettingKey } from "../../types";

export default function SettingsForm() {
  const { settings, loading, error, updateSettings } = useSettings();
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm(settings as Record<string, string>);
    }
  }, [settings]);

  if (loading && Object.keys(form).length === 0) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await updateSettings(form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: AppSettingKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-xl bg-error/10 p-4 text-sm text-error">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl bg-success/10 p-4 text-sm text-success">
          Configuración guardada exitosamente.
        </div>
      )}

      <div className="surface space-y-4 p-4 sm:p-6">
        <h2 className="font-display text-xl font-bold text-text border-b border-border pb-2">
          Tienda
        </h2>
        <div className="space-y-4">
          <Input
            label="Nombre de la tienda"
            value={form.site_name || ""}
            onChange={(e) => handleChange("site_name", e.target.value)}
          />
          <Input
            label="WhatsApp"
            value={form.whatsapp_number || ""}
            onChange={(e) => handleChange("whatsapp_number", e.target.value)}
          />
          <Input
            label="Departamento"
            value={form.store_department || ""}
            onChange={(e) => handleChange("store_department", e.target.value)}
          />
          <Input
            label="Ciudad"
            value={form.store_city || ""}
            onChange={(e) => handleChange("store_city", e.target.value)}
          />
          <Input
            label="Dirección"
            value={form.store_address || ""}
            onChange={(e) => handleChange("store_address", e.target.value)}
          />
        </div>
      </div>

      <div className="surface space-y-4 p-4 sm:p-6">
        <h2 className="font-display text-xl font-bold text-text border-b border-border pb-2">
          Alertas
        </h2>
        <div className="space-y-4">
          <Input
            label="Umbral stock bajo (unidades)"
            type="number"
            value={form.low_stock_threshold || ""}
            onChange={(e) => handleChange("low_stock_threshold", e.target.value)}
          />
          <Input
            label="Pedido sin atender (horas)"
            type="number"
            value={form.alert_pending_hours || ""}
            onChange={(e) => handleChange("alert_pending_hours", e.target.value)}
          />
        </div>
      </div>

      <div className="surface space-y-4 p-4 sm:p-6">
        <h2 className="font-display text-xl font-bold text-text border-b border-border pb-2">
          Legal
        </h2>
        <div className="space-y-4">
          <Input
            label="Versión TyC"
            value={form.terms_version || ""}
            onChange={(e) => handleChange("terms_version", e.target.value)}
          />
          <Input
            label="Email administrador"
            type="email"
            value={form.admin_email || ""}
            onChange={(e) => handleChange("admin_email", e.target.value)}
          />
        </div>
      </div>

      <Button type="submit" disabled={saving} className="min-h-[52px] w-full">
        {saving ? "Guardando..." : "Guardar cambios"}
      </Button>
    </form>
  );
}
