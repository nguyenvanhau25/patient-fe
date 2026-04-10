import React from 'react';
import { cn } from '../../utils/cn';

const paddingStyles = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card = ({
  children,
  className,
  hoverable = false,
  padding = 'md',
  glass = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition-all duration-300',
        hoverable && 'hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg hover:shadow-slate-200/50',
        glass && 'bg-white/85 flex backdrop-blur-md border-white/40',
        className
      )}
      {...props}
    >
      {/* We inject context padding to children body if they are used, or just apply it inside Card if no CardBody is used */}
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type === CardBody) {
          return React.cloneElement(child, { padding, ...child.props });
        }
        return child;
      })}
    </div>
  );
};

export const CardHeader = ({ children, className, ...props }) => (
  <div
    className={cn(
      'flex items-center justify-between border-b border-slate-200 px-6 py-5 font-bold text-slate-800',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const CardBody = ({ children, padding = 'md', className, ...props }) => (
  <div className={cn('flex-1', paddingStyles[padding], className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className, ...props }) => (
  <div
    className={cn(
      'border-t border-slate-200 bg-slate-50 px-6 py-4',
      className
    )}
    {...props}
  >
    {children}
  </div>
);
