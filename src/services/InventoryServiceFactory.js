import { LiteInventoryService } from "./inventory/lite/LiteInventoryService";
import { EnterpriseInventoryService } from "./inventory/enterprise/EnterpriseInventoryService";

/**
 * InventoryServiceFactory
 * Returns the appropriate service implementation based on the configuration.
 */
export const InventoryServiceFactory = {
  /**
   * Get the inventory service instance.
   * @param {string} mode - 'LITE' or 'ENTERPRISE'
   * @returns {object} The service implementation
   */
  getService: (mode = "LITE") => {
    console.log(`[InventoryFactory] Initializing ${mode} engine...`);
    if (mode === "ENTERPRISE") {
      return EnterpriseInventoryService;
    }
    return LiteInventoryService;
  },
};
