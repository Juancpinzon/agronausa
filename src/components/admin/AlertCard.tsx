import React from 'react';
import { AlertTriangle, AlertCircle, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { Alert } from '../../types';
import { Link } from 'react-router-dom';

interface AlertCardProps {
  alert: Alert;
}

export function AlertCard({ alert }: AlertCardProps) {
  const isCritical = alert.severity === 'critica';
  
  const getIcon = () => {
    switch (alert.type) {
      case 'stock_bajo':
        return <AlertTriangle className="w-5 h-5" />;
      case 'pedido_sin_atender':
        return <AlertCircle className="w-5 h-5" />;
      case 'sin_imagen':
        return <ImageIcon className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className={`p-4 border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
      isCritical ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
    }`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 shrink-0 ${isCritical ? 'text-red-600' : 'text-yellow-600'}`}>
          {getIcon()}
        </div>
        <div>
          <h4 className={`font-medium ${isCritical ? 'text-red-900' : 'text-yellow-900'}`}>
            {alert.title}
          </h4>
          <p className={`text-sm mt-1 ${isCritical ? 'text-red-700' : 'text-yellow-700'}`}>
            {alert.description}
          </p>
        </div>
      </div>
      
      <Link
        to={alert.action_url}
        className={`inline-flex items-center gap-1 text-sm font-medium whitespace-nowrap min-h-[48px] sm:min-h-0 sm:h-auto px-4 py-2 sm:px-0 sm:py-0 rounded-md sm:rounded-none bg-white sm:bg-transparent border sm:border-none justify-center shrink-0 ${
          isCritical ? 'text-red-700 border-red-200 hover:text-red-800' : 'text-yellow-700 border-yellow-200 hover:text-yellow-800'
        }`}
      >
        <span>Resolver</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
