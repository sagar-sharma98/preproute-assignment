import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { login as loginRequest } from '../api/auth';
import { AUTH_UNAUTHORIZED_EVENT } from '../api/client';
import type { User } from '../types';

interface AuthContextValue {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (userId: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(() => localStorage.getItem('preproute_token'));
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('preproute_user');
    if (!stored) return null;
    try {
      return JSON.parse(stored) as User;
    } catch {
      localStorage.removeItem('preproute_user');
      return null;
    }
  });

  const logout = useCallback(() => {
    localStorage.removeItem('preproute_token');
    localStorage.removeItem('preproute_user');
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => logout();
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
  }, [logout]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token || localStorage.getItem('preproute_token')),
      login: async (userId, password) => {
        const data = await loginRequest(userId, password);
        if (!data.token) {
          throw new Error('Login succeeded, but the server did not return an access token.');
        }
        localStorage.setItem('preproute_token', data.token);
        localStorage.setItem('preproute_user', JSON.stringify(data.user ?? { userId }));
        setToken(data.token);
        setUser(data.user ?? { userId });
      },
      logout
    }),
    [logout, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
