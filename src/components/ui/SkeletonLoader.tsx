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
      className={`animate-pulse rounded-2xl bg-gradient-to-r from-border/40 via-border/60 to-border/40 bg-[length:200%_100%] ${className}`}
      style={{ animationDuration: "1.6s" }}
      aria-hidden="true"
    />
  );
}

// ─── ProductCard Skeleton ───────────────────────────────────────────────────────
export function ProductCardSkeleton() {
  return (
    <div
      className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
      aria-hidden="true"
    >
      {/* Imagen */}
      <Skeleton className="h-44 w-full rounded-none rounded-t-2xl" />

      <div className="flex flex-col gap-3 p-4">
        {/* Categoría badge */}
        <Skeleton className="h-4 w-20" />
        {/* Nombre producto */}
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
        {/* Precio */}
        <Skeleton className="mt-1 h-7 w-28" />
        {/* Botón */}
        <Skeleton className="mt-2 h-11 w-full rounded-full" />
      </div>
    </div>
  );
}

// ─── ProductGrid Skeleton (6 cards) ────────────────────────────────────────────
export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-2 xl:grid-cols-3">
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
      <div className="surface space-y-4 p-6">
        <Skeleton className="h-5 w-32" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 flex-shrink-0 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-5 w-20" />
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="surface flex items-center justify-between p-6">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-8 w-32" />
      </div>
    </div>
  );
}
