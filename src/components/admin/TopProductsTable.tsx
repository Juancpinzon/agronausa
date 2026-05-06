import React from 'react';
import { formatCOP } from '../../lib/formatters';

interface TopProductsTableProps {
  products: Array<{
    product_name: string;
    units_sold: number;
    revenue: number;
  }>;
}

export function TopProductsTable({ products }: TopProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className="surface border border-border p-5 text-center">
        <h3 className="font-display text-base font-bold text-text mb-2">Productos más vendidos</h3>
        <p className="text-sm text-text-muted py-8">No hay datos de ventas en este período.</p>
      </div>
    );
  }

  return (
    <div className="surface border border-border overflow-hidden">
      <div className="p-5 border-b border-border">
        <h3 className="font-display text-base font-bold text-text">Productos más vendidos</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-primary/5 text-text-muted font-ui text-xs uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3 font-medium">Pos</th>
              <th className="px-5 py-3 font-medium">Producto</th>
              <th className="px-5 py-3 font-medium text-right">Unidades</th>
              <th className="px-5 py-3 font-medium text-right">Ingresos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((product, idx) => (
              <tr key={product.product_name} className="hover:bg-primary/5 transition-colors">
                <td className="px-5 py-3 text-text-muted">{idx + 1}</td>
                <td className="px-5 py-3 font-medium text-text">{product.product_name}</td>
                <td className="px-5 py-3 text-right text-text-muted">{product.units_sold}</td>
                <td className="px-5 py-3 text-right font-mono text-text">{formatCOP(product.revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
