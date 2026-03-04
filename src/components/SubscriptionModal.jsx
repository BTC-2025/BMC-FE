import { ALL_AVAILABLE_WORKSPACES } from "../config/workspaces";
import { useAuth } from "../context/AuthContext";

export default function SubscriptionModal({ 
  isOpen, 
  onClose, 
  modalMode, 
  setModalMode, 
  subscribedWorkspaces, 
  setSubscribedWorkspaces, 
  dashboardWorkspaces, 
  setDashboardWorkspaces 
}) {
  const { user } = useAuth();
  
  if (!isOpen) return null;

  // Filter available workspaces based on user access
  const availableForUser = ALL_AVAILABLE_WORKSPACES.filter(ws => {
      if (user?.access?.includes('*')) return true;
      return user?.access?.includes(ws.id);
  });

  const toggleAction = (id) => {
    if (modalMode === "store") {
      setSubscribedWorkspaces(prev => {
        const isSubscribed = prev.includes(id);
        if (isSubscribed) {
          setDashboardWorkspaces(d => d.filter(item => item !== id));
          return prev.filter(item => item !== id);
        } else {
          // Auto-add to dashboard when subscribing
          setDashboardWorkspaces(d => {
             if (!d.includes(id)) return [...d, id];
             return d;
          });
          return [...prev, id];
        }
      });
    } else {
      setDashboardWorkspaces(prev => {
        const isAdded = prev.includes(id);
        if (isAdded) {
          return prev.filter(item => item !== id);
        } else {
          return [...prev, id];
        }
      });
    }
  };

  const totalPrice = subscribedWorkspaces.reduce((acc, id) => {
    const ws = ALL_AVAILABLE_WORKSPACES.find(w => w.id === id);
    return acc + (ws?.price || 0);
  }, 0);

  return (
    <div 
      className="fixed inset-0 bg-gray-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-6 md:p-12 text-left animate-in fade-in duration-500"
      onClick={onClose}
    >
        <div 
          className="bg-white rounded-[48px] w-full max-w-6xl h-[85vh] overflow-hidden flex flex-col shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] animate-in zoom-in-95 slide-in-from-bottom-10 duration-700 border border-white/80"
          style={{ willChange: 'transform, opacity' }}
          onClick={(e) => e.stopPropagation()}
        >
            {/* Header - Optimized Liquid Style */}
            <div className="px-12 py-10 flex items-center justify-between border-b border-gray-100/50 bg-white/80 backdrop-blur-md shrink-0">
                <div className="text-left">
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">
                        {modalMode === "store" ? "Enterprise Store" : "Dashboard Setup"}
                    </h2>
                    <p className="text-[13px] font-bold text-gray-400 mt-2 opacity-80">
                        {modalMode === "store" ? "Browse enterprise modules to power your business" : "Toggle active workspaces on your primary view"}
                    </p>
                </div>
                <button 
                  onClick={onClose} 
                  className="group relative w-12 h-12 flex items-center justify-center transition-all duration-300"
                >
                    <div className="absolute inset-0 bg-gray-50 rounded-2xl group-hover:bg-red-50 group-hover:rotate-90 transition-all duration-500"></div>
                    <span className="relative z-10 text-gray-400 group-hover:text-red-500 text-xl transition-colors">✕</span>
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-12 py-12 scrollbar-style bg-gray-50/50" style={{ transform: 'translateZ(0)' }}>
                {modalMode === "add" && subscribedWorkspaces.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                        <div className="relative w-28 h-28 mb-10">
                            <div className="absolute inset-0 bg-white rounded-[36px] shadow-xl animate-drift"></div>
                            <div className="absolute inset-0 flex items-center justify-center text-5xl">🛠️</div>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Your toolkit is empty</h3>
                        <p className="text-sm font-bold text-gray-400 max-w-sm leading-relaxed mb-10 opacity-70">
                            To see workspaces here, you first need to subscribe to them in our store.
                        </p>
                        <button 
                            onClick={() => setModalMode("store")}
                            className="px-10 py-5 bg-[#195bac] text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_20px_40px_-10px_rgba(25,91,172,0.3)] hover:scale-105 active:scale-95 transition-all duration-500"
                        >
                            Enter App Store
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left h-fit">
                        {availableForUser
                            .filter(ws => modalMode === "store" || subscribedWorkspaces.includes(ws.id))
                            .map(ws => {
                                const isSubscribed = subscribedWorkspaces.includes(ws.id);
                                const isDashboard = dashboardWorkspaces.includes(ws.id);
                                const isActive = modalMode === "store" ? isSubscribed : isDashboard;
                                return (
                                    <div 
                                        key={ws.id} 
                                        onClick={() => toggleAction(ws.id)}
                                        className="group relative p-8 rounded-[32px] bg-white border border-gray-100 hover:border-[#195bac]/40 shadow-sm hover:shadow-md transition-all duration-500 flex flex-col min-h-[240px] text-left overflow-hidden cursor-pointer"
                                    >
                                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#195bac]/[0.02] rounded-full group-hover:scale-150 transition-transform duration-1000 pointer-events-none"></div>
                                        
                                        <div className="relative z-10 flex items-center justify-between mb-5 overflow-visible text-left">
                                            <div className="w-12 h-12 rounded-[16px] bg-gray-50 flex items-center justify-center text-2xl shadow-sm border border-gray-100 group-hover:bg-white group-hover:shadow-md transition-all duration-500 shrink-0">
                                                {ws.icon}
                                            </div>
                                            {modalMode === "store" && (
                                              <div className="text-right shrink-0 ml-3">
                                                  <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-0.5">Price</p>
                                                  <p className="text-lg font-black text-[#195bac] tracking-tighter">${ws.price}<span className="text-[9px] text-gray-400 uppercase ml-0.5">/mo</span></p>
                                              </div>
                                            )}
                                        </div>
                                        <div className="relative z-10 text-left mb-5 flex-1">
                                            <h4 className="text-base font-black text-gray-900 leading-tight mb-1.5 text-left group-hover:text-[#195bac] transition-colors">{ws.name}</h4>
                                            <p className="text-[11px] font-bold text-gray-400 leading-relaxed text-left line-clamp-3 group-hover:text-gray-500 transition-colors">
                                              {ws.description}
                                            </p>
                                        </div>
                                        
                                        <div className="relative z-20 mt-auto text-left">
                                          <button 
                                              onClick={(e) => { e.stopPropagation(); toggleAction(ws.id); }}
                                              className={`w-full py-3 rounded-[14px] text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 active:scale-[0.98] cursor-pointer shadow-sm hover:shadow-md
                                                  ${isActive 
                                                      ? 'bg-emerald-500 text-white hover:bg-emerald-600 border border-transparent' 
                                                      : 'bg-[#195bac] text-white hover:bg-[#11407a] border border-transparent'}`}
                                          >
                                              <span className="flex items-center justify-center gap-1.5">
                                                {isActive && <span className="text-[12px]">✓</span>}
                                                {modalMode === "store" 
                                                  ? (isSubscribed ? "Subscribed" : "Subscribe") 
                                                  : (isDashboard ? "Active" : "Add")}
                                              </span>
                                          </button>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                )}
            </div>
 
            {/* Footer - Optimized Liquid Style */}
            <div className="px-12 py-10 border-t border-gray-100 flex items-center justify-between text-left bg-white shrink-0">
                <div className="text-left">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">
                      {modalMode === "store" ? "Monthly Commitment" : "Workflow Statistics"}
                    </p>
                    <p className="text-5xl font-black text-gray-900 tracking-tighter text-left">
                        <span className="text-[#195bac] opacity-40 shrink-0 mr-1">$</span>
                        {totalPrice}
                        <span className="text-sm text-gray-400 font-bold ml-4 tracking-normal opacity-60">
                          {modalMode === "store" ? "USD / month" : "Services Enabled"}
                        </span>
                    </p>
                </div>
                <button 
                  onClick={onClose} 
                  className="relative overflow-hidden group bg-gray-950 text-white px-14 py-5 rounded-[24px] font-black text-[11px] uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all duration-500 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)]"
                >
                    <span className="relative z-10">Save Changes</span>
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>
            </div>
        </div>
    </div>
  );
}
