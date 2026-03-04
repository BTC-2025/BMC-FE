import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useBI } from "../../context/BIContext";
import LiteDashboard from "./LiteDashboard";
import EnterpriseDashboard from "./EnterpriseDashboard";

export default function DashboardShell() {
  const { user } = useAuth();
  const { kpiData, trendData, isLoading, error, refreshData } = useBI();
  
  // Use workspace_type from user profile
  const mode = user?.workspace_type || "LITE";

  if (isLoading) {
    return (
      <div className="min-h-[600px] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
        <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2 uppercase">Initializing Terminal</h3>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Synchronizing with global compute node...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[600px] flex flex-col items-center justify-center text-center bg-red-50/50 rounded-[60px] border border-red-100 m-10 p-12">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-[32px] flex items-center justify-center text-4xl mb-8 border border-red-200">⚠️</div>
        <h3 className="text-3xl font-[1000] text-gray-900 tracking-tighter mb-4 uppercase">Sync Failure (ERP_NODE_OFFLINE)</h3>
        <p className="text-gray-500 font-bold max-w-md mb-10 leading-relaxed">
            We encountered a protocol error while fetching Business Intelligence data from the main cluster. {error}
        </p>
        <button 
            onClick={refreshData}
            className="px-10 py-5 bg-gray-950 text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:-translate-y-1 active:scale-95 transition-all"
        >
            Retry Synchronization
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {mode === "ENTERPRISE" ? (
        <EnterpriseDashboard stats={kpiData} trendData={trendData} />
      ) : (
        <LiteDashboard stats={kpiData} />
      )}
    </div>
  );
}
