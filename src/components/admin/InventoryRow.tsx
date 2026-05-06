import React, { useState } from 'react';
import { Product } from '../../types';
import { ChevronDown, ChevronUp, Edit3 } from 'lucide-react';
import { MovementHistory } from './MovementHistory';

interface InventoryRowProps {
  product: Product;
  onAdjustClick: (product: Product) => void;
  lowStockThreshold: number;
}

export function InventoryRow({ product, onAdjustClick, lowStockThreshold }: InventoryRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStockStatus = () => {
    if (product.stock === 0) return { label: 'Agotado', classes: 'text-red-700 bg-red-100', icon: '🔴' };
    if (product.stock <= lowStockThreshold) return { label: 'Bajo', classes: 'text-yellow-700 bg-yellow-100', icon: '⚠️' };
    return { label: 'Normal', classes: 'text-green-700 bg-green-100', icon: '✅' };
  };

  const status = getStockStatus();

  return (
    <div className="border rounded-lg bg-white overflow-hidden shadow-sm transition-all hover:shadow-md">
      <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{product.name}</h3>
          <div className="flex items-center gap-3 mt-2 text-sm">
            <span className="text-gray-500">
              Stock actual:{' '}
              <span className="font-mono font-medium text-gray-900 ml-1">
                {product.stock} {product.unit}s
              </span>
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${status.classes}`}>
              <span>{status.icon}</span>
              <span>{status.label}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0 mt-2 sm:mt-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1 sm:flex-none px-4 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-gray-900 min-h-[48px] flex items-center justify-center gap-2 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span className="sm:hidden">Historial</span>
          </button>
          
          <button
            onClick={() => onAdjustClick(product)}
            className="flex-1 sm:flex-none px-4 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 min-h-[48px] flex items-center justify-center gap-2 border border-transparent transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span>Ajustar</span>
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <MovementHistory productId={product.id} />
      )}
    </div>
  );
}
