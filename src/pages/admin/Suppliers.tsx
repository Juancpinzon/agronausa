import React, { useState } from 'react';
import { useSuppliers } from '../../hooks/useSuppliers';
import { SupplierForm } from '../../components/admin/SupplierForm';
import type { Supplier } from '../../types';

export default function Suppliers() {
  const { suppliers, loading, saveSupplier, toggleSupplierActive } = useSuppliers();
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null | undefined>(undefined);

  const handleSave = async (formData: any, id?: string) => {
    await saveSupplier(formData, id);
    setEditingSupplier(undefined);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="font-ui text-[11px] font-medium uppercase tracking-[0.14em] text-accent">Admin</p>
          <h1 className="font-display text-3xl font-bold text-text">Gestión de Proveedores</h1>
        </div>

        <button 
          onClick={() => setEditingSupplier(null)}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md font-medium text-sm transition-colors"
        >
          + Nuevo Proveedor
        </button>
      </header>

      {loading ? (
        <div className="py-12 flex justify-center">
          <p className="text-text-muted">Cargando proveedores...</p>
        </div>
      ) : suppliers.length === 0 ? (
        <div className="surface border border-border p-8 text-center rounded-lg">
          <p className="text-4xl mb-4">🚛</p>
          <h3 className="font-display text-lg font-bold text-text mb-2">No hay proveedores</h3>
          <p className="text-text-muted mb-4">Aún no has registrado ningún proveedor en el sistema.</p>
          <button 
            onClick={() => setEditingSupplier(null)}
            className="text-primary font-medium hover:underline"
          >
            Agregar el primero
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {suppliers.map(supplier => (
            <div key={supplier.id} className={`surface border ${!supplier.active ? 'border-border/50 opacity-60' : 'border-border'} p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-colors`}>
              <div className="flex-1">
                <h3 className="font-display text-lg font-bold text-text flex items-center gap-2">
                  {supplier.name}
                  {!supplier.active && (
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-ui uppercase tracking-wider">Inactivo</span>
                  )}
                </h3>
                
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-muted">
                  {supplier.phone && (
                    <span className="flex items-center gap-1">
                      📞 {supplier.phone}
                    </span>
                  )}
                  {supplier.contact_name && (
                    <span className="flex items-center gap-1">
                      👤 {supplier.contact_name}
                    </span>
                  )}
                  {supplier.email && (
                    <span className="flex items-center gap-1">
                      ✉️ {supplier.email}
                    </span>
                  )}
                </div>
                
                {supplier.category_ids && supplier.category_ids.length > 0 && (
                  <p className="text-xs text-text-muted mt-2">
                    <span className="font-medium">Categorías:</span> {supplier.category_ids.length} asignadas
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-3 shrink-0">
                <button 
                  onClick={() => toggleSupplierActive(supplier.id, !supplier.active)}
                  className={`text-sm px-3 py-1.5 rounded border transition-colors ${
                    supplier.active 
                      ? 'border-error/20 text-error hover:bg-error/5' 
                      : 'border-success/20 text-success hover:bg-success/5'
                  }`}
                >
                  {supplier.active ? 'Desactivar' : 'Activar'}
                </button>
                <button 
                  onClick={() => setEditingSupplier(supplier)}
                  className="p-2 text-text-muted hover:text-primary transition-colors border border-border rounded hover:border-primary/30 bg-surface"
                  title="Editar proveedor"
                >
                  ✏️ Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingSupplier !== undefined && (
        <SupplierForm 
          initialData={editingSupplier}
          onSave={handleSave}
          onCancel={() => setEditingSupplier(undefined)}
        />
      )}
    </div>
  );
}
