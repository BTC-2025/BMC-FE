import api from "./api";

export const notificationApi = {
  getNotifications: () => api.get("/notifications"),
  markRead: (id) => api.post(`/notifications/${id}/read`),
};

export default notificationApi;
