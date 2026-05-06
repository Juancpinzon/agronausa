import React, { useState, useMemo } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { FinancialKPI } from '../../components/admin/FinancialKPI';
import { RevenueChart } from '../../components/admin/RevenueChart';
import { TopProductsTable } from '../../components/admin/TopProductsTable';
import { formatCOP } from '../../lib/formatters';

type DateRange = 'esta_semana' | 'este_mes' | 'custom';

export default function Analytics() {
  const [rangeType, setRangeType] = useState<DateRange>('este_mes');
  
  // Default to current month
  const [customStart, setCustomStart] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().split('T')[0];
  });
  
  const [customEnd, setCustomEnd] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const period = useMemo(() => {
    const end = new Date();
    const start = new Date();
    
    if (rangeType === 'esta_semana') {
      start.setDate(end.getDate() - 7);
    } else if (rangeType === 'este_mes') {
      start.setDate(1);
    } else {
      return {
        start: new Date(customStart + 'T00:00:00'),
        end: new Date(customEnd + 'T23:59:59')
      };
    }
    
    return { start, end };
  }, [rangeType, customStart, customEnd]);

  const { summary, loading } = useAnalytics(period);

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="font-ui text-[11px] font-medium uppercase tracking-[0.14em] text-accent">Admin</p>
          <h1 className="font-display text-3xl font-bold text-text">Análisis Financiero</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex bg-surface border border-border rounded-lg p-1">
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                rangeType === 'esta_semana' ? 'bg-primary text-white' : 'text-text hover:bg-primary/5'
              }`}
              onClick={() => setRangeType('esta_semana')}
            >
              Esta semana
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                rangeType === 'este_mes' ? 'bg-primary text-white' : 'text-text hover:bg-primary/5'
              }`}
              onClick={() => setRangeType('este_mes')}
            >
              Este mes
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                rangeType === 'custom' ? 'bg-primary text-white' : 'text-text hover:bg-primary/5'
              }`}
              onClick={() => setRangeType('custom')}
            >
              Custom
            </button>
          </div>
        </div>
      </header>

      {rangeType === 'custom' && (
        <div className="flex items-center gap-3 bg-surface p-4 border border-border rounded-lg">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-text">Desde:</label>
            <input 
              type="date" 
              value={customStart}
              onChange={e => setCustomStart(e.target.value)}
              className="border border-border rounded p-1 text-sm bg-surface text-text"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-text">Hasta:</label>
            <input 
              type="date" 
              value={customEnd}
              onChange={e => setCustomEnd(e.target.value)}
              className="border border-border rounded p-1 text-sm bg-surface text-text"
            />
          </div>
        </div>
      )}

      {loading || !summary ? (
        <div className="py-20 flex justify-center">
          <p className="text-text-muted">Cargando métricas...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FinancialKPI 
              label="Ingresos" 
              value={formatCOP(summary.revenue_total)} 
            />
            <FinancialKPI 
              label="Pedidos" 
              value={String(summary.orders_count)} 
            />
            <FinancialKPI 
              label="Ticket Promedio" 
              value={formatCOP(summary.avg_ticket)} 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RevenueChart data={summary.revenue_by_day} />
            </div>
            <div className="lg:col-span-1">
              <TopProductsTable products={summary.top_products} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
