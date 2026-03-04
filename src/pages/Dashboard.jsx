import { useState, useEffect } from "react";
import { useToast } from "../context/ToastContext";
import AppShell from "../layouts/AppShell";
import WorkspaceList from "./WorkspaceList";
import InventoryWorkspace from "./InventoryWorkspace";

import HRWorkspace from "./HRWorkspace";
import FinanceWorkspace from "./FinanceWorkspace";
import CRMWorkspace from "./CRMWorkspace";
import ProjectWorkspace from "./ProjectWorkspace";

import BIWorkspace from "./BIWorkspace";
import AdminWorkspace from "./AdminWorkspace";
import ManufacturingWorkspace from "./ManufacturingWorkspace";
import SupplyChainWorkspace from "./SupplyChainWorkspace";

import Settings from "./Settings";
import RecentActivity from "./RecentActivity";
import Profile from "./Profile";
import SubscriptionModal from "../components/SubscriptionModal";
import { TransitionWrapper } from "../components/ui/TransitionWrapper";

import { useAuth } from "../context/AuthContext";
import { ALL_AVAILABLE_WORKSPACES } from "../config/workspaces";

export default function Dashboard() {
  const { user, hasPermission } = useAuth();
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [activeSubView, setActiveSubView] = useState(null);

  // Initialize with empty, will be populated by effect
  const [subscribedWorkspaces, setSubscribedWorkspaces] = useState([]);
  const [dashboardWorkspaces, setDashboardWorkspaces] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSwitching, setIsSwitching] = useState(false);
  const { showToast } = useToast();

  // Modal States
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [storeModalMode, setStoreModalMode] = useState("store"); // "store" or "add"

  // Sync access control and handle default workspace redirect
  // Initialize workspaces based on user access
  useEffect(() => {
    if (user && subscribedWorkspaces.length === 0) {
      if (user.roles?.includes("ADMIN") || user.access?.includes("*")) {
        // Admin gets everything by default
        const allIds = ALL_AVAILABLE_WORKSPACES.map((ws) => ws.id);
        setSubscribedWorkspaces(allIds);
        setDashboardWorkspaces(allIds);
      } else {
        setSubscribedWorkspaces(user.access || []);
        setDashboardWorkspaces(user.access || []);
      }
    }
  }, [user, currentWorkspace]);

  const renderWorkspace = () => {
    // Safety check: ensure user has access to the current workspace
    if (
      currentWorkspace &&
      currentWorkspace !== "Settings" &&
      currentWorkspace !== "Profile" &&
      currentWorkspace !== "Recent Activity" &&
      currentWorkspace !== "Landing"
    ) {
      const wsObj = ALL_AVAILABLE_WORKSPACES.find(
        (w) => w.name === currentWorkspace,
      );

      // Map Workspace IDs to PERMISSIONS (Core rule 🔐)
      const permissionMap = {
        inventory: "inventory.view",
        finance: "finance.view",
        hr: "hrm.view_employee",
        crm: "crm.view",
        projects: "project.view",
        manufacturing: "mfg.view",
        supplychain: "scm.view",
        bi: "bi.view_dashboard",
        administration: "system.admin",
      };

      const requiredPermission = wsObj
        ? permissionMap[wsObj.id]
        : currentWorkspace === "Administration"
          ? "system.admin"
          : null;

      if (requiredPermission && !hasPermission(requiredPermission)) {
        return (
          <div className="flex flex-col items-center justify-center min-h-[600px] text-center bg-white/40 backdrop-blur-xl m-10 rounded-[61px] border border-white shadow-2xl animate-in zoom-in duration-700">
            <div className="w-28 h-28 bg-red-500/10 text-red-600 rounded-full flex items-center justify-center text-5xl mb-8 border border-red-500/20 shadow-xl shadow-red-500/5 animate-pulse">
              🔒
            </div>
            <h2 className="text-4xl font-[1000] text-gray-950 tracking-tighter mb-4 uppercase">
              Security Hold
            </h2>
            <p className="text-gray-500 max-w-md mb-10 font-medium leading-relaxed">
              Your current role authorization does not include protocol:{" "}
              <span className="text-red-600 font-black uppercase tracking-widest">
                {requiredPermission}
              </span>
              . Please contact the Master Admin to modify your permission
              matrix.
            </p>
            <button
              onClick={() => setCurrentWorkspace(null)}
              className="px-10 py-5 bg-gray-950 text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:-translate-y-1 active:scale-95 transition-all"
            >
              Return to Mission Control
            </button>
            <div className="mt-8 text-[9px] font-black text-gray-400 uppercase tracking-widest opacity-40">
              System Node: ERP_SECURE_AUTH_V2
            </div>
          </div>
        );
      }
    }

    switch (currentWorkspace) {
      case "Settings":
        return (
          <Settings
            onBack={() => {
              setCurrentWorkspace(null);
              setActiveSubView(null);
            }}
          />
        );
      case "Inventory Management":
        return (
          <InventoryWorkspace
            onBack={() => {
              setCurrentWorkspace(null);
              setActiveSubView(null);
            }}
            initialView={activeSubView}
          />
        );

      case "Human Resources Management":
        return (
          <HRWorkspace
            onBack={() => {
              setCurrentWorkspace(null);
              setActiveSubView(null);
            }}
            initialView={activeSubView}
          />
        );
      case "Finance Management":
        return (
          <FinanceWorkspace
            onBack={() => {
              setCurrentWorkspace(null);
              setActiveSubView(null);
            }}
            initialView={activeSubView}
          />
        );
      case "CRM":
        return (
          <CRMWorkspace
            onBack={() => {
              setCurrentWorkspace(null);
              setActiveSubView(null);
            }}
            initialView={activeSubView}
          />
        );
      case "Project Management":
        return (
          <ProjectWorkspace
            onBack={() => {
              setCurrentWorkspace(null);
              setActiveSubView(null);
            }}
            initialView={activeSubView}
          />
        );
      case "Manufacturing Management":
        return (
          <ManufacturingWorkspace
            onBack={() => {
              setCurrentWorkspace(null);
              setActiveSubView(null);
            }}
            initialView={activeSubView}
          />
        );
      case "Supply Chain":
        return (
          <SupplyChainWorkspace
            onBack={() => {
              setCurrentWorkspace(null);
              setActiveSubView(null);
            }}
            initialView={activeSubView}
          />
        );
      case "Business Intelligence":
        return (
          <BIWorkspace
            onBack={() => {
              setCurrentWorkspace(null);
              setActiveSubView(null);
            }}
            initialView={activeSubView}
          />
        );
      case "Administration":
        return (
          <AdminWorkspace
            onBack={() => {
              setCurrentWorkspace(null);
              setActiveSubView(null);
            }}
          />
        );
      case "Recent Activity":
        return (
          <RecentActivity
            onBack={() => {
              setCurrentWorkspace(null);
              setActiveSubView(null);
            }}
          />
        );
      case "Profile":
        return (
          <Profile
            onBack={() => {
              setCurrentWorkspace(null);
              setActiveSubView(null);
            }}
          />
        );
      default:
        return null;
    }
  };

  const openStore = () => {
    setStoreModalMode("store");
    setShowStoreModal(true);
  };

  const handleHubAction = (action, data) => {
    // action: 'open_workspace'
    if (action === "open_workspace") {
      enterWorkspace(data.workspace, data.view);
    }
  };

  const enterWorkspace = (wsName, subView = null) => {
    setIsSwitching(true);
    setCurrentWorkspace(wsName);
    setActiveSubView(subView);

    // Simulate high-speed route resolution
    setTimeout(() => {
      setIsSwitching(false);
      showToast(`Workspace initialized: ${wsName}`, "success");
    }, 600);
  };

  const handleQuickAction = (label, data) => {
    // This is the dedicated handler for the proprietary product hub actions
    // It processes the action without a simple workspace redirection
    console.log(`Executing Protocol: ${label}`, data);
    alert(`System: Executing ${label} protocol... [INTERNAL ACTION]`);
    // Future integration point for proprietary logic
  };

  return (
    <>
      <AppShell
        onEnterWorkspace={(wsName) => {
          setCurrentWorkspace(wsName);
          setActiveSubView(null);
        }}
        onReset={() => {
          setCurrentWorkspace(null);
          setActiveSubView(null);
        }}
        onOpenSettings={() => {
          setCurrentWorkspace("Settings");
          setActiveSubView(null);
        }}
        onOpenProfile={() => {
          setCurrentWorkspace("Profile");
          setActiveSubView(null);
        }}
        onOpenStore={openStore}
        onOpenActivity={() => {
          enterWorkspace("Recent Activity");
        }}
        currentWorkspace={currentWorkspace}
        subscribedWorkspaces={subscribedWorkspaces}
        showStoreModal={showStoreModal}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      >
        {/* Architecture Perfection: Top Loading Bar */}
        <div
          className={`fixed top-0 left-0 right-0 h-1 z-[9999] transition-all duration-500 pointer-events-none ${isSwitching ? "opacity-100" : "opacity-0"}`}
        >
          <div
            className={`h-full bg-gradient-to-r from-[#195bac] via-blue-400 to-[#195bac] shadow-[0_0_10px_rgba(25,91,172,0.5)] ${isSwitching ? "w-full animate-[progress_0.8s_ease-in-out_infinite]" : "w-0"}`}
          />
        </div>

        {currentWorkspace ? (
          <TransitionWrapper key={currentWorkspace}>
            {renderWorkspace()}
          </TransitionWrapper>
        ) : (
          <WorkspaceList
            onEnter={enterWorkspace}
            onHubAction={handleHubAction}
            onAction={handleQuickAction}
            subscribedWorkspaces={subscribedWorkspaces}
            setSubscribedWorkspaces={setSubscribedWorkspaces}
            dashboardWorkspaces={dashboardWorkspaces}
            setDashboardWorkspaces={setDashboardWorkspaces}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}
      </AppShell>

      <SubscriptionModal
        isOpen={showStoreModal}
        onClose={() => setShowStoreModal(false)}
        modalMode={storeModalMode}
        setModalMode={setStoreModalMode}
        subscribedWorkspaces={subscribedWorkspaces}
        setSubscribedWorkspaces={setSubscribedWorkspaces}
        dashboardWorkspaces={dashboardWorkspaces}
        setDashboardWorkspaces={setDashboardWorkspaces}
      />
    </>
  );
}
