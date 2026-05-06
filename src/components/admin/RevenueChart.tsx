import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { formatCOP } from '../../lib/formatters';

interface RevenueChartProps {
  data: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

export function RevenueChart({ data }: RevenueChartProps) {
  const chartData = data.map(item => {
    const d = new Date(item.date);
    // Add timezone offset to display correct day locally if needed, but it's simpler to just format the string
    const [year, month, day] = item.date.split('-');
    const label = `${day}/${month}`;
    
    return {
      name: label,
      revenue: item.revenue,
      orders: item.orders,
      rawDate: item.date
    };
  });

  return (
    <div className="surface border border-border p-5">
      <h3 className="font-display text-base font-bold text-text mb-4">Ingresos por día</h3>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#7A6553' }}
              dy={10}
            />
            <Tooltip
              cursor={{ fill: '#F9F6F0' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="surface shadow-md p-3 border border-border">
                      <p className="text-sm font-bold text-text mb-1">{data.rawDate}</p>
                      <p className="text-sm text-primary">Ingresos: {formatCOP(data.revenue)}</p>
                      <p className="text-xs text-text-muted mt-1">{data.orders} pedidos</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="revenue" 
              fill="#2D6A1F" 
              radius={[4, 4, 0, 0]} 
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
