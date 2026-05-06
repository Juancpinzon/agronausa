import React from 'react';

interface FinancialKPIProps {
  label: string;
  value: string;
  subValue?: string;
}

export function FinancialKPI({ label, value, subValue }: FinancialKPIProps) {
  return (
    <div className="surface p-4 sm:p-5 border border-border">
      <p className="font-ui mb-1 text-[10px] font-medium uppercase tracking-[0.12em] text-text-muted">
        {label}
      </p>
      <div className="flex flex-col gap-1">
        <p className="font-display text-3xl font-bold leading-tight text-text">
          {value}
        </p>
        {subValue && (
          <p className="text-sm text-text-muted">
            {subValue}
          </p>
        )}
      </div>
    </div>
  );
}
