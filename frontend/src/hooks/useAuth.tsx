import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { IUser } from '../types';
import { authService } from '../services/auth';
import { AUTH_CACHE_KEY } from '../constants/auth';

interface AuthContextType {
  user: IUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: IUser | null) => void;
}

function getCachedUser(): IUser | null {
  try {
    const raw = localStorage.getItem(AUTH_CACHE_KEY);
    return raw ? (JSON.parse(raw) as IUser) : null;
  } catch {
    return null;
  }
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const cached = getCachedUser();
  const [user, setUserState] = useState<IUser | null>(cached);
  // If we have a cached user, skip the loading screen — verify in background
  const [loading, setLoading] = useState(!cached);

  function setUser(u: IUser | null) {
    if (u) localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(u));
    else localStorage.removeItem(AUTH_CACHE_KEY);
    setUserState(u);
  }

  useEffect(() => {
    authService.me()
      .then(res => setUser(res.data.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const res = await authService.login({ email, password });
    setUser(res.data.data);
  }

  async function logout() {
    await authService.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
