import api from "./api";

export const projectsApi = {
  getProjects: () => api.get("/projects/"),
  createProject: (data) => api.post("/projects/", data),

  // Tasks
  getTasks: (projectId) => api.get(`/projects/${projectId}/tasks`),
  createTask: (projectId, data) =>
    api.post(`/projects/${projectId}/tasks`, data),
  updateTask: (taskId, data) => api.patch(`/projects/tasks/${taskId}`, data),

  // Members
  addMember: (projectId, data) =>
    api.post(`/projects/${projectId}/members`, data),

  // Summary
  getSummary: (projectId) => api.get(`/projects/${projectId}/summary`),
};

export default projectsApi;
