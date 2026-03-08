import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { manufacturingApi } from "../services/manufacturingApi";

const ManufacturingContext = createContext();

export const ManufacturingProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [boms, setBoms] = useState([]);
  const [workCenters, setWorkCenters] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [costingRecords, setCostingRecords] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.allSettled([
        manufacturingApi.getWorkOrders(),
        manufacturingApi.getBOMs(),
        manufacturingApi.getWorkCenters(),
        manufacturingApi.getInspections(),
        manufacturingApi.getCostingRecords(),
        manufacturingApi.getSchedules(),
      ]);

      if (results[0].status === "fulfilled") setOrders(results[0].value.data);
      if (results[1].status === "fulfilled") setBoms(results[1].value.data);
      if (results[2].status === "fulfilled") setWorkCenters(results[2].value.data);
      if (results[3].status === "fulfilled") setInspections(results[3].value.data);
      if (results[4].status === "fulfilled") setCostingRecords(results[4].value.data);
      if (results[5].status === "fulfilled") setSchedules(results[5].value.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch manufacturing data");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── BOMs ────────────────────────────────────────────────────────────────

  const createBOM = async (data) => {
    setLoading(true);
    try {
      await manufacturingApi.createBOM(data);
      await refreshData();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create BOM");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBOM = async (id) => {
    setLoading(true);
    try {
      await manufacturingApi.deleteBOM(id);
      await refreshData();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete BOM");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ── Work Orders ──────────────────────────────────────────────────────────

  const createOrder = async (data) => {
    setLoading(true);
    try {
      await manufacturingApi.createWorkOrder(data);
      await refreshData();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create Work Order");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (id) => {
    setLoading(true);
    try {
      await manufacturingApi.deleteWorkOrder(id);
      await refreshData();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete Work Order");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const produce = async (id, warehouseId = 1) => {
    setLoading(true);
    try {
      await manufacturingApi.produce(id, warehouseId);
      await refreshData();
    } catch (err) {
      const msg = err.response?.data?.detail || "Production execution failed";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Quality ──────────────────────────────────────────────────────────────

  const inspect = async (id, status = "PASS") => {
    setLoading(true);
    try {
      // Send an empty array for PASS, which allows the backend to naturally pass the inspection.
      await manufacturingApi.inspectWorkOrder(id, []);
      await refreshData();
    } catch (err) {
      const msg = err.response?.data?.detail || "Inspection creation failed";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Shop Floor ───────────────────────────────────────────────────────────

  const scheduleOrder = async (id, startDate) => {
    setLoading(true);
    try {
      await manufacturingApi.scheduleWorkOrder(id, startDate);
      await refreshData();
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to schedule order";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Work Centers ─────────────────────────────────────────────────────────

  const createWorkCenter = async (data) => {
    setLoading(true);
    try {
      await manufacturingApi.createWorkCenter(data);
      await refreshData();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create Work Center");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateWorkCenter = async (id, data) => {
    setLoading(true);
    try {
      await manufacturingApi.updateWorkCenter(id, data);
      await refreshData();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update Work Center");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteWorkCenter = async (id) => {
    setLoading(true);
    try {
      await manufacturingApi.deleteWorkCenter(id);
      await refreshData();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete Work Center");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ── Compatibility bridge ─────────────────────────────────────────────────

  const stats = {
    activeWorkOrders: orders.filter((o) => o.status !== "COMPLETED").length,
    completedToday: orders.filter((o) => o.status === "COMPLETED").length,
    totalBOMs: boms.length,
  };

  const bridgedOrders = orders.map((o) => ({
    ...o,
    id: `WO-${String(o.id).padStart(4, "0")}`,
    realId: o.id,
    bomName: boms.find((b) => b.id === o.bom_id)?.name || `BOM #${o.bom_id}`,
    product: boms.find((b) => b.id === o.bom_id)?.name || `BOM #${o.bom_id}`,
    qty: o.quantity_to_produce,
    priority: o.quantity_to_produce > 50 ? "High" : "Medium",
    due: o.created_at ? new Date(new Date(o.created_at).getTime() + 7 * 86400000).toLocaleDateString() : "TBD",
    status:
      o.status === "COMPLETED" ? "Executed" :
      o.status === "IN_PROGRESS" ? "In Production" :
      "Planned",
  }));

  const completedOrders = orders.filter((o) => o.status === "COMPLETED");

  return (
    <ManufacturingContext.Provider
      value={{
        orders: bridgedOrders,
        rawOrders: orders,
        boms,
        workCenters,
        inspections,
        costingRecords,
        schedules,
        stats,
        loading,
        error,
        completedOrders,
        createOrder,
        deleteOrder,
        produce,
        inspect,
        scheduleOrder,
        createBOM,
        deleteBOM,
        createWorkCenter,
        updateWorkCenter,
        deleteWorkCenter,
        refreshData,
      }}
    >
      {children}
    </ManufacturingContext.Provider>
  );
};

export const useManufacturing = () => {
  const context = useContext(ManufacturingContext);
  if (!context)
    throw new Error("useManufacturing must be used within ManufacturingProvider");
  return context;
};
