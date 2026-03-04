import React from 'react';

export default function ProjectOverview({ onSelectView }) {
  const kpis = [
    { id: "Milestones", label: "Active Milestones", value: "12", icon: "🚩", color: "bg-blue-50 text-blue-600", trend: "On Schedule" },
    { id: "Team", label: "Resource Bandwidth", value: "84%", icon: "⚡", color: "bg-emerald-50 text-emerald-600", trend: "High Efficiency" },
    { id: "Issues", label: "Project Delta", value: "+12.5%", icon: "📈", color: "bg-purple-50 text-purple-600", trend: "Positive Yield" },
  ];

  return (
    <div className="p-8 md:p-12 max-w-[1700px] mx-auto space-y-12 animate-in fade-in duration-700 text-left">
      


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-left">
          {/* Main Progress Hub - Golden Ratio Container */}
          <div className="lg:col-span-2 space-y-8 text-left">
              <h3 className="font-[1000] text-[#111827] text-2xl tracking-tighter px-4">Active Projects Progress</h3>
              <div 
                onClick={() => onSelectView?.('Projects')}
                className="bg-white p-12 rounded-[56px] border border-gray-100 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.06)] min-h-[460px] flex flex-col justify-center space-y-10 group relative overflow-hidden cursor-pointer"
              >
                  {[
                    { name: "Website Redesign", progress: 45, color: "bg-blue-600", status: "In Progress" },
                    { name: "Mobile App Refactor", progress: 75, color: "bg-emerald-500", status: "Internal Beta" },
                    { name: "Global ERP Sync", progress: 20, color: "bg-amber-500", status: "Planning" },
                  ].map((proj, idx) => (
                    <div key={proj.name} className="space-y-4 animate-in slide-in-from-left duration-1000" style={{ animationDelay: `${idx * 150}ms` }}>
                      <div className="flex justify-between items-end">
                        <div className="text-left">
                          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">{proj.status}</p>
                          <h4 className="text-lg font-[1000] text-[#111827] tracking-tighter">{proj.name}</h4>
                        </div>
                        <span className="text-2xl font-[1000] text-[#195bac] tabular-nums tracking-tighter">{proj.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-50 h-3 rounded-full overflow-hidden border border-gray-100">
                        <div className={`${proj.color} h-full transition-all duration-[2s] ease-out rounded-full shadow-lg group-hover:scale-x-[1.02]`} style={{ width: `${proj.progress}%` }}></div>
                      </div>
                    </div>
                  ))}
                  <div className="absolute -right-20 -bottom-20 text-[200px] font-[1000] text-gray-950/[0.01] select-none pointer-events-none -rotate-12">SPEED</div>
              </div>
          </div>

          <div className="space-y-8 text-left h-full">
              <h3 className="font-[1000] text-[#111827] text-2xl tracking-tighter px-4">Milestone Alert</h3>
              {/* Golden Ratio Sidebar Card */}
              <div className="bg-[#111827] text-white p-12 rounded-[56px] shadow-2xl min-h-[460px] flex flex-col justify-between relative overflow-hidden group border border-white/5 h-full">
                <div className="relative z-10 text-left">
                   <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-4 leading-none">Terminal Alert</p>
                   <h4 className="text-3xl font-[1000] tracking-tighter mb-4 leading-tight">Beta Launch Protocol</h4>
                   <p className="text-[11px] font-bold text-gray-500 max-w-[220px] leading-relaxed uppercase tracking-[0.1em]">Mobile App Refresh sequence initiates on March 15.</p>
                </div>
                
                <div className="relative z-10 text-left">
                    <div className="inline-flex items-center gap-3 px-5 py-3 bg-white/5 border border-white/10 rounded-2xl mb-8">
                       <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                       <span className="text-[10px] font-black uppercase tracking-widest">4 Days Remaining</span>
                    </div>
                    <button 
                        onClick={() => onSelectView?.('Milestones')}
                        className="w-full py-5 bg-white text-[#111827] rounded-[22px] text-[11px] font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-xl"
                    >Execute Priority Audit</button>
                </div>

                {/* Back-glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>
              </div>
          </div>
      </div>

      {/* KPI Grid (Golden Ratio Tiles) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {kpis.map((kpi, i) => (
          <div 
            key={i} 
            onClick={() => onSelectView?.(kpi.id)}
            className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-[#195bac]/5 transition-all duration-700 group relative overflow-hidden flex flex-col gap-8 min-h-[220px] text-left cursor-pointer"
          >
             <div className="flex justify-between items-start relative z-10">
                <div className={`w-16 h-16 rounded-[24px] ${kpi.color} flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-sm border border-black/5`}>
                    {kpi.icon}
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black bg-gray-50 text-gray-400 px-3 py-1.5 rounded-xl border border-gray-100 uppercase tracking-widest">{kpi.trend}</span>
                </div>
             </div>
             <div className="relative z-10 text-left mt-auto">
                 <p className="text-4xl font-[1000] text-[#111827] mb-1.5 tracking-tighter tabular-nums">{kpi.value}</p>
                 <p className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-[0.25em]">{kpi.label}</p>
             </div>
             <div className="absolute -right-12 -bottom-12 w-40 h-40 rounded-full bg-[#195bac]/[0.02] group-hover:scale-150 transition-transform duration-1000"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
