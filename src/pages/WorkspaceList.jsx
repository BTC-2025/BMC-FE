import WorkspaceCard from "../components/WorkspaceCard";
import { ALL_AVAILABLE_WORKSPACES } from "../config/workspaces";
import { useAuth } from "../context/AuthContext";

export default function WorkspaceList({ 
  onEnter, 
  onHubAction,
  subscribedWorkspaces, 
  setSubscribedWorkspaces, 
  dashboardWorkspaces, 
  setDashboardWorkspaces,
  searchQuery,
  setSearchQuery,
  onAction
}) {
  const { user, hasPermission } = useAuth();
  
  const metrics = [
    { label: "Revenue", value: "$2.4M", trend: "+12.5%", color: "text-emerald-600", bg: "bg-emerald-500/10" },
    { label: "Efficiency", value: "100.0%", trend: "+5.8%", color: "text-[#195bac]", bg: "bg-[#195bac]/10" },
    { label: "Active Users", value: "1,284", trend: "+45", color: "text-purple-600", bg: "bg-purple-500/10" },
    { label: "Avg Growth", value: "18.2%", trend: "+3.4%", color: "text-blue-600", bg: "bg-blue-500/10" },
    { label: "Acquisition", value: "412", trend: "+12%", color: "text-orange-600", bg: "bg-orange-500/10" },
    { label: "Market Share", value: "14.5%", trend: "+0.8%", color: "text-cyan-600", bg: "bg-cyan-500/10" },
  ];

  const alerts = [
    { label: "Low Stock Alert", status: "Critical", icon: "⚠️", color: "text-red-600" },
    { label: "System Maintenance", status: "Scheduled", icon: "⚙️", color: "text-amber-600" },
  ];

  const quickActions = [
    { label: "Create Invoice", icon: "🧾", workspace: "Finance Management", view: "new_invoice" },
    { label: "Purchase Order", icon: "🛒", workspace: "Supply Chain", view: "new_po" },
    { label: "Define BOM", icon: "📝", workspace: "Manufacturing Management", view: "new_bom" },
    { label: "Workspace Stats", icon: "📈", workspace: "Business Intelligence", view: "stats" },
    { label: "Knowledge Docs", icon: "📑", workspace: "Project Management", view: "docs" },
    { label: "File Manager", icon: "📁", workspace: "Project Management", view: "files" },
    { label: "Stocks Receivable", icon: "📥", workspace: "Inventory Management", view: "receivable" },
    { label: "Sales Pipeline", icon: "💰", workspace: "CRM", view: "sales" },
    { label: "Purchase Ledger", icon: "💳", workspace: "Finance Management", view: "purchase" },
    { label: "Low Stock Alert", icon: "🔔", workspace: "Inventory Management", view: "low_stock" },
    { label: "Pending Approvals", icon: "⌛", workspace: "Human Resources Management", view: "approvals" },
  ];
  
  const activeWorkspaces = ALL_AVAILABLE_WORKSPACES.filter(ws => {
    // Map Workspace IDs to PERMISSIONS (Core rule 🔐)
    const permissionMap = {
        'inventory': 'inventory.view',
        'finance': 'finance.view',
        'hr': 'hrm.view_employee',
        'crm': 'crm.view',
        'projects': 'project.view',
        'manufacturing': 'mfg.view',
        'supplychain': 'scm.view',
        'bi': 'bi.view_dashboard'
    };
    
    const requiredPermission = permissionMap[ws.id];
    // If we have a permission mapping, check it. If not, allow (or default strictly).
    const hasRoleAccess = requiredPermission ? hasPermission(requiredPermission) : true;
    
    return dashboardWorkspaces.includes(ws.id) && hasRoleAccess;
  });

  const filtered = activeWorkspaces.filter(ws => ws.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="w-full min-h-screen p-12 bg-[var(--bg-app)] text-left animate-fade-in relative overflow-x-hidden pt-20 transition-colors duration-500">
      {/* Background patterns - Linearized */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white opacity-[0.1] -translate-y-1/2 translate-x-1/2 blur-[160px] pointer-events-none rotate-45"></div>

      {/* Main Header Container */}
      <div className="mb-20 text-left flex flex-col xl:flex-row xl:items-end justify-between gap-16 animate-slide-up relative z-10 w-full">
        <div className="max-w-2xl flex flex-col items-start px-2 shrink-0">
          <h2 className="text-2xl font-serif italic text-[var(--text-main)] tracking-[0.3em] leading-none mb-1 opacity-70 transition-colors">
            Enterprise
          </h2>
          <h1 className="text-5xl font-[1000] text-[#195bac] tracking-[-0.05em] leading-none uppercase">
            Suite
          </h1>
          <p className="text-[34px] font-bold text-[var(--text-main)] tracking-tight mt-6 font-rounded transition-colors">
            Welcome, <span className="text-[#195bac] font-[800]">{user?.name || "User"}</span>
          </p>
        </div>
      </div>

      {/* Quick Overview Feature - Restricted to Admin */}
      {user?.roles?.includes('ADMIN') && (
        <div className="mb-20 grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in slide-in-from-top-4 duration-1000">
          
          {/* Header for Admin View */}
          <div className="lg:col-span-12 flex items-center gap-4 mb-2 text-left">
            <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center text-white shadow-xl shadow-black/10">
              <span className="text-xl">🛡️</span>
            </div>
            <div className="text-left">
              <h2 className="text-2xl font-[1000] text-[var(--text-main)] tracking-tighter uppercase leading-none text-left transition-colors">Executive Command Center</h2>
              <p className="text-[10px] font-black text-[#195bac] uppercase tracking-[0.2em] mt-1.5 opacity-60 text-left transition-colors">Master Node Authority • Global Analytics Overview</p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="lg:col-span-5 space-y-6 pt-4 text-left">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-[#195bac] rounded-full"></div>
               <h2 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em]">Global Metrics</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {metrics.map((m) => (
                <div key={m.label} className="bg-[var(--bg-surface)] backdrop-blur-xl border border-[var(--border-color)] p-5 rounded-[28px] shadow-sm text-left transition-all duration-500 hover:shadow-md">
                  <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 text-left transition-colors">{m.label}</p>
                  <p className={`text-xl font-[1000] tracking-tighter ${m.color} text-left`}>{m.value}</p>
                  <div className={`inline-flex items-center px-2 py-0.5 rounded-full ${m.bg} ${m.color} text-[8px] font-black mt-2`}>
                     {m.trend}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Alerts */}
          <div className="lg:col-span-4 space-y-6 pt-4 text-left">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-red-500 rounded-full"></div>
               <h2 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em]">Security & Health</h2>
            </div>
            <div className="space-y-3">
              {alerts.map((a) => (
                <div key={a.label} className="bg-white/40 backdrop-blur-xl border border-white/50 p-4 rounded-3xl flex items-center justify-between group cursor-pointer hover:bg-white/60 transition-all text-left">
                  <div className="flex items-center gap-4">
                    <span className="text-xl">{a.icon}</span>
                    <div className="text-left">
                      <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest leading-none text-left">{a.label}</p>
                      <p className={`text-[8px] font-black ${a.color} uppercase tracking-[0.1em] mt-1.5 text-left`}>{a.status}</p>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Global Actions */}
          <div className="lg:col-span-3 space-y-6 pt-4 text-left">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-[#195bac] rounded-full"></div>
               <h2 className="text-[11px] font-black text-[var(--text-main)] uppercase tracking-[0.2em] transition-colors">Module Quick Launch</h2>
            </div>
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-2 scrollbar-hide">
              {quickActions.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    const permissionMap = {
                      "Create Invoice": "finance.create_invoice",
                      "Purchase Order": "scm.create_po",
                      "Define BOM": "mfg.create_bom",
                      "Pending Approvals": "hrm.approve_leave",
                      "Stocks Receivable": "inventory.stock_in_out",
                      "Low Stock Alert": "inventory.view_reports"
                    };

                    const requiredPerm = permissionMap[item.label];
                    if (requiredPerm && !hasPermission(requiredPerm)) {
                      alert(`Access Denied: ${requiredPerm} permission required.`);
                      return;
                    }
                    
                    if (onAction) {
                      onAction(item.label, item);
                    } else {
                      alert(`Initializing: ${item.label} Hub Protocol...`);
                    }
                  }}
                  className="w-full p-4 bg-[#195bac] text-white rounded-3xl hover:bg-[#11407a] transition-all duration-500 flex items-center justify-between group active:scale-95 shadow-xl shadow-blue-500/10"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm group-hover:scale-125 transition-transform">{item.icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                  </div>
                  <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-[#195bac] transition-all">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M12 4v16m8-8H4" /></svg>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Grid View Label */}
      {!searchQuery && activeWorkspaces.length > 0 && (
        <div className="flex items-center gap-3 mb-6 opacity-40 animate-in fade-in duration-1000 delay-500">
           <div className="w-1.5 h-6 bg-gray-400 rounded-full"></div>
           <h2 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em]">Active Modules</h2>
        </div>
      )}

      {/* Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
        {filtered.length > 0 ? (
          filtered.map((ws, index) => (
            <div 
              key={ws.id} 
              className="animate-in fade-in zoom-in-95 duration-700"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <WorkspaceCard 
                {...ws} 
                onEnter={() => onEnter(ws.name)} 
                onRemove={() => {}}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white/30 backdrop-blur-xl rounded-[60px] border border-white animate-in zoom-in-95 duration-700">
             <div className="text-5xl mb-6">📂</div>
             <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">No Accessible Modules</h3>
             <p className="text-sm text-gray-500 font-medium max-w-xs mx-auto mt-2 leading-relaxed">Your current permission matrix does not authorize access to any modules in this view.</p>
          </div>
        )}
      </div>

    </div>
  );
}
