'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService, profileService, getToken, setToken, removeToken } from '@/services/api';
import { Profile } from '@/types';
import toast from 'react-hot-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  profile: Profile | null;
  hasProfile: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [hasProfile, setHasProfile] = useState(false);

  const fetchProfile = useCallback(async (): Promise<boolean> => {
    try {
      const res = await profileService.getProfile();
      if (res.data) {
        setProfile(res.data);
        setHasProfile(true);
        return true;
      }
      return false;
    } catch {
      setProfile(null);
      setHasProfile(false);
      return false;
    }
  }, []);

  // Initialize auth state on mount
  useEffect(() => {
    const init = async () => {
      const token = getToken();
      if (token) {
        setIsAuthenticated(true);
        await fetchProfile();
      }
      setIsLoading(false);
    };
    init();
  }, [fetchProfile]);

  const login = async (email: string, password: string) => {
    const res = await authService.login(email, password);
    const { accessToken, expiresIn } = res.data;
    setToken(accessToken, expiresIn);
    setIsAuthenticated(true);

    const profileExists = await fetchProfile();
    if (profileExists) {
      router.push('/feed');
    } else {
      router.push('/complete-profile');
    }
  };

  const logout = () => {
    removeToken();
    setIsAuthenticated(false);
    setProfile(null);
    setHasProfile(false);
    router.push('/login');
    toast.success('Até logo!');
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, profile, hasProfile, login, logout, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
