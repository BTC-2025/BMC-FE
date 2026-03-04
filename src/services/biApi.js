import api from "./api";

export const biApi = {
  getDashboard: () => api.get("/bi/dashboard"),
  getRevenue: () => api.get("/bi/revenue"),
  getOperations: () => api.get("/bi/operations"),
  exportCSV: () => api.get("/bi/export", { responseType: "blob" }),
};

export default biApi;
