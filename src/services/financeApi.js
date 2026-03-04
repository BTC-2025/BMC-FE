import api from "./api";

export const financeApi = {
  // Chart of Accounts
  getAccounts: () => api.get("/finance/accounts"),
  createAccount: (data) => api.post("/finance/accounts", data),

  // Invoices (AR)
  getInvoices: () => api.get("/finance/invoices"),
  createInvoice: (data) => api.post("/finance/invoices", data),
  postInvoice: (id) => api.post(`/finance/invoices/${id}/post`),
  payInvoice: (id, data) => api.post(`/finance/invoices/${id}/pay`, data),

  // Bills (AP)
  getBills: () => api.get("/finance/bills"),
  createBill: (data) => api.post("/finance/bills", data),
  updateBill: (id, data) => api.put(`/finance/bills/${id}`, data),
  deleteBill: (id) => api.delete(`/finance/bills/${id}`),
  postBill: (id) => api.post(`/finance/bills/${id}/post`),
  downloadInvoicePDF: (id) =>
    api.get(`/finance/invoices/${id}/pdf`, { responseType: "blob" }),
  downloadBillPDF: (id) =>
    api.get(`/finance/bills/${id}/pdf`, { responseType: "blob" }),

  // Reports
  getTrialBalance: () => api.get("/finance/reports/trial-balance"),
  getProfitLoss: () => api.get("/finance/reports/pnl"),

  // Bank
  syncBank: () => api.post("/finance/bank-statements/sync"),
  getBankStatements: () => api.get("/finance/bank-statements"),
  getPayments: () => api.get("/finance/payments"),
};

export default financeApi;
