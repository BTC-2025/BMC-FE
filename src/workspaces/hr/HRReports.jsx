import { useHR } from "../../context/HRContext";
import {
  Users,
  Clock,
  AlertCircle,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { formatNumber } from "../../utils/formatters";

export default function HRReports() {
  const { stats, employees, payroll, leaves } = useHR();

  const totalPayroll = payroll.reduce((acc, p) => acc + (p.net || 0), 0);
  const avgPerformance = 4.2; // Placeholder for now

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-10 animate-in fade-in duration-500 text-left">
      <div className="space-y-2">
        <h2 className="text-5xl font-black font-heading text-[#111827] tracking-tighter leading-none">
          Personnel Intelligence Dossier
        </h2>
        <p className="text-[11px] font-black font-subheading text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#195bac] animate-pulse"></span>
          Aggregate Workforce Metrics & Operational Analytics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Headcount Card */}
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm group hover:shadow-xl transition-all duration-500">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 border border-blue-100 group-hover:bg-[#195bac] group-hover:text-white transition-all">
            <Users className="w-7 h-7" />
          </div>
          <h4 className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest mb-1">
            Total Headcount
          </h4>
          <div className="text-4xl font-black font-heading text-[#1E293B] tracking-tighter">
            {stats.totalEmployees}
          </div>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
            <TrendingUp className="w-3 h-3" /> +12% this quarter
          </div>
        </div>

        {/* Presence Card */}
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm group hover:shadow-xl transition-all duration-500">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 border border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white transition-all">
            <Clock className="w-7 h-7" />
          </div>
          <h4 className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest mb-1">
            Today's Presence
          </h4>
          <div className="text-4xl font-black font-heading text-[#1E293B] tracking-tighter">
            {stats.presentToday}
          </div>
          <p className="mt-4 text-[11px] font-black font-subheading text-gray-300 uppercase leading-none">
            Nodes Synchronized
          </p>
        </div>

        {/* Efficiency Card */}
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm group hover:shadow-xl transition-all duration-500">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 border border-amber-100 group-hover:bg-amber-500 group-hover:text-white transition-all">
            <TrendingUp className="w-7 h-7" />
          </div>
          <h4 className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest mb-1">
            Avg Efficiency
          </h4>
          <div className="text-4xl font-black font-heading text-[#1E293B] tracking-tighter">
            {avgPerformance}/5.0
          </div>
          <p className="mt-4 text-[11px] font-black font-subheading text-gray-300 uppercase leading-none">
            Workforce Tier
          </p>
        </div>

        {/* Expense Card */}
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm group hover:shadow-xl transition-all duration-500">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-6 border border-rose-100 group-hover:bg-rose-500 group-hover:text-white transition-all">
            <DollarSign className="w-7 h-7" />
          </div>
          <h4 className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest mb-1">
            Monthly Remittance
          </h4>
          <div className="text-4xl font-black font-heading text-[#1E293B] tracking-tighter">
            ${formatNumber(totalPayroll)}
          </div>
          <div className="mt-4 text-[10px] font-black text-rose-400 uppercase tracking-widest">
            Calculated Net Settlement
          </div>
        </div>
      </div>

      {/* Leave Overview */}
      <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <AlertCircle className="w-6 h-6 text-[#195bac]" />
          <h3 className="text-xl font-black font-heading text-[#111827]">
            Anomaly Detection & Leave Overlays
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
              Pending Intermissions
            </p>
            <div className="text-3xl font-black font-heading text-[#1E293B]">
              {stats.pendingLeaves}
            </div>
          </div>
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
              Sick Leave Overlay
            </p>
            <div className="text-3xl font-black font-heading text-[#1E293B]">
              {
                leaves.filter(
                  (l) => l.leave_type === "SICK" && l.status === "APPROVED",
                ).length
              }
            </div>
          </div>
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
              Unscheduled Absence
            </p>
            <div className="text-3xl font-black font-heading text-[#1E293B]">
              0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
