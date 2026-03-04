import { useState, useEffect } from "react";
import { CRMProvider } from "../context/CRMContext";
import { CRM_CONFIG } from "../data/crmConfig";
import { useScaleMode } from "../context/ScaleModeContext";
import CRMSidebar from "../workspaces/crm/CRMSidebar";
import CRMOverview from "../workspaces/crm/CRMOverview";
import Leads from "../workspaces/crm/Leads";
import CRMCustomers from "../workspaces/crm/CRMCustomers";
import Contacts from "../workspaces/crm/Contacts";
import Deals from "../workspaces/crm/Deals";
import CRMActivities from "../workspaces/crm/CRMActivities";
import CRMReports from "../workspaces/crm/CRMReports";
import SalesOrders from "../workspaces/crm/SalesOrders";
import CRMQuotes from "../workspaces/crm/CRMQuotes";

export default function CRMWorkspace({ onBack, initialView }) {
  const { scaleMode } = useScaleMode();
  const [activeView, setActiveView] = useState(initialView || "Overview");

  const sidebarSections =
    scaleMode === "SMALL"
      ? CRM_CONFIG.workspace.sidebar.liteSections
      : CRM_CONFIG.workspace.sidebar.enterpriseSections;

  useEffect(() => {
    if (initialView) setActiveView(initialView);
  }, [initialView]);

  useEffect(() => {
    const allAvailableIds = sidebarSections.flatMap((s) =>
      s.items.map((i) => i.id),
    );
    if (activeView !== "Overview" && !allAvailableIds.includes(activeView)) {
      setActiveView("Overview");
    }
  }, [scaleMode, sidebarSections]);

  const renderView = () => {
    const props = { onSelectView: setActiveView };
    switch (activeView) {
      case "Overview":
        return <CRMOverview {...props} />;
      case "leads":
        return <Leads />;
      case "new_lead":
        return <Leads autoOpen={true} />;
      case "customers":
        return <CRMCustomers />;
      case "contacts":
        return <Contacts />;
      case "deals":
        return <Deals />;
      case "quotes":
        return <CRMQuotes />;
      case "sales_orders":
        return <SalesOrders />;
      case "activities":
        return <CRMActivities />;
      case "reports":
        return <CRMReports />;
      default:
        return <CRMOverview {...props} />;
    }
  };

  return (
    <CRMProvider>
      <div className="flex min-h-full w-full bg-[#CFECF7] text-left font-sans relative">
        <CRMSidebar
          sections={sidebarSections}
          activeView={activeView}
          onSelect={(view) => {
            setActiveView(view);
          }}
          onBack={onBack}
        />
        <div className="flex-1 flex flex-col min-w-0 relative">
          {/* Internal Workspace Header - Liquid Glass - Hidden on Overview */}
          {activeView !== "Overview" && (
            <div className="bg-white/40 backdrop-blur-xl border-b border-white/50 px-6 sm:px-12 py-6 sm:py-8 flex items-center justify-between shrink-0 relative z-10 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.03)]">
              <div className="animate-in slide-in-from-left-4 duration-700 flex items-center gap-4 min-w-0 flex-1">
                <div className="min-w-0">
                  <h2 className="text-2xl sm:text-3xl font-[1000] text-gray-950 tracking-tighter leading-none mb-1 uppercase truncate">
                    {activeView ? activeView.replace("_", " ") : "CRM"}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-[pulse_2.5s_infinite] shrink-0"></div>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] hidden sm:block truncate">
                      Lead Intelligence / Hub Sync:{" "}
                      <span className="text-blue-500 font-black">
                        100.0% Synchronized
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 h-full bg-[#CFECF7]/30 relative">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
            <div
              key={activeView}
              className="animate-in fade-in slide-in-from-bottom-6 duration-700 h-full relative z-10 p-0"
            >
              {renderView()}
            </div>
          </div>
        </div>
      </div>
    </CRMProvider>
  );
}
