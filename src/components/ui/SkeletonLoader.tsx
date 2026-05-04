/**
 * SkeletonLoader — sistema de placeholders animados
 * Uso:
 *   <ProductCardSkeleton />         → en ProductGrid mientras carga
 *   <OrderDetailSkeleton />         → en OrderDetail / Account mientras carga
 */

// ─── Base Skeleton ─────────────────────────────────────────────────────────────
interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] ${className}`}
      style={{ animationDuration: "1.6s" }}
      aria-hidden="true"
    />
  );
}

// ─── ProductCard Skeleton ───────────────────────────────────────────────────────
export function ProductCardSkeleton() {
  return (
    <div
      className="flex flex-col overflow-hidden rounded-[2rem] border border-border bg-white shadow-sm"
      aria-hidden="true"
    >
      {/* Imagen */}
      <Skeleton className="h-44 w-full rounded-none rounded-t-[2rem]" />

      <div className="flex flex-col gap-3 p-4">
        {/* Categoría badge */}
        <Skeleton className="h-4 w-20" />
        {/* Nombre producto */}
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
        {/* Precio */}
        <Skeleton className="h-7 w-28 mt-1" />
        {/* Botón */}
        <Skeleton className="h-11 w-full mt-2 rounded-full" />
      </div>
    </div>
  );
}

// ─── ProductGrid Skeleton (6 cards) ────────────────────────────────────────────
export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 grid-cols-2 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── OrderDetail Skeleton ───────────────────────────────────────────────────────
export function OrderDetailSkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>

      {/* Items table */}
      <div className="surface rounded-[2rem] p-6 space-y-4">
        <Skeleton className="h-5 w-32" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-5 w-20" />
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="surface rounded-[2rem] p-6 flex justify-between items-center">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-8 w-32" />
      </div>
    </div>
  );
}
