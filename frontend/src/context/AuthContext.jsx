import { createContext, useState, useEffect } from "react";
import { API_URL } from "../config/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Invalid session");

        const data = await res.json();
        setUser(data);
      } catch {
        localStorage.removeItem("token");
        setToken(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [token]);

  function login(userData, jwtToken) {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("token", jwtToken);
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  }

  function updateUser(updatedUser) {
    setUser(updatedUser);
  }

  const value = { user, token, login, logout, updateUser, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };