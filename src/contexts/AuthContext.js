'use client';

import { createContext, useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        setUser({ token });
      }
    } catch (e) {
      console.error('토큰 읽기 실패:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('서버에서 JSON이 아닌 응답이 왔습니다.');
      }

      if (!response.ok) {
        throw new Error(data.message || '로그인에 실패했습니다.');
      }

      return data;
    },
    onSuccess: (data) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', data.accessToken);
      }
      setUser({
        id: data.user?.id,
        email: data.user?.email,
        nickname: data.user?.nickname,
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async ({ email, nickname, password }) => {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, nickname, password }),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('서버에서 JSON이 아닌 응답이 왔습니다.');
      }

      if (!response.ok) {
        throw new Error(data.message || '회원가입에 실패했습니다.');
      }

      return data;
    },
    onSuccess: (data) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', data.accessToken);
      }
      setUser({
        id: data.user?.id,
        email: data.user?.email,
        nickname: data.user?.nickname,
      });
    },
  });

  const login = (email, password) => {
    return loginMutation.mutateAsync({ email, password });
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
    setUser(null);
  };

  const register = (userData) => {
    return registerMutation.mutateAsync(userData);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}