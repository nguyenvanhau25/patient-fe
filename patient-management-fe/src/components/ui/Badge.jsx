import React from 'react';
import { cn } from '../../utils/cn';

const variantStyles = {
  info: 'bg-sky-100 text-sky-700',
  success: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-emerald-100 text-emerald-700',
  active: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  pending: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  error: 'bg-red-100 text-red-700',
  cancelled: 'bg-red-100 text-red-700',
  primary: 'bg-slate-100 text-slate-800',
};

export const Badge = ({ children, variant = 'info', className, ...props }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide',
        variantStyles[variant.toLowerCase()],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
