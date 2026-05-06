import React, { useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { CategoryForm } from '../../components/admin/CategoryForm';
import type { Category } from '../../types';

export default function Categories() {
  const { categories, loading, saveCategory, reorderCategories, deleteCategory, removeCategoryImage } = useCategories();
  const [editingCategory, setEditingCategory] = useState<Category | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (formData: any, imageFile?: File, id?: string) => {
    setError(null);
    try {
      await saveCategory(formData, imageFile, id);
      setEditingCategory(undefined);
    } catch (err: any) {
      setError(err.message || 'Error al guardar la categoría');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar esta categoría?')) return;
    setError(null);
    try {
      await deleteCategory(id);
    } catch (err: any) {
      setError(err.message || 'Error al eliminar la categoría');
    }
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const newOrder = [...categories.map(c => c.id)];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    await reorderCategories(newOrder);
  };

  const moveDown = async (index: number) => {
    if (index === categories.length - 1) return;
    const newOrder = [...categories.map(c => c.id)];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    await reorderCategories(newOrder);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="font-ui text-[11px] font-medium uppercase tracking-[0.14em] text-accent">Admin</p>
          <h1 className="font-display text-3xl font-bold text-text">Gestión de Categorías</h1>
        </div>

        <button 
          onClick={() => setEditingCategory(null)}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md font-medium text-sm transition-colors"
        >
          + Nueva Categoría
        </button>
      </header>

      {error && (
        <div className="bg-error/10 text-error p-4 rounded border border-error/20 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : categories.length === 0 ? (
        <div className="surface border border-border p-8 text-center rounded-lg">
          <p className="text-4xl mb-4">📂</p>
          <h3 className="font-display text-lg font-bold text-text mb-2">No hay categorías</h3>
          <p className="text-text-muted mb-4">Agrega categorías para organizar tus productos.</p>
          <button 
            onClick={() => setEditingCategory(null)}
            className="text-primary font-medium hover:underline"
          >
            Agregar la primera
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((category, index) => (
            <div key={category.id} className={`surface border ${!category.active ? 'border-border/50 opacity-60' : 'border-border'} p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-colors`}>
              <div className="flex-1 flex items-center gap-4">
                <div className="flex flex-col gap-1 shrink-0">
                  <button 
                    onClick={() => moveUp(index)} 
                    disabled={index === 0}
                    className="text-text-muted hover:text-primary disabled:opacity-30 disabled:hover:text-text-muted text-xs p-1 bg-border/20 rounded"
                    title="Mover arriba"
                  >
                    ▲
                  </button>
                  <button 
                    onClick={() => moveDown(index)} 
                    disabled={index === categories.length - 1}
                    className="text-text-muted hover:text-primary disabled:opacity-30 disabled:hover:text-text-muted text-xs p-1 bg-border/20 rounded"
                    title="Mover abajo"
                  >
                    ▼
                  </button>
                </div>

                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-bg border border-border">
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xl bg-accent/5 text-accent/30">
                      📂
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-display text-lg font-bold text-text flex items-center gap-2">
                    {category.name}
                    {!category.active && (
                      <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-ui uppercase tracking-wider">Inactiva</span>
                    )}
                  </h3>
                  <p className="text-sm text-text-muted font-mono mt-1">/{category.slug}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 shrink-0">
                <button 
                  onClick={() => setEditingCategory(category)}
                  className="p-2 text-text-muted hover:text-primary transition-colors border border-border rounded hover:border-primary/30 bg-surface"
                  title="Editar categoría"
                >
                  ✏️
                </button>
                <button 
                  onClick={() => handleDelete(category.id)}
                  className="p-2 text-text-muted hover:text-error transition-colors border border-border rounded hover:border-error/30 bg-surface"
                  title="Eliminar categoría"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingCategory !== undefined && (
        <CategoryForm 
          initialData={editingCategory}
          onSave={handleSave}
          onRemoveImage={removeCategoryImage}
          onCancel={() => setEditingCategory(undefined)}
          nextSortOrder={categories.length}
        />
      )}
    </div>
  );
}
