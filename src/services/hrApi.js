import api from "./api";

export const hrmApi = {
  // Employees
  getEmployees: () => api.get("/hrm/employees"),
  createEmployee: (data) => api.post("/hrm/employees", data),

  // Attendance
  getAttendance: (employeeId = null) =>
    api.get("/hrm/attendance", { params: { employee_id: employeeId } }),
  punchAttendance: (data) => api.post("/hrm/attendance", data),

  // Leaves
  getLeaves: () => api.get("/hrm/leaves"),
  createLeave: (data) => api.post("/hrm/leaves", data),
  approveLeave: (id) => api.post(`/hrm/leaves/${id}/approve`),

  // Payroll
  getPayroll: () => api.get("/hrm/payroll"),
  generatePayroll: (employeeId, month) =>
    api.post(`/hrm/payroll/${employeeId}`, null, { params: { month } }),

  // Departments
  getDepartments: () => api.get("/hrm/departments"),
  createDepartment: (data) => api.post("/hrm/departments", data),
  updateDepartment: (id, data) => api.patch(`/hrm/departments/${id}`, data),
  deleteDepartment: (id) => api.delete(`/hrm/departments/${id}`),

  // Recruitment
  getJobs: () => api.get("/hrm/recruitment/jobs"),
  createJob: (data) => api.post("/hrm/recruitment/jobs", data),
  applyJob: (data) => api.post("/hrm/recruitment/apply", data),
  hireCandidate: (applicationId) =>
    api.post(`/hrm/recruitment/hire`, null, {
      params: { application_id: applicationId },
    }),

  // Performance / Appraisals
  getPerformance: (filters = {}) =>
    api.get("/hrm/performance", { params: filters }),
  getPerformanceSummary: () => api.get("/hrm/performance/summary"),
  getAppraisal: (id) => api.get(`/hrm/performance/${id}`),
  createPerformance: (data) => api.post("/hrm/performance", data),
  updateAppraisal: (id, data) => api.patch(`/hrm/performance/${id}`, data),
  deleteAppraisal: (id) => api.delete(`/hrm/performance/${id}`),
};

export default hrmApi;
