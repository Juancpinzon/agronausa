import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Alert } from '../types';

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const newAlerts: Alert[] = [];

      // 1. Get settings for thresholds
      const { data: settingsData } = await supabase
        .from('app_settings')
        .select('key, value');
      
      const settings = settingsData?.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {} as Record<string, string>);

      const lowStockThreshold = parseInt(settings?.low_stock_threshold || '10', 10);
      const pendingHoursThreshold = parseInt(settings?.alert_pending_hours || '24', 10);

      // 2. Check for low stock products
      const { data: lowStockProducts } = await supabase
        .from('products')
        .select('id, name, stock')
        .eq('active', true)
        .lt('stock', lowStockThreshold);

      if (lowStockProducts) {
        lowStockProducts.forEach(product => {
          newAlerts.push({
            id: `stock-${product.id}`,
            type: 'stock_bajo',
            severity: product.stock === 0 ? 'critica' : 'advertencia',
            title: product.stock === 0 ? 'Stock agotado' : 'Stock bajo',
            description: `${product.name} — ${product.stock} und.`,
            action_url: `/admin/inventory`,
            product_id: product.id,
            created_at: new Date().toISOString()
          });
        });
      }

      // 3. Check for unattended orders
      const cutoffDate = new Date();
      cutoffDate.setHours(cutoffDate.getHours() - pendingHoursThreshold);
      
      const { data: pendingOrders } = await supabase
        .from('orders')
        .select('id, order_number, total, created_at')
        .eq('status', 'pendiente')
        .lt('created_at', cutoffDate.toISOString());

      if (pendingOrders) {
        pendingOrders.forEach(order => {
          const hoursPending = Math.floor((new Date().getTime() - new Date(order.created_at).getTime()) / (1000 * 60 * 60));
          newAlerts.push({
            id: `order-${order.id}`,
            type: 'pedido_sin_atender',
            severity: 'critica',
            title: `Pedido sin atender (${hoursPending}h)`,
            description: `${order.order_number} · $${order.total.toLocaleString('es-CO')}`,
            action_url: `/admin/orders`,
            order_id: order.id,
            created_at: new Date().toISOString()
          });
        });
      }

      // 4. Check for products without images
      const { data: noImageProducts } = await supabase
        .from('products')
        .select('id, name, category_id')
        .eq('active', true);
        
      if (noImageProducts) {
        // En supabase si el array está vacío puede ser [] o null. Verificamos con el cliente.
        // Dado que la query jsonb no es sencilla desde JS directo para todos los casos, traemos y filtramos
        const { data: allProductsImages } = await supabase
          .from('products')
          .select('id, name, images, category_id')
          .eq('active', true);
          
        if (allProductsImages) {
          const missingImages = allProductsImages.filter(p => !p.images || p.images.length === 0);
          missingImages.forEach(product => {
            newAlerts.push({
              id: `img-${product.id}`,
              type: 'sin_imagen',
              severity: 'advertencia',
              title: 'Producto sin foto',
              description: `${product.name}`,
              action_url: `/admin/products`,
              product_id: product.id,
              created_at: new Date().toISOString()
            });
          });
        }
      }

      setAlerts(newAlerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return {
    alerts,
    loading,
    refreshAlerts: fetchAlerts,
    criticalCount: alerts.filter(a => a.severity === 'critica').length,
    warningCount: alerts.filter(a => a.severity === 'advertencia').length
  };
}
