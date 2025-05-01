import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface FormAlertProps {
  type: AlertType;
  message: ReactNode | null;
  className?: string;
}

const alertStyles: Record<AlertType, string> = {
  success: 'bg-emerald-50 dark:bg-emerald-950/20 border-l-4 border-emerald-500 dark:border-emerald-700',
  error: 'bg-rose-50 dark:bg-rose-950/20 border-l-4 border-rose-500 dark:border-rose-700',
  warning: 'bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 dark:border-amber-700',
  info: 'bg-sky-50 dark:bg-sky-950/20 border-l-4 border-sky-500 dark:border-sky-700',
};

const textStyles: Record<AlertType, string> = {
  success: 'text-emerald-700 dark:text-emerald-300',
  error: 'text-rose-700 dark:text-rose-300',
  warning: 'text-amber-700 dark:text-amber-300',
  info: 'text-sky-700 dark:text-sky-300',
};

export default function FormAlert({ type, message, className }: FormAlertProps) {
  if (!message) return null;
  
  return (
    <div className={cn('p-4 rounded', alertStyles[type], className)}>
      {typeof message === 'string' ? (
        <p className={textStyles[type]}>{message}</p>
      ) : (
        <div className={textStyles[type]}>{message}</div>
      )}
    </div>
  );
}