import { useState, useEffect } from "react";
import { HRProvider } from "../context/HRContext";
import { HR_CONFIG } from "../data/hrConfig";
import { useScaleMode } from "../context/ScaleModeContext";
import HRSidebar from "../workspaces/hr/HRSidebar";
import HROverview from "../workspaces/hr/HROverview";
import Employees from "../workspaces/hr/Employees";
import Departments from "../workspaces/hr/Departments";
import Attendance from "../workspaces/hr/Attendance";
import LeaveManagement from "../workspaces/hr/LeaveManagement";
import Payroll from "../workspaces/hr/Payroll";
import Performance from "../workspaces/hr/Performance";
import Recruitment from "../workspaces/hr/Recruitment";
import HRReports from "../workspaces/hr/HRReports";

export default function HRWorkspace({ onBack, initialView }) {
  const { scaleMode } = useScaleMode();
  const [activeView, setActiveView] = useState(initialView || "Overview");

  const sidebarSections = scaleMode === 'SMALL' 
    ? HR_CONFIG.workspace.sidebar.liteSections 
    : HR_CONFIG.workspace.sidebar.enterpriseSections;

  useEffect(() => {
    if (initialView) setActiveView(initialView);
  }, [initialView]);

  useEffect(() => {
    const allAvailableIds = sidebarSections.flatMap(s => s.items.map(i => i.id));
    if (activeView !== "Overview" && !allAvailableIds.includes(activeView)) {
      setActiveView("Overview");
    }
  }, [scaleMode, sidebarSections]);

  const renderView = () => {
    const props = { onSelectView: setActiveView };
    switch(activeView) {
        case "Overview": return <HROverview {...props} />;
        case "employees": return <Employees />;
        case "departments": return <Departments />;
        case "attendance": return <Attendance />;
        case "leaves": return <LeaveManagement />;
        case "payroll": return <Payroll />;
        case "performance": return <Performance />;
        case "recruitment": return <Recruitment />;
        case "reports": return <HRReports />;
        default: return <HROverview {...props} />;
    }
  };

  return (
    <HRProvider>
        <div className="flex min-h-full w-full bg-[#CFECF7] text-left font-sans relative">
            <HRSidebar 
                sections={sidebarSections}
                activeView={activeView}
                onSelect={(view) => {
                  setActiveView(view);
                }}
                onBack={onBack}
            />
            <div className="flex-1 flex flex-col min-w-0 relative text-left">
                {/* Internal Workspace Header - Liquid Glass - Hidden on Overview */}
                {activeView !== 'Overview' && (
                  <div className="bg-white/40 backdrop-blur-xl border-b border-white/50 px-6 sm:px-12 py-6 sm:py-8 flex items-center justify-between shrink-0 relative z-10 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.03)]">
                      <div className="animate-in slide-in-from-left-4 duration-700 flex items-center gap-4 min-w-0 flex-1">
                          <div className="min-w-0">
                            <h2 className="text-2xl sm:text-3xl font-[1000] text-gray-950 tracking-tighter leading-none mb-1 uppercase truncate">
                                {activeView ? activeView.replace('_', ' ') : 'HUMAN RESOURCES'}
                            </h2>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-[pulse_3s_infinite] shrink-0"></div>
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] hidden sm:block truncate">
                                  Talent Management / Node Sync: <span className="text-emerald-500 font-black">100.0% Synchronized</span>
                                </p>
                            </div>
                          </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                          {/* Status indicators removed for minimalism */}
                      </div>
                  </div>
                )}

                <div className="flex-1 bg-[#CFECF7]/30 relative">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
                    <div key={activeView} className="animate-in fade-in slide-in-from-bottom-6 duration-700 h-full relative z-10 p-0 text-left">
                        {renderView()}
                    </div>
                </div>
            </div>
        </div>
    </HRProvider>
  );
}
