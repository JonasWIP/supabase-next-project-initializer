import React from 'react';
import { cn } from '@/lib/utils';

interface FormDividerProps {
  text?: string;
  className?: string;
}

export default function FormDivider({ text = 'Or', className }: FormDividerProps) {
  return (
    <div className={cn('relative my-6', className)}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border"></div>
      </div>
      {text && (
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-muted-foreground">
            {text}
          </span>
        </div>
      )}
    </div>
  );
}