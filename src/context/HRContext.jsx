import { createContext, useContext, useEffect, useState } from "react";
import { hrmApi } from "../services/hrApi";

const HRContext = createContext();

export const HRProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [appraisalSummary, setAppraisalSummary] = useState(null);
  const [recruitment, setRecruitment] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchEmployees(),
        fetchDepartments(),
        fetchAttendance(),
        fetchLeaves(),
        fetchPayroll(),
        fetchPerformance(),
        fetchAppraisalSummary(),
        fetchRecruitment(),
      ]);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch HRM data");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    const res = await hrmApi.getEmployees();
    setEmployees(res.data);
  };

  const fetchDepartments = async () => {
    const res = await hrmApi.getDepartments();
    setDepartments(res.data);
  };

  const fetchAttendance = async () => {
    const res = await hrmApi.getAttendance();
    // Transform backend fields to frontend expectations if needed,
    // or just pass through if backend matches.
    // The redesigned Attendance.jsx will handle the mapping.
    setAttendance(res.data);
  };

  const fetchLeaves = async () => {
    const res = await hrmApi.getLeaves();
    setLeaves(res.data);
  };

  const fetchPerformance = async (filters = {}) => {
    const res = await hrmApi.getPerformance(filters);
    setPerformance(res.data);
  };

  const fetchAppraisalSummary = async () => {
    try {
      const res = await hrmApi.getPerformanceSummary();
      setAppraisalSummary(res.data);
    } catch {
      // Summary is non-critical – fail silently
    }
  };

  const fetchRecruitment = async () => {
    const res = await hrmApi.getJobs();
    setRecruitment(res.data);
  };

  const fetchPayroll = async () => {
    const res = await hrmApi.getPayroll();
    setPayroll(res.data);
  };

  const addEmployee = async (data) => {
    setLoading(true);
    try {
      const res = await hrmApi.createEmployee(data);
      setEmployees((prev) => [res.data, ...prev]);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create employee");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logAttendance = async (data) => {
    // data: { employee_id, action: 'IN' | 'OUT' }
    setLoading(true);
    try {
      await hrmApi.punchAttendance(data);
      await fetchAttendance();
    } catch (err) {
      setError(err.response?.data?.detail || "Attendance punch failed");
    } finally {
      setLoading(false);
    }
  };

  const applyLeave = async (data) => {
    setLoading(true);
    try {
      const res = await hrmApi.createLeave(data);
      setLeaves((prev) => [res.data, ...prev]);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to apply for leave");
    } finally {
      setLoading(false);
    }
  };

  const approveLeave = async (id) => {
    setLoading(true);
    try {
      await hrmApi.approveLeave(id);
      await fetchLeaves();
    } catch (err) {
      setError(err.response?.data?.detail || "Leave approval failed");
    } finally {
      setLoading(false);
    }
  };

  const rejectLeave = async (id) => {
    setLoading(true);
    try {
      await hrmApi.rejectLeave(id);
      await fetchLeaves();
    } catch (err) {
      setError(err.response?.data?.detail || "Leave rejection failed");
    } finally {
      setLoading(false);
    }
  };

  const processPayroll = async (employeeId, month) => {
    setLoading(true);
    try {
      await hrmApi.generatePayroll(employeeId, month);
      await fetchPayroll();
    } catch (err) {
      setError(err.response?.data?.detail || "Payroll generation failed");
    } finally {
      setLoading(false);
    }
  };

  // --- COMPATIBILITY BRIDGE ---

  const bridgedAttendance = attendance.map((a) => {
    const emp = employees.find((e) => e.id === a.employee_id);
    return {
      ...a,
      id: a.id,
      empId: `EMP-${a.employee_id}`,
      name: emp?.name || `Employee #${a.employee_id}`,
      checkIn: a.punch_in
        ? new Date(a.punch_in).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "---",
      checkOut: a.punch_out
        ? new Date(a.punch_out).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "---",
      status: a.status === "PRESENT" ? "Present" : a.status || "Active",
      date: a.punch_in
        ? new Date(a.punch_in).toISOString().split("T")[0]
        : "---",
    };
  });

  const bridgedLeaves = leaves.map((l) => {
    const emp = employees.find((e) => e.id === l.employee_id);
    return {
      ...l,
      empId: `EMP-${l.employee_id}`,
      name: emp?.name || `Employee #${l.employee_id}`,
      from: l.start_date,
      to: l.end_date,
      type: l.leave_type,
      status:
        l.status.charAt(0).toUpperCase() + l.status.slice(1).toLowerCase(),
    };
  });

  const stats = {
    totalEmployees: employees.length,
    presentToday: attendance.filter(
      (a) =>
        a.punch_in &&
        new Date(a.punch_in).toISOString().split("T")[0] ===
          new Date().toISOString().split("T")[0],
    ).length,
    pendingLeaves: leaves.filter((l) => l.status === "PENDING").length,
    activeJobs: recruitment.length,
    headcountGrowth: "0%",
    retentionRate: "100%",
  };

  const [departments, setDepartments] = useState([]);

  const addDepartment = async (name) => {
    setLoading(true);
    try {
      const res = await hrmApi.createDepartment({ name });
      setDepartments((prev) => [...prev, res.data]);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create department");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateDepartment = async (id, name) => {
    setLoading(true);
    try {
      const res = await hrmApi.updateDepartment(id, { name });
      setDepartments((prev) => prev.map((d) => (d.id === id ? res.data : d)));
      return res.data;
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update department");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeDepartment = async (id) => {
    setLoading(true);
    try {
      await hrmApi.deleteDepartment(id);
      setDepartments((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete department");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <HRContext.Provider
      value={{
        employees: employees.map((e) => ({
          ...e,
          id: `EMP-${e.id}`,
          realId: e.id,
        })), // Bridge ID format
        attendance: bridgedAttendance,
        leaves: bridgedLeaves,
        payroll,
        departments,
        performance,
        appraisalSummary,
        recruitment,
        stats,
        loading,
        isLoading: loading, // Bridge
        error,
        addEmployee,
        addDepartment,
        updateDepartment,
        removeDepartment,
        updateEmployee: async (id, data) => {
          setLoading(true);
          try {
            const realId = id?.toString().includes("EMP-")
              ? parseInt(id.split("-")[1])
              : id;
            const res = await hrmApi.updateEmployee(realId, {
              ...data,
              basic_salary: parseFloat(data.basic_salary) || 0,
            });
            setEmployees((prev) =>
              prev.map((e) => (e.id === realId ? res.data : e))
            );
            await fetchEmployees();
            return res.data;
          } catch (err) {
            setError(err.response?.data?.detail || "Failed to update employee");
            throw err;
          } finally {
            setLoading(false);
          }
        },
        removeEmployee: async (id) => {
          setLoading(true);
          try {
            const realId = id?.toString().includes("EMP-")
              ? parseInt(id.split("-")[1])
              : id;
            await hrmApi.deleteEmployee(realId);
            setEmployees((prev) => prev.filter((e) => e.id !== realId));
          } catch (err) {
            setError(err.response?.data?.detail || "Failed to delete employee");
            throw err;
          } finally {
            setLoading(false);
          }
        },
        logAttendance: async (data) => {
          const realId = data.employee_id?.toString().includes("EMP-")
            ? parseInt(data.employee_id.split("-")[1])
            : data.employee_id;
          return await logAttendance({ ...data, employee_id: realId });
        },
        punchCard: async (data) => {
          const realId = data.employee_id?.toString().includes("EMP-")
            ? parseInt(data.employee_id.split("-")[1])
            : data.employee_id;
          return await logAttendance({ ...data, employee_id: realId });
        },
        applyLeave,
        approveLeave,
        rejectLeave,
        updateLeaveStatus: (id, status) => {
          if (status === "Approved") return approveLeave(id);
          if (status === "Rejected") return rejectLeave(id);
          return null;
        },
        processPayroll,
        completeReview: async (employeeId, score, feedback) => {
          setLoading(true);
          try {
            const realId = employeeId?.toString().includes("EMP-")
              ? parseInt(employeeId.split("-")[1])
              : employeeId;
            await hrmApi.createPerformance({
              employee_id: realId,
              score: parseFloat(score),
              feedback,
              status: "COMPLETED",
            });
            await Promise.all([fetchPerformance(), fetchAppraisalSummary()]);
          } catch (err) {
            setError(err.response?.data?.detail || "Appraisal failed");
          } finally {
            setLoading(false);
          }
        },
        createAppraisal: async (data) => {
          setLoading(true);
          try {
            const realId = data.employee_id?.toString().includes("EMP-")
              ? parseInt(data.employee_id.split("-")[1])
              : data.employee_id;
            const res = await hrmApi.createPerformance({ ...data, employee_id: realId });
            await Promise.all([fetchPerformance(), fetchAppraisalSummary()]);
            return res.data;
          } catch (err) {
            setError(err.response?.data?.detail || "Failed to create appraisal");
            throw err;
          } finally {
            setLoading(false);
          }
        },
        updateAppraisal: async (id, data) => {
          setLoading(true);
          try {
            const res = await hrmApi.updateAppraisal(id, data);
            await Promise.all([fetchPerformance(), fetchAppraisalSummary()]);
            return res.data;
          } catch (err) {
            setError(err.response?.data?.detail || "Failed to update appraisal");
            throw err;
          } finally {
            setLoading(false);
          }
        },
        deleteAppraisal: async (id) => {
          setLoading(true);
          try {
            await hrmApi.deleteAppraisal(id);
            setPerformance((prev) => prev.filter((p) => p.id !== id));
            await fetchAppraisalSummary();
          } catch (err) {
            setError(err.response?.data?.detail || "Failed to delete appraisal");
            throw err;
          } finally {
            setLoading(false);
          }
        },
        refetchAppraisals: async (filters) => {
          await Promise.all([fetchPerformance(filters), fetchAppraisalSummary()]);
        },
        hireCandidate: async (jobId, candidate) => {
          setLoading(true);
          try {
            await hrmApi.hireCandidate(candidate.id);
            await Promise.all([fetchEmployees(), fetchRecruitment()]);
          } catch (err) {
            setError(err.response?.data?.detail || "Hiring failed");
          } finally {
            setLoading(false);
          }
        },
        createJob: async (data) => {
          setLoading(true);
          try {
            const res = await hrmApi.createJob(data);
            await fetchRecruitment();
            return res.data;
          } catch (err) {
            setError(err.response?.data?.detail || "Failed to create job");
            throw err;
          } finally {
            setLoading(false);
          }
        },
        deleteJob: async (jobId) => {
          setLoading(true);
          try {
            await hrmApi.deleteJob(jobId);
            await fetchRecruitment();
          } catch (err) {
            setError(err.response?.data?.detail || "Failed to delete job");
            throw err;
          } finally {
            setLoading(false);
          }
        },
        updateApplicationStatus: async (applicationId, status) => {
          setLoading(true);
          try {
            await hrmApi.updateApplicationStatus(applicationId, status);
            await fetchRecruitment();
          } catch (err) {
            setError(err.response?.data?.detail || "Failed to update status");
            throw err;
          } finally {
            setLoading(false);
          }
        },
        addApplication: async (data) => {
          setLoading(true);
          try {
            const res = await hrmApi.applyJob(data);
            await fetchRecruitment();
            return res.data;
          } catch (err) {
            setError(err.response?.data?.detail || "Failed to add application");
            throw err;
          } finally {
            setLoading(false);
          }
        },
      }}
    >
      {children}
    </HRContext.Provider>
  );
};

export const useHR = () => useContext(HRContext);
