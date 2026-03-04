import { createContext, useContext, useEffect, useState } from "react";
import { manufacturingApi } from "../services/manufacturingApi";

const ManufacturingContext = createContext();

export const ManufacturingProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [boms, setBoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    try {
      const [woRes, bomRes] = await Promise.all([
        manufacturingApi.getWorkOrders(),
        manufacturingApi.getBOMs()
      ]);
      setOrders(woRes.data);
      setBoms(bomRes.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch manufacturing data");
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (data) => {
    setLoading(true);
    try {
      await manufacturingApi.createWorkOrder(data);
      await refreshData();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create Work Order");
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
      setError(err.response?.data?.detail || "Production execution failed");
    } finally {
      setLoading(false);
    }
  };

  const createBOM = async (data) => {
    setLoading(true);
    try {
      await manufacturingApi.createBOM(data);
      await refreshData();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create BOM");
    } finally {
      setLoading(false);
    }
  };

  // --- Compatibility Bridge ---
  const stats = {
    activeWorkOrders: orders.filter(o => o.status !== "COMPLETED").length,
    dailyOutput: 0, 
    efficiencyRate: 0 
  };

  const bridgedOrders = orders.map(o => ({
    ...o,
    id: `WO-${o.id.toString().padStart(4, '0')}`,
    realId: o.id,
    product: `BOM #${o.bom_id}`,
    qty: o.quantity_to_produce,
    priority: "Medium",
    due: "TBD",
    status: o.status === "COMPLETED" ? "Executed" : o.status
  }));

  return (
    <ManufacturingContext.Provider value={{ 
        orders: bridgedOrders, 
        boms,
        stats, 
        loading,
        error,
        createOrder, 
        produce,
        createBOM,
        refreshData
    }}>
      {children}
    </ManufacturingContext.Provider>
  );
};

export const useManufacturing = () => {
  const context = useContext(ManufacturingContext);
  if (!context) throw new Error("useManufacturing must be used within ManufacturingProvider");
  return context;
};
