import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../services/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto-load user if token exists
  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      localStorage.removeItem("access_token");
    };
    
    window.addEventListener("auth:logout", handleLogout);

    const token = localStorage.getItem("access_token");
    if (token) {
      authApi
        .me()
        .then((res) => {
          const userData = res.data;
          setUser({
            ...userData,
            name: userData.full_name || userData.username,
            access: userData.permissions || [], // Map for Dashboard.jsx compatibility
            roles: userData.roles || [],
          });
        })
        .catch(() => {
          localStorage.removeItem("access_token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
    
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, []);

  const login = async (username, password) => {
    // Backend expects form data for OAuth2 password flow
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    const res = await authApi.login(formData);

    localStorage.setItem("access_token", res.data.access_token);
    
    // Fetch user profile immediately after login
    const meRes = await authApi.me();
    const userData = meRes.data;
    setUser({
      ...userData,
      name: userData.full_name || userData.username,
      access: userData.permissions || [],
      roles: userData.roles || [],
    });

    return true;
  };

  const register = async (data) => {
    await authApi.register(data);
    // After registration, user can login
    return await login(data.username, data.password);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      // Logout anyway even if backend call fails
      console.warn("Logout API call failed:", err);
    }
    localStorage.removeItem("access_token");
    setUser(null);
  };

  const hasPermission = (permissionCode) => {
    if (!user) return false;
    if (user.is_admin) return true;
    if (user.permissions?.includes("*")) return true;
    return user.permissions?.includes(permissionCode) || false;
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, hasPermission, loading, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
