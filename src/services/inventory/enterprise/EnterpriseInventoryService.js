import { StockEngine } from "../../../utils/StockEngine";
import { AsyncUtils } from "../../../utils/AsyncUtils";

/**
 * EnterpriseInventoryService
 * Optimized for Large Scale Business (Asynchronous, Batched, Strict Validation).
 */
export const EnterpriseInventoryService = {
  mode: "ENTERPRISE",

  validateTransaction: async (transaction, products) => {
    // 1. Simulate Network Latency
    await AsyncUtils.sleep(400);

    // 2. Strict Batch/Serial Logic (Simulated)
    if (transaction.batchId) {
      if (Math.random() > 0.9)
        return {
          valid: false,
          error: "Batch ID could not be verified in master database.",
        };
    }

    // 3. Stock Check
    if (transaction.type === "Stock Out") {
      const product = products.find(
        (p) => p.name === transaction.product || p.sku === transaction.sku,
      );
      if (product && product.stock < transaction.qty) {
        return {
          valid: false,
          error: `[ERP-ERR-001] Allocation Failed: Insufficient stock for ${product.name}.`,
        };
      }
    }
    return { valid: true };
  },

  executeTransaction: async (trx, products, warehouses) => {
    // 1. Simulate Network Request
    await AsyncUtils.sleep(600);
    AsyncUtils.checkConnection();

    // 2. Process Atomic Update
    return StockEngine.processTransaction(trx, products, warehouses);
  },

  calculateStats: (products) => {
    // In a real enterprise app, this would use a WebReceiver or Server aggregation.
    // For now, we simulate the calculation delay.
    return {
      totalProducts: products.length,
      stockValue: products.reduce(
        (acc, p) => acc + Number(p.stock || 0) * Number(p.cost || 0),
        0,
      ),
      lowStockItems: products.filter(
        (p) => Number(p.stock || 0) <= Number(p.reorder || 0) && p.stock > 0,
      ).length,
      outOfStock: products.filter((p) => Number(p.stock || 0) === 0).length,
    };
  },

  formatCurrency: (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  },
};
