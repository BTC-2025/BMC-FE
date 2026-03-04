import { useCRM } from "../../context/CRMContext";

export default function CRMOverview({ onSelectView }) {
  const { stats, activities, customers, contacts, salesOrders, leads, deals } =
    useCRM();

  const totalOrderValue = (salesOrders || []).reduce(
    (sum, o) => sum + (parseFloat(o.total_amount) || 0),
    0,
  );

  const cards = [
    {
      id: "leads",
      label: "High Intent Leads",
      value: stats.totalLeads,
      icon: "🎯",
      color: "bg-blue-50 text-blue-600",
      border: "border-blue-100/50",
      trend: "+12.5%",
      trendUp: true,
    },
    {
      id: "deals",
      label: "Active Revenue Pipeline",
      value: stats.activeDeals,
      icon: "💰",
      color: "bg-emerald-50 text-emerald-600",
      border: "border-emerald-100/50",
      trend: "+8.3%",
      trendUp: true,
    },
    {
      id: "customers",
      label: "Enterprise Accounts",
      value: customers?.length || 0,
      icon: "🏢",
      color: "bg-indigo-50 text-indigo-600",
      border: "border-indigo-100/50",
      trend: "+2 New",
      trendUp: true,
    },
    {
      id: "contacts",
      label: "Key Stakeholders",
      value: contacts?.length || 0,
      icon: "👥",
      color: "bg-purple-50 text-purple-600",
      border: "border-purple-100/50",
      trend: "+5 New",
      trendUp: true,
    },
    {
      id: "sales_orders",
      label: "Commercial Order Value",
      value: `$${(totalOrderValue / 1000).toFixed(1)}K`,
      icon: "📑",
      color: "bg-amber-50 text-amber-600",
      border: "border-amber-100/50",
      trend: "SCM Bridge",
      trendUp: true,
    },
    {
      id: "analytics",
      label: "Projected ARR",
      value: `$${(stats.pipelineValue / 1000).toFixed(1)}K`,
      icon: "📈",
      color: "bg-rose-50 text-rose-600",
      border: "border-rose-100/50",
      trend: "+24.1%",
      trendUp: true,
    },
    {
      id: "activities",
      label: "Interaction Velocity",
      value: activities?.length || 0,
      icon: "⚡",
      color: "bg-cyan-50 text-cyan-600",
      border: "border-cyan-100/50",
      trend: "Live",
      trendUp: true,
    },
    {
      id: "deals",
      label: "Pipeline Health",
      value: `${stats.conversionRate}%`,
      icon: "💖",
      color: "bg-teal-50 text-teal-600",
      border: "border-teal-100/50",
      trend: "High",
      trendUp: true,
    },
  ];

  const recentActivities = (activities || []).slice(0, 6).map((act) => {
    let targetName = "Unknown";
    if (act.lead_id) {
      targetName = leads.find((l) => l.id === act.lead_id)?.name || "Lead";
    } else if (act.deal_id) {
      targetName = deals.find((d) => d.id === act.deal_id)?.title || "Deal";
    } else if (act.customer_id) {
      targetName =
        customers.find((c) => c.id === act.customer_id)?.company_name ||
        "Customer";
    }

    return {
      ...act,
      target: targetName,
      subject: act.note || "No details provided",
      date: new Date(act.created_at).toLocaleString(),
    };
  });

  return (
    <div className="p-8 md:p-12 max-w-[1700px] mx-auto space-y-12 animate-in fade-in duration-700">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div
            key={i}
            onClick={() => onSelectView?.(card.id)}
            className={`bg-white p-6 rounded-[32px] border ${card.border} shadow-sm hover:shadow-2xl hover:shadow-[#195bac]/5 transition-all duration-500 group relative overflow-hidden flex flex-col gap-6 cursor-pointer`}
          >
            <div className="flex justify-between items-start relative z-10">
              <div
                className={`w-12 h-12 rounded-2xl ${card.color} flex items-center justify-center text-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm border border-black/5`}
              >
                {card.icon}
              </div>
              <div
                className={`px-2.5 py-1 rounded-full text-[9px] font-black flex items-center gap-1.5 ${card.trendUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
              >
                {card.trendUp &&
                  card.trend !== "Live" &&
                  card.trend !== "SCM Bridge" &&
                  "▲"}{" "}
                {card.trend}
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-3xl font-[1000] font-heading text-[#111827] mb-1 tracking-tighter tabular-nums">
                {card.value}
              </p>
              <h3 className="text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em]">
                {card.label}
              </h3>
            </div>
            <div
              className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full ${card.color} opacity-[0.03] group-hover:scale-150 transition-transform duration-1000`}
            ></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Activities Feed */}
        <div className="lg:col-span-2 space-y-8 h-full">
          <div className="flex items-center justify-between px-4">
            <h3 className="font-[1000] font-heading text-[#111827] text-2xl tracking-tighter flex items-center gap-4">
              Strategic Interactions
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#195bac]/40"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#195bac]/70 animate-pulse"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#195bac]"></span>
              </div>
            </h3>
            <button
              onClick={() => onSelectView?.("activities")}
              className="text-[10px] font-black font-subheading text-[#195bac] uppercase tracking-[0.2em] hover:underline"
            >
              View Ledger →
            </button>
          </div>

          <div
            onClick={() => onSelectView?.("activities")}
            className="bg-white rounded-[56px] border border-gray-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] overflow-hidden text-left relative isolate cursor-pointer h-full"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent pointer-events-none"></div>
            <table className="w-full relative z-10">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="px-10 py-8 text-[11px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.3em] text-left">
                    Stakeholder
                  </th>
                  <th className="px-10 py-8 text-[11px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.3em] text-left">
                    Engagement
                  </th>
                  <th className="px-10 py-8 text-right text-[11px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.3em]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50/80">
                {recentActivities.map((act) => (
                  <tr
                    key={act.id}
                    className="hover:bg-[#195bac]/[0.02] transition-all group"
                  >
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-black text-[10px] text-gray-400 group-hover:bg-[#195bac] group-hover:text-white transition-all">
                          {act.target
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="text-[14px] font-[900] font-subheading text-[#1E293B] group-hover:text-[#195bac] transition-colors">
                            {act.target}
                          </p>
                          <p className="text-[10px] font-bold font-body text-gray-400 uppercase tracking-widest mt-0.5">
                            {act.type}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <p className="text-[13px] font-bold font-body text-[#4B5563] leading-relaxed">
                        {act.subject}
                      </p>
                      <p className="text-[11px] font-medium font-body text-gray-300 mt-1 italic">
                        {act.date}
                      </p>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black font-subheading uppercase tracking-[0.2em] shadow-sm border border-emerald-100/50">
                        In Progress
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white via-white/60 to-transparent pointer-events-none"></div>
          </div>
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-8 h-full">
          <div className="bg-[#111827] text-white p-10 rounded-[56px] shadow-2xl relative overflow-hidden group border border-white/5 h-full flex flex-col justify-between">
            <div className="relative z-10">
              <span className="w-12 h-12 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center text-2xl mb-8 border border-white/10 group-hover:scale-110 transition-transform">
                📅
              </span>
              <h4 className="text-3xl font-[1000] font-heading mb-3 tracking-tighter leading-tight">
                Priority <br />
                Follow-ups
              </h4>
              <p className="text-slate-400 text-sm font-medium font-body leading-relaxed mb-10">
                Our AI suggests pursuing{" "}
                <span className="text-blue-400 font-bold">Innovation Inc</span>{" "}
                renewal within the next 48 hours for optimal conversion
                probability.
              </p>
              <button
                onClick={() => onSelectView?.("analytics")}
                className="bg-[#195bac] text-white px-8 py-4 rounded-2xl text-[11px] font-black font-subheading uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all w-full shadow-lg shadow-blue-900/40 group-hover:-translate-y-1"
              >
                Run Analysis
              </button>
            </div>

            {/* Background Visual Detail */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#195bac] opacity-20 blur-[100px] rounded-full group-hover:opacity-40 transition-opacity"></div>
          </div>

          <div
            onClick={() => onSelectView?.("deals")}
            className="p-8 rounded-[48px] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center group hover:border-[#195bac]/30 transition-all cursor-pointer min-h-[200px]"
          >
            <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center text-2xl text-gray-400 mb-4 group-hover:bg-[#195bac] group-hover:text-white transition-all group-hover:scale-110">
              ＋
            </div>
            <p className="text-[11px] font-black font-subheading text-gray-400 uppercase tracking-[0.2em] group-hover:text-[#195bac] transition-colors">
              Configure Pipeline
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
