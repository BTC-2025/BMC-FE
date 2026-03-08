import api from "./api";

export const manufacturingApi = {
  // ── BOMs ──────────────────────────────────────────────────────────────────
  getBOMs: () => api.get("/mfg/boms"),
  getBOM: (id) => api.get(`/mfg/boms/${id}`),
  createBOM: (data) => api.post("/mfg/boms", data),
  deleteBOM: (id) => api.delete(`/mfg/boms/${id}`),

  // ── Work Orders ───────────────────────────────────────────────────────────
  getWorkOrders: () => api.get("/mfg/work-orders"),
  getWorkOrder: (id) => api.get(`/mfg/work-orders/${id}`),
  createWorkOrder: (data) => api.post("/mfg/work-orders", data),
  updateWorkOrder: (id, data) => api.patch(`/mfg/work-orders/${id}`, data),
  deleteWorkOrder: (id) => api.delete(`/mfg/work-orders/${id}`),
  produce: (id, warehouseId = 1) =>
    api.post(`/mfg/work-orders/${id}/produce?warehouse_id=${warehouseId}`),
  scheduleWorkOrder: (id, startDate) =>
    api.post(`/mfg/work-orders/${id}/schedule?start_date=${startDate}`),
  inspectWorkOrder: (id, results) =>
    api.post(`/mfg/work-orders/${id}/inspect`, results),
  getWOCosting: (id) => api.get(`/mfg/work-orders/${id}/costing`),

  // ── Work Centers ──────────────────────────────────────────────────────────
  getWorkCenters: () => api.get("/mfg/work-centers"),
  createWorkCenter: (data) => api.post("/mfg/work-centers", data),
  updateWorkCenter: (id, data) => api.patch(`/mfg/work-centers/${id}`, data),
  deleteWorkCenter: (id) => api.delete(`/mfg/work-centers/${id}`),

  // ── Quality ───────────────────────────────────────────────────────────────
  getInspections: () => api.get("/mfg/quality-inspections"),

  // ── Costing ───────────────────────────────────────────────────────────────
  getCostingRecords: () => api.get("/mfg/costing"),

  // ── Schedules ─────────────────────────────────────────────────────────────
  getSchedules: () => api.get("/mfg/schedules"),
};

export default manufacturingApi;
