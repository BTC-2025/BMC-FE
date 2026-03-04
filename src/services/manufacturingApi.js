import api from "./api";

export const manufacturingApi = {
  // BOM
  getBOMs: () => api.get("/mfg/boms"),
  createBOM: (data) => api.post("/mfg/boms", data),

  // Work Orders
  getWorkOrders: () => api.get("/mfg/work-orders"),
  createWorkOrder: (data) => api.post("/mfg/work-orders", data),
  produce: (id, warehouseId) =>
    api.post(`/mfg/work-orders/${id}/produce?warehouse_id=${warehouseId}`),
};

export default manufacturingApi;
