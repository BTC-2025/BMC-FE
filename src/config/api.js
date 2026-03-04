/**
 * API Configuration
 */
export const API_BASE_URL = "http://localhost:8000";

export const ENDPOINTS = {
  BI: {
    DASHBOARD: `${API_BASE_URL}/bi/dashboard`,
    REVENUE_TREND: `${API_BASE_URL}/bi/revenue-trend`,
    EXPORT: `${API_BASE_URL}/bi/export`,
  },
};
