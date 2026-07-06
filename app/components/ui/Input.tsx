'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/app/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="text-sm font-semibold text-[#0f172a]">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]">
              {icon}
            </span>
          )}
          <input
            className={cn(
              'w-full px-4 py-2.5 border rounded-xl text-sm transition-all duration-200 bg-white text-[#0f172a]',
              'focus:outline-none focus:ring-2 focus:ring-[#0B6B3A]/20 focus:border-[#0B6B3A]',
              'placeholder:text-[#94a3b8]',
              icon ? 'pl-10' : '',
              error ? 'border-[#CE1126] focus:ring-[#CE1126]/20 focus:border-[#CE1126]' : 'border-[#e2e8f0] hover:border-[#0B6B3A]/30',
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-[#CE1126]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';