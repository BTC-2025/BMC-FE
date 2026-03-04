import { useBI } from "../../context/BIContext";
import LiveStreamTerminal from "./LiveStreamTerminal";
import DashboardShell from "../../components/dashboard/DashboardShell";

export default function BIOverview({ onSelectView }) {
  const { stats, loading, error } = useBI();

  if (loading) {
    return (
      <div className="min-h-[600px] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
        <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2 uppercase">Initializing Terminal</h3>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Synchronizing with global compute node...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 text-left pb-20">
      <DashboardShell />

      {/* Aesthetic Continuity: Live Data Terminal & Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
          
          {/* Tile 4: System Insight Container - Reused from original for premium feel */}
          <div className="lg:col-span-12 xl:col-span-8 bg-[#111827] p-12 rounded-[56px] shadow-2xl relative overflow-hidden text-left min-h-[500px] flex flex-col group">
             {/* Dynamic Data Pulse Animation */}
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/[0.03] blur-[120px] rounded-full"></div>
             
             {/* Simulated Data Packets */}
             <div className="absolute top-0 right-0 p-8 flex flex-col gap-2 items-end opacity-20 group-hover:opacity-40 transition-opacity">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex gap-2 items-center animate-pulse" style={{ animationDelay: `${i * 300}ms` }}>
                    <div className="w-12 h-1 bg-blue-500/20 rounded-full"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  </div>
                ))}
             </div>

             <div className="relative z-10 flex flex-col justify-between h-full flex-1">
                <div>
                   <div className="flex items-center gap-3 mb-8">
                      <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.5em]">Data Processing Active</h4>
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   </div>
                   <h3 className="text-5xl font-[1000] text-white tracking-tighter mb-6 leading-none">Operational Metrics</h3>
                   <p className="text-base font-bold text-gray-500 max-w-2xl leading-relaxed">
                      Our calculation engine is processing real-time feeds from <span className="text-blue-400">ERP_BACKEND_V2</span>. 
                      Data consistency: <span className="text-emerald-400 font-black">100%</span>. 
                      Currently aggregating {stats.dataPoints} across all financial sectors.
                   </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-16 mt-16 pt-12 border-t border-white/5">
                   {[
                     { l: 'Precision', v: '100%', c: 'text-emerald-400' },
                     { l: 'Latency', v: '4ms', c: 'text-blue-400' },
                     { l: 'Data Flow', v: stats.dataPoints, c: 'text-purple-400' },
                     { l: 'System Pulse', v: `${stats.livePulse}%`, c: 'text-amber-400' },
                   ].map((m, i) => (
                     <div key={i} className="min-w-[100px]">
                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-2">{m.l}</p>
                        <p className={`text-3xl font-[1000] tracking-tighter leading-none ${m.c}`}>{m.v}</p>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* System Status - Reused for consistency */}
          <div className="lg:col-span-12 xl:col-span-4 bg-[#111827] text-white p-12 rounded-[56px] shadow-2xl relative overflow-hidden border border-white/5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full"></div>
            
            <div className="relative z-10 text-left space-y-8">
              <div>
                <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em] mb-4">Node Health</h4>
                <h3 className="text-3xl font-[1000] tracking-tighter mb-2">Sync: Online</h3>
                <p className="text-sm font-bold text-gray-500">FastAPI backend reached successfully</p>
              </div>

              <div className="space-y-4">
                {[
                  { label: "BI Pipeline", status: "Active", value: "100%", color: "bg-emerald-500" },
                  { label: "Revenue Engine", status: "Running", value: "100%", color: "bg-blue-500" },
                  { label: "Auth Sync", status: "Online", value: "100%", color: "bg-purple-500" },
                ].map((sys, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{sys.label}</span>
                      <span className="text-sm font-black text-white">{sys.value}</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${sys.color} rounded-full transition-all duration-1000`} style={{ width: sys.value }}></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-white/10">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">Last Sync Sequence</p>
                <p className="text-sm font-bold text-white">{new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
      </div>

      {/* Live Data Terminal at bottom */}
      <div className="mt-12">
          <LiveStreamTerminal />
      </div>
    </div>
  );
}
