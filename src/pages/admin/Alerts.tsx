import React from 'react';
import { useAlerts } from '../../hooks/useAlerts';
import { AlertCard } from '../../components/admin/AlertCard';
import { SkeletonLoader } from '../../components/ui/SkeletonLoader';

export default function Alerts() {
  const { alerts, loading, criticalCount, warningCount } = useAlerts();

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">Alertas Críticas</h1>
        <div className="space-y-4">
          <SkeletonLoader className="h-24 w-full rounded-lg" />
          <SkeletonLoader className="h-24 w-full rounded-lg" />
          <SkeletonLoader className="h-24 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  const sortedAlerts = [...alerts].sort((a, b) => {
    // Sort critical first
    if (a.severity === 'critica' && b.severity !== 'critica') return -1;
    if (a.severity !== 'critica' && b.severity === 'critica') return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Alertas Críticas</h1>
          <p className="text-sm text-gray-500 mt-1">
            Revisa los aspectos de la tienda que requieren tu atención
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-3 rounded-lg border shadow-sm shrink-0">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-red-500"></span>
            <span className="text-sm font-medium text-gray-700">{criticalCount} críticas</span>
          </div>
          <div className="w-px h-4 bg-gray-300"></div>
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-yellow-500"></span>
            <span className="text-sm font-medium text-gray-700">{warningCount} advertencias</span>
          </div>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="bg-white rounded-lg border p-12 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Todo está en orden</h3>
          <p className="text-gray-500 mt-2">No hay alertas activas en este momento.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedAlerts.map(alert => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      )}
    </div>
  );
}
