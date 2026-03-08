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

  const updateProject = async (id, data) => {
    // Backend doesn't have an updateProject route yet, skip for now or mock update temporarily
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const removeProject = async (id) => {
    setLoading(true);
    try {
      await projectsApi.deleteProject(id);
      await fetchProjects();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete project");
    } finally {
      setLoading(false);
    }
  };

  // --- Tasks ---
  const addTask = async (data) => {
    setLoading(true);
    try {
      // Find the project based on name or ID. data.project is a string name from the modal.
      const prj = projects.find(p => p.name === data.project) || projects[0];
      if (!prj) throw new Error("No active projects to assign task to.");

      await projectsApi.createTask(prj.id, {
        title: data.title,
        status: data.status === "Blocked" ? "TODO" : data.status === "Pending" ? "TODO" : "IN_PROGRESS",
        priority: data.priority ? data.priority.toUpperCase() : "MEDIUM"
      });
      await fetchProjects();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskId, data) => {
    setLoading(true);
    try {
      let statusMap = {
        "In Progress": "IN_PROGRESS",
        "Blocked": "TODO",
        "Completed": "DONE",
        "Pending": "TODO"
      };
      
      await projectsApi.updateTask(taskId, {
        status: statusMap[data.status] || "IN_PROGRESS"
      });
      await fetchProjects();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  const removeTask = async (taskId) => {
    setLoading(true);
    try {
      await projectsApi.deleteTask(taskId);
      await fetchProjects();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete task");
    } finally {
      setLoading(false);
    }
  };

  // --- Milestones ---
  const addMilestone = async (data) => {
    setLoading(true);
    try {
      const prj = projects[0]; // Just attach to the first project for now since UI doesn't allow project selection for milestones
      if (!prj) throw new Error("No active projects for milestone.");

      await projectsApi.createMilestone(prj.id, {
        title: data.title,
        status: data.status,
        due_date: new Date().toISOString().split('T')[0] // Use current date safely
      });
      await fetchProjects();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add milestone");
    } finally {
      setLoading(false);
    }
  };

  const updateMilestone = async (id, data) => {
    setLoading(true);
    try {
      await projectsApi.updateMilestone(id, {
        title: data.title,
        status: data.status,
        due_date: new Date().toISOString().split('T')[0] // Safely mock date update
      });
      await fetchProjects();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update milestone");
    } finally {
      setLoading(false);
    }
  };

  const removeMilestone = async (id) => {
    setLoading(true);
    try {
      await projectsApi.deleteMilestone(id);
      await fetchProjects();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete milestone");
    } finally {
      setLoading(false);
    }
  };

  // --- Compatibility Bridge ---
  const bridgedProjects = projects.map(p => ({
    ...p,
    id: `PRJ-${p.id.toString().padStart(3, '0')}`,
    realId: p.id,
    lead: "Self Assigned",
    timeline: p.start_date || "Ongoing"
  }));

  const allTasks = projects.flatMap(p => (p.tasks || []).map(t => ({
    id: t.id,
    realId: t.id,
    title: t.title,
    project: p.name,
    projectId: p.id,
    priority: t.priority === "HIGH" ? "High" : t.priority === "CRITICAL" ? "Critical" : "Medium",
    status: t.status === "DONE" ? "Completed" : "In Progress",
    due: "ASAP"
  })));

  const allMilestones = projects.flatMap(p => (p.milestones || []).map(m => ({
    ...m,
    id: m.id,
    title: m.title,
    date: m.due_date || "Upcoming",
    status: m.status === "ACHIEVED" ? "Completed" : "In Progress",
    description: "Operational initiative."
  })));

  return (
    <ProjectsContext.Provider
      value={{
        projects: bridgedProjects,
        allTasks,
        allMilestones,
        loading,
        error,
        fetchProjects,
        createProject,
        updateProject,
        removeProject,
        addTask,
        updateTask,
        removeTask,
        addMilestone,
        updateMilestone,
        removeMilestone,
        clearError: () => setError(null)
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
