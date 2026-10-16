'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Role, UserSummary, KycStatus } from '@aurumsave/shared';
import { apiRequest } from './api';

interface AuthContextType {
  user: UserSummary | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<UserSummary>;
  register: (data: { email: string; password: string; fullName: string; phone?: string; role?: Role }) => Promise<UserSummary>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSummary | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('aurumsave_token');
    const savedUser = localStorage.getItem('aurumsave_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('aurumsave_token');
        localStorage.removeItem('aurumsave_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<UserSummary> => {
    const res = await apiRequest<{ success: boolean; data: { token: string; user: UserSummary } }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      },
    );

    const { token: receivedToken, user: receivedUser } = res.data;
    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem('aurumsave_token', receivedToken);
    localStorage.setItem('aurumsave_user', JSON.stringify(receivedUser));

    return receivedUser;
  };

  const register = async (data: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    role?: Role;
  }): Promise<UserSummary> => {
    const res = await apiRequest<{ success: boolean; data: { token: string; user: UserSummary } }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
    );

    const { token: receivedToken, user: receivedUser } = res.data;
    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem('aurumsave_token', receivedToken);
    localStorage.setItem('aurumsave_user', JSON.stringify(receivedUser));

    return receivedUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('aurumsave_token');
    localStorage.removeItem('aurumsave_user');
    router.push('/');
  };

  const refreshUser = async () => {
    try {
      const res = await apiRequest<{ success: boolean; data: UserSummary }>('/auth/me');
      if (res.success && res.data) {
        setUser(res.data);
        localStorage.setItem('aurumsave_user', JSON.stringify(res.data));
      }
    } catch {
      // Ignore if session expired
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
