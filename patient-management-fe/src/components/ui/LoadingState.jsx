import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export const LoadingState = ({ message = 'Đang tải...', fullScreen = false }) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-12 gap-4',
        fullScreen && 'fixed inset-0 bg-slate-50/80 backdrop-blur-sm z-[9999]'
      )}
    >
      <Loader2 className="animate-spin text-sky-500" size={40} />
      {message && <p className="text-slate-500 font-medium animate-pulse">{message}</p>}
    </div>
  );
};

export default LoadingState;
