import { useState, useEffect } from "react";
import { useFinance } from "../../context/FinanceContext";
import { Skeleton, CardSkeleton } from "../../components/ui/Skeleton";
import { TransitionWrapper } from "../../components/ui/TransitionWrapper";
import { simulateNetworkRequest } from "../../data/mockData";
import { formatNumber } from "../../utils/formatters";

export default function FinanceOverview({ onSelectView }) {
  const { stats, invoices, expenses, isLoading } = useFinance();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) setLoading(false);
  }, [isLoading]);

  // Waterfall calculation
  const totalSales = stats.totalRevenue;
  const totalCosts = expenses.reduce((acc, e) => acc + e.amount, 0);
  const totalTax = stats.taxLiability;

  const cards = [
    {
      id: "bank_cash",
      label: "Cash Availability",
      value: `$${formatNumber(stats?.cashOnHand)}`,
      icon: "🏦",
      trend: "+12.5%",
      color: "text-blue-600",
      border: "border-blue-100/50",
    },
    {
      id: "receivables",
      label: "Accounts Receivable",
      value: `$${formatNumber(stats?.unpaidReceivables)}`,
      icon: "📥",
      trend: "5 Pending",
      color: "bg-emerald-50 text-emerald-600",
      border: "border-emerald-100/50",
    },
    {
      id: "payables",
      label: "Accounts Payable",
      value: `$${formatNumber(stats?.unpaidPayables)}`,
      icon: "📤",
      trend: "3 Due",
      color: "bg-rose-50 text-rose-600",
      border: "border-rose-100/50",
    },
    {
      id: "taxes",
      label: "Tax Liability",
      value: `$${formatNumber(stats?.taxLiability)}`,
      icon: "🏛️",
      trend: "Q1 Estimate",
      color: "bg-purple-50 text-purple-600",
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
            <Skeleton className="h-[560px] w-full rounded-[64px]" />
          </div>
          <div className="space-y-10">
            <Skeleton className="h-[600px] w-full rounded-[60px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <TransitionWrapper className="p-8 md:p-12 max-w-[1700px] mx-auto space-y-12 relative text-left">
      {/* Primary KPI Grid (Golden Ratio) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {cards.map((card, i) => (
          <div
            key={i}
            onClick={() => onSelectView?.(card.id)}
            className={`bg-white p-10 rounded-[48px] border ${card.border} shadow-sm hover:shadow-2xl hover:shadow-[#195bac]/5 transition-all duration-700 group relative overflow-hidden flex flex-col gap-10 min-h-[240px] text-left cursor-pointer`}
          >
            <div className="flex justify-between items-start relative z-10 text-left">
              <div
                className={`w-16 h-16 rounded-[24px] ${card.color} flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-sm border border-black/5`}
              >
                {card.icon}
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black font-subheading bg-gray-50 text-gray-400 px-3 py-1.5 rounded-xl border border-gray-100 uppercase tracking-widest">
                  {card.trend}
                </span>
              </div>
            </div>
            <div className="relative z-10 text-left mt-auto">
              <p className="text-4xl font-[1000] font-heading text-[#111827] mb-1.5 tracking-tighter tabular-nums text-left">
                {card.value}
              </p>
              <p className="text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.25em] text-left">
                {card.label}
              </p>
            </div>
            {/* Geometric Accent */}
            <div className="absolute -right-12 -bottom-12 w-40 h-40 rounded-full bg-[#195bac]/[0.02] group-hover:scale-150 transition-transform duration-1000"></div>
          </div>
        ))}
      </div>

      {/* Multi-Section Analysis (All sections now follow Golden Proportions) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Revenue Waterfall - The centerpiece Analysis */}
        <div className="lg:col-span-2 text-left space-y-8 h-full">
          <h3 className="font-[1000] font-heading text-[#111827] text-2xl tracking-tighter flex items-center gap-3 px-4">
            Revenue Waterfall
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#195bac] animate-ping"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#195bac]/40"></span>
            </div>
          </h3>

          <div
            onClick={() => onSelectView?.("reports")}
            className="bg-[#111827] p-12 rounded-[64px] text-white shadow-2xl relative overflow-hidden group min-h-[560px] flex flex-col justify-between border border-white/5 h-full cursor-pointer"
          >
            <div className="relative z-10 flex flex-col h-full space-y-10">
              {/* Waterfall Strips */}
              <div className="space-y-8 flex-1 flex flex-col justify-center">
                {[
                  {
                    label: "Gross Revenue",
                    val: totalSales,
                    color: "bg-blue-500",
                    percent: 100,
                  },
                  {
                    label: "Operational Burn",
                    val: totalCosts,
                    color: "bg-rose-500",
                    percent: Math.round((totalCosts / totalSales) * 100),
                  },
                  {
                    label: "Tax Liability",
                    val: totalTax,
                    color: "bg-purple-500",
                    percent: Math.round((totalTax / totalSales) * 100),
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="group/strip transition-all duration-500"
                  >
                    <div className="flex justify-between items-end mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${item.color} shadow-[0_0_8px_rgba(255,255,255,0.3)]`}
                        ></div>
                        <p className="text-[11px] font-[900] font-subheading uppercase tracking-[0.2em] opacity-60 group-hover/strip:opacity-100 transition-opacity">
                          {item.label}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-[1000] font-heading tabular-nums tracking-tighter leading-none">
                          ${formatNumber(item.val)}
                        </p>
                        <p className="text-[10px] font-black font-subheading text-[#195bac] mt-1">
                          {item.percent}%
                        </p>
                      </div>
                    </div>
                    <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-[1.5s] ease-out shadow-lg`}
                        style={{ width: `${item.percent}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-10 border-t border-white/10 flex justify-between items-center">
                <div className="text-left">
                  <h4 className="text-[10px] font-black font-subheading text-emerald-400 uppercase tracking-[0.3em] mb-2 leading-none">
                    Net Retained Yield
                  </h4>
                  <p className="text-5xl font-[1000] font-heading text-white tracking-tighter leading-none">
                    $
                    {formatNumber(
                      (totalSales || 0) - (totalCosts || 0) - (totalTax || 0),
                    )}
                  </p>
                </div>
                <button className="px-10 py-5 bg-white/5 backdrop-blur-md rounded-[24px] text-[10px] font-black font-subheading uppercase tracking-[0.3em] hover:bg-white text-white hover:text-[#111827] transition-all border border-white/10 active:scale-95 shadow-xl">
                  Full Audit Dossier
                </button>
              </div>
            </div>

            {/* Aesthetic backgrounds */}
            <div className="absolute -right-20 -bottom-20 text-[260px] font-[1000] text-white/[0.02] select-none pointer-events-none tracking-tighter -rotate-12 uppercase">
              LIQUID
            </div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
          </div>
        </div>

        {/* Side Module: Compliance & Health (Also Golden Aspect where it fits) */}
        <div className="space-y-10 text-left h-full">
          <h3 className="font-[1000] font-heading text-[#111827] text-2xl tracking-tighter px-4">
            System Health
          </h3>

          <div className="bg-white p-12 rounded-[60px] border border-gray-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] space-y-12 flex flex-col justify-between text-left h-full group">
            <div className="text-left space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#e9f4ff] text-[#195bac] flex items-center justify-center text-xl shadow-sm">
                  🛡️
                </div>
                <h4 className="text-xl font-[1000] font-heading text-[#111827] tracking-tight text-left">
                  Active Pulse
                </h4>
              </div>
              <p className="text-xs text-gray-400 font-bold font-body leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
                Automated tax calculation is live. Regional compliance for
                GST/VAT is 100% synchronized across all BTC Enterprise nodes.
              </p>
            </div>

            <div className="space-y-6 text-left">
              {[
                {
                  id: "taxes",
                  label: "Q1 Filing Status",
                  val: "Critical Processing",
                  sub: "Operational",
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                  icon: "🌀",
                },
                {
                  id: "reports",
                  label: "Annual Tax Audit",
                  val: "Verified & Locked",
                  sub: "Secured",
                  color: "text-emerald-600",
                  bg: "bg-emerald-50",
                  icon: "🔒",
                },
              ].map((status, i) => (
                <div
                  key={i}
                  onClick={() => onSelectView?.(status.id)}
                  className="p-6 bg-gray-50/50 rounded-[32px] flex items-center justify-between border border-transparent hover:border-[#195bac]/10 hover:bg-white hover:shadow-xl transition-all duration-500 group/status cursor-pointer"
                >
                  <div className="flex items-center gap-5">
                    <div
                      className={`w-12 h-12 rounded-2xl ${status.bg} ${status.color} flex items-center justify-center text-xl shadow-sm group-hover/status:scale-110 transition-transform`}
                    >
                      {status.icon}
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest mb-1 leading-none">
                        {status.label}
                      </p>
                      <span
                        className={`text-[15px] font-[1000] font-heading ${status.color} tracking-tight`}
                      >
                        {status.val}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-8 space-y-4 text-left">
              <button
                onClick={() => onSelectView?.("reports")}
                className="w-full bg-[#111827] text-white py-6 rounded-[24px] text-[11px] font-black font-subheading uppercase tracking-[0.25em] shadow-2xl hover:-translate-y-1 hover:bg-black transition-all"
              >
                Download P&L Dossier
              </button>
              <button
                onClick={() => onSelectView?.("bank_cash")}
                className="w-full bg-white text-gray-500 py-6 rounded-[24px] text-[11px] font-black font-subheading uppercase tracking-[0.25em] border border-gray-100 hover:bg-gray-50 hover:text-[#111827] transition-all"
              >
                Sync External Bank
              </button>
            </div>
          </div>
        </div>
      </div>
    </TransitionWrapper>
  );
}
