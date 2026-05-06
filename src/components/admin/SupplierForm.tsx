import React, { useState, useEffect } from 'react';
import { useCategories } from '../../hooks/useCategories';
import type { SupplierFormData } from '../../hooks/useSuppliers';
import type { Supplier } from '../../types';

interface SupplierFormProps {
  initialData?: Supplier | null;
  onSave: (data: SupplierFormData, id?: string) => Promise<void>;
  onCancel: () => void;
}

export function SupplierForm({ initialData, onSave, onCancel }: SupplierFormProps) {
  const { categories, loading: categoriesLoading } = useCategories();
  
  const [formData, setFormData] = useState<SupplierFormData>({
    name: initialData?.name || '',
    contact_name: initialData?.contact_name || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    category_ids: initialData?.category_ids || [],
    notes: initialData?.notes || '',
    active: initialData ? initialData.active : true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('El nombre del proveedor es obligatorio');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onSave(formData, initialData?.id);
    } catch (err: any) {
      setError(err.message || 'Error al guardar el proveedor');
      setSaving(false);
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFormData(prev => {
      const current = prev.category_ids;
      if (current.includes(categoryId)) {
        return { ...prev, category_ids: current.filter(id => id !== categoryId) };
      } else {
        return { ...prev, category_ids: [...current, categoryId] };
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="surface w-full max-w-lg rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="font-display text-lg font-bold text-text">
            {initialData ? 'Editar Proveedor' : 'Nuevo Proveedor'}
          </h2>
          <button 
            onClick={onCancel}
            className="text-text-muted hover:text-text text-xl leading-none px-2 py-1"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          {error && (
            <div className="bg-error/10 text-error p-3 rounded border border-error/20 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text mb-1">Nombre *</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-border rounded p-2 text-text focus:outline-none focus:border-primary"
              placeholder="Ej. AgroInsumos del Valle"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">Nombre del contacto</label>
              <input 
                type="text" 
                value={formData.contact_name}
                onChange={e => setFormData({ ...formData, contact_name: e.target.value })}
                className="w-full border border-border rounded p-2 text-text focus:outline-none focus:border-primary"
                placeholder="Ej. Juan Pérez"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Teléfono</label>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border border-border rounded p-2 text-text focus:outline-none focus:border-primary"
                placeholder="Ej. 3201234567"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">Email</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full border border-border rounded p-2 text-text focus:outline-none focus:border-primary"
              placeholder="Ej. ventas@agroinsumos.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Categorías que provee</label>
            <div className="border border-border rounded p-3 max-h-40 overflow-y-auto space-y-2">
              {categoriesLoading ? (
                <p className="text-sm text-text-muted">Cargando categorías...</p>
              ) : categories.length === 0 ? (
                <p className="text-sm text-text-muted">No hay categorías disponibles.</p>
              ) : (
                categories.map(cat => (
                  <label key={cat.id} className="flex items-center gap-2 text-sm text-text cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.category_ids.includes(cat.id)}
                      onChange={() => handleCategoryToggle(cat.id)}
                      className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                    />
                    {cat.name}
                  </label>
                ))
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">Notas</label>
            <textarea 
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full border border-border rounded p-2 text-text focus:outline-none focus:border-primary"
              placeholder="Condiciones de pago, horarios, etc."
              rows={3}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer mt-2">
            <input 
              type="checkbox" 
              checked={formData.active}
              onChange={e => setFormData({ ...formData, active: e.target.checked })}
              className="rounded border-border text-primary focus:ring-primary h-4 w-4"
            />
            <span className="text-sm text-text">Proveedor Activo</span>
          </label>
        </form>

        <div className="border-t border-border p-4 flex justify-end gap-3 bg-surface">
          <button 
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="px-4 py-2 border border-border rounded text-text font-medium hover:bg-border/30 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 bg-primary text-white rounded font-medium hover:bg-primary-hover disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar Proveedor'}
          </button>
        </div>
      </div>
    </div>
  );
}
