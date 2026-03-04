import api, { API_BASE_URL } from "./api";

export const inventoryApi = {
  // Items
  getItems: () => api.get("/inventory/items"),
  createItem: (data) => api.post("/inventory/items", data),
  updateItem: (id, data) => api.put(`/inventory/items/${id}`, data),
  deleteItem: (id) => api.delete(`/inventory/items/${id}`),

  // Warehouses
  getWarehouses: () => api.get("/inventory/warehouses"),
  createWarehouse: (data) => api.post("/inventory/warehouses", data),

  // Stock - FIXED ENDPOINTS
  adjustStock: (data) => api.post("/inventory/adjust", data),
  transferStock: (data) => api.post("/inventory/transfer", data),
  getStockSummary: () => api.get("/inventory/stock-summary"),
  getAuditLog: () => api.get("/inventory/audit"),

  // Barcode
  getBarcodeUrl: (sku) => `${API_BASE_URL}/inventory/barcode/${sku}`,

  // Categories
  getCategories: () => api.get("/inventory/categories"),
  createCategory: (data) => api.post("/inventory/categories", data),
  deleteCategory: (id) => api.delete(`/inventory/categories/${id}`),

  // Item Groups
  getItemGroups: () => api.get("/inventory/item-groups"),
  createItemGroup: (data) => api.post("/inventory/item-groups", data),
  updateItemGroup: (id, data) => api.put(`/inventory/item-groups/${id}`, data),
  deleteItemGroup: (id) => api.delete(`/inventory/item-groups/${id}`),

  // Price Lists
  getPriceLists: () => api.get("/inventory/price-lists"),
  createPriceList: (data) => api.post("/inventory/price-lists", data),
  updatePriceList: (id, data) => api.put(`/inventory/price-lists/${id}`, data),
  deletePriceList: (id) => api.delete(`/inventory/price-lists/${id}`),

  // Price List Items
  getPriceListItems: (listId) =>
    api.get(`/inventory/price-lists/${listId}/items`),
  addPriceListItem: (listId, data) =>
    api.post(`/inventory/price-lists/${listId}/items`, data),

  // Traceability
  getBatches: () => api.get("/inventory/batches"),
  getSerials: () => api.get("/inventory/serials"),
  stockInBatch: (data) => api.post("/inventory/stock-in/batch", data),
  stockInSerial: (data) => api.post("/inventory/stock-in/serial", data),

  // Bins
  getBins: (warehouseId) =>
    api.get(`/inventory/warehouses/${warehouseId}/bins`),
  createBin: (warehouseId, code) =>
    api.post(`/inventory/warehouses/${warehouseId}/bins`, { code }),

  // Alerts
  getAlerts: () => api.get("/inventory/alerts"),

  // Assemblies
  getAssemblies: () => api.get("/inventory/assemblies"),
  createAssembly: (data) => api.post("/inventory/assemblies", data),
  buildAssembly: (data) => api.post("/inventory/assemblies/build", data),
};

export default inventoryApi;
