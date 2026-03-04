import api from "./api";

export const adminApi = {
  // Users
  getUsers: () => api.get("/admin/users"),
  createUser: (data) => api.post("/admin/users", data),
  updateUserRoles: (id, roles) =>
    api.patch(`/admin/users/${id}/roles`, { roles }),

  // Roles
  getRoles: () => api.get("/admin/roles"),
  createRole: (data) => api.post("/admin/roles", data),
  updateRole: (id, data) => api.patch(`/roles/${id}`, data), // User requested /admin/roles/{id} though?

  // Actually, I should probably stick to what I implemented in the backend: /admin/roles/{role_id}
  updateAdminRole: (id, data) => api.patch(`/admin/roles/${id}`, data),

  // Permissions
  getPermissions: () => api.get("/admin/permissions"),
};

export default adminApi;
