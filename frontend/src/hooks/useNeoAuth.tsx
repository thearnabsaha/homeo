"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

interface NeoUser {
  id: string;
  email: string;
  name: string;
}

interface NeoAuthCtx {
  user: NeoUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<NeoAuthCtx>({
  user: null, token: null, loading: true,
  login: async () => ({ ok: false }), signup: async () => ({ ok: false }), logout: () => {},
});

const TOKEN_KEY = "neoai-token";
const USER_KEY = "neoai-user";

async function apiFetch(path: string, body: Record<string, string>) {
  const res = await fetch(`/api/auth/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false as const, error: data.error || "Something went wrong" };
  return { ok: true as const, token: data.token as string, user: data.user as NeoUser };
}

export function NeoAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<NeoUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const t = localStorage.getItem(TOKEN_KEY);
      const u = localStorage.getItem(USER_KEY);
      if (t && u) {
        setToken(t);
        setUser(JSON.parse(u));
      }
    } catch {}
    setLoading(false);
  }, []);

  const persist = useCallback((t: string, u: NeoUser) => {
    setToken(t);
    setUser(u);
    localStorage.setItem(TOKEN_KEY, t);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiFetch("login", { email, password });
    if (res.ok) { persist(res.token, res.user); return { ok: true }; }
    return { ok: false, error: res.error };
  }, [persist]);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    const res = await apiFetch("signup", { email, password, name });
    if (res.ok) { persist(res.token, res.user); return { ok: true }; }
    return { ok: false, error: res.error };
  }, [persist]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useNeoAuth() {
  return useContext(AuthContext);
}
