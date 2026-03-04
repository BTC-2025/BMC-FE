export default function SupplyChainOverview({ onSelectView }) {
  const stats = [
    { id: "Logistics", label: "On-Time Delivery", value: "98.5%", change: "+0.5%", icon: "🚚", color: "text-emerald-600", bg: "bg-emerald-50", trend: "High Reliability" },
    { id: "InventoryCoordination", label: "Inventory Turnover", value: "12 Days", change: "-2 Days", icon: "🔄", color: "text-blue-600", bg: "bg-blue-50", trend: "Fast Rotation" },
    { id: "Logistics", label: "Active Shipments", value: "116", change: "+14", icon: "🛳️", color: "text-[#195bac]", bg: "bg-[#e9f4ff]", trend: "Transit Active" },
  ];

  return (
    <div className="p-8 md:p-12 max-w-[1700px] mx-auto space-y-12 animate-in fade-in duration-1000 text-left">
      


      {/* KPI Cards in Golden Ratio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {stats.map((s, i) => (
            <div 
                key={i} 
                onClick={() => onSelectView?.(s.id)}
                className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-[#195bac]/5 transition-all duration-700 group relative overflow-hidden flex flex-col gap-8 min-h-[220px] text-left cursor-pointer"
            >
               <div className="flex justify-between items-start relative z-10 text-left">
                  <div className={`w-16 h-16 rounded-[24px] ${s.bg} ${s.color} flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-sm border border-black/5`}>
                      {s.icon}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black bg-gray-50 text-gray-400 px-3 py-1.5 rounded-xl border border-gray-100 uppercase tracking-widest">{s.trend}</span>
                  </div>
               </div>
              <div className="relative z-10 text-left mt-auto">
                   <div className="flex items-baseline gap-3 mb-2">
                      <p className="text-4xl font-[1000] text-[#111827] tracking-tighter tabular-nums text-left leading-none">{s.value}</p>
                      <span className={`text-[11px] font-[1000] px-3 py-1 rounded-lg ${s.bg} ${s.color} tabular-nums leading-none`}>{s.change}</span>
                   </div>
                   <h3 className="text-[11px] font-[1000] text-[#9CA3AF] uppercase tracking-[0.25em] text-left leading-none">{s.label}</h3>
              </div>
              <div className="absolute -right-12 -bottom-12 w-40 h-40 rounded-full bg-[#195bac]/[0.02] group-hover:scale-150 transition-transform duration-1000"></div>
            </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
         {/* Alerts Sector */}
         <div className="bg-white p-12 rounded-[56px] border border-gray-100 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.06)] text-left group h-full">
            <div className="flex justify-between items-center mb-10 text-left">
                <h3 className="text-2xl font-[1000] text-[#111827] tracking-tighter text-left">Supply Criticalities</h3>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            </div>
            <div className="space-y-6 text-left">
               {[
                 { id: "Logistics", title: "Port Congestion Protocol", desc: "Shanghai Terminal B reporting significant operational variance.", type: "Critical", icon: "🌋", color: "bg-rose-50 text-rose-500" },
                 { id: "Procurement", title: "Inventory Threshold Alert", desc: "Raw Material SKU-992 predicted depletion in 5 business days.", type: "Warning", icon: "📉", color: "bg-amber-50 text-amber-600" },
               ].map((alert, i) => (
                  <div 
                    key={i} 
                    onClick={() => onSelectView?.(alert.id)}
                    className="flex gap-6 p-6 bg-gray-50/50 rounded-[32px] border border-transparent hover:border-gray-200 transition-all duration-500 group/item text-left cursor-pointer"
                  >
                    <div className={`w-14 h-14 rounded-2xl ${alert.color} flex items-center justify-center text-2xl shadow-sm group-hover/item:scale-110 transition-transform`}>{alert.icon}</div>
                    <div className="text-left">
                       <h4 className="font-[1000] text-[#111827] text-[15px] mb-1 leading-tight">{alert.title}</h4>
                       <p className="text-xs text-gray-400 font-bold leading-relaxed">{alert.desc}</p>
                    </div>
                  </div>
               ))}
            </div>
         </div>

         {/* AI Predictive Intelligence Section (Golden Ratio Themed) */}
         <div className="bg-[#195bac] text-white p-12 rounded-[56px] shadow-2xl flex flex-col justify-between relative overflow-hidden group border border-white/5 min-h-[400px] h-full">
            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="text-left flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-[1000] tracking-tighter mb-2">Predictive Synthesis</h3>
                    <p className="text-[11px] font-[900] text-[#e9f4ff] uppercase tracking-[0.2em] opacity-80">Quantum Demand Model Update Ready</p>
                  </div>
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-3xl backdrop-blur-md group-hover:rotate-12 transition-transform shadow-lg">🤖</div>
                </div>
                
                <p className="text-sm font-bold text-white/70 max-w-sm leading-relaxed mb-8 text-left uppercase tracking-widest text-[10px]">Your Q2 procurement strategy recommendation has been synthesized with 98.2% confidence. Port congestion variants considered.</p>
                
                <button 
                    onClick={() => onSelectView?.('Procurement')}
                    className="px-10 py-5 bg-white text-[#195bac] rounded-[24px] text-[11px] font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-2xl w-full"
                >Initialize Strategy Review</button>
            </div>
            
            {/* Visuals */}
            <div className="absolute -right-20 -bottom-20 text-[200px] font-[1000] text-white/[0.03] select-none pointer-events-none -rotate-12 tracking-tighter uppercase">PREDICT</div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full pointer-events-none"></div>
         </div>
      </div>
    </div>
  );
}
