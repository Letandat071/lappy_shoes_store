'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: string;
}

interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
}

export function useAuth() {
  const { data: session, status } = useSession();

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success('Đăng xuất thành công');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Có lỗi xảy ra khi đăng xuất');
    }
  };

  const updateUser = async (userData: Partial<AuthUser>) => {
    try {
      const res = await fetch('/api/auth/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      return data;
    } catch (error) {
      throw error;
    }
  };

  return {
    user: session?.user as AuthUser | null,
    loading: status === 'loading',
    login,
    register,
    logout,
    updateUser,
  };
} 