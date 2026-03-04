import axios from "axios";

// Base URL (Backend)
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 REQUEST INTERCEPTOR (Attach JWT)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 🚨 RESPONSE INTERCEPTOR (Global Errors)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        // Token expired or invalid
        localStorage.removeItem("access_token");
        // Dispatch event for AuthContext to handle
        window.dispatchEvent(new Event("auth:logout"));
      }

      if (status === 403) {
        alert("You do not have permission to perform this action.");
      }
    }
    return Promise.reject(error);
  },
);

export default api;
