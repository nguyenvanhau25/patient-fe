import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const variantStyles = {
  primary: 'bg-sky-500 text-white border-transparent shadow-sm hover:bg-sky-600 hover:shadow-md hover:-translate-y-px active:translate-y-px',
  secondary: 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50 hover:border-sky-500 hover:text-sky-500',
  danger: 'bg-red-500 text-white border-transparent hover:bg-red-600 hover:shadow-md',
  outlined: 'bg-transparent text-sky-500 border-sky-500 hover:bg-sky-50',
  ghost: 'bg-transparent text-slate-500 border-transparent hover:bg-slate-50 hover:text-slate-800',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-xs rounded',
  md: 'px-5 py-2.5 text-sm rounded-md',
  lg: 'px-6 py-3 text-base rounded-lg',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  icon: Icon,
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold transition-all outline-none border relative overflow-hidden select-none',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        isLoading && 'pointer-events-none',
        className
      )}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={size === 'sm' ? 16 : 20} />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 16 : 20} />
      ) : null}
      <span>{children}</span>
    </button>
  );
};

export default Button;
