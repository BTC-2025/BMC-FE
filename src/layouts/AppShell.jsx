import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

export default function AppShell({ children, onEnterWorkspace, onReset, onOpenSettings, onOpenProfile, onOpenStore, onOpenActivity, currentWorkspace, subscribedWorkspaces, showStoreModal, searchQuery, setSearchQuery }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route or workspace change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location, currentWorkspace, setIsMobileOpen]);

  return (
    <div className="flex h-screen w-full bg-[var(--bg-app)] overflow-hidden transition-colors duration-500">
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden transition-all duration-500 ${isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsMobileOpen(false)}
      ></div>

      <div className={`fixed inset-y-0 left-0 z-[70] lg:relative lg:z-auto transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <Sidebar 
          onEnterWorkspace={onEnterWorkspace}
          onReset={onReset} 
          onOpenStore={onOpenStore} 
          onOpenActivity={onOpenActivity}
          onOpenSettings={onOpenSettings}
          isCollapsed={isCollapsed} 
          currentWorkspace={showStoreModal ? "Store" : currentWorkspace}
          subscribedWorkspaces={subscribedWorkspaces}
          onClose={() => setIsMobileOpen(false)}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {!currentWorkspace && (
          <TopBar 
            onOpenSettings={onOpenSettings} 
            onOpenActivity={onOpenActivity}
            onOpenProfile={onOpenProfile}
            onOpenStore={onOpenStore}
            onToggleSidebar={() => {
              if (window.innerWidth < 1024) {
                setIsMobileOpen(!isMobileOpen);
              } else {
                setIsCollapsed(!isCollapsed);
              }
            }} 
            currentWorkspace={currentWorkspace}
            onHome={onReset}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}
        <main className="flex-1 overflow-y-auto bg-[var(--bg-app)] relative transition-colors duration-500">
          <div 
            key={currentWorkspace || 'hub'} 
            className="w-full animate-in fade-in zoom-in-95 duration-700 ease-out"
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
