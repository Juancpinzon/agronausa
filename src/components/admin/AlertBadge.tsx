import React from 'react';
import { Bell } from 'lucide-react';
import { useAlerts } from '../../hooks/useAlerts';

export function AlertBadge() {
  const { criticalCount } = useAlerts();

  return (
    <div className="relative inline-flex items-center justify-center">
      <Bell className="w-6 h-6" />
      {criticalCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-white">
          {criticalCount > 9 ? '9+' : criticalCount}
        </span>
      )}
    </div>
  );
}
