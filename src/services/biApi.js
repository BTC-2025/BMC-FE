import api from "./api";

export const biApi = {
  getDashboard: () => api.get("/bi/dashboard"),
  getRevenue: () => api.get("/bi/revenue"),
  getOperations: () => api.get("/bi/operations"),
  getInsights: () => api.get("/bi/insights"),
  getTopology: () => api.get("/bi/topology"),
  exportCSV: () => api.get("/bi/export", { responseType: "blob" }),
};

export default biApi;
