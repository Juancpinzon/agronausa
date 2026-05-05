import { useRef, useState } from "react";
import { useAdminProducts, type ProductFormData } from "../../hooks/useAdmin";
import { formatCOP } from "../../lib/formatters";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import type { Product } from "../../types";

const UNITS = ["kg", "bulto", "litro", "unidad", "caja", "gramo", "paquete"];

const EMPTY_FORM: ProductFormData = {
  name: "",
  description: "",
  category_id: "",
  price_retail: 0,
  price_wholesale: null,
  min_wholesale_qty: null,
  unit: "unidad",
  stock: 0,
  active: true,
  featured: false,
};

type EditTarget = Product | "new" | null;

export default function Products() {
  const { products, categories, loading, saveProduct, removeImage } =
    useAdminProducts();

  const [editing, setEditing] = useState<EditTarget>(null);
  const [form, setForm] = useState<ProductFormData>(EMPTY_FORM);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function openNew() {
    setEditing("new");
    setForm(EMPTY_FORM);
    resetImages();
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openEdit(product: Product) {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description ?? "",
      category_id: product.category_id,
      price_retail: product.price_retail,
      price_wholesale: product.price_wholesale ?? null,
      min_wholesale_qty: product.min_wholesale_qty ?? null,
      unit: product.unit,
      stock: product.stock,
      active: product.active,
      featured: product.featured,
    });
    resetImages();
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeForm() {
    setEditing(null);
    resetImages();
    setError(null);
  }

  function resetImages() {
    setImageFiles([]);
    setImagePreviews([]);
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setImageFiles((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
    if (fileRef.current) fileRef.current.value = "";
  }

  function removePendingImage(index: number) {
    URL.revokeObjectURL(imagePreviews[index]!);
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleRemoveExisting(
    productId: string,
    url: string,
  ) {
    if (!confirm("¿Eliminar esta imagen?")) return;
    try {
      await removeImage(productId, url);
      setEditing((prev) => {
        if (!prev || prev === "new") return prev;
        return {
          ...prev,
          images: (prev.images ?? []).filter((img) => img !== url),
        };
      });
    } catch (e) {
      setError(String(e));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const existingId = editing !== "new" && editing ? editing.id : undefined;
      const existingImages =
        editing !== "new" && editing ? (editing.images ?? []) : [];
      await saveProduct(form, imageFiles, existingId, existingImages);
      closeForm();
    } catch (e) {
      setError(String(e));
    } finally {
      setSaving(false);
    }
  }

  function setField<K extends keyof ProductFormData>(
    key: K,
    value: ProductFormData[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const existingImages =
    editing !== "new" && editing ? (editing.images ?? []) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <header>
          <p className="text-sm uppercase tracking-[0.3em] text-accent">
            Admin / Productos
          </p>
          <h1 className="text-3xl font-bold text-text">Productos</h1>
        </header>
        {!editing && (
          <Button onClick={openNew} className="shrink-0">
            + Nuevo
          </Button>
        )}
      </div>

      {/* ── Form panel ─────────────────────────────────────────────────────── */}
      {editing && (
        <div className="surface space-y-4 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {editing === "new" ? "Nuevo producto" : "Editar producto"}
            </h2>
            <button
              onClick={closeForm}
              className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-text-muted hover:bg-bg"
            >
              ×
            </button>
          </div>

          {error && (
            <p className="rounded-xl bg-error/10 p-3 text-sm text-error">
              {error}
            </p>
          )}

          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
            <Input
              label="Nombre"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              required
            />

            <label className="block space-y-2 text-sm">
              <span className="font-medium text-text">Descripción</span>
              <textarea
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                rows={3}
                className="w-full resize-none rounded-3xl border border-border bg-white px-4 py-3 text-sm text-text focus:border-primary focus:outline-none"
              />
            </label>

            <label className="block space-y-2 text-sm">
              <span className="font-medium text-text">Categoría</span>
              <select
                value={form.category_id}
                onChange={(e) => setField("category_id", e.target.value)}
                required
                className="w-full rounded-3xl border border-border bg-white px-4 py-3 text-sm text-text focus:border-primary focus:outline-none"
              >
                <option value="">Seleccionar...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block space-y-2 text-sm">
                <span className="font-medium text-text">Precio detal (COP)</span>
                <input
                  type="number"
                  value={form.price_retail}
                  onChange={(e) =>
                    setField("price_retail", Number(e.target.value))
                  }
                  required
                  min={0}
                  className="w-full rounded-3xl border border-border bg-white px-4 py-3 text-sm text-text focus:border-primary focus:outline-none"
                />
              </label>
              <label className="block space-y-2 text-sm">
                <span className="font-medium text-text">Precio mayoreo (COP)</span>
                <input
                  type="number"
                  value={form.price_wholesale ?? ""}
                  onChange={(e) =>
                    setField(
                      "price_wholesale",
                      e.target.value ? Number(e.target.value) : null,
                    )
                  }
                  min={0}
                  className="w-full rounded-3xl border border-border bg-white px-4 py-3 text-sm text-text focus:border-primary focus:outline-none"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block space-y-2 text-sm">
                <span className="font-medium text-text">Unidad</span>
                <select
                  value={form.unit}
                  onChange={(e) => setField("unit", e.target.value)}
                  className="w-full rounded-3xl border border-border bg-white px-4 py-3 text-sm text-text focus:border-primary focus:outline-none"
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block space-y-2 text-sm">
                <span className="font-medium text-text">Mín. qty mayoreo</span>
                <input
                  type="number"
                  value={form.min_wholesale_qty ?? ""}
                  onChange={(e) =>
                    setField(
                      "min_wholesale_qty",
                      e.target.value ? Number(e.target.value) : null,
                    )
                  }
                  min={1}
                  className="w-full rounded-3xl border border-border bg-white px-4 py-3 text-sm text-text focus:border-primary focus:outline-none"
                />
              </label>
            </div>

            <Input
              label="Stock disponible"
              type="number"
              value={form.stock}
              onChange={(e) => setField("stock", Number(e.target.value))}
              min={0}
              required
            />

            <div className="flex gap-6">
              <label className="flex min-h-[48px] items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setField("active", e.target.checked)}
                  className="h-5 w-5 accent-primary"
                />
                <span className="text-sm font-medium">Activo</span>
              </label>
              <label className="flex min-h-[48px] items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setField("featured", e.target.checked)}
                  className="h-5 w-5 accent-primary"
                />
                <span className="text-sm font-medium">Destacado</span>
              </label>
            </div>

            {/* Image upload */}
            <div>
              <p className="mb-2 text-sm font-medium text-text">Fotos</p>

              {/* Existing images */}
              {existingImages.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {existingImages.map((url) => (
                    <div key={url} className="relative">
                      <img
                        src={url}
                        alt=""
                        className="h-20 w-20 rounded-2xl object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          void handleRemoveExisting(
                            (editing as Product).id,
                            url,
                          )
                        }
                        className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-error text-xs text-white"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Pending new images */}
              {imagePreviews.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="relative">
                      <img
                        src={src}
                        alt=""
                        className="h-20 w-20 rounded-2xl border-2 border-primary object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePendingImage(i)}
                        className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-error text-xs text-white"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="img-upload"
              />
              <label
                htmlFor="img-upload"
                className="flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-border text-sm text-text-muted transition hover:border-primary hover:text-primary"
              >
                📷 Agregar fotos
              </label>
            </div>

            <Button
              type="submit"
              disabled={saving}
              className="min-h-[52px] w-full"
            >
              {saving
                ? "Guardando..."
                : editing === "new"
                  ? "Crear producto"
                  : "Guardar cambios"}
            </Button>
          </form>
        </div>
      )}

      {/* ── Product list ───────────────────────────────────────────────────── */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="surface p-12 text-center text-text-muted">
          No hay productos. Crea uno con el botón de arriba.
        </div>
      )}

      {!loading && (
        <div className="space-y-2">
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() => openEdit(product)}
              className="surface flex w-full items-center gap-3 p-3 text-left transition-shadow hover:shadow-md active:opacity-80"
            >
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-bg">
                {product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xl">
                    🌱
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-semibold text-text">
                    {product.name}
                  </p>
                  {!product.active && (
                    <span className="shrink-0 rounded-full bg-text-muted/10 px-2 py-0.5 text-xs text-text-muted">
                      inactivo
                    </span>
                  )}
                  {product.featured && (
                    <span className="shrink-0 rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">
                      destacado
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-muted">
                  {product.category?.name}
                </p>
                <div className="mt-0.5 flex items-center gap-3">
                  <span className="font-mono text-sm font-semibold">
                    {formatCOP(product.price_retail)}
                  </span>
                  <span
                    className={`text-xs font-medium ${product.stock <= 5 ? "text-error" : "text-success"}`}
                  >
                    Stock: {product.stock}
                  </span>
                </div>
              </div>

              <span className="shrink-0 text-text-muted">›</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
