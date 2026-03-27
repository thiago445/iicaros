import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'orange' | 'green' | 'blue' | 'red' | 'purple';
  className?: string;
}

const variants = {
  default: 'bg-zinc-800 text-zinc-300 border border-zinc-700',
  orange: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
  green: 'bg-green-500/10 text-green-400 border border-green-500/20',
  blue: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  red: 'bg-red-500/10 text-red-400 border border-red-500/20',
  purple: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
