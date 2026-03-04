import { useState, useEffect, useRef } from "react";
import { useBI } from "../../context/BIContext";
import { formatNumber } from "../../utils/formatters";
import html2pdf from "html2pdf.js";

export default function DashboardView({ dashboard, onBack }) {
  const { kpiData, trendData, isLoading, exportCSV } = useBI();
  const [activeTab, setActiveTab] = useState("revenue");
  const [drillDownMonth, setDrillDownMonth] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [filters, setFilters] = useState({
    date: "Last 30 Days",
    region: "Global",
    product: "All Services",
    customer: "All Tiers",
  });

  const dashboardRef = useRef(null);

  // Real export engine trigger
  const handleExport = async (type) => {
    setIsExporting(true);
    setExportProgress(0);
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    try {
      if (type === "CSV") {
        await exportCSV();
      } else if (type === "PDF") {
        const element = dashboardRef.current;
        const opt = {
          margin: [10, 10, 10, 10],
          filename: `${dashboard.name}_Report.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
        };
        await html2pdf().from(element).set(opt).save();
      }

      setExportProgress(100);
      setTimeout(() => setIsExporting(false), 800);
    } catch (err) {
      console.error("Export Error:", err);
      setIsExporting(false);
      clearInterval(interval);
    }
  };

  // Sample data derived from real context
  const kpis = {
    revenue: [
      {
        label: "Total Revenue",
        value: `$${formatNumber(kpiData?.total_revenue)}`,
        trend: "+12.5%",
        color: "text-blue-600",
      },
      {
        label: "Total Payroll",
        value: `$${formatNumber(kpiData?.total_payroll_cost)}`,
        trend: "-2.1%",
        color: "text-rose-600",
      },
      {
        label: "Active Revenue Node",
        value: "WON Deals",
        trend: "authoritative",
        color: "text-emerald-600",
      },
      {
        label: "Project Yield",
        value: "Varies",
        trend: "0.0%",
        color: "text-amber-600",
      },
    ],
    operations: [
      {
        label: "Active Projects",
        value: formatNumber(kpiData?.active_projects),
        trend: "Stable",
        color: "text-blue-600",
      },
      {
        label: "Low Stock Items",
        value: formatNumber(kpiData?.low_stock_items),
        trend: "Critical",
        color: "text-rose-600",
      },
      {
        label: "Open POs",
        value: formatNumber(kpiData?.open_purchase_orders),
        trend: "Pending",
        color: "text-amber-600",
      },
      {
        label: "System Sync",
        value: "100%",
        trend: "Online",
        color: "text-emerald-600",
      },
    ],
  };

  const getMonthName = (m) =>
    [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ][m - 1] || m;

  // Bridge trendData to chart-friendly transactions for the table below if needed
  const transactions = (trendData || [])
    .map((t) => ({
      entity: "Sales Sector",
      cat: "WON Deal",
      val: `$${formatNumber(t.revenue)}`,
      reg: "Global",
      status: "Safe",
      monthId: `${t.year}-${t.month}`,
      monthLabel: `${getMonthName(t.month)} ${t.year}`,
    }))
    .slice(-5);

  return (
    <div
      ref={dashboardRef}
      className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700 text-left relative bg-white min-h-screen"
    >
      {/* Export Progress Overlay */}
      {isExporting && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center backdrop-blur-md bg-white/40 animate-in fade-in duration-300">
          <div className="bg-white p-12 rounded-[48px] shadow-2xl border border-gray-100 max-w-sm w-full text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-8 animate-bounce">
              📦
            </div>
            <h3 className="text-2xl font-[1000] text-[#111827] tracking-tighter uppercase mb-4">
              Exporting Data
            </h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">
              Preparing your classic BI report...
            </p>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-[#195bac] transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              ></div>
            </div>
            <p className="text-sm font-black text-[#195bac]">
              {exportProgress}% Complete
            </p>
          </div>
        </div>
      )}

      {/* Dashboard Sub-Header / Filters */}
      <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-wrap items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <button
            onClick={onBack}
            className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-[#111827] transition-all group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">
              ←
            </span>
          </button>
          <div>
            <h3 className="text-xl font-[1000] text-[#111827] tracking-tighter leading-none">
              {dashboard.name}
            </h3>
            <p className="text-[10px] font-black text-gray-400 mt-2 uppercase tracking-widest">
              {dashboard.category} •{" "}
              {activeTab === "revenue" ? "Financial Node" : "Operational Node"}
            </p>
          </div>
        </div>

        <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
          <button
            onClick={() => setActiveTab("revenue")}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "revenue" ? "bg-[#195bac] text-white shadow-lg" : "text-gray-400 hover:text-gray-600"}`}
          >
            Revenue
          </button>
          <button
            onClick={() => setActiveTab("operations")}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "operations" ? "bg-[#195bac] text-white shadow-lg" : "text-gray-400 hover:text-gray-600"}`}
          >
            Operations
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {["date", "region", "product"].map((f) => (
            <div key={f} className="relative hidden xl:block">
              <select
                className="appearance-none bg-gray-50 border border-transparent hover:border-gray-200 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-600 outline-none cursor-pointer min-w-[140px]"
                value={filters[f]}
                onChange={(e) =>
                  setFilters({ ...filters, [f]: e.target.value })
                }
              >
                <option>{filters[f]}</option>
                <option>North Region</option>
                <option>South Region</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-[8px]">
                ▼
              </div>
            </div>
          ))}
          <div className="flex gap-2">
            <button
              onClick={() => handleExport("CSV")}
              className="px-6 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#195bac] hover:bg-blue-50 transition-all font-black"
            >
              CSV
            </button>
            <button
              onClick={() => handleExport("PDF")}
              className="px-6 py-3 bg-[#111827] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#195bac] transition-all"
            >
              PDF
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {(activeTab === "revenue" ? kpis.revenue : kpis.operations).map(
          (kpi, i) => (
            <div
              key={i}
              className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group"
            >
              <p className="text-[10px] font-[1000] text-gray-400 uppercase tracking-[0.2em] mb-4">
                {kpi.label}
              </p>
              <div className="flex items-end justify-between gap-4">
                <h4
                  className={`text-4xl font-[1000] tracking-tighter leading-none tabular-nums ${kpi.color}`}
                >
                  {kpi.value}
                </h4>
                <span
                  className={`text-[10px] font-black px-2 py-1 rounded-lg ${kpi.trend.startsWith("+") || kpi.trend === "Stable" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
                >
                  {kpi.trend}
                </span>
              </div>
            </div>
          ),
        )}
      </div>

      {activeTab === "revenue" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Revenue Chart with Drill-down */}
          <div className="lg:col-span-8 bg-white p-12 rounded-[56px] border border-gray-100 shadow-sm flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h4 className="text-2xl font-[1000] text-[#111827] tracking-tighter">
                  Financial Distribution
                </h4>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                  Click a bar to drill-through into transactions
                </p>
              </div>
            </div>

            <div className="flex-1 flex items-end justify-between gap-6 px-4">
              {(trendData || []).slice(-7).map((data, i) => {
                // Normalize relative to max for height scaling
                const maxVal = Math.max(
                  ...trendData.map((d) => d.revenue || 0),
                );
                const heightPct =
                  maxVal > 0 ? ((data.revenue || 0) / maxVal) * 80 : 0;

                return (
                  <div
                    key={i}
                    onClick={() =>
                      setDrillDownMonth(`${data.year}-${data.month}`)
                    }
                    className="flex-1 flex flex-col items-center gap-4 h-full justify-end group cursor-pointer"
                  >
                    <div className="flex items-end gap-1.5 w-full h-full justify-center relative">
                      {/* Projection Bar (Mocked as +10% for now) */}
                      <div
                        className="w-4 lg:w-6 bg-blue-50 rounded-t-xl transition-all"
                        style={{ height: `${heightPct * 1.1}%` }}
                      ></div>
                      {/* Actual Bar */}
                      <div
                        className="w-4 lg:w-6 bg-gradient-to-t from-indigo-600 to-violet-400 rounded-t-xl transition-all duration-700 group-hover:scale-y-105 absolute bottom-0 left-1/2 -translate-x-1/2 lg:-translate-x-0 lg:left-auto"
                        style={{ height: `${heightPct}%` }}
                      ></div>
                    </div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      {getMonthName(data.month)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Market Share (Remains same) */}
          <div className="lg:col-span-4 bg-[#111827] text-white p-12 rounded-[56px] shadow-2xl relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full"></div>
            <div className="relative z-10 text-left mb-12">
              <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4">
                Market Share
              </h4>
              <h3 className="text-2xl font-[1000] tracking-tighter">
                Segment Split
              </h3>
            </div>
            {/* Complex SVG circle code (Existing logic) */}
            <div className="flex-1 flex items-center justify-center relative">
              <svg
                className="w-64 h-64 transform -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="12"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#4f46e5"
                  strokeWidth="12"
                  strokeDasharray="160 251.2"
                />
              </svg>
              <div className="absolute text-center">
                <p className="text-3xl font-[1000] tracking-tighter">68%</p>
                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">
                  Enterprise
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Ops Chart 1: Resource Utilization */}
          <div className="bg-white p-12 rounded-[56px] border border-gray-100 shadow-sm text-left">
            <h4 className="text-2xl font-[1000] text-[#111827] tracking-tighter mb-8 uppercase">
              Resource Load Distribution
            </h4>
            <div className="space-y-8">
              {[
                { label: "Compute Engine", val: 92, color: "bg-rose-500" },
                { label: "Data Processing", val: 78, color: "bg-blue-500" },
                { label: "Storage Sync", val: 45, color: "bg-emerald-500" },
                { label: "API Gateway", val: 64, color: "bg-amber-500" },
              ].map((res, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-gray-400">{res.label}</span>
                    <span className="text-gray-900">{res.val}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-50 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${res.color} rounded-full`}
                      style={{ width: `${res.val}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ops Chart 2: Lead Time Trend */}
          <div className="bg-white p-12 rounded-[56px] border border-gray-100 shadow-sm flex flex-col">
            <h4 className="text-2xl font-[1000] text-[#111827] tracking-tighter mb-8 uppercase text-left">
              Process Lead Times
            </h4>
            <div className="flex-1 flex items-end justify-between gap-4 px-2">
              {[40, 55, 30, 45, 60, 40, 35].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-slate-100 rounded-t-2xl relative group hover:bg-slate-200 transition-all cursor-help"
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute inset-0 bg-indigo-50/50 group-hover:bg-indigo-600/10 transition-all rounded-t-2xl"></div>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    {h}ms
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-6 text-[9px] font-black text-gray-400 uppercase tracking-widest">
              <span>Mon</span>
              <span>Sun</span>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Table / Drill Down Results */}
      <div className="bg-white p-12 rounded-[56px] border border-gray-100 shadow-sm text-left">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h4 className="text-2xl font-[1000] text-[#111827] tracking-tighter">
              {drillDownMonth
                ? `Transactions for ${drillDownMonth}`
                : "Global Transaction Log"}
            </h4>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
              {drillDownMonth
                ? `Filtered by month: ${drillDownMonth}`
                : "Showing all recent data points"}
            </p>
          </div>
          {drillDownMonth && (
            <button
              onClick={() => setDrillDownMonth(null)}
              className="px-6 py-2 bg-gray-50 rounded-xl text-[9px] font-black uppercase text-[#195bac] tracking-widest hover:bg-blue-50 transition-all"
            >
              Clear Filter ×
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="pb-6 text-left">Entity</th>
                <th className="pb-6 text-left">Type</th>
                <th className="pb-6 text-left">Value</th>
                <th className="pb-6 text-left">Month</th>
                <th className="pb-6 text-right">Security</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions
                .filter((t) => !drillDownMonth || t.monthId === drillDownMonth)
                .map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="py-6 font-black text-[#111827]">
                      {row.entity}
                    </td>
                    <td className="py-6 text-xs font-bold text-gray-500">
                      {row.cat}
                    </td>
                    <td className="py-6 font-black">{row.val}</td>
                    <td className="py-6 uppercase text-[9px] font-bold text-gray-400">
                      {row.monthLabel}
                    </td>
                    <td className="py-6 text-right">
                      <span
                        className={`${row.status === "Critical" ? "text-rose-500" : "text-emerald-500"} text-[9px] font-black uppercase`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {transactions.filter(
            (t) => !drillDownMonth || t.monthId === drillDownMonth,
          ).length === 0 && (
            <div className="py-20 text-center text-gray-400 font-black uppercase text-xs">
              No transactions for this period.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
