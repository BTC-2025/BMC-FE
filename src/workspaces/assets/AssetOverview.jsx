import { useFinance } from "../../context/FinanceContext";

export default function AssetOverview() {
  const { assets } = useFinance();
  
  // Dynamic stats calculation
  const totalValue = assets.reduce((acc, a) => acc + (Number(a.value) || 0), 0);
  const activeAssets = assets.filter(a => a.status === 'Allocated').length;
  const maintenanceAssets = assets.filter(a => a.status === 'Maintenance').length;

  const stats = [
    { label: "Total Asset Value", value: `$${(totalValue / 1000).toFixed(1)}k`, change: "+4.2%", icon: "💎", color: "bg-blue-50 text-blue-600", trend: "Appreciating" },
    { label: "Active Utilization", value: activeAssets, change: `${((activeAssets/assets.length)*100).toFixed(0)}%`, icon: "⚡", color: "bg-emerald-50 text-emerald-600", trend: "In Circulation" },
    { label: "Maintenance Pipeline", value: maintenanceAssets, change: "Critical", icon: "🔧", color: "bg-rose-50 text-rose-600", trend: "Needs Attention" },
  ];

  return (
    <div className="p-8 md:p-12 max-w-[1700px] mx-auto space-y-12 animate-in fade-in duration-700">
      


      {/* Golden Ratio KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-[#195bac]/5 transition-all duration-700 group relative overflow-hidden flex flex-col gap-8 min-h-[220px] text-left cursor-pointer">
            <div className="flex justify-between items-start relative z-10">
                <div className={`w-16 h-16 rounded-[24px] ${s.color} flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-sm border border-black/5`}>
                    {s.icon}
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black bg-gray-50 text-gray-400 px-3 py-1.5 rounded-xl border border-gray-100 uppercase tracking-widest">{s.trend}</span>
                </div>
            </div>
            <div className="relative z-10 text-left mt-auto">
                 <div className="flex items-baseline gap-3 mb-2">
                    <h3 className="text-4xl font-[1000] text-[#111827] tracking-tighter tabular-nums leading-none">{s.value}</h3>
                    <span className={`text-[11px] font-[1000] px-2.5 py-1 rounded-lg ${s.color} bg-opacity-10 shadow-sm leading-none`}>{s.change}</span>
                 </div>
                 <h3 className="text-[11px] font-[1000] text-gray-400 uppercase tracking-[0.2em] leading-none">{s.label}</h3>
            </div>
            
            {/* Geometric Accent */}
            <div className={`absolute -right-12 -bottom-12 w-40 h-40 rounded-full ${s.color} opacity-[0.03] group-hover:scale-150 transition-transform duration-1000`}></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Health Hub */}
        <div className="bg-white p-10 rounded-[56px] border border-gray-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] text-left relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-2xl font-[1000] text-[#111827] tracking-tighter">System Health Alerts</h3>
               <span className="text-[10px] font-black text-[#195bac] uppercase tracking-widest bg-[#e9f4ff] px-4 py-2 rounded-xl">Live Sync</span>
            </div>
            <div className="space-y-4">
              {[
                { title: "Upcoming Warranty Expiry", desc: "15 MacBook Pro units expiring in 30 days", type: "Warning", icon: "🕒" },
                { title: "Critical Maintenance required", desc: "Server Rack B-12 Temp Alert", type: "Critical", icon: "🌋" },
                { title: "Asset Discrepancy", desc: "2 tablets missing from London hub", type: "Info", icon: "🕵️" },
              ].map((alert, i) => (
                <div key={i} className="flex gap-5 p-6 rounded-[32px] bg-gray-50/50 border border-transparent hover:border-[#195bac]/10 hover:bg-white hover:shadow-xl transition-all duration-500 group/item">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm ${alert.type === 'Critical' ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-500'} group-hover/item:scale-110 transition-transform`}>
                    {alert.icon}
                  </div>
                  <div className="text-left">
                    <h4 className="text-[15px] font-[900] text-gray-900 mb-1">{alert.title}</h4>
                    <p className="text-xs text-gray-500 font-bold leading-relaxed opacity-70 transition-opacity group-hover/item:opacity-100">{alert.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Distribution Map Visualization */}
        <div className="bg-[#111827] text-white p-12 rounded-[56px] shadow-2xl flex flex-col relative overflow-hidden group border border-white/5">
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-10">
                   <h3 className="text-2xl font-[1000] tracking-tighter">Global Asset Distribution</h3>
                   <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:rotate-12 transition-transform">🌍</div>
                </div>
                
                <div className="space-y-8 flex-1">
                    {[
                        { loc: "New York HQ", count: 240, progress: 80, color: "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" },
                        { loc: "London Tech Hub", count: 120, progress: 45, color: "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" },
                        { loc: "Tokyo Design Studio", count: 85, progress: 30, color: "bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]" },
                    ].map(loc => (
                        <div key={loc.loc} className="group/loc cursor-pointer">
                            <div className="flex justify-between text-[11px] font-black uppercase tracking-widest mb-3 opacity-60 group-hover/loc:opacity-100 transition-opacity">
                                <span>{loc.loc}</span>
                                <span className="text-white">{loc.count} Units</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className={`h-full ${loc.color} rounded-full transition-all duration-1000 ease-out group-hover:scale-x-[1.02]`} style={{ width: `${loc.progress}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <button className="mt-12 w-full py-5 bg-white text-[#111827] rounded-[24px] text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/20">
                    Interact with Global Map
                </button>
            </div>
            
            {/* Background Visual Enhancements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-600/5 blur-[80px] rounded-full pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        </div>
      </div>
    </div>
  );
}
