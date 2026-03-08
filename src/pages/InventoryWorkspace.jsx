import { useState, useEffect } from "react";
import InventorySidebar from "../workspaces/inventory/InventorySidebar";
import InventoryOverview from "../workspaces/inventory/InventoryOverview";
import ItemMaster from "../workspaces/inventory/ItemMaster";
import Categories from "../workspaces/inventory/Categories";
import AssetCategories from "../workspaces/inventory/AssetCategories";
import Suppliers from "../workspaces/inventory/Suppliers";
import Customers from "../workspaces/inventory/Customers";
import Transactions from "../workspaces/inventory/Transactions";
import PurchaseOrders from "../workspaces/inventory/PurchaseOrders";
import SalesOrders from "../workspaces/inventory/SalesOrders";
import Warehouses from "../workspaces/inventory/Warehouses";
import BatchesAndSerials from "../workspaces/inventory/BatchesAndSerials";
import AuditLog from "../workspaces/inventory/AuditLog";
import ItemGroups from "../workspaces/inventory/ItemGroups";
import PriceLists from "../workspaces/inventory/PriceLists";
import Packages from "../workspaces/inventory/Packages";
import Assemblies from "../workspaces/inventory/Assemblies";
import Invoices from "../workspaces/inventory/Invoices";
import PaymentsReceived from "../workspaces/inventory/PaymentsReceived";
import Bills from "../workspaces/inventory/Bills";
import { INVENTORY_CONFIG } from "../data/inventoryConfig";
import { InventoryProvider } from "../context/InventoryContext";
import { FinanceProvider } from "../context/FinanceContext";
import { useScaleMode } from "../context/ScaleModeContext";

// Fallback for not-yet-implemented views
function PlaceholderView({ title }) {
  return (
    <div className="flex items-center justify-center h-full text-gray-400 bg-gray-50/30 font-bold p-20 text-center">
      <div className="animate-in zoom-in duration-700">
        <div className="text-6xl mb-6">⚙️</div>
        <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tighter">
          {title} Module
        </h3>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
          Autonomous Sync in progress
        </p>
      </div>
    </div>
  );
}

export default function InventoryWorkspace({ onBack, initialView }) {
  const { scaleMode } = useScaleMode();
  const [activeView, setActiveView] = useState(initialView || "overview");

  const sidebarSections =
    scaleMode === "SMALL"
      ? INVENTORY_CONFIG.workspace.sidebar.liteSections
      : INVENTORY_CONFIG.workspace.sidebar.enterpriseSections;

  useEffect(() => {
    if (initialView) setActiveView(initialView);
  }, [initialView]);

  // Handle case where activeView might not exist in the current scale mode
  useEffect(() => {
    const allAvailableIds = sidebarSections.flatMap((s) =>
      s.items.map((i) => i.id),
    );
    if (activeView !== "overview" && !allAvailableIds.includes(activeView)) {
      setActiveView("overview");
    }
  }, [scaleMode, sidebarSections]);

  const renderView = () => {
    const props = { onSelectView: setActiveView };
    try {
      switch (activeView) {
        case "overview":
          return <InventoryOverview {...props} />;
        case "products":
          return <ItemMaster />;
        case "categories":
          return <Categories />;
        case "asset_categories":
          return <AssetCategories />;
        case "suppliers":
          return <Suppliers />;
        case "customers":
          return <Customers />;
        case "transactions":
          return <Transactions />;
        case "audit_log":
          return <AuditLog />;
        case "purchase_orders":
          return <PurchaseOrders />;
        case "sales_orders":
          return <SalesOrders />;
        case "warehouses":
          return <Warehouses />;
        case "batches":
          return <BatchesAndSerials />;
        case "item_groups":
          return <ItemGroups />;
        case "price_lists":
          return <PriceLists />;
        case "packages":
          return <Packages />;
        case "assemblies":
          return <Assemblies />;
        case "invoices":
          return <Invoices />;
        case "payments_received":
          return <PaymentsReceived />;
        case "bills":
          return <Bills />;
        default:
          return (
            <PlaceholderView
              title={activeView ? activeView.replace("_", " ") : "CORE"}
            />
          );
      }
    } catch (e) {
      return (
        <div className="p-10 text-red-600 font-bold">
          Error loading inventory module: {e.message}
        </div>
      );
    }
  };

  return (
    <FinanceProvider>
      <InventoryProvider>
        <div className="flex min-h-full w-full bg-[#CFECF7] text-left relative">
          <InventorySidebar
            sections={sidebarSections}
            activeView={activeView}
            onSelect={(view) => {
              setActiveView(view);
            }}
            onBack={onBack}
          />

          <div className="flex-1 flex flex-col min-w-0 relative">
            {activeView !== "overview" && (
              <div className="bg-white/40 backdrop-blur-xl border-b border-white/50 px-6 sm:px-12 py-6 sm:py-8 flex items-center justify-between shrink-0 relative z-10 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.03)]">
                <div className="animate-in slide-in-from-left-4 duration-700 flex items-center gap-4 min-w-0 flex-1">
                  <div className="min-w-0">
                    <h2 className="text-2xl sm:text-3xl font-[1000] text-gray-950 tracking-tighter leading-none mb-1 uppercase truncate">
                      {activeView ? activeView.replace("_", " ") : "OPERATIONS"}
                    </h2>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#195bac] animate-[pulse_2s_infinite] shrink-0"></div>
                      <p className="text-[10px] font-black text-[#195bac] uppercase tracking-[0.3em] hidden sm:block truncate">
                        Satellite / Warehouse Sync:{" "}
                        <span className="text-emerald-500 font-black">
                          100.0% Synchronized
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-5 py-2.5 bg-white/80 border border-white/50 backdrop-blur-md rounded-2xl text-[9px] font-black text-[#195bac] uppercase tracking-widest shadow-xl transition-all hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Force Sync
                  </button>
                </div>
              </div>
            )}

            <div className="flex-1 bg-[#CFECF7]/30 relative text-left">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
              <div
                key={activeView}
                className="animate-in fade-in slide-in-from-bottom-6 duration-700 h-full relative z-10 p-0 text-left"
              >
                {renderView()}
              </div>
            </div>
          </div>
        </div>
      </InventoryProvider>
    </FinanceProvider>
  );
}
