'use client';

import { cn } from '@/app/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn('card', className)}>
      {children}
    </div>
  );
}