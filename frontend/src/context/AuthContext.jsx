import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest, AUTH_EXPIRED_EVENT } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => window.localStorage.getItem("leafwise.token"));
  const [loading, setLoading] = useState(Boolean(window.localStorage.getItem("leafwise.token")));
  const [authError, setAuthError] = useState("");

  const clearSession = useCallback(() => {
    window.localStorage.removeItem("leafwise.token");
    setToken(null);
    setUser(null);
    setAuthError("");
    setLoading(false);
  }, []);

  const refreshUser = useCallback(async () => {
    const currentToken = window.localStorage.getItem("leafwise.token");
    if (!currentToken) {
      setLoading(false);
      setUser(null);
      setToken(null);
      setAuthError("");
      return;
    }

    setLoading(true);
    setAuthError("");
    try {
      const result = await apiRequest("/auth/me");
      setUser(result.user);
      setToken(currentToken);
    } catch (error) {
      if (error.status !== 401) setAuthError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (window.localStorage.getItem("leafwise.token")) refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    window.addEventListener(AUTH_EXPIRED_EVENT, clearSession);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, clearSession);
  }, [clearSession]);

  const login = useCallback(async (credentials) => {
    const result = await apiRequest("/auth/login", { method: "POST", body: credentials });
    if (!result?.token || !result?.user) {
      throw new Error("The server returned an incomplete sign-in response.");
    }
    window.localStorage.setItem("leafwise.token", result.token);
    setToken(result.token);
    setUser(result.user);
    setAuthError("");
    return result.user;
  }, []);

  const register = useCallback((details) => (
    apiRequest("/auth/register", { method: "POST", body: details })
  ), []);

  const logout = useCallback(() => clearSession(), [clearSession]);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    authError,
    login,
    register,
    logout,
    refreshUser,
    setUser,
  }), [user, token, loading, authError, login, register, logout, refreshUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
