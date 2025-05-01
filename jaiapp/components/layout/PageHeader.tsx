import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function PageHeader({
  title,
  description,
  children,
  className
}: PageHeaderProps) {
  return (
    <div className={cn('mb-8', className)}>
      <h1 className="text-3xl font-bold text-foreground">
        {title}
      </h1>
      
      {description && (
        <p className="mt-2 text-lg text-muted-foreground">
          {description}
        </p>
      )}
      
      {children}
    </div>
  );
}