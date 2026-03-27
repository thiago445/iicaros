'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export function useRequireAuth(requireProfile = true) {
  const { isAuthenticated, isLoading, hasProfile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (requireProfile && !hasProfile) {
      router.replace('/complete-profile');
    }
  }, [isAuthenticated, isLoading, hasProfile, requireProfile, router]);

  return { isAuthenticated, isLoading, hasProfile };
}
