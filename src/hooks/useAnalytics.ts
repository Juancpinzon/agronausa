import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import type { FinancialSummary, OrderStatus } from "../types";

export interface AnalyticsPeriod {
  start: Date;
  end: Date;
}

export function useAnalytics(period: AnalyticsPeriod) {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);

    // Fetch orders within the period
    const { data: ordersData, error: ordersError } = await supabase
      .from("orders")
      .select("*, items:order_items(*)")
      .gte("created_at", period.start.toISOString())
      .lte("created_at", period.end.toISOString())
      .neq("status", "cancelado");

    if (ordersError) {
      console.error("Error loading analytics orders:", ordersError);
      setLoading(false);
      return;
    }

    // Fetch profiles created within the period for new_customers
    const { count: newCustomersCount, error: profilesError } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", period.start.toISOString())
      .lte("created_at", period.end.toISOString());

    if (profilesError) {
      console.error("Error loading new customers:", profilesError);
    }

    const orders = ordersData || [];

    const revenue_total = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const orders_count = orders.length;
    const avg_ticket = orders_count > 0 ? revenue_total / orders_count : 0;

    const orders_by_status: Record<OrderStatus, number> = {
      pendiente: 0,
      confirmado: 0,
      en_preparacion: 0,
      despachado: 0,
      entregado: 0,
      cancelado: 0,
    };

    orders.forEach((o) => {
      if (o.status in orders_by_status) {
        orders_by_status[o.status as OrderStatus]++;
      }
    });

    // Calculate top products
    const productsMap = new Map<string, { units_sold: number; revenue: number }>();
    
    orders.forEach((order) => {
      // Supabase nested relation returns items as an array if properly set up
      const items = order.items || [];
      items.forEach((item: any) => {
        const current = productsMap.get(item.product_name) || { units_sold: 0, revenue: 0 };
        productsMap.set(item.product_name, {
          units_sold: current.units_sold + item.quantity,
          revenue: current.revenue + item.subtotal,
        });
      });
    });

    const top_products = Array.from(productsMap.entries())
      .map(([product_name, stats]) => ({
        product_name,
        units_sold: stats.units_sold,
        revenue: stats.revenue,
      }))
      .sort((a, b) => b.units_sold - a.units_sold)
      .slice(0, 5);

    // Revenue by day
    const daysMap = new Map<string, { revenue: number; orders: number }>();
    orders.forEach((o) => {
      const dateStr = o.created_at.split('T')[0];
      if (dateStr) {
        const current = daysMap.get(dateStr) || { revenue: 0, orders: 0 };
        daysMap.set(dateStr, {
          revenue: current.revenue + (o.total || 0),
          orders: current.orders + 1,
        });
      }
    });

    // Fill all days in range to ensure chart has continuous data
    const revenue_by_day = [];
    const currentDate = new Date(period.start);
    while (currentDate <= period.end) {
      const dateStr = currentDate.toISOString().split('T')[0]!;
      const stats = daysMap.get(dateStr) || { revenue: 0, orders: 0 };
      revenue_by_day.push({
        date: dateStr,
        revenue: stats.revenue,
        orders: stats.orders,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setSummary({
      revenue_total,
      orders_count,
      avg_ticket,
      orders_by_status,
      top_products,
      revenue_by_day,
      new_customers: newCustomersCount || 0,
    });

    setLoading(false);
  }, [period.start.toISOString(), period.end.toISOString()]);

  useEffect(() => {
    void load();
  }, [load]);

  return { summary, loading, refresh: load };
}
