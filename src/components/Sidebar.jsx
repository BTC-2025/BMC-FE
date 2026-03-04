import logo from "../assets/logo.png";
import { ALL_AVAILABLE_WORKSPACES } from "../config/workspaces";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ onEnterWorkspace, onReset, onOpenStore, onOpenActivity, onOpenSettings, isCollapsed, currentWorkspace, subscribedWorkspaces = [], onClose }) {
  const { user } = useAuth();
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    ) },
  ];

  const handleNav = (id) => {
    if (id === 'dashboard') {
      onReset();
    } else if (id === 'activity' || id === 'Recent Activity') {
      if (onOpenActivity) onOpenActivity();
    } else if (id === 'settings' || id === 'Settings') {
      if (onOpenSettings) onOpenSettings();
    } else if (id === 'store' || id === 'Store') {
      if (onOpenStore) onOpenStore();
    } else if (id === 'chat') {
      alert("Initializing AI Chat Protocol...");
    }
    
    if (window.innerWidth < 1024 && onClose) onClose();
  };

  const handleWorkspaceNav = (name) => {
    onEnterWorkspace(name);
    if (window.innerWidth < 1024 && onClose) onClose();
  };

  const userModules = ALL_AVAILABLE_WORKSPACES.filter(ws => subscribedWorkspaces.includes(ws.id));

  return (
    <div className={`${isCollapsed ? "w-20" : "w-60 lg:w-56"} bg-[var(--bg-surface)] lg:bg-[var(--bg-surface)] backdrop-blur-3xl border-r border-[var(--border-color)] flex flex-col h-full z-50 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] relative shadow-2xl lg:shadow-none`}>
      {/* Brand Logo Header */}
      <div className={`pt-6 pb-2 flex items-center ${isCollapsed ? "justify-center" : "justify-between"} cursor-pointer group mb-2 px-3`}>
        <div className="flex items-center gap-3" onClick={onReset}>
          <div className="w-5 flex justify-center shrink-0 relative">
            <img src={logo} alt="Logo" className="w-6 h-6 object-contain relative z-10 group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-[#195bac]/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          </div>
          {!isCollapsed && (
            <div className="animate-in slide-in-from-left-2 duration-500 overflow-hidden ml-1">
              <h1 className="text-lg font-[1000] text-[var(--text-main)] leading-none tracking-tighter transition-colors">BTC</h1>
              <p className="text-[9px] font-black text-[#195bac] mt-1 uppercase tracking-[0.15em] opacity-60">Enterprise</p>
            </div>
          )}
        </div>
        
        {/* Mobile Close Button */}
        <button onClick={onClose} className="lg:hidden p-2 text-gray-400 hover:text-gray-900 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide py-1 px-3">
        {/* Main Navigation */}
        <nav className="space-y-1 mb-6">
          {!isCollapsed && <p className="text-[8.5px] font-black text-[var(--text-main)] uppercase tracking-[0.2em] px-1 mb-3 transition-colors">Main Menu</p>}
          {menuItems.map((item) => {
            const isActive = (item.id === 'dashboard' && !currentWorkspace) || 
                             (item.id === 'activity' && currentWorkspace === 'Recent Activity') || 
                             (item.id === 'settings' && currentWorkspace === 'Settings');
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center ${isCollapsed ? "justify-center" : "gap-3"} py-2.5 rounded-xl transition-all duration-500 group relative
                  ${isActive 
                    ? "bg-[#195bac] text-white shadow-lg shadow-blue-500/10" 
                    : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-element)]"}`}
                title={isCollapsed ? item.label : ""}
              >
                <div className="w-8 flex justify-center shrink-0">
                  <span className={`transition-all duration-500 ${isActive ? "text-white scale-110" : "text-gray-400 group-hover:text-gray-900 group-hover:scale-110"}`}>
                    {item.icon}
                  </span>
                </div>
                {!isCollapsed && (
                  <span className={`text-[11px] font-black tracking-[0.05em] transition-all duration-500 uppercase ${isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"}`}>
                    {item.label}
                  </span>
                )}
                {!isCollapsed && isActive && (
                   <div className="absolute right-3 w-1 h-3 rounded-full bg-white/40 animate-pulse"></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Workspaces Section */}
        <nav className="space-y-1">
          {!isCollapsed && <p className="text-[8.5px] font-black text-[var(--text-main)] uppercase tracking-[0.2em] px-1 mb-3 transition-colors">Business Units</p>}
          {userModules.map((ws) => {
            const isActive = currentWorkspace === ws.name;
            return (
              <button
                key={ws.id}
                onClick={() => handleWorkspaceNav(ws.name)}
                className={`w-full flex items-center ${isCollapsed ? "justify-center" : "gap-3"} py-1.5 rounded-xl transition-all duration-500 group relative overflow-hidden
                  ${isActive 
                    ? "bg-gradient-to-r from-[#195bac]/15 to-transparent text-[#195bac] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]" 
                    : "text-gray-600 hover:text-gray-950 hover:bg-white/60"}`}
                title={isCollapsed ? ws.name : ""}
              >
                {/* Active Backdrop Glow */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#195bac]/5 to-transparent opacity-50 animate-pulse"></div>
                )}

                <div className="w-8 flex justify-center shrink-0">
                  <span className={`text-xl transition-all duration-700 relative z-10 ${isActive ? "scale-110 drop-shadow-[0_0_8px_rgba(25,91,172,0.3)]" : "opacity-40 group-hover:opacity-100 group-hover:scale-110 group-hover:rotate-3"}`}>
                    {ws.icon}
                  </span>
                </div>
                
                {!isCollapsed && (
                  <span className={`flex-1 text-left text-[12px] font-bold tracking-tight leading-tight transition-all duration-500 relative z-10 ${isActive ? "opacity-100" : "opacity-75 group-hover:opacity-100"}`}>
                    {ws.name}
                  </span>
                )}

                {/* Refined Active Indicator */}
                {!isCollapsed && isActive && (
                   <div className="absolute right-0 w-1 h-5 rounded-l-full bg-[#195bac] shadow-[0_0_15px_rgba(25,91,172,0.4)]"></div>
                )}

                {/* Hover Border Effect */}
                <div className="absolute bottom-0 left-3 right-3 h-[1px] bg-gradient-to-r from-transparent via-[#195bac]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </button>
            );
          })}
        </nav>

        {/* Administration Section (Super Admin Only) */}
        {user?.is_admin && (
          <nav className="space-y-1 mt-6">
            {!isCollapsed && <p className="text-[8.5px] font-black text-[#195bac] uppercase tracking-[0.2em] px-1 mb-3">System Governance</p>}
            <button
              onClick={() => handleWorkspaceNav("Administration")}
              className={`w-full flex items-center ${isCollapsed ? "justify-center" : "gap-3"} py-2.5 rounded-xl transition-all duration-500 group relative
                ${currentWorkspace === "Administration" 
                  ? "bg-[#111827] text-white shadow-xl shadow-gray-900/10" 
                  : "text-gray-600 hover:text-gray-950 hover:bg-white/60"}`}
            >
              <div className="w-8 flex justify-center shrink-0">
                <span className={`text-lg transition-all duration-500 ${currentWorkspace === "Administration" ? "text-white scale-110" : "text-gray-400 group-hover:text-gray-900"}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </span>
              </div>
              {!isCollapsed && (
                <span className={`text-[11px] font-[1000] uppercase tracking-tighter transition-all duration-500 ${currentWorkspace === "Administration" ? "opacity-100" : "opacity-75 group-hover:opacity-100"}`}>
                  Governance
                </span>
              )}
              {currentWorkspace === "Administration" && !isCollapsed && (
                 <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
              )}
            </button>
          </nav>
        )}
      </div>

      <div className="p-3 mb-2 space-y-2">
        <button 
          onClick={() => handleNav('chat')}
          className="w-full relative group transition-all duration-500"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-[#195bac] rounded-xl blur-[2px] opacity-0 group-hover:opacity-10 transition duration-1000 group-hover:duration-200"></div>
          
          <div className={`relative flex items-center justify-center py-3 bg-[var(--bg-element)] backdrop-blur-xl rounded-xl border border-[var(--border-color)] group-hover:border-[#195bac]/30 transition-all duration-500 shadow-sm group-hover:shadow-lg ${isCollapsed ? 'w-12 h-12' : 'w-full'}`}>
             <div className="flex justify-center shrink-0 relative">
                <svg className="w-5 h-5 transition-all duration-500 text-gray-400 group-hover:text-[#195bac] group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
             </div>
          </div>
        </button>

        <button 
          onClick={() => handleNav('Store')}
          className="w-full relative group transition-all duration-500"
        >
          {/* Background Glow Layer */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-[#195bac] rounded-xl blur-[2px] opacity-0 group-hover:opacity-10 transition duration-1000 group-hover:duration-200"></div>
          
          <div className={`relative flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} py-3 bg-white/40 lg:bg-white/20 backdrop-blur-xl rounded-xl border border-white/60 group-hover:border-[#195bac]/30 transition-all duration-500 shadow-sm group-hover:shadow-lg ${currentWorkspace === 'Store' ? 'border-[#195bac]/20 bg-white/60' : ''}`}>
             <div className="w-8 flex justify-center shrink-0 relative">
                <svg className={`w-4 h-4 transition-all duration-500 ${currentWorkspace === 'Store' ? 'text-[#195bac] scale-110' : 'text-gray-400 group-hover:text-[#195bac] group-hover:scale-110'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
             </div>
             {!isCollapsed && (
               <div className="flex flex-col items-start leading-none gap-1 overflow-hidden">
                  <span className={`text-[9px] font-black uppercase tracking-[0.2em] transition-colors ${currentWorkspace === 'Store' ? 'text-[#195bac]' : 'text-gray-900'}`}>
                    Marketplace
                  </span>
                  <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest group-hover:text-[#195bac] transition-colors whitespace-nowrap">
                    Systems
                  </span>
               </div>
             )}
          </div>
        </button>

        <button 
          onClick={() => handleNav('Settings')}
          className="w-full relative group transition-all duration-500"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-400 to-gray-600 rounded-xl blur-[2px] opacity-0 group-hover:opacity-10 transition duration-1000 group-hover:duration-200"></div>
          
          <div className={`relative flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} py-3 bg-white/40 lg:bg-white/20 backdrop-blur-xl rounded-xl border border-white/60 group-hover:border-gray-300 transition-all duration-500 shadow-sm group-hover:shadow-lg ${currentWorkspace === 'Settings' ? 'border-[#195bac]/20 bg-white/60' : ''}`}>
             <div className="w-8 flex justify-center shrink-0 relative">
                <svg className={`w-4 h-4 transition-all duration-500 ${currentWorkspace === 'Settings' ? 'text-[#195bac] scale-110 rotate-90' : 'text-gray-400 group-hover:text-gray-900 group-hover:scale-110 group-hover:rotate-45'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
             </div>
             {!isCollapsed && (
               <div className="flex flex-col items-start leading-none gap-1 overflow-hidden">
                  <span className={`text-[9px] font-black uppercase tracking-[0.2em] transition-colors ${currentWorkspace === 'Settings' ? 'text-[#195bac]' : 'text-gray-900'}`}>
                    Settings
                  </span>
                  <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest group-hover:text-gray-600 transition-colors whitespace-nowrap">
                    Preferences
                  </span>
               </div>
             )}
          </div>
        </button>
      </div>
    </div>
  );
}
