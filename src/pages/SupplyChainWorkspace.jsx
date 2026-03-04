import { useState, useEffect } from "react";
import { SupplyChainProvider, useSupplyChain } from "../context/SupplyChainContext";
import { useScaleMode } from "../context/ScaleModeContext";
import SupplyChainSidebar from "../workspaces/supplychain/SupplyChainSidebar";
import SupplyChainOverview from "../workspaces/supplychain/SupplyChainOverview";
import Procurement from "../workspaces/supplychain/Procurement";
import Suppliers from "../workspaces/supplychain/Suppliers";
import InventoryCoordination from "../workspaces/supplychain/InventoryCoordination";
import Warehousing from "../workspaces/supplychain/Warehousing";
import Logistics from "../workspaces/supplychain/Logistics";
import OrderFulfillment from "../workspaces/supplychain/OrderFulfillment";
import ReturnsManagement from "../workspaces/supplychain/ReturnsManagement";
import SupplyChainReports from "../workspaces/supplychain/SupplyChainReports";
import NewShipmentModal from "../workspaces/supplychain/NewShipmentModal";

function SupplyChainContent({ onBack, initialView }) {
  const { scaleMode } = useScaleMode();
  const [activeTab, setActiveTab] = useState(initialView || "Overview");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { 
    routes, addRoute, updateRoute, deleteRoute,
    purchaseOrders, updatePOStatus, createPO, deletePO, 
    suppliers, addSupplier, updateSupplier, deleteSupplier, 
    inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem, 
    warehouseItems, addWarehouseZone, updateWarehouseZone, deleteWarehouseZone, 
    fleet, updateFleet, 
    fulfillments, updateFulfillmentStatus, addFulfillmentOrder, updateFulfillmentOrder, deleteFulfillmentOrder, 
    returns, addReturn, updateReturn, deleteReturn,
    receiveGoods
  } = useSupplyChain();

  const enterpriseSections = [
    { title: "Navigation", items: [{ id: "Overview", label: "Overview", icon: "🌐" }] },
    { title: "Sourcing", items: [{ id: "Procurement", label: "Procurement", icon: "🛍️" }, { id: "Suppliers", label: "Suppliers", icon: "🤝" }] },
    { title: "Flow", items: [{ id: "InventoryCoordination", label: "Inventory", icon: "🔗" }, { id: "Warehousing", label: "Warehousing", icon: "🏭" }, { id: "Logistics", label: "Transport", icon: "🚚" }] },
    { title: "Execution", items: [{ id: "Fulfillment", label: "Fulfillment", icon: "📦" }, { id: "Returns", label: "Returns", icon: "↩️" }] }
  ];

  const liteSections = [
    { title: "Dashboard", items: [{ id: "Overview", label: "Overview", icon: "⚡" }] },
    { title: "Sourcing", items: [{ id: "Procurement", label: "Procurement", icon: "🛍️" }, { id: "Suppliers", label: "Suppliers", icon: "🤝" }] },
    { title: "Logistics", items: [{ id: "Logistics", label: "Transport", icon: "🚚" }, { id: "Fulfillment", label: "Fulfillment", icon: "📦" }] },
    { title: "Storage", items: [{ id: "Warehousing", label: "Warehouse", icon: "🏭" }, { id: "InventoryCoordination", label: "Stocks", icon: "🔗" }] }
  ];

  const sidebarSections = scaleMode === 'SMALL' ? liteSections : enterpriseSections;

  useEffect(() => {
    if (initialView) setActiveTab(initialView);
  }, [initialView]);

  useEffect(() => {
    const allAvailableIds = sidebarSections.flatMap(s => s.items.map(i => i.id));
    if (activeTab !== "Overview" && !allAvailableIds.includes(activeTab)) {
      setActiveTab("Overview");
    }
  }, [scaleMode, sidebarSections]);

  const handleCreateShipment = (shipment) => {
      addRoute(shipment);
      setActiveTab("Logistics");
  };

  const renderContent = () => {
    const props = { onSelectView: setActiveTab };
    try {
      switch (activeTab) {
        case "Overview": return <SupplyChainOverview {...props} />;
        case "Procurement": return <Procurement orders={purchaseOrders} onUpdateStatus={updatePOStatus} onCreate={createPO} onDelete={deletePO} onReceive={receiveGoods} />;
        case "Suppliers": return <Suppliers suppliers={suppliers} onAdd={addSupplier} onUpdate={updateSupplier} onDelete={deleteSupplier} />;
        case "InventoryCoordination": return <InventoryCoordination items={inventory} onAdd={addInventoryItem} onUpdate={updateInventoryItem} onDelete={deleteInventoryItem} />;
        case "Warehousing": return <Warehousing items={warehouseItems} onAdd={addWarehouseZone} onUpdate={updateWarehouseZone} onDelete={deleteWarehouseZone} fleet={fleet} onUpdateFleet={updateFleet} />;
        case "Logistics": return <Logistics routes={routes} onUpdate={updateRoute} onDelete={deleteRoute} />;
        case "Fulfillment": return <OrderFulfillment orders={fulfillments} onProcess={updateFulfillmentStatus} onAdd={addFulfillmentOrder} onUpdate={updateFulfillmentOrder} onDelete={deleteFulfillmentOrder} />;
        case "Returns": return <ReturnsManagement returns={returns} onAdd={addReturn} onUpdate={updateReturn} onDelete={deleteReturn} />;
        case "Reports": return <SupplyChainReports />;
        default: return <SupplyChainOverview {...props} />;
      }
    } catch (error) {
       return <div className="p-10 text-red-500 font-bold">Error loading content: {error.message}</div>;
    }
  };

  return (
    <div className="flex min-h-full w-full bg-[#CFECF7] text-left font-sans relative">
      <SupplyChainSidebar 
        sections={sidebarSections}
        activeView={activeTab}
        onSelect={(tab) => {
          setActiveTab(tab);
        }}
        onBack={onBack}
      />
      
      <div className="flex-1 flex flex-col min-w-0 relative">
        {activeTab !== 'Overview' && (
          <div className="bg-white/60 backdrop-blur-xl border-b border-white/50 px-6 sm:px-12 py-6 sm:py-8 flex items-center justify-between shrink-0 relative z-10 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.03)]">
            <div className="animate-in slide-in-from-left-4 duration-700 flex items-center gap-4 min-w-0 flex-1">
              <div className="min-w-0">
                <h2 className="text-2xl sm:text-3xl font-[1000] text-gray-950 tracking-tighter leading-none mb-1 uppercase truncate">
                  {activeTab}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#195bac] animate-pulse shrink-0"></div>
                    <p className="text-[10px] font-black text-[#195bac] uppercase tracking-[0.3em] hidden sm:block truncate">
                      Logistics Network / Relay Sync: <span className="text-emerald-500 font-black">100.0% Synchronized</span>
                    </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 shrink-0 px-2 text-right">
                <button 
                   onClick={() => setIsModalOpen(true)}
                   className="bg-[#111827] text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all whitespace-nowrap"
                >
                   + Shipment
                </button>
            </div>
          </div>
        )}

        <div className="flex-1 p-0 bg-[#CFECF7]/30 relative text-left">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
          <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-6 duration-700 h-full">
            {renderContent()}
          </div>
        </div>

        <NewShipmentModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSubmit={handleCreateShipment} 
        />
      </div>
    </div>
  );
}

export default function SupplyChainWorkspace({ onBack, initialView }) {
    return (
        <SupplyChainProvider>
            <SupplyChainContent onBack={onBack} initialView={initialView} />
        </SupplyChainProvider>
    );
}
