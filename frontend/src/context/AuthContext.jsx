import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("leafwise_token")));

  useEffect(() => {
    if (!localStorage.getItem("leafwise_token")) return;
    api.me().then((result) => setUser(result.user)).catch(() => localStorage.removeItem("leafwise_token")).finally(() => setLoading(false));
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    async login(credentials) {
      const result = await api.login(credentials);
      localStorage.setItem("leafwise_token", result.token);
      setUser(result.user);
      return result;
    },
    async register(details) {
      return api.register(details);
    },
    logout() {
      localStorage.removeItem("leafwise_token");
      setUser(null);
    },
  }), [loading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
