import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Product } from '../../types';

interface StockAdjustModalProps {
  product: Product;
  onClose: () => void;
  onAdjust: (productId: string, newQuantity: number, reason: string) => Promise<void>;
}

export function StockAdjustModal({ product, onClose, onAdjust }: StockAdjustModalProps) {
  const [newStock, setNewStock] = useState(product.stock.toString());
  const [reasonType, setReasonType] = useState('entrada');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const stockVal = parseInt(newStock, 10);
    
    if (isNaN(stockVal) || stockVal < 0) {
      setError('El stock debe ser un número válido mayor o igual a 0');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const fullReason = note.trim() ? `${reasonType} - ${note}` : reasonType;
      await onAdjust(product.id, stockVal, fullReason);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al ajustar el stock');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-display font-bold text-gray-900">Ajustar stock</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 min-h-[48px] min-w-[48px] flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 bg-gray-50 border-b">
          <p className="font-medium text-gray-900">{product.name}</p>
          <p className="text-sm text-gray-500 mt-1">Stock actual: {product.stock} {product.unit}s</p>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nuevo stock ({product.unit}s)</label>
            <input
              type="number"
              min="0"
              required
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
              className="w-full px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary min-h-[48px] text-lg font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
            <select
              value={reasonType}
              onChange={(e) => setReasonType(e.target.value)}
              className="w-full px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary min-h-[48px]"
            >
              <option value="entrada">Entrada (compra/recepción)</option>
              <option value="salida">Salida (merma/daño)</option>
              <option value="ajuste">Ajuste manual (conteo)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nota (opcional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Detalles adicionales..."
              className="w-full px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary min-h-[48px]"
            />
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-1/2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 min-h-[48px] font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-1/2 px-4 bg-primary text-white rounded-lg hover:bg-primary-hover min-h-[48px] font-medium disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
