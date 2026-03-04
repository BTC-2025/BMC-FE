import { useFinance } from "../../context/FinanceContext";
import { useState, useMemo } from "react";
import { formatNumber } from "../../utils/formatters";

export default function TaxesView() {
  const { invoices, bills, stats } = useFinance();
  const [isFiling, setIsFiling] = useState(false);
  const [isFiled, setIsFiled] = useState(false);

  // Mock filing history for UI
  const [filingHistory] = useState([
    {
      id: "TX-9901",
      period: "Q4 2025",
      type: "VAT/GST",
      status: "Accepted",
      date: "2026-01-15",
      amount: 12450.0,
    },
    {
      id: "TX-9844",
      period: "Q3 2025",
      type: "VAT/GST",
      status: "Accepted",
      date: "2025-10-12",
      amount: 11200.0,
    },
  ]);

  const taxDetails = useMemo(() => {
    const itc = bills.reduce((acc, b) => acc + (b.total_amount || 0) * 0.1, 0);
    const outputTax = invoices.reduce(
      (acc, i) => acc + (i.amount || 0) * 0.1,
      0,
    );
    return { itc, outputTax, net: outputTax - itc };
  }, [invoices, bills]);

  const handleFile = () => {
    setIsFiling(true);
    setTimeout(() => {
      setIsFiling(false);
      setIsFiled(true);
    }, 2000);
  };

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-10 animate-in fade-in duration-500 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1">
          <h2 className="text-4xl font-black font-heading text-[#111827] tracking-tighter leading-none text-left">
            Tax Engine
          </h2>
          <p className="text-[11px] font-black font-subheading text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 text-left">
            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]"></span>
            Fiscal Compliance & Liability Tracker
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
        <div className="lg:col-span-2 bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm text-left">
          <div className="flex justify-between items-start mb-10">
            <div className="text-left">
              <p className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest mb-1 text-left">
                Estimated Net Liability
              </p>
              <h3 className="text-5xl font-black font-heading text-[#111827] tracking-tighter text-left">
                ${formatNumber(taxDetails.net)}
              </h3>
            </div>
            <div className="bg-purple-50 text-purple-600 px-4 py-2 rounded-2xl text-[10px] font-black font-subheading uppercase tracking-widest border border-purple-100">
              Current Quarter
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 text-left">
            <div className="space-y-2 p-6 bg-gray-50/50 rounded-3xl border border-gray-100">
              <p className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest text-left">
                Input Tax Credit (ITC)
              </p>
              <p className="text-2xl font-black font-heading tracking-tighter text-emerald-600">
                ${formatNumber(taxDetails.itc)}
              </p>
              <p className="text-[9px] font-bold font-body text-gray-400 flex items-center gap-1 uppercase tracking-tighter">
                Verified Purchases: {bills.length}
              </p>
            </div>
            <div className="space-y-2 p-6 bg-gray-50/50 rounded-3xl border border-gray-100">
              <p className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest">
                Output Tax (Sales)
              </p>
              <p className="text-2xl font-black font-heading text-rose-600">
                ${formatNumber(taxDetails.outputTax)}
              </p>
              <p className="text-[9px] font-bold font-body text-gray-400 flex items-center gap-1 uppercase tracking-tighter">
                Verified Sales: {invoices.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#111827] text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden group text-left">
          <div className="relative z-10 h-full flex flex-col justify-between text-left">
            <div>
              <h4 className="text-xl font-black font-heading mb-4 tracking-tight text-left">
                Next Filing Deadline
              </h4>
              <div className="bg-white/10 p-6 rounded-3xl border border-white/5 mb-8 text-left">
                <p className="text-[10px] font-black font-subheading text-blue-400 uppercase tracking-widest mb-1 text-left">
                  GSTR-1 / VAT Q1
                </p>
                <p className="text-3xl font-black font-heading tracking-tighter text-left">
                  March 10, 2026
                </p>
              </div>
            </div>
            <button
              disabled={isFiling || isFiled}
              onClick={handleFile}
              className={`w-full py-5 rounded-2xl text-[10px] font-black font-subheading uppercase tracking-[0.2em] transition-all shadow-xl
                      ${isFiled ? "bg-emerald-500 cursor-default shadow-emerald-500/20" : "bg-blue-600 hover:bg-black shadow-blue-500/20"} 
                      ${isFiling ? "animate-pulse" : ""}`}
            >
              {isFiling
                ? "SYNCHRONIZING WITH PORTAL..."
                : isFiled
                  ? "FILING SUCCESSFUL ✓"
                  : "Initialize Return Filing"}
            </button>
          </div>
          <div className="absolute -right-6 -bottom-6 text-9xl opacity-5 select-none pointer-events-none rotate-12">
            🏛️
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden text-left">
        <div className="p-8 border-b border-gray-50 bg-[#F8FAFC]">
          <h4 className="text-[11px] font-black font-subheading text-[#111827] uppercase tracking-[0.2em] text-left">
            Filing History & Audit Trails
          </h4>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/30">
              <th className="px-8 py-5 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em] text-left">
                Voucher / ID
              </th>
              <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em] text-left">
                Tax Category
              </th>
              <th className="px-8 py-5 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em] text-left">
                Amount Paid
              </th>
              <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em] text-left">
                Basis Amount
              </th>
              <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em] text-left">
                Rate (%)
              </th>
              <th className="px-8 py-5 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em] text-left">
                Status
              </th>
              <th className="px-8 py-6 text-right text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em]">
                Accrued Liability
              </th>
              <th className="px-8 py-5 text-right text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em]">
                Filing Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-left">
            {filingHistory.map((history) => (
              <tr
                key={history.id}
                className="hover:bg-gray-50/50 transition-all text-left"
              >
                <td className="px-8 py-6 font-mono text-sm font-black font-body text-[#195bac] text-left">
                  {history.id}
                </td>
                <td className="px-8 py-6 text-left">
                  <div className="font-black font-heading text-[#1E293B] text-base mb-0.5 text-left">
                    {history.period}
                  </div>
                  <div className="text-[10px] font-bold font-subheading text-gray-400 uppercase tracking-widest leading-none">
                    {history.type}
                  </div>
                </td>
                <td className="px-8 py-6 text-left font-black font-heading text-[#111827] text-left">
                  ${formatNumber(history.amount)}
                </td>
                <td className="px-8 py-6 font-mono font-bold font-body text-gray-400 text-left">
                  ${formatNumber(history.amount)}
                </td>
                <td className="px-8 py-6 font-mono font-bold font-body text-[#195bac] text-left">
                  10%
                </td>
                <td className="px-8 py-6 text-left">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black font-subheading uppercase tracking-widest border border-emerald-100">
                    {history.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-left">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black font-subheading uppercase tracking-widest border border-blue-100">
                    {history.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right font-black font-body text-gray-400 text-sm text-right tabular-nums">
                  {history.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-blue-50/50 p-8 rounded-[40px] border border-blue-100/50 flex gap-6 items-start text-left">
        <div className="p-4 bg-white rounded-2xl shadow-sm border border-blue-100">
          ℹ️
        </div>
        <div>
          <h4 className="text-[11px] font-black font-subheading text-[#111827] uppercase tracking-[0.2em] mb-1 text-left">
            Compliance protocol
          </h4>
          <p className="text-sm font-medium font-body text-gray-500 leading-relaxed max-w-4xl text-left">
            The Tax Engine automatically calculates liabilities based on
            jurisdictional rules applied to each transaction. Basis amounts are
            updated in real-time. Settling a period will generate a specific
            Accounts Payable entry for disbursement to the relevant authority.
          </p>
        </div>
      </div>
    </div>
  );
}
