import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn('skeleton rounded-lg', className)}
      style={{
        background:
          'linear-gradient(90deg, #18181b 25%, #27272a 50%, #18181b 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton 1.5s ease-in-out infinite',
      }}
    />
  );
}

export function TweetSkeleton() {
  return (
    <div className="p-4 border-b border-zinc-800 flex gap-3">
      <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex gap-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-32 w-full rounded-xl" />
      <div className="px-4 space-y-3">
        <Skeleton className="w-16 h-16 rounded-full" />
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>
    </div>
  );
}
