import React, { useEffect, useState } from 'react';
import { useInventory } from '../../hooks/useInventory';
import { InventoryMovement } from '../../types';
import { formatDate } from '../../lib/formatters';

interface MovementHistoryProps {
  productId: string;
}

export function MovementHistory({ productId }: MovementHistoryProps) {
  const { getMovements, loading, error } = useInventory();
  const [movements, setMovements] = useState<InventoryMovement[]>([]);

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        const data = await getMovements(productId);
        setMovements(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMovements();
  }, [productId]);

  if (loading) {
    return <div className="text-sm text-gray-500 p-4 text-center">Cargando historial...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-500 p-4 text-center">Error cargando historial: {error}</div>;
  }

  if (movements.length === 0) {
    return <div className="text-sm text-gray-500 p-4 text-center bg-gray-50 border-t border-gray-100">No hay movimientos registrados.</div>;
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'entrada': return <span className="text-green-600 font-medium">Entrada</span>;
      case 'salida': return <span className="text-red-600 font-medium">Salida</span>;
      case 'ajuste': return <span className="text-yellow-600 font-medium">Ajuste</span>;
      case 'pedido': return <span className="text-blue-600 font-medium">Pedido</span>;
      default: return type;
    }
  };

  return (
    <div className="overflow-x-auto border-t border-gray-100 bg-gray-50/50">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-500 uppercase bg-gray-100/50">
          <tr>
            <th className="px-4 py-3 font-medium">Fecha</th>
            <th className="px-4 py-3 font-medium">Tipo</th>
            <th className="px-4 py-3 font-medium text-right">Cantidad</th>
            <th className="px-4 py-3 font-medium text-right">Stock Final</th>
            <th className="px-4 py-3 font-medium hidden sm:table-cell">Motivo</th>
          </tr>
        </thead>
        <tbody>
          {movements.map(mov => (
            <tr key={mov.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-100/50">
              <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                {formatDate(mov.created_at)}
              </td>
              <td className="px-4 py-3">{getTypeLabel(mov.type)}</td>
              <td className={`px-4 py-3 text-right font-mono font-medium ${mov.quantity > 0 ? 'text-green-600' : (mov.quantity < 0 ? 'text-red-600' : 'text-gray-600')}`}>
                {mov.quantity > 0 ? '+' : ''}{mov.quantity}
              </td>
              <td className="px-4 py-3 text-right font-mono text-gray-900">{mov.stock_after}</td>
              <td className="px-4 py-3 text-gray-500 text-xs hidden sm:table-cell">{mov.reason || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
