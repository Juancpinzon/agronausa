import React, { useState, useMemo } from 'react';
import { useInventory } from '../../hooks/useInventory';
import useProducts from '../../hooks/useProducts';
import { InventoryRow } from '../../components/admin/InventoryRow';
import { StockAdjustModal } from '../../components/admin/StockAdjustModal';
import { Product } from '../../types';
import { Search } from 'lucide-react';
import { Skeleton } from '../../components/ui/SkeletonLoader';

export default function Inventory() {
  const { products, loading: productsLoading, refreshProducts } = useProducts();
  const { adjustStock } = useInventory();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'todos' | 'bajo' | 'agotado'>('todos');
  
  const [adjustProduct, setAdjustProduct] = useState<Product | null>(null);

  // Default threshold a 10. Posteriormente podría venir de useSettings
  const lowStockThreshold = 10; 

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Filtrar inactivos (generalmente el admin podría querer ver inactivos, pero para control de stock mejor nos enfocamos en activos)
      // O podemos dejarlos. Asumimos que useProducts ya trae solo activos según su spec, pero en admin trae todos.
      // Depende de la implementación de useProducts. Si trae inactivos los dejamos.

      // Filtrar por texto
      if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;

      // Filtrar por estado de stock
      if (filter === 'bajo' && p.stock > lowStockThreshold) return false;
      if (filter === 'agotado' && p.stock > 0) return false;

      return true;
    });
  }, [products, searchTerm, filter, lowStockThreshold]);

  const handleAdjustStock = async (productId: string, newQuantity: number, reason: string) => {
    await adjustStock(productId, newQuantity, reason);
    await refreshProducts(); // recargar catálogo para mostrar nuevo stock
  };

  if (productsLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">Control de Inventario</h1>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">Control de Inventario</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gestiona las existencias y revisa el historial de movimientos
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary min-h-[48px]"
          />
        </div>
        
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="w-full sm:w-auto px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary min-h-[48px] bg-white cursor-pointer"
        >
          <option value="todos">Todos los productos</option>
          <option value="bajo">Stock bajo</option>
          <option value="agotado">Agotados</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No se encontraron productos</h3>
            <p className="text-gray-500 mt-2">Intenta cambiar los filtros o el término de búsqueda.</p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <InventoryRow 
              key={product.id} 
              product={product} 
              onAdjustClick={setAdjustProduct}
              lowStockThreshold={lowStockThreshold}
            />
          ))
        )}
      </div>

      {adjustProduct && (
        <StockAdjustModal
          product={adjustProduct}
          onClose={() => setAdjustProduct(null)}
          onAdjust={handleAdjustStock}
        />
      )}
    </div>
  );
}
