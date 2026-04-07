import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, getToken, setToken } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const boot = async () => {
      try {
        if (!getToken()) {
          setLoading(false);
          return;
        }
        const me = await api.me();
        setUser(me.user);
      } catch {
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    boot();
  }, []);

  const auth = useMemo(
    () => ({
      user,
      loading,
      async signIn(email, password) {
        const result = await api.login({ email, password });
        setToken(result.token);
        setUser(result.user);
        return result.user;
      },
      async signUp(payload) {
        const result = await api.register(payload);
        setToken(result.token);
        setUser(result.user);
        return result.user;
      },
      async signOut() {
        try {
          await api.logout();
        } finally {
          setToken(null);
          setUser(null);
        }
      },
      async refresh() {
        const me = await api.me();
        setUser(me.user);
        return me.user;
      },
    }),
    [loading, user]
  );

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
