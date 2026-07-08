import { useCallback, useEffect, useMemo, useState } from "react";
import AuthContext from "./authContext.js";
import api, { setAuthToken } from "../services/api.js";

const TOKEN_STORAGE_KEY = "wealthtrack_auth_token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => window.localStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    setAuthToken(token);

    if (!token) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const loadSession = async () => {
      try {
        const response = await api.get("/auth/me");

        if (isMounted) {
          setUser(response.data.user);
          setProfile(response.data.profile);
        }
      } catch (_error) {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
        setAuthToken(null);

        if (isMounted) {
          setToken(null);
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSession();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const saveSession = (payload) => {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, payload.token);
    setAuthToken(payload.token);
    setToken(payload.token);
    setUser(payload.user);
    setProfile(payload.profile);
  };

  const register = useCallback(async (formData) => {
    const response = await api.post("/auth/register", formData);
    saveSession(response.data);
    return response.data;
  }, []);

  const login = useCallback(async (formData) => {
    const response = await api.post("/auth/login", formData);
    saveSession(response.data);
    return response.data;
  }, []);

  const updateProfile = useCallback(async (formData) => {
    const response = await api.put("/profile", formData);
    setProfile(response.data.profile);
    return response.data.profile;
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    setAuthToken(null);
    setToken(null);
    setUser(null);
    setProfile(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      profile,
      loading,
      isAuthenticated: Boolean(token && user),
      register,
      login,
      updateProfile,
      logout
    }),
    [token, user, profile, loading, register, login, updateProfile, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
