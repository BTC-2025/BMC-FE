import { createContext, useContext, useEffect, useState } from "react";
import { inventoryApi } from "../services/inventoryApi";
import { scmApi } from "../services/scmApi";
import { crmApi } from "../services/crmApi";
import { useToast } from "./ToastContext";

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [batches, setBatches] = useState([]);
  const [serials, setSerials] = useState([]);
  const [bins, setBins] = useState([]);
  const [itemGroups, setItemGroups] = useState([]);
  const [priceLists, setPriceLists] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [assemblies, setAssemblies] = useState([]);
  const [salesOrders, setSalesOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchItems(),
        fetchWarehouses(),
        fetchAuditLog(),
        fetchCategories(),
        fetchBatches(),
        fetchSerials(),
        fetchItemGroups(),
        fetchPriceLists(),
        fetchAlerts(),
        fetchBins(),
        fetchAssemblies(),
        fetchSalesOrders(),
        fetchCustomers(),
        fetchSuppliers().catch((e) =>
          console.error("Suppliers fetch error:", e),
        ),
        fetchPurchaseOrders().catch((e) => console.error("PO fetch error:", e)),
      ]);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch inventory data");
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async () => {
    const res = await inventoryApi.getItems();
    setItems(res.data);
  };

  const fetchWarehouses = async () => {
    const res = await inventoryApi.getWarehouses();
    setWarehouses(res.data);
  };

  const fetchCategories = async () => {
    try {
      const res = await inventoryApi.getCategories();
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const fetchAuditLog = async () => {
    try {
      const res = await inventoryApi.getAuditLog();
      // Transform backend StockMovement data to UI format
      const mapped = res.data.map((movement) => {
        const item = items.find((i) => i.id === movement.item_id);
        const warehouse = warehouses.find(
          (w) => w.id === movement.warehouse_id,
        );

        return {
          id: movement.id,
          type: movement.quantity > 0 ? "Stock In" : "Stock Out",
          product: item?.name || `Item #${movement.item_id}`,
          qty: Math.abs(movement.quantity),
          warehouse: warehouse?.name || `Warehouse #${movement.warehouse_id}`,
          bin_id: movement.bin_id,
          notes: movement.reference || "",
          user: `User #${movement.performed_by}`,
          date: new Date(movement.created_at).toLocaleDateString(),
          movement_type: movement.movement_type,
          ref_type: movement.ref_type,
        };
      });
      setTransactions(mapped || []);
    } catch (err) {
      console.error("Failed to fetch audit log:", err);
    }
  };

  const fetchBatches = async () => {
    try {
      const res = await inventoryApi.getBatches();
      setBatches(res.data);
    } catch (err) {
      console.error("Failed to fetch batches:", err);
    }
  };

  const fetchSerials = async () => {
    try {
      const res = await inventoryApi.getSerials();
      setSerials(res.data);
    } catch (err) {
      console.error("Failed to fetch serials:", err);
    }
  };

  const fetchBins = async () => {
    try {
      const allBins = [];
      for (const wh of warehouses) {
        try {
          const res = await inventoryApi.getBins(wh.id);
          allBins.push(
            ...res.data.map((b) => ({ ...b, warehouse_name: wh.name })),
          );
        } catch (e) {
          console.warn(`Failed to fetch bins for warehouse ${wh.id}:`, e);
        }
      }
      setBins(allBins);
    } catch (err) {
      console.error("Failed to fetch bins:", err);
    }
  };

  const updateItemGroup = async (id, data) => {
    setError(null);
    try {
      const res = await inventoryApi.updateItemGroup(id, data);
      setItemGroups((prev) => prev.map((g) => (g.id === id ? res.data : g)));
      showToast("Item Group updated", "success");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update item group");
      throw err;
    }
  };

  const deleteItemGroup = async (id) => {
    setError(null);
    try {
      await inventoryApi.deleteItemGroup(id);
      setItemGroups((prev) => prev.filter((g) => g.id !== id));
      showToast("Item Group deleted", "success");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete item group");
    }
  };

  const fetchItemGroups = async () => {
    try {
      const res = await inventoryApi.getItemGroups();
      setItemGroups(res.data);
    } catch (err) {
      console.error("Failed to fetch item groups:", err);
    }
  };

  const fetchPriceLists = async () => {
    try {
      const res = await inventoryApi.getPriceLists();
      setPriceLists(res.data);
    } catch (err) {
      console.error("Failed to fetch price lists", err);
    }
  };

  const updatePriceList = async (id, data) => {
    setError(null);
    try {
      const res = await inventoryApi.updatePriceList(id, data);
      setPriceLists((prev) => prev.map((pl) => (pl.id === id ? res.data : pl)));
      showToast("Price list updated", "success");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update price list");
      throw err;
    }
  };

  const deletePriceList = async (id) => {
    setError(null);
    try {
      await inventoryApi.deletePriceList(id);
      setPriceLists((prev) => prev.filter((pl) => pl.id !== id));
      showToast("Price list deleted", "success");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete price list");
    }
  };

  const fetchAlerts = async () => {
    try {
      const res = await inventoryApi.getAlerts();
      setAlerts(res.data);
    } catch (err) {
      console.error("Failed to fetch alerts:", err);
    }
  };

  const fetchAssemblies = async () => {
    try {
      const res = await inventoryApi.getAssemblies();
      setAssemblies(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch assemblies:", err);
    }
  };

  const fetchSalesOrders = async () => {
    try {
      const res = await scmApi.getSalesOrders();
      setSalesOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch sales orders:", err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await crmApi.getLeads(); // Fallback to leads as customers index
      setCustomers(res.data);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await scmApi.getSuppliers();
      console.log("Fetched Suppliers:", res.data);
      setSuppliers(res.data);
    } catch (err) {
      console.error("Failed to fetch suppliers:", err);
    }
  };

  const fetchPurchaseOrders = async () => {
    try {
      const res = await scmApi.getPurchaseOrders();
      console.log("Fetched Purchase Orders:", res.data);
      setPurchaseOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch purchase orders:", err);
    }
  };

  const addItem = async (data) => {
    setLoading(true);
    try {
      const res = await inventoryApi.createItem(data);
      setItems((prev) => [res.data, ...prev]);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add item");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const moveStock = async (movement) => {
    setLoading(true);
    try {
      let item_id = movement.item_id;
      let quantity = movement.quantity;

      if (!item_id && movement.product) {
        const item = items.find(
          (i) => i.name === movement.product || i.sku === movement.product,
        );
        if (!item) throw new Error(`Item not found: ${movement.product}`);
        item_id = item.id;
      }

      if (quantity === undefined && movement.qty !== undefined) {
        const qty = parseInt(movement.qty);
        quantity =
          movement.type === "Stock Out" ? -Math.abs(qty) : Math.abs(qty);
      }

      const payload = {
        item_id: item_id,
        warehouse_id: movement.warehouse_id || 1,
        bin_id: movement.bin_id || null,
        quantity: quantity,
        reference: movement.reference || movement.notes || "Manual adjustment",
      };

      await inventoryApi.adjustStock(payload);
      await Promise.all([fetchItems(), fetchAuditLog()]);
    } catch (err) {
      setError(
        err.response?.data?.detail || err.message || "Stock movement failed",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const transferStock = async (data) => {
    setLoading(true);
    try {
      await inventoryApi.transferStock(data);
      await Promise.all([fetchItems(), fetchAuditLog()]);
    } catch (err) {
      setError(err.response?.data?.detail || "Transfer failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const stockInBatch = async (data) => {
    setLoading(true);
    try {
      await inventoryApi.stockInBatch(data);
      await Promise.all([fetchItems(), fetchAuditLog(), fetchBatches()]);
    } catch (err) {
      setError(err.response?.data?.detail || "Batch Stock-In failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const stockInSerial = async (data) => {
    setLoading(true);
    try {
      await inventoryApi.stockInSerial(data);
      await Promise.all([fetchItems(), fetchAuditLog(), fetchSerials()]);
    } catch (err) {
      setError(err.response?.data?.detail || "Serial Stock-In failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createAssembly = async (data) => {
    setLoading(true);
    try {
      await inventoryApi.createAssembly(data);
      await fetchAssemblies();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create assembly");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const buildAssembly = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await inventoryApi.buildAssembly(data);
      await Promise.all([fetchItems(), fetchAuditLog(), fetchAssemblies()]);
    } catch (err) {
      setError(err.response?.data?.detail || "Build failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const addSalesOrder = async (data) => {
    setLoading(true);
    setError(null);
    try {
      // Map UI data to backend schema
      const payload = {
        customer_name: data.customer || data.customer_name,
        items: [
          {
            item_id:
              items.find(
                (i) => i.name === data.product || i.sku === data.product,
              )?.id || 1,
            quantity: parseFloat(data.qty),
            unit_price: parseFloat(data.amount) / parseFloat(data.qty) || 0,
          },
        ],
      };
      await scmApi.createSalesOrder(payload);
      await fetchSalesOrders();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add sales order");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fulfillSalesOrder = async (soId, warehouseId) => {
    setLoading(true);
    setError(null);
    try {
      await scmApi.fulfillSalesOrder(soId, warehouseId);
      await Promise.all([fetchSalesOrders(), fetchItems(), fetchAuditLog()]);
    } catch (err) {
      setError(err.response?.data?.detail || "Fulfillment failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSalesOrder = async (soId, data) => {
    setLoading(true);
    setError(null);
    try {
      await scmApi.updateSalesOrder(soId, data);
      await fetchSalesOrders();
    } catch (err) {
      setError(err.response?.data?.detail || "Update failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (data) => {
    setLoading(true);
    try {
      await crmApi.createLead({
        name: data.name,
        email: data.email,
        phone: data.contact, // Mapping 'contact' field from UI to 'phone' on backend
      });
      await fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add customer");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCustomer = async (id, data) => {
    setLoading(true);
    try {
      await crmApi.updateLead(id, {
        name: data.name,
        email: data.email,
        phone: data.contact,
      });
      await fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update customer");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeCustomer = async (id) => {
    // Placeholder for deletion since backend route is missing
    showToast("Deletion protocol not yet supported locally", "warning");
  };

  const addSupplier = async (data) => {
    setLoading(true);
    try {
      await scmApi.createSupplier(data);
      await fetchSuppliers();
      showToast("Vendor onboarded successfully", "success");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add supplier");
    } finally {
      setLoading(false);
    }
  };

  const updateSupplier = async (id, data) => {
    // Backend API might need patch, using local update for now if missing
    showToast("Supplier update protocol not yet fully synced", "info");
  };

  const removeSupplier = async (id) => {
    showToast("Supplier deletion protocol restricted", "warning");
  };

  const addPurchaseOrder = async (data) => {
    setLoading(true);
    try {
      // Find supplier ID from name
      const supplier = suppliers.find((s) => s.name === data.supplier);
      const product = items.find((i) => i.name === data.product);

      const payload = {
        supplier_id: supplier?.id || 1,
        items: [
          {
            item_id: product?.id || 1,
            quantity: parseInt(data.qty),
          },
        ],
      };
      await scmApi.createPurchaseOrder(payload);
      await fetchPurchaseOrders();
      showToast("Purchase Order generated", "success");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add PO");
    } finally {
      setLoading(false);
    }
  };

  const updatePurchaseOrder = async (id, data) => {
    showToast("PO modification restricted after generation", "info");
  };

  const removePurchaseOrder = async (id) => {
    showToast("PO deletion restricted", "warning");
  };

  const approvePurchaseOrder = async (id) => {
    setLoading(true);
    try {
      await scmApi.approvePurchaseOrder(id);
      await fetchPurchaseOrders();
      showToast("PO Approved for procurement", "success");
    } catch (err) {
      setError(err.response?.data?.detail || "PO Approval failed");
    } finally {
      setLoading(false);
    }
  };

  const receivePurchaseOrder = async (poId, warehouseId) => {
    setLoading(true);
    try {
      await scmApi.receiveGoods({
        purchase_order_id: poId,
        warehouse_id: warehouseId,
      });
      await Promise.all([fetchPurchaseOrders(), fetchItems(), fetchAuditLog()]);
      showToast("Goods received and stock updated", "success");
    } catch (err) {
      setError(err.response?.data?.detail || "Goods receipt failed");
    } finally {
      setLoading(false);
    }
  };

  // --- Compatibility Helpers ---
  const products = items;

  const addCategory = async (name) => {
    setError(null);
    try {
      const res = await inventoryApi.createCategory({ name });
      setCategories((prev) => [...prev, res.data]);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add category");
    }
  };

  const removeCategory = async (nameOrId) => {
    setError(null);
    try {
      // Find ID if name was passed
      const cat = categories.find(
        (c) => c.name === nameOrId || c.id === nameOrId,
      );
      if (!cat) return;

      await inventoryApi.deleteCategory(cat.id);
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      showToast("Category deleted", "success");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to remove category");
    }
  };

  const updateCategory = async (id, data) => {
    setError(null);
    try {
      const res = await inventoryApi.updateCategory(id, data);
      setCategories((prev) => prev.map((c) => (c.id === id ? res.data : c)));
      showToast("Category updated", "success");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update category");
      throw err;
    }
  };

  const addProduct = async (p) => {
    setError(null);
    // Find category ID from name
    const category = categories.find((c) => c.name === p.category);
    const data = {
      name: p.name,
      sku: p.sku || p.id,
      unit: p.unit || "pcs",
      reorder_level: p.reorder || p.reorder_level || 0,
      valuation_rate: parseFloat(p.price || 0),
      category_id: category?.id,
    };
    return await addItem(data);
  };

  const updateProduct = async (idOrSku, updates) => {
    setLoading(true);
    setError(null);
    try {
      // Find item ID by SKU if necessary
      const item = items.find((i) => i.id === idOrSku || i.sku === idOrSku);
      if (!item) throw new Error("Item not found");

      // If category name provided, map to ID
      if (updates.category) {
        const category = categories.find((c) => c.name === updates.category);
        if (category) {
          updates.category_id = category.id;
        }
      }

      const res = await inventoryApi.updateItem(item.id, updates);
      setItems((prev) => prev.map((i) => (i.id === item.id ? res.data : i)));
    } catch (err) {
      setError(err.response?.data?.detail || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (idOrSku) => {
    setLoading(true);
    setError(null);
    try {
      const item = items.find((i) => i.id === idOrSku || i.sku === idOrSku);
      if (!item) throw new Error("Item not found");

      await inventoryApi.deleteItem(item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (err) {
      setError(err.response?.data?.detail || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalProducts: items.length,
    lowStockItems: items.filter(
      (i) => (i.current_stock || 0) <= (i.reorder_level || 0),
    ).length,
    outOfStock: items.filter((i) => (i.current_stock || 0) === 0).length,
    stockValue: items.reduce(
      (acc, i) => acc + (i.current_stock || 0) * (i.valuation_rate || 0),
      0,
    ),
  };

  const addWarehouse = async (wh) => {
    setError(null);
    try {
      const res = await inventoryApi.createWarehouse({
        name: wh.name,
        parent_id: wh.parent_id,
      });
      setWarehouses((prev) => [...prev, res.data]);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create warehouse");
    }
  };

  const updateWarehouse = (id, updates) => {
    // Local state update for responsiveness (Sync will happen on next fetch)
    setWarehouses((prev) =>
      prev.map((wh) => (wh.id === id ? { ...wh, ...updates } : wh)),
    );
  };

  const removeWarehouse = (id) => {
    setWarehouses((prev) => prev.filter((wh) => wh.id !== id));
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTransaction = (id, updates) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    );
  };

  return (
    <InventoryContext.Provider
      value={{
        items,
        products,
        warehouses,
        transactions,
        loading,
        isLoading: loading, // Compatibility
        error,
        clearError,
        addItem,
        addProduct,
        updateProduct,
        removeProduct,
        moveStock,
        executeTransaction: moveStock, // Bridge
        fetchItems,
        fetchWarehouses,
        addWarehouse,
        updateWarehouse,
        removeWarehouse,
        deleteTransaction,
        updateTransaction,
        categories,
        fetchCategories,
        addCategory,
        removeCategory,
        batches,
        serials,
        bins,
        itemGroups,
        priceLists,
        alerts,
        fetchBatches,
        fetchSerials,
        fetchBins,
        fetchItemGroups,
        fetchPriceLists,
        fetchAlerts,
        transferStock,
        stockInBatch,
        stockInSerial,
        getBarcodeUrl: inventoryApi.getBarcodeUrl,
        stats,
        assemblies,
        salesOrders,
        customers,
        suppliers,
        purchaseOrders,
        addCustomer,
        updateCustomer,
        removeCustomer,
        addSupplier,
        updateSupplier,
        removeSupplier,
        addPurchaseOrder,
        updatePurchaseOrder,
        removePurchaseOrder,
        approvePurchaseOrder,
        receivePurchaseOrder,
        fetchAssemblies,
        createAssembly,
        buildAssembly,
        fetchSalesOrders,
        addSalesOrder,
        fulfillSalesOrder,
        updateSalesOrder,
        updateCategory,
        updateItemGroup,
        deleteItemGroup,
        updatePriceList,
        deletePriceList,
      }}

    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);
