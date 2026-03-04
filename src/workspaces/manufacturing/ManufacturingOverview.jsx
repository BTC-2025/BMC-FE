export default function ManufacturingOverview({ onSelectView }) {
  const kpis = [
    { id: "WorkOrders", label: "Active Work Orders", value: "24", change: "+4", color: "text-blue-600", bg: "bg-blue-50", icon: "📋", trend: "High Demand" },
    { id: "FinishedGoods", label: "Daily Output", value: "1,240", change: "+12%", color: "text-emerald-600", bg: "bg-emerald-50", icon: "📦", trend: "Target Exceeded" },
    { id: "Efficiency", label: "Efficiency Rate", value: "94.2%", change: "+1.5%", color: "text-amber-600", bg: "bg-amber-50", icon: "⚡", trend: "Optimal Flow" },
  ];

  return (
    <div className="p-8 md:p-12 max-w-[1700px] mx-auto space-y-12 animate-in fade-in duration-1000 text-left">
      

      
      {/* KPI Cards in Golden Ratio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {kpis.map((kpi, i) => (
          <div 
            key={i} 
            onClick={() => onSelectView?.(kpi.id === 'Efficiency' ? 'Reports' : kpi.id)}
            className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-[#195bac]/5 transition-all duration-700 group relative overflow-hidden flex flex-col gap-8 min-h-[220px] text-left cursor-pointer"
          >
             <div className="flex justify-between items-start relative z-10 text-left">
                <div className={`w-16 h-16 rounded-[24px] ${kpi.bg} ${kpi.color} flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-sm border border-black/5`}>
                    {kpi.icon}
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black bg-gray-50 text-gray-400 px-3 py-1.5 rounded-xl border border-gray-100 uppercase tracking-widest">{kpi.trend}</span>
                </div>
             </div>
            <div className="relative z-10 text-left mt-auto">
                 <div className="flex items-baseline gap-3 mb-2">
                    <p className="text-4xl font-[1000] text-[#111827] tracking-tighter tabular-nums text-left leading-none">{kpi.value}</p>
                    <span className={`text-[11px] font-[1000] px-3 py-1 rounded-lg ${kpi.bg} ${kpi.color} leading-none`}>{kpi.change}</span>
                 </div>
                 <h3 className="text-[11px] font-[1000] text-[#9CA3AF] uppercase tracking-[0.25em] text-left leading-none">{kpi.label}</h3>
            </div>
            {/* Geometric Accent */}
            <div className="absolute -right-12 -bottom-12 w-40 h-40 rounded-full bg-[#195bac]/[0.02] group-hover:scale-150 transition-transform duration-1000"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
        {/* Production Alerts in Golden Ratio Style */}
        <div className="bg-white p-12 rounded-[56px] border border-gray-100 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.06)] text-left group relative overflow-hidden h-full">
           <div className="relative z-10">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-[1000] text-[#111827] tracking-tighter">Production Alerts</h3>
              <button 
                onClick={() => onSelectView?.('Reports')}
                className="text-[10px] font-black text-[#195bac] uppercase tracking-widest bg-[#e9f4ff] px-6 py-3 rounded-2xl hover:bg-[#195bac] hover:text-white transition-all duration-500"
              >Global Log</button>
            </div>
            <div className="space-y-4">
              {[
                { id: "BOM", msg: "Machine B-04 requires maintenance calibration.", type: "warning", time: "2h ago", icon: "🛠️" },
                { id: "Consumption", msg: "Raw Material 'Steel Sheets' below reorder level.", type: "critical", time: "4h ago", icon: "📉" },
                { id: "WorkOrders", msg: "Work Order #WO-992 delayed due to shortage.", type: "error", time: "6h ago", icon: "⏳" },
              ].map((alert, i) => (
                <div 
                    key={i} 
                    onClick={() => onSelectView?.(alert.id)}
                    className="flex gap-6 p-6 rounded-[32px] bg-gray-50/50 border border-transparent hover:border-[#195bac]/10 hover:bg-white transition-all duration-500 group/item cursor-pointer"
                >
                   <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center text-xl shadow-sm ${alert.type === 'critical' || alert.type === 'error' ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-500'} group-hover/item:scale-110 transition-transform`}>
                     {alert.icon}
                   </div>
                   <div className="text-left">
                      <p className="text-[15px] font-[1000] text-[#111827] tracking-tight leading-tight mb-1.5">{alert.msg}</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{alert.type} • {alert.time}</p>
                   </div>
                </div>
              ))}
            </div>
           </div>
           <div className="absolute top-0 right-0 w-32 h-32 bg-[#195bac]/[0.02] rounded-full blur-3xl"></div>
        </div>

        {/* Shop Floor Status (Golden Ratio Dark Model) */}
        <div 
            onClick={() => onSelectView?.('ShopFloor')}
            className="bg-[#111827] text-white p-12 rounded-[56px] shadow-2xl flex flex-col justify-between relative overflow-hidden group border border-white/5 h-full cursor-pointer"
        >
            <div className="relative z-10 flex flex-col h-full">
               <div className="flex items-center justify-between mb-10">
                  <div className="text-left">
                    <h3 className="text-2xl font-[1000] tracking-tighter">Shop Floor Live</h3>
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-1 opacity-60">Production Line Connectivity: Active</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl border border-white/10 group-hover:rotate-12 transition-transform">🏭</div>
               </div>
               
               <div className="space-y-10 flex-1 flex flex-col justify-center">
                  {[
                    { label: "Line A (Assembly)", status: "Running", val: 85, color: "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" },
                    { label: "Line B (Packaging)", status: "Slow Cycle", val: 45, color: "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]" },
                  ].map((line, i) => (
                    <div key={i} className="group/line text-left">
                      <div className="flex justify-between items-end mb-3">
                         <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover/line:text-white transition-colors">{line.label}</span>
                         <span className="text-[10px] font-black text-white uppercase tracking-widest opacity-60">{line.status}</span>
                      </div>
                      <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden border border-white/5">
                         <div className={`h-full ${line.color} rounded-full transition-all duration-[2s] ease-out`} style={{ width: `${line.val}%` }}></div>
                      </div>
                    </div>
                  ))}
               </div>
               
               <button className="w-full py-6 mt-12 bg-white text-[#111827] rounded-[24px] text-[11px] font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/40">
                   Execute Live Terminal
               </button>
            </div>
            
            <div className="absolute -right-20 -bottom-20 text-[200px] font-[1000] text-white/[0.01] select-none pointer-events-none tracking-tighter">PROTO</div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
}
