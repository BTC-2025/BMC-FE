/**
 * StockEngine
 * Responsible for calculating new stock levels across products and warehouses.
 * Ensures consistent and atomic updates.
 */
export const StockEngine = {
  /**
   * Calculates the new status of a product based on its stock level.
   */
  calculateStatus: (stock, reorderPoint) => {
    if (stock <= 0) return "Out of Stock";
    if (stock <= reorderPoint) return "Low Stock";
    return "Active";
  },

  /**
   * Processes a stock transaction and returns updated products and warehouses list.
   */
  processTransaction: (transaction, products, warehouses) => {
    const {
      product: productName,
      sku,
      qty,
      type,
      toWarehouseId = "WH-001",
    } = transaction;
    const amount = Number(qty);

    // 1. Update Products
    const updatedProducts = products.map((p) => {
      if (p.name === productName || p.sku === sku) {
        let newStock = Number(p.stock || 0);

        if (type === "Stock In") newStock += amount;
        else if (type === "Stock Out") newStock -= amount;
        else if (type === "Adjustment") newStock = amount;

        newStock = Math.max(0, newStock);
        return {
          ...p,
          stock: newStock,
          status: StockEngine.calculateStatus(newStock, Number(p.reorder || 0)),
        };
      }
      return p;
    });

    // 2. Update Warehouses
    const updatedWarehouses = warehouses.map((wh) => {
      // In a real system, this would use toWarehouseId.
      // For now, we follow the prototype's logic of updating WH-001.
      if (wh.id === toWarehouseId || wh.id === "WH-001") {
        let newWhStock = Number(wh.stockCount || 0);
        if (type === "Stock In") newWhStock += amount;
        else if (type === "Stock Out") newWhStock -= amount;
        return { ...wh, stockCount: Math.max(0, newWhStock) };
      }
      return wh;
    });

    return { updatedProducts, updatedWarehouses };
  },
};
