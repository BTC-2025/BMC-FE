import { useManufacturing } from "../../context/ManufacturingContext";

export default function ManufacturingOverview({ onSelectView }) {
  const { stats, orders, boms, workCenters, loading } = useManufacturing();

  const activeWOs = orders.filter((o) => o.status !== "Executed").length;
  const completedWOs = orders.filter((o) => o.status === "Executed").length;
  const inProduction = orders.filter((o) => o.status === "In Production").length;

  const kpis = [
    {
      id: "WorkOrders",
      label: "Active Work Orders",
      value: loading ? "—" : String(activeWOs),
      change: `+${inProduction} running`,
      color: "text-blue-600",
      bg: "bg-blue-50",
      icon: "📋",
      trend: inProduction > 0 ? "In Production" : "Awaiting Start",
    },
    {
      id: "FinishedGoods",
      label: "Completed Orders",
      value: loading ? "—" : String(completedWOs),
      change: `${boms.length} BOMs`,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      icon: "📦",
      trend: completedWOs > 0 ? "Production Done" : "No Output Yet",
    },
    {
      id: "Planning",
      label: "Work Centers",
      value: loading ? "—" : String(workCenters.length),
      change: `${workCenters.length > 0 ? "Active" : "Add one"}`,
      color: "text-amber-600",
      bg: "bg-amber-50",
      icon: "⚡",
      trend: "Resources",
    },
  ];

  const recentOrders = orders.slice(0, 3);

  return (
    <div className="p-8 md:p-12 max-w-[1700px] mx-auto space-y-12 animate-in fade-in duration-1000 text-left">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            onClick={() => onSelectView?.(kpi.id)}
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
            <div className="absolute -right-12 -bottom-12 w-40 h-40 rounded-full bg-[#195bac]/[0.02] group-hover:scale-150 transition-transform duration-1000"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
        {/* Recent Work Orders */}
        <div className="bg-white p-12 rounded-[56px] border border-gray-100 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.06)] text-left group relative overflow-hidden h-full">
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-[1000] text-[#111827] tracking-tighter">Latest Work Orders</h3>
              <button
                onClick={() => onSelectView?.("WorkOrders")}
                className="text-[10px] font-black text-[#195bac] uppercase tracking-widest bg-[#e9f4ff] px-6 py-3 rounded-2xl hover:bg-[#195bac] hover:text-white transition-all duration-500"
              >
                View All
              </button>
            </div>
            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 font-bold text-sm">No work orders yet. Create one to get started!</p>
                <button onClick={() => onSelectView?.("WorkOrders")} className="mt-4 px-6 py-2 bg-amber-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-600">
                  Create Work Order
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order, i) => (
                  <div key={i} onClick={() => onSelectView?.("WorkOrders")} className="flex gap-6 p-6 rounded-[32px] bg-gray-50/50 border border-transparent hover:border-[#195bac]/10 hover:bg-white transition-all duration-500 cursor-pointer">
                    <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center text-xl shadow-sm ${order.status === "Executed" ? "bg-emerald-50 text-emerald-500" : order.status === "In Production" ? "bg-blue-50 text-blue-500" : "bg-amber-50 text-amber-500"}`}>
                      {order.status === "Executed" ? "✅" : order.status === "In Production" ? "🏭" : "📋"}
                    </div>
                    <div className="text-left">
                      <p className="text-[15px] font-[1000] text-[#111827] tracking-tight leading-tight mb-1.5">{order.product} — {order.qty} units</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{order.id} • {order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#195bac]/[0.02] rounded-full blur-3xl"></div>
        </div>

        {/* Shop Floor Live */}
        <div onClick={() => onSelectView?.("ShopFloor")}
          className="bg-[#111827] text-white p-12 rounded-[56px] shadow-2xl flex flex-col justify-between relative overflow-hidden group border border-white/5 h-full cursor-pointer"
        >
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-10">
              <div className="text-left">
                <h3 className="text-2xl font-[1000] tracking-tighter">Shop Floor Live</h3>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-1 opacity-60">
                  {inProduction} order(s) in production
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl border border-white/10 group-hover:rotate-12 transition-transform">🏭</div>
            </div>

            <div className="space-y-6 flex-1 flex flex-col justify-center">
              {workCenters.length === 0 ? (
                <p className="text-gray-500 font-bold text-sm">No work centers configured. Go to Planning to add one.</p>
              ) : (
                workCenters.slice(0, 2).map((wc, i) => {
                  const load = inProduction > 0 ? Math.min(Math.round((inProduction / Math.max(wc.capacity_per_day, 1)) * 100), 100) : 0;
                  return (
                    <div key={i} className="group/line text-left">
                      <div className="flex justify-between items-end mb-3">
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover/line:text-white transition-colors">{wc.name}</span>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest opacity-60">{load > 0 ? "Active" : "Idle"}</span>
                      </div>
                      <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden border border-white/5">
                        <div className={`h-full rounded-full transition-all duration-[2s] ease-out ${load > 80 ? "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]" : "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"}`} style={{ width: `${load}%` }}></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <button className="w-full py-6 mt-12 bg-white text-[#111827] rounded-[24px] text-[11px] font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/40">
              View Shop Floor
            </button>
          </div>

          <div className="absolute -right-20 -bottom-20 text-[200px] font-[1000] text-white/[0.01] select-none pointer-events-none tracking-tighter">LIVE</div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
}
