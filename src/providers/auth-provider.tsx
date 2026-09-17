"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  clearAccessToken,
  setAccessToken,
  subscribeToSessionInvalidation,
} from "@/lib/auth-session";
import * as authService from "@/services/auth.service";
import type { LoginInput } from "@/services/auth.service";
import type { User } from "@/types/api";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  sessionMessage: string | null;
  login: (input: LoginInput) => Promise<User>;
  logout: () => Promise<void>;
};
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [sessionMessage, setSessionMessage] = useState<string | null>(null);

  useEffect(
    () =>
      subscribeToSessionInvalidation((message) => {
        queryClient.clear();
        setUser(null);
        setSessionMessage(message);
        setLoading(false);
      }),
    [queryClient],
  );

  useEffect(() => {
    authService
      .refreshSession()
      .then((session) => {
        setAccessToken(session.access_token);
        setUser(session.user);
      })
      .catch(() => {
        clearAccessToken();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    const session = await authService.login(input);
    setAccessToken(session.access_token);
    setUser(session.user);
    setSessionMessage(null);
    return session.user;
  }, []);
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      clearAccessToken();
      queryClient.clear();
      setUser(null);
      setSessionMessage(null);
    }
  }, [queryClient]);
  const value = useMemo(
    () => ({ user, isLoading, sessionMessage, login, logout }),
    [user, isLoading, sessionMessage, login, logout],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
}
