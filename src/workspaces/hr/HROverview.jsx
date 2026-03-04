import { useState, useEffect } from "react";
import { useHR } from "../../context/HRContext";
import { Skeleton, CardSkeleton } from "../../components/ui/Skeleton";
import { TransitionWrapper } from "../../components/ui/TransitionWrapper";
import { simulateNetworkRequest } from "../../data/mockData";

export default function HROverview({ onSelectView }) {
  const { stats, employees } = useHR();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    simulateNetworkRequest(null, 1100).then(() => setLoading(false));
  }, []);

  const cards = [
    {
      id: "employees",
      label: "Total Headcount",
      value: stats.totalEmployees,
      icon: "👥",
      color: "bg-blue-50 text-blue-600",
      trend: "Stability Active",
      border: "border-blue-100/50",
    },
    {
      id: "attendance",
      label: "Present Today",
      value: stats.presentToday,
      icon: "📍",
      color: "bg-emerald-50 text-emerald-600",
      trend: "Live Tracking",
      border: "border-emerald-100/50",
    },
    {
      id: "leaves",
      label: "Pending Leaves",
      value: stats.pendingLeaves,
      icon: "📄",
      color: "bg-amber-50 text-amber-600",
      trend: "Review Required",
      border: "border-amber-100/50",
    },
    {
      id: "recruitment",
      label: "Active Jobs",
      value: stats.activeJobs,
      icon: "💼",
      color: "bg-purple-50 text-purple-600",
      trend: "Hiring Protocol",
      border: "border-purple-100/50",
    },
  ];

  if (loading) {
    return (
      <div className="p-8 md:p-12 max-w-[1700px] mx-auto space-y-12 text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-[460px] w-full rounded-[56px]" />
          </div>
          <div className="space-y-10">
            <Skeleton className="h-[400px] w-full rounded-[60px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <TransitionWrapper className="p-8 md:p-12 max-w-[1700px] mx-auto space-y-12 relative text-left">
      {/* KPI Cards in Golden Ratio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {cards.map((card, i) => (
          <div
            key={i}
            onClick={() => onSelectView?.(card.id)}
            className={`bg-white p-10 rounded-[48px] border ${card.border} shadow-sm hover:shadow-2xl hover:shadow-[#195bac]/5 transition-all duration-700 group relative overflow-hidden flex flex-col gap-8 min-h-[220px] text-left cursor-pointer`}
          >
            <div className="flex justify-between items-start relative z-10 text-left">
              <div
                className={`w-16 h-16 rounded-[24px] ${card.color} flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-sm border border-black/5`}
              >
                {card.icon}
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black bg-gray-50 text-gray-400 px-3 py-1.5 rounded-xl border border-gray-100 uppercase tracking-widest">
                  {card.trend}
                </span>
              </div>
            </div>
            <div className="relative z-10 text-left mt-auto">
              <h3 className="text-[11px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.25em] text-left leading-none">
                {card.label}
              </h3>
              <p className="text-4xl font-black font-heading text-[#111827] tracking-tighter tabular-nums text-left leading-none">
                {card.value}
              </p>
            </div>
            {/* Geometric Accent */}
            <div className="absolute -right-12 -bottom-12 w-40 h-40 rounded-full bg-[#195bac]/[0.02] group-hover:scale-150 transition-transform duration-1000"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-left">
        {/* Recent Hires in Golden Ratio Container */}
        <div className="lg:col-span-2 space-y-8 text-left">
          <h3 className="font-black font-heading text-[#111827] text-2xl tracking-tighter px-4 flex items-center gap-3 text-left">
            Recent New Hires
            <span className="text-[10px] font-black font-subheading bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl uppercase tracking-widest border border-emerald-100">
              Live
            </span>
          </h3>
          <div
            onClick={() => onSelectView?.("employees")}
            className="bg-white rounded-[56px] border border-gray-100 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.06)] overflow-hidden min-h-[460px] flex flex-col p-8 relative group cursor-pointer"
          >
            <table className="w-full h-full text-left table-fixed relative z-10">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/30">
                  <th className="px-8 py-7 text-[11px] font-black text-[#9CA3AF] uppercase tracking-[0.3em] text-left">
                    Employee
                  </th>
                  <th className="px-8 py-7 text-[11px] font-black text-[#9CA3AF] uppercase tracking-[0.3em] text-left">
                    Department
                  </th>
                  <th className="px-8 py-7 text-right text-[11px] font-black text-[#9CA3AF] uppercase tracking-[0.3em] text-left">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-left">
                {(employees || []).slice(0, 5).map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-[#195bac]/[0.02] transition-all group/row cursor-default"
                  >
                    <td className="px-8 py-7 text-left">
                      <div className="font-black font-heading text-[#1E293B] text-base mb-0.5">
                        {emp.name}
                      </div>
                      <div className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest">
                        ID: {emp.id}
                      </div>
                    </td>
                    <td className="px-8 py-7 text-left">
                      <p className="text-[13px] font-[900] text-[#4B5563] uppercase tracking-tighter">
                        {emp.department}
                      </p>
                    </td>
                    <td className="px-8 py-7 text-right text-left">
                      <span className="px-4 py-2 bg-[#e9f4ff] text-[#195bac] rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm group-hover/row:bg-[#195bac] group-hover/row:text-white transition-all">
                        {emp.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white via-white/60 to-transparent pointer-events-none"></div>
          </div>
        </div>

        <div className="space-y-10 text-left h-full">
          <h3 className="font-[1000] text-[#111827] text-2xl tracking-tighter px-4">
            Cycle Management
          </h3>
          <div className="bg-[#111827] text-white p-12 rounded-[60px] shadow-2xl relative overflow-hidden group min-h-[400px] flex flex-col justify-between border border-white/5 h-full">
            <div className="relative z-10 text-left">
              <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-4 leading-none">
                Intelligence Node
              </h4>
              <h4 className="text-2xl font-black font-heading tracking-tighter mb-4">
                Quarterly Review
              </h4>
              <p className="text-xs font-black font-subheading text-white/70 uppercase tracking-widest mb-10">
                System-wide performance appraisal cycle open.
              </p>
            </div>

            <button
              onClick={() => onSelectView?.("performance")}
              className="relative z-10 bg-white text-[#111827] px-8 py-5 rounded-[22px] text-[11px] font-black font-subheading uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all w-full shadow-xl"
            >
              Launch Evaluation
            </button>

            {/* Background Visuals */}
            <div className="absolute -right-10 -top-10 text-9xl opacity-5 select-none rotate-12 group-hover:rotate-0 transition-transform duration-1000">
              📊
            </div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>
          </div>
        </div>
      </div>
    </TransitionWrapper>
  );
}
