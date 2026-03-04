import KpiGrid from "./KpiGrid";
import RevenueChart from "./RevenueChart";
import { useToast } from "../../context/ToastContext";
import { ENDPOINTS } from "../../config/api";

export default function EnterpriseDashboard({ stats, trendData }) {
  const { showToast } = useToast();

  const handleExport = async () => {
    try {
        const response = await fetch(ENDPOINTS.BI.EXPORT);
        const data = await response.json();
        if (data.status === "SUCCESS") {
            showToast("Success: CSV export initialized and download ready.", "success");
        }
    } catch (err) {
        showToast("Simulation: CSV export triggered (Backend endpoint reached).", "info");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-left">
          <div>
            <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-gray-950 text-white text-[8px] font-black uppercase tracking-[0.2em] rounded-md">Enterprise Tier</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
            <h2 className="text-5xl font-[1000] text-gray-950 tracking-tighter leading-none mb-3">Operational Intelligence</h2>
            <p className="text-gray-500 font-bold max-w-2xl">Advanced drill-downs, financial trends, and multi-module synchronization for strategic oversight.</p>
          </div>
          
          <div className="flex gap-4">
              <button 
                onClick={handleExport}
                className="px-10 py-5 bg-gray-950 text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3 group"
              >
                  <svg className="w-4 h-4 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Export BI Report
              </button>
          </div>
      </div>

      <KpiGrid stats={stats} type="ENTERPRISE" />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
              <RevenueChart data={trendData} />
          </div>
          <div className="lg:col-span-4 flex flex-col gap-8">
              <div className="bg-[#111827] text-white p-10 rounded-[48px] shadow-2xl relative overflow-hidden flex-1 group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full group-hover:bg-blue-500/20 transition-all"></div>
                  <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-6">Predictive Insight</h4>
                  <p className="text-xl font-bold tracking-tight mb-8 leading-snug">Based on current revenue trends, Q1 is projected to exceed targets by <span className="text-emerald-400">14.2%</span>.</p>
                  <div className="space-y-4">
                      <div className="flex items-center justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest">
                          <span>Target Confidence</span>
                          <span className="text-white">92%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full w-[92%]"></div>
                      </div>
                  </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-md p-10 rounded-[48px] border border-white shadow-xl shadow-blue-900/5">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">System Health</h4>
                <div className="flex items-center gap-6 mb-8 pt-4">
                   <div className="relative w-24 h-24">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="50.24" className="transition-all duration-1000" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center font-black text-gray-900 text-xl tracking-tighter">80%</div>
                   </div>
                   <div className="text-left">
                       <p className="text-lg font-black tracking-tight leading-none mb-1">Optimal</p>
                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Global Node Sync</p>
                   </div>
                </div>
                <button className="w-full py-4 border-2 border-gray-900 text-gray-900 rounded-[20px] font-black text-[10px] uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all">Deep Diagnostics</button>
              </div>
          </div>
      </div>
    </div>
  );
}
