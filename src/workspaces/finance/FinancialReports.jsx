import { useState, useRef, useMemo } from "react";
import { useFinance } from "../../context/FinanceContext";
import { formatNumber } from "../../utils/formatters";
import html2pdf from "html2pdf.js";

export default function FinancialReportsView() {
  const { invoices, bills, expenses, accounts, stats } = useFinance();
  const [activeReport, setActiveReport] = useState(null);

  const reportRef = useRef(null);

  const handleExportPDF = (reportName) => {
    const element = reportRef.current;
    const opt = {
      margin: [15, 15, 15, 15],
      filename: `${reportName}_${new Date().toISOString().split("T")[0]}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().from(element).set(opt).save();
  };

  const renderReportContent = () => {
    switch (activeReport) {
      case "Profit & Loss Statement":
        return (
          <div ref={reportRef} className="bg-white p-4 rounded-[40px]">
            <div className="flex justify-end mb-4 no-print">
              <button
                onClick={() => handleExportPDF("Profit_and_Loss")}
                className="px-6 py-2 bg-[#195bac] text-white rounded-xl text-[10px] font-black font-subheading uppercase tracking-widest hover:bg-[#111827] transition-all"
              >
                Export PDF
              </button>
            </div>
            <ProfitAndLossReport
              invoices={invoices}
              bills={bills}
              expenses={expenses}
              stats={stats}
              onBack={() => setActiveReport(null)}
            />
          </div>
        );
      case "Balance Sheet":
        return (
          <div ref={reportRef} className="bg-white p-4 rounded-[40px]">
            <div className="flex justify-end mb-4 no-print">
              <button
                onClick={() => handleExportPDF("Balance_Sheet")}
                className="px-6 py-2 bg-[#195bac] text-white rounded-xl text-[10px] font-black font-subheading uppercase tracking-widest hover:bg-[#111827] transition-all"
              >
                Export PDF
              </button>
            </div>
            <BalanceSheetReport
              accounts={accounts}
              onBack={() => setActiveReport(null)}
            />
          </div>
        );
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {[
              {
                title: "Profit & Loss Statement",
                desc: "Detailed breakdown of income vs expenditure over selected fiscal periods.",
                icon: "📄",
              },
              {
                title: "Balance Sheet",
                desc: "Snapshot of assets, liabilities, and equity structure.",
                icon: "⚖️",
              },
              {
                title: "Cash Flow Ledger",
                desc: "Tracking inbound/outbound liquidity cycles and burn rate.",
                icon: "💸",
              },
              {
                title: "Tax Audit Pack",
                desc: "Consolidated commercial logs for regional compliance filing.",
                icon: "📑",
              },
              {
                title: "Expense Variance",
                desc: "Analysis of operational costs vs budget allocations.",
                icon: "🔍",
              },
            ].map((report, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col justify-between h-[280px] text-left"
              >
                <div className="text-left">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-500">
                    {report.icon}
                  </div>
                  <h3 className="text-xl font-black font-heading text-[#111827] mb-3 tracking-tight text-left">
                    {report.title}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium font-body leading-relaxed text-left">
                    {report.desc}
                  </p>
                </div>
                <button
                  onClick={() => setActiveReport(report.title)}
                  className="w-full py-4 text-[10px] font-black font-subheading uppercase tracking-[0.2em] text-[#195bac] bg-blue-50/50 rounded-2xl hover:bg-[#195bac] hover:text-white transition-all"
                >
                  Generate Dossier
                </button>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-12 animate-in fade-in duration-700 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1">
          <h2 className="text-4xl font-black font-heading text-[#111827] tracking-tighter leading-none text-left">
            {activeReport || "Financial Dossiers"}
          </h2>
          <p className="text-[11px] font-black font-subheading text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 text-left">
            <span className="w-2 h-2 rounded-full bg-[#111827] animate-pulse"></span>
            Official intelligence & Audit-Ready Reporting
          </p>
        </div>
      </div>

      {renderReportContent()}

      {!activeReport && (
        <div className="p-10 bg-[#1E293B] rounded-[40px] text-white/90 relative overflow-hidden group text-left">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 text-left">
            <div className="text-left">
              <h4 className="text-2xl font-black font-heading text-white mb-3 tracking-tighter text-left">
                SECURE ARCHIVE MODE
              </h4>
              <p className="text-sm text-gray-400 font-body max-w-xl leading-relaxed text-left">
                All reports are cryptographically signed and audit-logged.
                Unauthorized dissemination of fiscal intelligence is monitored
                by the system core.
              </p>
            </div>
            <div className="flex gap-4 text-left">
              <button className="px-8 py-4 bg-white text-[#111827] rounded-2xl text-[10px] font-black font-subheading uppercase tracking-widest border border-white transition-all hover:-translate-y-1">
                Audit Log
              </button>
              <button className="px-8 py-4 bg-white/5 text-white rounded-2xl text-[10px] font-black font-subheading uppercase tracking-widest border border-white/10 transition-all hover:bg-white/10">
                Permission Matrix
              </button>
            </div>
          </div>
          <div className="absolute -left-10 -bottom-10 text-[180px] font-black font-heading opacity-[0.02] select-none pointer-events-none rotate-6">
            DOCKER
          </div>
        </div>
      )}
    </div>
  );
}

function ProfitAndLossReport({ invoices, bills, expenses, stats, onBack }) {
  const sales = invoices.reduce(
    (acc, i) => acc + (i.total_amount || i.amount || 0),
    0,
  );
  const purchases = bills.reduce((acc, b) => acc + (b.total_amount || 0), 0);
  const grossProfit = sales - purchases;

  const opExpenses = expenses
    .filter((e) => e.category === "Operational")
    .reduce((acc, e) => acc + e.amount, 0);
  const marketing = expenses
    .filter((e) => e.category === "Marketing")
    .reduce((acc, e) => acc + e.amount, 0);
  const other = expenses
    .filter(
      (e) =>
        e.category !== "Operational" &&
        e.category !== "Marketing" &&
        e.category !== "Infrastructure",
    )
    .reduce((acc, e) => acc + e.amount, 0);

  const totalExpenses = opExpenses + marketing + other;
  const netIncome = grossProfit - totalExpenses;

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <button
        onClick={onBack}
        className="mb-8 text-[11px] font-black uppercase tracking-widest text-[#195bac] flex items-center gap-2"
      >
        <span className="text-lg">←</span> Back to selection
      </button>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden text-left">
        <div className="p-10 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-xl font-black font-heading text-[#111827] tracking-tight">
            Statement of Operations
          </h3>
          <p className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest mt-1">
            Fiscal Year 2026 - Quarter 1
          </p>
        </div>

        <div className="p-10 space-y-12">
          {/* Revenue */}
          <section className="space-y-4">
            <h4 className="text-[10px] font-black font-subheading text-blue-600 uppercase tracking-[0.2em] border-b border-blue-100 pb-2">
              Revenue Streams
            </h4>
            <div className="flex justify-between items-center px-4">
              <span className="text-sm font-bold font-body text-gray-600">
                Product & Software Sales
              </span>
              <span className="text-lg font-black font-heading text-[#111827]">
                ${formatNumber(sales)}
              </span>
            </div>
            <div className="flex justify-between items-center px-4 py-4 bg-blue-50/50 rounded-2xl border border-blue-100">
              <span className="text-sm font-black font-subheading text-[#111827]">
                Total Operational Revenue
              </span>
              <span className="text-xl font-black font-heading text-[#111827]">
                ${formatNumber(sales)}
              </span>
            </div>
          </section>

          {/* Expenses */}
          <section className="space-y-4">
            <h4 className="text-[10px] font-black font-subheading text-rose-600 uppercase tracking-[0.2em] border-b border-rose-100 pb-2">
              Operational Expenditures
            </h4>
            <div className="space-y-3">
              {[
                { label: "Cost of Purchases (Vendor Bills)", value: purchases },
                { label: "Marketing & Growth", value: marketing },
                { label: "Internal Operations", value: opExpenses },
                { label: "Other / Miscellaneous", value: other },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center px-4"
                >
                  <span className="text-sm font-bold font-body text-gray-600">
                    {item.label}
                  </span>
                  <span className="text-lg font-black font-heading text-gray-400">
                    ${formatNumber(item.value)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center px-4 py-4 bg-rose-50/50 rounded-2xl border border-rose-100">
              <span className="text-sm font-black font-subheading text-rose-600 uppercase tracking-widest">
                Aggregate Expenses
              </span>
              <span className="text-xl font-black font-heading text-rose-600">
                ${formatNumber(totalExpenses + purchases)}
              </span>
            </div>
          </section>

          {/* Net Profit */}
          <section className="pt-8 border-t-2 border-dashed border-gray-100">
            <div className="flex justify-between items-center p-8 bg-[#111827] rounded-[32px] text-white">
              <div>
                <h4 className="text-[10px] font-black font-subheading text-emerald-400 uppercase tracking-[0.2em] mb-1">
                  Net Fiscal Variance
                </h4>
                <p className="text-gray-400 text-xs font-body">
                  Total comprehensive income for the period
                </p>
              </div>
              <div className="text-right text-left">
                <p className="text-4xl font-black font-heading tracking-tighter text-left">
                  ${formatNumber(netIncome)}
                </p>
                <span className="text-[10px] font-black font-subheading text-emerald-400 uppercase tracking-widest">
                  Status: Positive Yield
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function BalanceSheetReport({ accounts, onBack }) {
  const assets = accounts.filter((a) => a.type === "ASSET");
  const liabilities = accounts.filter((a) => a.type === "LIABILITY");
  const equityAccounts = accounts.filter((a) => a.type === "EQUITY");

  const totalAssets = assets.reduce((acc, a) => acc + (a.balance || 0), 0);
  const totalLiabilities = liabilities.reduce(
    (acc, a) => acc + (a.balance || 0),
    0,
  );
  const totalEquity = equityAccounts.reduce(
    (acc, a) => acc + (a.balance || 0),
    0,
  );
  const retainedEarnings = totalAssets - totalLiabilities - totalEquity;

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500 text-left">
      <button
        onClick={onBack}
        className="mb-8 text-[11px] font-black uppercase tracking-widest text-[#195bac] flex items-center gap-2"
      >
        <span className="text-lg">←</span> Back to selection
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
        {/* Assets */}
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden text-left">
          <div className="p-8 border-b border-gray-100 bg-emerald-50/30">
            <h3 className="text-lg font-black font-heading text-[#111827] tracking-tight">
              Active Assets
            </h3>
            <p className="text-[9px] font-black font-subheading text-emerald-600 uppercase tracking-widest mt-1">
              Resource Inventory
            </p>
          </div>
          <div className="p-8 space-y-4 text-left">
            {assets.map((acc) => (
              <div
                key={acc.id}
                className="flex justify-between items-center text-left"
              >
                <span className="text-sm font-bold text-gray-600">
                  {acc.name}
                </span>
                <span className="text-base font-black text-[#111827]">
                  ${formatNumber(acc.balance)}
                </span>
              </div>
            ))}
            <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-left">
              <span className="text-xs font-black font-subheading uppercase tracking-widest text-emerald-600">
                Total Assets
              </span>
              <span className="text-xl font-black font-heading text-emerald-600">
                ${formatNumber(totalAssets)}
              </span>
            </div>
          </div>
        </div>

        {/* Liabilities & Equity */}
        <div className="space-y-8 text-left">
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden text-left">
            <div className="p-8 border-b border-gray-100 bg-rose-50/30">
              <h3 className="text-lg font-black font-heading text-[#111827] tracking-tight">
                External Liabilities
              </h3>
              <p className="text-[9px] font-black font-subheading text-rose-600 uppercase tracking-widest mt-1">
                Debt Obligations
              </p>
            </div>
            <div className="p-8 space-y-4 text-left">
              {liabilities.map((acc) => (
                <div
                  key={acc.id}
                  className="flex justify-between items-center text-left"
                >
                  <span className="text-sm font-bold font-body text-gray-600">
                    {acc.name}
                  </span>
                  <span className="text-base font-black font-heading text-[#111827]">
                    ${formatNumber(acc.balance)}
                  </span>
                </div>
              ))}
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-left">
                <span className="text-xs font-black font-subheading uppercase tracking-widest text-rose-600 text-left">
                  Total Liabilities
                </span>
                <span className="text-xl font-black font-heading text-rose-600 text-left">
                  ${formatNumber(totalLiabilities)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#111827] text-white rounded-[40px] p-8 text-left space-y-6">
            {equityAccounts.length > 0 && (
              <div className="space-y-3">
                {equityAccounts.map((acc) => (
                  <div
                    key={acc.id}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm font-bold text-gray-400">
                      {acc.name}
                    </span>
                    <span className="text-base font-black text-white">
                      ${formatNumber(acc.balance || 0)}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-between items-center pt-4 border-t border-white/10 text-left">
              <div>
                <h3 className="text-lg font-black font-heading tracking-tight text-left">
                  Total Equity
                </h3>
                <p className="text-[9px] font-black font-subheading text-blue-400 uppercase tracking-widest text-left">
                  Equity + Retained Earnings
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black font-heading tracking-tighter">
                  ${formatNumber(totalEquity + retainedEarnings)}
                </p>
                <div className="text-[9px] font-black font-subheading text-emerald-400 uppercase tracking-widest mt-1">
                  {totalAssets ===
                  totalLiabilities + totalEquity + retainedEarnings
                    ? "Balanced"
                    : "Unbalanced"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
