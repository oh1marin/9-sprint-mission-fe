"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

interface User {
  id?: number;
  email?: string;
  nickname?: string;
  token?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  nickname: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  user: {
    id: number;
    email: string;
    nickname: string;
  };
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<AuthResponse>;
  isAuthenticated: boolean;
  isLoggingIn: boolean;
  isRegistering: boolean;
  loginError: Error | null;
  registerError: Error | null;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        setUser({ token });
      }
    } catch (e) {
      console.error("토큰 읽기 실패:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const loginMutation: UseMutationResult<
    AuthResponse,
    Error,
    LoginCredentials
  > = useMutation({
    mutationFn: async ({
      email,
      password,
    }: LoginCredentials): Promise<AuthResponse> => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const text = await response.text();
      let data: AuthResponse;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("서버에서 JSON이 아닌 응답이 왔습니다.");
      }

      if (!response.ok) {
        throw new Error((data as any).message || "로그인에 실패했습니다.");
      }

      return data;
    },
    onSuccess: (data: AuthResponse) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", data.accessToken);
      }
      setUser({
        id: data.user?.id,
        email: data.user?.email,
        nickname: data.user?.nickname,
      });
    },
  });

  const registerMutation: UseMutationResult<AuthResponse, Error, RegisterData> =
    useMutation({
      mutationFn: async ({
        email,
        nickname,
        password,
      }: RegisterData): Promise<AuthResponse> => {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, nickname, password }),
        });

        const text = await response.text();
        let data: AuthResponse;
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error("서버에서 JSON이 아닌 응답이 왔습니다.");
        }

        if (!response.ok) {
          throw new Error((data as any).message || "회원가입에 실패했습니다.");
        }

        return data;
      },
      onSuccess: (data: AuthResponse) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", data.accessToken);
        }
        setUser({
          id: data.user?.id,
          email: data.user?.email,
          nickname: data.user?.nickname,
        });
      },
    });

  const login = (email: string, password: string): Promise<AuthResponse> => {
    return loginMutation.mutateAsync({ email, password });
  };

  const logout = (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
    }
    setUser(null);
  };

  const register = (userData: RegisterData): Promise<AuthResponse> => {
    return registerMutation.mutateAsync(userData);
  };

  const value: AuthContextValue = {
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
