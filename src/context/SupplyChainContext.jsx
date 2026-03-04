import { createContext, useContext, useEffect, useState } from "react";
import { scmApi } from "../services/scmApi";
import { inventoryApi } from "../services/inventoryApi";

const SupplyChainContext = createContext();

export const SupplyChainProvider = ({ children }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [salesOrders, setSalesOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchSuppliers(),
        fetchPurchaseOrders(),
        fetchShipments(),
        fetchSalesOrders(),
        fetchInventory(),
        fetchWarehouses(),
      ]);
    } catch (err) {
      console.error("SCM Data Refresh Error:", err);
      setError(err.response?.data?.detail || "Failed to fetch SCM data");
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    const res = await scmApi.getSuppliers();
    setSuppliers(res.data);
  };

  const fetchPurchaseOrders = async () => {
    const res = await scmApi.getPurchaseOrders();
    setPurchaseOrders(res.data);
  };

  const fetchShipments = async () => {
    const res = await scmApi.getShipments();
    setShipments(res.data);
  };

  const fetchSalesOrders = async () => {
    const res = await scmApi.getSalesOrders();
    setSalesOrders(res.data);
  };

  const fetchInventory = async () => {
    const res = await inventoryApi.getItems();
    setInventory(res.data);
  };

  const fetchWarehouses = async () => {
    const res = await inventoryApi.getWarehouses();
    setWarehouses(res.data);
  };

  // --- ACTIONS ---

  const createPO = async (data) => {
    setLoading(true);
    try {
      await scmApi.createPurchaseOrder(data);
      await fetchPurchaseOrders();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create PO");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const approvePO = async (id) => {
    setLoading(true);
    try {
      const realId =
        typeof id === "string" && id.startsWith("PR-")
          ? parseInt(id.split("-")[2])
          : id;
      await scmApi.approvePurchaseOrder(realId);
      await fetchPurchaseOrders();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to approve PO");
    } finally {
      setLoading(false);
    }
  };

  const receiveGoods = async (data) => {
    setLoading(true);
    try {
      await scmApi.receiveGoods(data);
      await fetchPurchaseOrders();
      await fetchInventory(); // Refresh stock
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to receive goods");
    } finally {
      setLoading(false);
    }
  };

  const addSupplier = async (data) => {
    setLoading(true);
    try {
      await scmApi.createSupplier(data);
      await fetchSuppliers();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add supplier");
    } finally {
      setLoading(false);
    }
  };

  const updateSupplier = async (id, data) => {
    setLoading(true);
    try {
      const realId =
        typeof id === "string" && id.startsWith("SUP-")
          ? parseInt(id.split("-")[1])
          : id;
      await scmApi.updateSupplier(realId, data);
      await fetchSuppliers();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update supplier");
    } finally {
      setLoading(false);
    }
  };

  const deleteSupplier = async (id) => {
    setLoading(true);
    try {
      const realId =
        typeof id === "string" && id.startsWith("SUP-")
          ? parseInt(id.split("-")[1])
          : id;
      await scmApi.deleteSupplier(realId);
      await fetchSuppliers();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete supplier");
    } finally {
      setLoading(false);
    }
  };

  const createShipment = async (data) => {
    setLoading(true);
    try {
      await scmApi.createShipment(data);
      await fetchShipments();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create shipment");
    } finally {
      setLoading(false);
    }
  };

  const updateShipment = async (id, data) => {
    setLoading(true);
    try {
      await scmApi.updateShipment(id, data);
      await fetchShipments();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update shipment");
    } finally {
      setLoading(false);
    }
  };

  const deleteShipment = async (id) => {
    setLoading(true);
    try {
      await scmApi.deleteShipment(id);
      await fetchShipments();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete shipment");
    } finally {
      setLoading(false);
    }
  };

  const fulfillSO = async (id, warehouseId) => {
    setLoading(true);
    try {
      await scmApi.fulfillSalesOrder(id, warehouseId);
      await fetchSalesOrders();
      await fetchInventory(); // Refresh stock
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fulfill SO");
    } finally {
      setLoading(false);
    }
  };

  const createSalesOrder = async (data) => {
    setLoading(true);
    try {
      await scmApi.createSalesOrder(data);
      await fetchSalesOrders();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create SO");
    } finally {
      setLoading(false);
    }
  };

  // --- COMPATIBILITY BRIDGE ---

  const bridgedSuppliers = suppliers.map((s) => ({
    ...s,
    id: `SUP-${s.id}`,
    realId: s.id,
    type: "Vendor",
    rating: s.rating === 5 ? "A" : s.rating === 4 ? "B" : "C",
    status: "Active",
    location: "Global",
  }));

  const bridgedPOs = purchaseOrders.map((po) => {
    const supplier = suppliers.find((s) => s.id === po.supplier_id);
    const firstItem = po.items && po.items.length > 0 ? po.items[0] : null;
    return {
      ...po,
      id: `PR-2026-${po.id}`,
      realId: po.id,
      vendor: supplier?.name || "Unknown Vendor",
      status:
        po.status === "DRAFT"
          ? "Pending Approval"
          : po.status === "APPROVED"
            ? "Ordered"
            : po.status === "CLOSED"
              ? "Delivered"
              : po.status,
      item: firstItem ? `Item #${firstItem.item_id}` : "Multi-item PO",
      qty: firstItem ? `${firstItem.quantity_ordered} Units` : "See Details",
      urge: "Medium",
    };
  });

  const bridgedRoutes = shipments.map((s) => ({
    id: s.tracking_number,
    realId: s.id,
    origin: s.origin_code,
    dest: "Standard Distribution", // Fixed for now or use meta
    method:
      s.carrier === "FedEx" ? "Air" : s.carrier === "Maersk" ? "Sea" : "Road",
    eta: "TBD",
    status: s.status === "SHIPPED" ? "On Time" : "Processing",
  }));

  const bridgedFulfillments = salesOrders.map((so) => ({
    id: `SO-${so.id}`,
    realId: so.id,
    items:
      so.items?.length > 0
        ? `${so.items[0].quantity}x Item #${so.items[0].item_id}`
        : "Empty SO",
    packer: "System Auto",
    status:
      so.status === "PENDING"
        ? "Ready to Pick"
        : so.status === "PROCESSING"
          ? "Packing"
          : so.status === "FULFILLED"
            ? "Shipped"
            : so.status,
  }));

  const [fleet] = useState({ forklifts: 4, palletJacks: 12 });
  const [returns] = useState([]);
  const [forecasts] = useState([]);
  const [categoryTrends] = useState([]);

  const value = {
    suppliers: bridgedSuppliers,
    purchaseOrders: bridgedPOs,
    routes: bridgedRoutes,
    fulfillments: bridgedFulfillments,
    inventory,
    warehouseItems: warehouses,
    fleet,
    loading,
    isLoading: loading,
    error,
    refreshData,
    createPO,
    approvePO,
    updatePOStatus: async (id, status) => {
      if (status === "Approved" || status === "Ordered") await approvePO(id);
    },
    receiveGoods,
    addSupplier,
    updateSupplier,
    deleteSupplier,

    deletePO: async (id) => {
      setLoading(true);
      try {
        const realId =
          typeof id === "string" && id.startsWith("PR-")
            ? parseInt(id.split("-")[2])
            : id;
        await scmApi.deletePurchaseOrder(realId);
        await fetchPurchaseOrders();
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to delete PO");
      } finally {
        setLoading(false);
      }
    },

    // Non-wired but used by UI
    addRoute: createShipment,
    updateRoute: updateShipment,
    deleteRoute: deleteShipment,
    createRandomShipment: () =>
      createShipment({
        origin_code: "AUTO",
        carrier: "FedEx",
        status: "SHIPPED",
      }),
    addWarehouseZone: () => {},
    updateWarehouseZone: () => {},
    deleteWarehouseZone: () => {},
    updateFleet: () => {},
    addInventoryItem: () => {},
    updateInventoryItem: () => {},
    deleteInventoryItem: () => {},
    addFulfillmentOrder: createSalesOrder,
    updateFulfillmentOrder: (id, data) =>
      scmApi.updateSalesOrder(id, data).then(fetchSalesOrders),
    deleteFulfillmentOrder: () => {},
    updateFulfillmentStatus: (id) => fulfillSO(id, 1), // Default to WH 1
    returns,
    addReturn: () => {},
    updateReturn: () => {},
    deleteReturn: () => {},
    forecasts,
    categoryTrends,
    generateForecast: () => {},
  };

  return (
    <SupplyChainContext.Provider value={value}>
      {children}
    </SupplyChainContext.Provider>
  );
};

export const useSupplyChain = () => {
  const context = useContext(SupplyChainContext);
  if (!context)
    throw new Error("useSupplyChain must be used within a SupplyChainProvider");
  return context;
};
