import KpiGrid from "./KpiGrid";
import AlertsBar from "./AlertsBar";

export default function LiteDashboard({ stats }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10 text-left">
          <h2 className="text-4xl font-[1000] text-gray-950 tracking-tighter mb-2">Business Overview</h2>
          <p className="text-gray-500 font-bold max-w-xl">At-a-glance health check of your core business metrics. Real-time data sync active.</p>
      </div>

      <KpiGrid stats={stats} type="LITE" />
      <AlertsBar stats={stats} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/40 p-10 rounded-[40px] border border-white/50 text-left">
              <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">Operations Tip</h4>
              <p className="text-sm font-bold text-gray-700 leading-relaxed italic">
                  "Maintain low stock items below 5% of total inventory to ensure continuous production without capital lock-up."
              </p>
          </div>
          <div className="bg-[#195bac] p-10 rounded-[40px] text-white flex flex-col justify-between group overflow-hidden relative">
              <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
              <div>
                <h4 className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-4">Upgrade to Enterprise</h4>
                <p className="text-lg font-black tracking-tight mb-6">Unlock Revenue Trends, Predictive Analytics, and Advanced Drill-downs.</p>
              </div>
              <button className="self-start px-8 py-3 bg-white text-blue-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">Explore Enterprise</button>
          </div>
      </div>
    </div>
  );
}
