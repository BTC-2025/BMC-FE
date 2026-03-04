import api from "./api";

export const crmApi = {
  // Leads
  getLeads: () => api.get("/crm/leads"),
  createLead: (data) => api.post("/crm/leads", data),
  updateLeadStatus: (id, status) =>
    api.post(`/crm/leads/${id}/status`, { status }),
  updateLead: (id, data) => api.patch(`/crm/leads/${id}`, data),

  // Convert
  convertLead: (id, data) => api.post(`/crm/leads/${id}/convert`, data),

  // Deals
  getDeals: () => api.get("/crm/deals"),
  createDeal: (data) => api.post("/crm/deals", data),
  updateDeal: (id, data) => api.patch(`/crm/deals/${id}`, data),
  deleteDeal: (id) => api.delete(`/crm/deals/${id}`),
  updateDealStage: (id, stage) => api.post(`/crm/deals/${id}/stage`, { stage }),

  // Customers
  getCustomers: () => api.get("/crm/customers"),
  createCustomer: (data) => api.post("/crm/customers", data),
  updateCustomer: (id, data) => api.patch(`/crm/customers/${id}`, data),

  // Contacts
  getContacts: () => api.get("/crm/contacts"),
  createContact: (data) => api.post("/crm/contacts", data),
  updateContact: (id, data) => api.patch(`/crm/contacts/${id}`, data),

  // Sales Orders (Bridged from SCM)
  getSalesOrders: () => api.get("/scm/sales-orders"),

  // Activities
  getActivities: () => api.get("/crm/activities"),
  addActivity: (data) => api.post("/crm/activities", data),

  // Quotations
  getQuotes: () => api.get("/crm/quotes"),
  createQuote: (data) => api.post("/crm/quotes", data),
  updateQuoteStatus: (id, status) =>
    api.post(`/crm/quotes/${id}/status`, { status }),

  // Analytics
  getStats: () => api.get("/crm/stats"),
};

export default crmApi;
