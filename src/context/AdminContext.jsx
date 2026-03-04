import { createContext, useContext, useEffect, useState } from "react";
import { adminApi } from "../services/adminApi";
import { useAuth } from "./AuthContext";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.is_admin) {
        loadAll();
    }
  }, [user]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [u, r, p] = await Promise.all([
        adminApi.getUsers(),
        adminApi.getRoles(),
        adminApi.getPermissions(),
      ]);
      setUsers(u.data);
      setRoles(r.data);
      setPermissions(p.data);
      setError(null);
    } catch (err) {
      console.error("Failed to load admin data:", err);
      setError(err.response?.data?.detail || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const assignRoles = async (userId, roles) => {
    setLoading(true);
    try {
      await adminApi.updateUserRoles(userId, roles);
      await loadAll();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to assign roles");
    } finally {
      setLoading(false);
    }
  };

  const createRole = async (data) => {
    setLoading(true);
    try {
      await adminApi.createRole(data);
      await loadAll();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create role");
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (id, data) => {
    setLoading(true);
    try {
      await adminApi.updateAdminRole(id, data);
      await loadAll();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        users,
        roles,
        permissions,
        loading,
        error,
        assignRoles,
        createRole,
        updateRole,
        refresh: loadAll
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) throw new Error("useAdmin must be used within AdminProvider");
    return context;
};
