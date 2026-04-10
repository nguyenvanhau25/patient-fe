import React from 'react';
import { AlertCircle, Inbox } from 'lucide-react';
import { cn } from '../../utils/cn';
import Button from './Button';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'Không có dữ liệu',
  message,
  actionLabel,
  onAction,
  isError = false
}) => {
  const StateIcon = isError ? AlertCircle : Icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center bg-white rounded-md border border-dashed border-slate-200">
      <div
        className={cn(
          'w-20 h-20 rounded-full flex items-center justify-center mb-6',
          isError ? 'bg-red-50 text-red-500' : 'bg-sky-50 text-sky-500'
        )}
      >
        <StateIcon size={48} />
      </div>
      <h3 className="text-xl text-slate-800 font-semibold mb-2">{title}</h3>
      {message && <p className="text-slate-500 max-w-[400px] leading-relaxed">{message}</p>}
      {actionLabel && onAction && (
        <Button
          variant={isError ? 'secondary' : 'primary'}
          onClick={onAction}
          className="mt-4"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
