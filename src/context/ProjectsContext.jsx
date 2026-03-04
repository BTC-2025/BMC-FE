import { createContext, useContext, useEffect, useState } from "react";
import { projectsApi } from "../services/projectsApi";

const ProjectsContext = createContext();

export const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await projectsApi.getProjects();
      setProjects(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (data) => {
    setLoading(true);
    try {
      await projectsApi.createProject(data);
      await fetchProjects();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create project");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskId, data) => {
    setLoading(true);
    try {
      await projectsApi.updateTask(taskId, data);
      // We might need to refresh projects if task progress affects project progress
      await fetchProjects();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (projectId, data) => {
    setLoading(true);
    try {
      await projectsApi.createTask(projectId, data);
      await fetchProjects();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  // --- Compatibility Bridge ---
  const bridedProjects = projects.map(p => ({
    ...p,
    id: `PRJ-${p.id.toString().padStart(3, '0')}`,
    realId: p.id,
    lead: "Assigned", // Backend doesn't have lead name directly in list
    timeline: "Ongoing"
  }));

  return (
    <ProjectsContext.Provider
      value={{
        projects: bridedProjects,
        loading,
        error,
        fetchProjects,
        createProject,
        updateTask,
        addTask,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) throw new Error("useProjects must be used within a ProjectsProvider");
  return context;
};
