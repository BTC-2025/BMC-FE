import { StockEngine } from "../../../utils/StockEngine";

/**
 * LiteInventoryService
 * Optimized for Small Scale Business (Synchronous, Local).
 */
export const LiteInventoryService = {
  mode: "LITE",

  validateTransaction: async (transaction, products) => {
    // Synchronous validation for speed
    if (transaction.type === "Stock Out") {
      const product = products.find(
        (p) => p.name === transaction.product || p.sku === transaction.sku,
      );
      if (product && product.stock < transaction.qty) {
        return {
          valid: false,
          error: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        };
      }
    }
    return { valid: true };
  },

  executeTransaction: async (trx, products, warehouses) => {
    // Direct, immediate execution (Blocking/Sync-like behavior)
    return StockEngine.processTransaction(trx, products, warehouses);
  },

  calculateStats: (products) => {
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
    }).format(value);
  },
};
