import api from "./api";

export const authApi = {
  login: (credentials) =>
    api.post("/auth/login", credentials, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }),
  me: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
  register: (data) => api.post("/auth/register", data),
};

export default authApi;
