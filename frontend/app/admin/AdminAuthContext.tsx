'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  lastLoginAt?: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  admin: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/v1/auth/me', {
          credentials: 'include',
        });
        if (res.ok) {
          const user = await res.json();
          setAdmin(user);
        } else {
          setAdmin(null);
          if (pathname !== '/admin/login') {
            router.push('/admin/login');
          }
        }
      } catch (err) {
        setAdmin(null);
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [pathname, router]);

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }

    setAdmin(data.user);
    router.push('/admin');
  };

  const logout = async () => {
    await fetch('/api/v1/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setAdmin(null);
    router.push('/admin/login');
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);
