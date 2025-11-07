import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // TODO: 토큰으로 사용자 정보 가져오기
      setUser({ email: 'test@test.com' }); // 임시
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // TODO: 실제 API 호출
    setUser({ email });
    localStorage.setItem('token', 'dummy-token');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const register = async (userData) => {
    // TODO: 실제 API 호출
    setUser({ email: userData.email });
    localStorage.setItem('token', 'dummy-token');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}