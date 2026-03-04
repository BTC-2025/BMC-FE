import api from "./api";

export const scmApi = {
  // Suppliers
  getSuppliers: () => api.get("/scm/suppliers"),
  createSupplier: (data) => api.post("/scm/suppliers", data),
  updateSupplier: (id, data) => api.patch(`/scm/suppliers/${id}`, data),
  deleteSupplier: (id) => api.delete(`/scm/suppliers/${id}`),

  // Purchase Orders
  getPurchaseOrders: () => api.get("/scm/purchase-orders"),
  createPurchaseOrder: (data) => api.post("/scm/purchase-orders", data),
  approvePurchaseOrder: (id) => api.post(`/scm/purchase-orders/${id}/approve`),
  updatePurchaseOrder: (id, data) =>
    api.patch(`/scm/purchase-orders/${id}`, data),
  deletePurchaseOrder: (id) => api.delete(`/scm/purchase-orders/${id}`),

  // Goods Receipt
  receiveGoods: (data) => api.post("/scm/receive", data),

  // Shipments
  getShipments: () => api.get("/scm/shipments"),
  createShipment: (data) => api.post("/scm/shipments", data),
  updateShipment: (id, data) => api.patch(`/scm/shipments/${id}`, data),
  deleteShipment: (id) => api.delete(`/scm/shipments/${id}`),

  // Sales Orders
  getSalesOrders: () => api.get("/scm/sales-orders"),
  createSalesOrder: (data) => api.post("/scm/sales-orders", data),
  fulfillSalesOrder: (id, warehouseId) =>
    api.post(`/scm/sales-orders/${id}/fulfill?warehouse_id=${warehouseId}`),
  updateSalesOrder: (id, data) => api.patch(`/scm/sales-orders/${id}`, data),
};

export default scmApi;
