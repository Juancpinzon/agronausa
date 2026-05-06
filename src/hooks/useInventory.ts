import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { InventoryMovement } from '../types';

export function useInventory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const adjustStock = async (
    product_id: string,
    new_quantity: number,
    reason: string
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      if (new_quantity < 0) {
        throw new Error('El stock no puede ser menor a 0');
      }

      // We need user context for created_by
      const { data: { user } } = await supabase.auth.getUser();

      // Get current stock
      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('stock')
        .eq('id', product_id)
        .single();

      if (fetchError || !product) {
        throw new Error('Producto no encontrado');
      }

      const stock_before = product.stock;
      const stock_after = new_quantity;
      const difference = stock_after - stock_before;
      
      let type: 'entrada' | 'salida' | 'ajuste' = 'ajuste';
      if (reason.toLowerCase().includes('entrada')) type = 'entrada';
      else if (reason.toLowerCase().includes('salida')) type = 'salida';

      if (difference === 0) return; // No change

      // We do sequential queries here since Supabase RPC might not be available yet.
      // Update product stock
      const { error: updateError } = await supabase
        .from('products')
        .update({ stock: stock_after })
        .eq('id', product_id);

      if (updateError) throw updateError;

      // Insert movement
      const { error: moveError } = await supabase
        .from('inventory_movements')
        .insert({
          product_id,
          type,
          quantity: difference,
          stock_before,
          stock_after,
          reason,
          created_by: user?.id
        });

      if (moveError) {
        // Rollback attempt if movement logging fails
        await supabase
          .from('products')
          .update({ stock: stock_before })
          .eq('id', product_id);
        throw moveError;
      }

    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getMovements = async (product_id: string): Promise<InventoryMovement[]> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('inventory_movements')
        .select('*')
        .eq('product_id', product_id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      return data as InventoryMovement[];
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    adjustStock,
    getMovements,
    loading,
    error
  };
}
