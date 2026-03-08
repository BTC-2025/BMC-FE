import api from "./api";

// ─── Auth ──────────────────────────────────────────────────────────────
export const authApi = {
  login: (username, password) =>
    api.post("/auth/login", new URLSearchParams({ username, password }), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }),
};

// ─── Employees ─────────────────────────────────────────────────────────
export const employeeApi = {
  getMe: () => api.get("/hrm/my-profile"),
  getAll: () => api.get("/hrm/my-profile"), // Fallback for components expecting a list or just profile
};

// ─── Attendance ────────────────────────────────────────────────────────
export const attendanceApi = {
  getHistory: () => api.get("/hrm/my-attendance"),
  punchIn: () => api.post("/hrm/my-attendance/punch", null, { params: { action: "IN" } }),
  punchOut: () => api.post("/hrm/my-attendance/punch", null, { params: { action: "OUT" } }),
};

// ─── Leave ─────────────────────────────────────────────────────────────
export const leaveApi = {
  getMyLeaves: () => api.get("/hrm/my-leaves"),
  apply: (data) => api.post("/hrm/my-leaves", data),
};

// ─── Payroll ───────────────────────────────────────────────────────────
export const payrollApi = {
  getMyPayroll: () => api.get("/hrm/my-payroll"),
};

// ─── Departments ───────────────────────────────────────────────────────
export const departmentApi = {
  getAll: () => api.get("/hrm/departments"),
};
