import React, { useState, useRef } from 'react';
import type { CategoryFormData } from '../../hooks/useCategories';
import type { Category } from '../../types';

interface CategoryFormProps {
  initialData?: Category | null;
  onSave: (data: CategoryFormData, imageFile?: File, id?: string) => Promise<void>;
  onRemoveImage?: (id: string, url: string) => Promise<void>;
  onCancel: () => void;
  nextSortOrder: number;
}

export function CategoryForm({ initialData, onSave, onRemoveImage, onCancel, nextSortOrder }: CategoryFormProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    image_url: initialData?.image_url || '',
    sort_order: initialData ? initialData.sort_order : nextSortOrder,
    active: initialData ? initialData.active : true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Auto-generate slug from name if not manually edited
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setFormData(prev => {
      const oldGeneratedSlug = prev.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const shouldUpdateSlug = !prev.slug || prev.slug === oldGeneratedSlug;
      
      return {
        ...prev,
        name: newName,
        slug: shouldUpdateSlug 
          ? newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
          : prev.slug
      };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveExistingImage = async () => {
    if (!initialData?.id || !formData.image_url || !onRemoveImage) return;
    if (!confirm('¿Eliminar la imagen actual?')) return;
    
    try {
      setSaving(true);
      await onRemoveImage(initialData.id, formData.image_url);
      setFormData(prev => ({ ...prev, image_url: '' }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('El nombre de la categoría es obligatorio');
      return;
    }
    if (!formData.slug.trim()) {
      setError('El identificador (slug) es obligatorio');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onSave(formData, imageFile || undefined, initialData?.id);
    } catch (err: any) {
      setError(err.message || 'Error al guardar la categoría');
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="surface w-full max-w-lg rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="font-display text-lg font-bold text-text">
            {initialData ? 'Editar Categoría' : 'Nueva Categoría'}
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
              onChange={handleNameChange}
              className="w-full border border-border rounded p-2 text-text focus:outline-none focus:border-primary"
              placeholder="Ej. Semillas y material vegetal"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">Identificador (URL Slug) *</label>
            <input 
              type="text" 
              value={formData.slug}
              onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
              className="w-full border border-border rounded p-2 text-text focus:outline-none focus:border-primary font-mono text-sm"
              placeholder="ej-semillas"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Foto de la categoría</label>
            
            {/* Existing or new preview */}
            {(formData.image_url || imagePreview) && (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border mb-3">
                <img 
                  src={imagePreview || formData.image_url} 
                  alt="Vista previa" 
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={imagePreview ? () => { setImagePreview(null); setImageFile(null); } : handleRemoveExistingImage}
                  className="absolute top-2 right-2 bg-error text-white h-8 w-8 rounded-full flex items-center justify-center shadow-lg"
                >
                  ×
                </button>
              </div>
            )}

            <input 
              ref={fileRef}
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="cat-img-upload"
            />
            <label 
              htmlFor="cat-img-upload"
              className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary hover:text-primary transition-colors text-sm font-ui text-text-muted"
            >
              📷 {formData.image_url || imagePreview ? 'Cambiar foto' : 'Subir foto'}
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">Descripción</label>
            <textarea 
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-border rounded p-2 text-text focus:outline-none focus:border-primary"
              placeholder="Breve descripción de la categoría"
              rows={2}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer mt-2">
            <input 
              type="checkbox" 
              checked={formData.active}
              onChange={e => setFormData({ ...formData, active: e.target.checked })}
              className="rounded border-border text-primary focus:ring-primary h-4 w-4"
            />
            <span className="text-sm text-text">Categoría Activa (visible en la tienda)</span>
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
            {saving ? 'Guardando...' : 'Guardar Categoría'}
          </button>
        </div>
      </div>
    </div>
  );
}
