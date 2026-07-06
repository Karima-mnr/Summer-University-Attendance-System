'use client';

import { cn } from '@/app/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'default';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'badge',
        {
          'badge-success': variant === 'success',
          'badge-warning': variant === 'warning',
          'bg-gray-100 text-gray-700': variant === 'default',
        },
        className
      )}
    >
      <span className="dot" />
      {children}
    </span>
  );
}