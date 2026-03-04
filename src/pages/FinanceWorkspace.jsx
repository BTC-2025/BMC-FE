import { useState, useEffect } from "react";
import { FinanceProvider, useFinance } from "../context/FinanceContext";
import { FINANCE_CONFIG } from "../data/financeConfig";
import { useScaleMode } from "../context/ScaleModeContext";
import FinanceSidebar from "../workspaces/finance/FinanceSidebar";
import FinanceOverview from "../workspaces/finance/FinanceOverview";
import ChartOfAccounts from "../workspaces/finance/ChartOfAccounts";
import Receivables from "../workspaces/finance/Receivables";
import Payables from "../workspaces/finance/Payables";
import Invoices from "../workspaces/finance/Invoices";
import Payments from "../workspaces/finance/Payments";
import Expenses from "../workspaces/finance/Expenses";
import BankAndCash from "../workspaces/finance/BankAndCash";
import Taxes from "../workspaces/finance/Taxes";
import FinancialReports from "../workspaces/finance/FinancialReports";

// Asset Management Integration
import AssetOverview from "../workspaces/assets/AssetOverview";
import AssetList from "../workspaces/assets/AssetList";
import AssetDepreciation from "../workspaces/assets/AssetDepreciation";
import AssetCategories from "../workspaces/assets/AssetCategories";

function FinanceInner({ onBack, initialView }) {
  const { scaleMode } = useScaleMode();
  const [activeView, setActiveView] = useState(initialView || "Overview");
  const { assets } = useFinance();

  const sidebarSections = scaleMode === 'SMALL' 
    ? FINANCE_CONFIG.workspace.sidebar.liteSections 
    : FINANCE_CONFIG.workspace.sidebar.enterpriseSections;

  // Sync initialView if it changes from props
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
        case "Overview": return <FinanceOverview {...props} />;
        case "accounts": return <ChartOfAccounts />;
        case "receivables": return <Receivables />;
        case "payables": return <Payables />;
        case "invoices": return <Invoices />;
        case "new_invoice": return <Invoices autoOpen={true} />;
        case "payments": return <Payments />;
        case "expenses": return <Expenses />;
        case "bank_cash": return <BankAndCash />;
        case "taxes": return <Taxes />;
        case "reports": return <FinancialReports />;
        
        // Assets Integration
        case "asset_overview": return <AssetOverview {...props} />;
        case "asset_registry": return <AssetList assets={assets} />;
        case "asset_categories": return <AssetCategories />;
        case "asset_depreciation": return <AssetDepreciation />;
        
        default: return <FinanceOverview {...props} />;
    }
  };

  return (
    <div className="flex min-h-full w-full bg-[#CFECF7] text-left font-sans relative">
        <FinanceSidebar 
            sections={sidebarSections}
            activeView={activeView}
            onSelect={(view) => {
              setActiveView(view);
            }}
            onBack={onBack}
        />
        
        <div className="flex-1 flex flex-col min-w-0 relative">
            {/* Internal Workspace Header - Liquid Glass - Hidden on Overview & Asset Overview */}
            {activeView !== 'Overview' && activeView !== 'asset_overview' && (
              <div className="bg-white/40 backdrop-blur-xl border-b border-white/50 px-6 sm:px-12 py-6 sm:py-8 flex items-center justify-between shrink-0 relative z-10 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.03)]">
                  <div className="animate-in slide-in-from-left-4 duration-700 flex items-center gap-4 min-w-0 flex-1">
                      <div className="min-w-0">
                        <h2 className="text-2xl sm:text-3xl font-[1000] text-gray-950 tracking-tighter leading-none mb-1 uppercase truncate">
                            {activeView ? activeView.replace('_', ' ') : 'FINANCE'}
                        </h2>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#195bac] animate-[pulse_2s_infinite] shrink-0"></div>
                            <p className="text-[10px] font-black text-[#195bac] uppercase tracking-[0.3em] opacity-60 hidden sm:block truncate">
                              Ledger Integrity / Real-time Audit
                            </p>
                        </div>
                      </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                      {/* Compact Status Indicator restored or kept empty for minimalism */}
                  </div>
              </div>
            )}

            <div className="flex-1 bg-[#CFECF7]/30 relative text-left">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
                <div key={activeView} className="animate-in fade-in slide-in-from-bottom-6 duration-700 h-full relative z-10 p-0 text-left">
                    {renderView()}
                </div>
            </div>
        </div>
    </div>
  );
}

export default function FinanceWorkspace(props) {
  return (
    <FinanceProvider>
        <FinanceInner {...props} />
    </FinanceProvider>
  );
}
