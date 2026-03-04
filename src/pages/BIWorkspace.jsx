import { useState, useEffect } from "react";
import { BIProvider } from "../context/BIContext";
import BISidebar from "../workspaces/bi/BISidebar";
import BIOverview from "../workspaces/bi/BIOverview";
import Dashboards from "../workspaces/bi/Dashboards";
import Analytics from "../workspaces/bi/Analytics";
import Insights from "../workspaces/bi/Insights";
import Forecasts from "../workspaces/bi/Forecasts";
import WhatIfAnalysis from "../workspaces/bi/WhatIfAnalysis";
import BICustomization from "../workspaces/bi/BICustomization";
import ScheduledReports from "../workspaces/bi/ScheduledReports";
import ExternalData from "../workspaces/bi/ExternalData";
import BIDocuments from "../workspaces/bi/BIDocuments";

export default function BIWorkspace({ onBack, initialView }) {
  const [activeView, setActiveView] = useState(initialView || "Overview");

  useEffect(() => {
    if (initialView) {
      setActiveView(initialView);
    }
  }, [initialView]);

  const renderView = () => {
    switch (activeView) {
      case "Overview":
        return <BIOverview onSelectView={setActiveView} />;
      case "Dashboards":
        return <Dashboards />;
      case "Analytics":
        return <Analytics />;
      case "Insights":
        return <Insights />;
      case "Forecasts":
        return <Forecasts />;
      case "WhatIf":
        return <WhatIfAnalysis />;
      case "Customization":
        return <BICustomization />;
      case "ScheduledReports":
        return <ScheduledReports />;
      case "ExternalData":
        return <ExternalData />;
      case "Documents":
        return <BIDocuments />;
      default:
        return <BIOverview onSelectView={setActiveView} />;
    }
  };

  return (
    <BIProvider>
      <div className="flex h-full bg-[#CFECF7] relative">
      <BISidebar 
        activeView={activeView}
        onSelect={setActiveView}
        onBack={onBack}
      />
      
      <main className="flex-1 relative scroll-smooth bg-[#CFECF7]">
        <div className="min-h-full flex flex-col">
          {/* Premium Sticky Header - Refined for Scroll - Hidden on Overview */}
          {activeView !== 'Overview' && (
            <div className="bg-white/95 border-b border-gray-100 px-12 py-8 sticky top-0 z-30 backdrop-blur-xl shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between max-w-[1700px] mx-auto w-full">
                <div className="text-left min-w-0 flex-1">
                  <h1 className="text-3xl font-[1000] text-[#111827] tracking-tighter leading-none truncate">
                    {activeView}
                  </h1>
                  <p className="text-[10px] font-black text-gray-400 mt-2 uppercase tracking-[0.3em] flex items-center gap-2 truncate">
                    <span className="text-[#195bac] shrink-0">BI Terminal</span>
                    <span className="opacity-30">•</span>
                    <span className="truncate">{activeView === "Overview" ? "Intelligence Hub" : `Operational Node`}</span>
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 px-6 py-3 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/10"></div>
                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Live Data Stream</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content Area - Standardized Padding to prevent overlap */}
          <div className="flex-1 p-8 md:p-12">
            <div className="max-w-[1700px] mx-auto">
              {renderView()}
            </div>
          </div>
        </div>
      </main>
    </div>
    </BIProvider>
  );
}
