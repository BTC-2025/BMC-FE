import { useState, useEffect } from "react";
import { useScaleMode } from "../context/ScaleModeContext";
import { ManufacturingProvider, useManufacturing } from "../context/ManufacturingContext";
import ManufacturingSidebar from "../workspaces/manufacturing/ManufacturingSidebar";
import ManufacturingOverview from "../workspaces/manufacturing/ManufacturingOverview";
import BillsOfMaterials from "../workspaces/manufacturing/BillsOfMaterials";
import WorkOrders from "../workspaces/manufacturing/WorkOrders";
import ProductionPlanning from "../workspaces/manufacturing/ProductionPlanning";
import ShopFloorControl from "../workspaces/manufacturing/ShopFloorControl";
import MaterialConsumption from "../workspaces/manufacturing/MaterialConsumption";
import FinishedGoods from "../workspaces/manufacturing/FinishedGoods";
import QualityControl from "../workspaces/manufacturing/QualityControl";
import ProductionCosting from "../workspaces/manufacturing/ProductionCosting";
import ManufacturingReports from "../workspaces/manufacturing/ManufacturingReports";

function ManufacturingContent({ onBack, initialView }) {
  const { scaleMode } = useScaleMode();
  const [activeTab, setActiveTab] = useState(initialView || "Overview");
  const { orders, produce, loading, error } = useManufacturing();

  const enterpriseSections = [
    { title: "Core", items: [{ id: "Overview", label: "Overview", icon: "📊" }, { id: "BOM", label: "BOM", icon: "📜" }, { id: "WorkOrders", label: "Orders", icon: "📋" }] },
    { title: "Floor", items: [{ id: "Planning", label: "Production", icon: "📅" }, { id: "ShopFloor", label: "Shop Floor", icon: "🏭" }, { id: "Consumption", label: "Consumables", icon: "🧱" }] },
    { title: "Output", items: [{ id: "FinishedGoods", label: "Goods", icon: "📦" }, { id: "Quality", label: "Quality", icon: "✅" }] },
    { title: "Analysis", items: [{ id: "Costing", label: "Costing", icon: "💲" }, { id: "Reports", label: "Reports", icon: "📈" }] }
  ];

  const liteSections = [
    { title: "Exec", items: [{ id: "Overview", label: "Overview", icon: "⚡" }] },
    { title: "Planning", items: [{ id: "BOM", label: "BOM", icon: "📜" }, { id: "WorkOrders", label: "Orders", icon: "📋" }, { id: "Planning", label: "Planning", icon: "📅" }] },
    { title: "Output", items: [{ id: "FinishedGoods", label: "Goods", icon: "📦" }, { id: "Quality", label: "Quality", icon: "✅" }, { id: "ShopFloor", label: "Status", icon: "🏭" }, { id: "Reports", label: "Stats", icon: "📈" }] }
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

  const handleCreateAction = () => {
    // Dispatch a global event that individual components can listen to
    window.dispatchEvent(new CustomEvent("open-create-modal", { detail: activeTab }));
  };

  const renderContent = () => {
    const props = { onSelectView: setActiveTab };
    try {
      switch (activeTab) {
        case "Overview": return <ManufacturingOverview {...props} />;
        case "BOM": return <BillsOfMaterials />;
        case "WorkOrders": return <WorkOrders orders={orders} onProduce={produce} />;
        case "Planning": return <ProductionPlanning />;
        case "ShopFloor": return <ShopFloorControl />;
        case "Consumption": return <MaterialConsumption />;
        case "FinishedGoods": return <FinishedGoods />;
        case "Quality": return <QualityControl />;
        case "Costing": return <ProductionCosting />;
        case "Reports": return <ManufacturingReports />;
        default: return <ManufacturingOverview {...props} />;
      }
    } catch (error) {
       return <div className="p-10 text-red-500 font-bold">Error loading content: {error.message}</div>;
    }
  };

  return (
    <div className="flex min-h-full w-full bg-[#CFECF7] text-left font-sans relative">
      <ManufacturingSidebar 
        sections={sidebarSections}
        activeView={activeTab}
        onSelect={(tab) => {
          setActiveTab(tab);
        }}
        onBack={onBack}
      />
      
      <div className="flex-1 flex flex-col min-w-0 relative">
        {loading && (
             <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
             </div>
        )}

        {activeTab !== 'Overview' && (
          <div className="bg-white/60 backdrop-blur-xl border-b border-white/50 px-6 sm:px-12 py-6 sm:py-8 flex items-center justify-between shrink-0 relative z-10 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.03)]">
            <div className="animate-in slide-in-from-left-4 duration-700 flex items-center gap-4 min-w-0 flex-1">
              <div className="min-w-0">
                <h2 className="text-2xl sm:text-3xl font-[1000] text-gray-950 tracking-tighter leading-none mb-1 uppercase truncate">
                  {activeTab}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-[pulse_1.5s_infinite] shrink-0"></div>
                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em] hidden sm:block truncate">
                      Production Floor / Factory Sync: <span className="text-emerald-500 font-black">100.0% Synchronized</span>
                    </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 shrink-0 px-2">
               {["BOM", "WorkOrders", "Orders"].includes(activeTab) && (
                 <button 
                    onClick={handleCreateAction}
                    className="bg-[#111827] text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all whitespace-nowrap"
                 >
                   + Create
                 </button>
               )}
            </div>
          </div>
        )}

        <div className="flex-1 p-0 bg-[#CFECF7]/30 relative text-left">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
          <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-6 duration-700 h-full">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ManufacturingWorkspace(props) {
    return (
        <ManufacturingProvider>
            <ManufacturingContent {...props} />
        </ManufacturingProvider>
    );
}
