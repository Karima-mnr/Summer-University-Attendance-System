'use client';

import { forwardRef } from 'react';
import { cn } from '@/app/lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="text-sm font-semibold text-[#0f172a]">
            {label}
          </label>
        )}
        <select
          className={cn(
            'w-full px-4 py-2.5 border rounded-xl text-sm transition-all duration-200 bg-white text-[#0f172a]',
            'focus:outline-none focus:ring-2 focus:ring-[#0B6B3A]/20 focus:border-[#0B6B3A]',
            'appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22 viewBox=%220 0 12 8%22%3E%3Cpath d=%22M1 1l5 5 5-5%22 stroke=%22%2394a3b8%22 stroke-width=%221.5%22 fill=%22none%22 stroke-linecap=%22round%22/%3E%3C/svg%3E")] bg-[length:12px] bg-[right_16px_center] bg-no-repeat pr-12',
            error ? 'border-[#CE1126] focus:ring-[#CE1126]/20 focus:border-[#CE1126]' : 'border-[#e2e8f0] hover:border-[#0B6B3A]/30',
            className
          )}
          ref={ref}
          {...props}
        >
          <option value="">Select...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-sm text-[#CE1126]">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';