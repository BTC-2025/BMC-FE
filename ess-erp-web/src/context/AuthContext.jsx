import { createContext, useContext, useState, useEffect } from "react";
import { authApi, employeeApi } from "../services/essApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("ess_token"));
  const [employee, setEmployee] = useState(() => {
    try {
      const stored = localStorage.getItem("ess_employee");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.login(username, password);
      const { access_token } = res.data;
      localStorage.setItem("ess_token", access_token);
      setToken(access_token);

      // Decode token to get user info (JWT payload) if needed for fallback
      const payload = JSON.parse(atob(access_token.split(".")[1]));
      
      // Fetch the employee record linked to this user
      let empData;
      try {
        const empRes = await employeeApi.getMe();
        empData = empRes.data;
      } catch (err) {
        console.warn("Could not fetch linked employee, using fallback", err);
        empData = { id: null, name: payload.sub || username, email: username, role: "Employee" };
      }

      localStorage.setItem("ess_employee", JSON.stringify(empData));
      setEmployee(empData);
      return empData;
    } catch (err) {
      const msg = err.response?.data?.detail || "Login failed. Check credentials.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("ess_token");
    localStorage.removeItem("ess_employee");
    setToken(null);
    setEmployee(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{ token, employee, loading, error, login, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
