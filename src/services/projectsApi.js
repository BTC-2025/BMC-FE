import api from "./api";

export const projectsApi = {
  getProjects: () => api.get("/projects/"),
  getProject: (id) => api.get(`/projects/${id}`),
  createProject: (data) => api.post("/projects/", data),
  deleteProject: (id) => api.delete(`/projects/${id}`),

  // Tasks
  getTasks: (projectId) => api.get(`/projects/${projectId}/tasks`),
  createTask: (projectId, data) =>
    api.post(`/projects/${projectId}/tasks`, data),
  updateTask: (taskId, data) => api.patch(`/projects/tasks/${taskId}`, data),
  deleteTask: (taskId) => api.delete(`/projects/tasks/${taskId}`),

  // Milestones
  getMilestones: (projectId) => api.get(`/projects/${projectId}/milestones`),
  createMilestone: (projectId, data) =>
    api.post(`/projects/${projectId}/milestones`, data),
  updateMilestone: (milestoneId, data) =>
    api.patch(`/projects/milestones/${milestoneId}`, data),
  deleteMilestone: (milestoneId) =>
    api.delete(`/projects/milestones/${milestoneId}`),

  // Members
  addMember: (projectId, data) =>
    api.post(`/projects/${projectId}/members`, data),

  // Summary
  getSummary: (projectId) => api.get(`/projects/${projectId}/summary`),
};

export default projectsApi;
