import { useHR } from "../../context/HRContext";
import { formatNumber } from "../../utils/formatters";

export default function PayrollView() {
  const { payroll, employees, processPayroll, loading } = useHR();

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1">
          <h2 className="text-4xl font-black font-heading text-[#111827] tracking-tighter leading-none text-left">
            Payroll Terminal
          </h2>
          <p className="text-[11px] font-black font-subheading text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 text-left">
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
            Compensation Disbursement & Net Settlement Ledger
          </p>
        </div>
        <button
          onClick={() => {
            const month = new Date().toISOString().slice(0, 7);
            employees.forEach((emp) => processPayroll(emp.realId || emp.id, month));
          }}
          className="bg-[#111827] text-white px-8 py-4 rounded-2xl text-[10px] font-black font-subheading uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 active:scale-95 transition-all"
        >
          {loading ? "Executing..." : "+ Execute Cycle"}
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden text-left">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#F8FAFC]">
              <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em] text-left">
                Payee Professional
              </th>
              <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em] text-left">
                Gross Remittance
              </th>
              <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em] text-left">
                Fiscal Period
              </th>
              <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em] text-left">
                Net Disbursement
              </th>
              <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em] text-left">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-left">
            {payroll.map((pay) => (
              <tr
                key={pay.id}
                className="hover:bg-blue-50/20 transition-all group text-left"
              >
                <td className="px-8 py-6 text-left">
                  <div className="font-black font-heading text-[#1E293B] text-base mb-0.5 text-left">
                    {pay.name}
                  </div>
                  <div className="text-[11px] font-black font-subheading text-gray-400 uppercase tracking-widest text-left">
                    {pay.id}
                  </div>
                </td>
                <td className="px-8 py-6 text-sm font-black font-body text-gray-500 text-left font-mono">
                  ${formatNumber(pay.gross)}
                </td>
                <td className="px-8 py-6 text-[10px] font-black font-subheading text-[#195bac] uppercase tracking-widest text-left">
                  {pay.period}
                </td>
                <td className="px-8 py-6 text-left">
                  <div className="text-xl font-black font-heading text-[#1E293B] tracking-tighter text-left">
                    ${formatNumber(pay.net)}
                  </div>
                </td>
                <td className="px-8 py-6 text-left">
                  <span className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black font-subheading uppercase tracking-widest border border-blue-100">
                    {pay.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-8 bg-blue-50/50 rounded-[40px] border border-blue-100/50 flex items-center justify-between text-left">
        <div className="text-left">
          <h4 className="text-sm font-black font-heading text-[#195bac] uppercase tracking-[0.1em] mb-1">
            Financial Intelligence
          </h4>
          <p className="text-xs font-black font-subheading text-[#195bac]/70 leading-tight">
            Next disbursement scheduled for{" "}
            <span className="font-black">Friday, March 1st</span>. All nodes
            synchronized.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Global Payout Mode:
          </span>
          <span className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-black text-[#111827] uppercase tracking-widest">
            Bank Direct
          </span>
        </div>
      </div>
    </div>
  );
}
