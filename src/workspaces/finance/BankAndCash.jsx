import { useFinance } from "../../context/FinanceContext";
import { formatNumber } from "../../utils/formatters";
import { useMemo } from "react";

export default function BankAndCashView() {
  const { accounts, bankTransactions, syncBank, isLoading } = useFinance();

  const liquidAccounts = useMemo(() => {
    return accounts.filter(
      (a) =>
        a.type === "ASSET" &&
        (a.name.toLowerCase().includes("bank") ||
          a.name.toLowerCase().includes("cash")),
    );
  }, [accounts]);

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-12 animate-in fade-in duration-500 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1">
          <h2 className="text-4xl font-black font-heading text-[#111827] tracking-tighter leading-none text-left">
            Liquidity & Cash
          </h2>
          <p className="text-[11px] font-black font-subheading text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 text-left">
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]"></span>
            Bank Synchronizer & Treasury Assets
          </p>
        </div>
        <button
          onClick={syncBank}
          disabled={isLoading}
          className="bg-[#111827] text-white px-8 py-4 rounded-[24px] text-[10px] font-black font-subheading uppercase tracking-[0.2em] shadow-2xl transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3 disabled:opacity-50 border border-white/10 hover:bg-black"
        >
          {isLoading ? (
            <span className="animate-pulse"> Synchronizing...</span>
          ) : (
            <>
              <span className="text-lg leading-none">⚡</span>
              SYNC BANK FEED
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {liquidAccounts.length > 0 ? (
          liquidAccounts.map((acc) => (
            <div
              key={acc.id}
              className="bg-[#111827] text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden group border border-white/5 text-left"
            >
              <div className="relative z-10 text-left">
                <div className="flex items-center gap-3 mb-10 text-left">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl border border-white/5">
                    🏦
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest leading-none mb-1 text-left">
                      {acc.code}
                    </p>
                    <h3 className="text-xl font-black font-heading text-left">
                      {acc.name}
                    </h3>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black font-subheading text-blue-400 uppercase tracking-widest mb-2 text-left">
                    Available Liquidity
                  </p>
                  <p className="text-5xl font-black font-heading tracking-tighter text-left">
                    ${formatNumber(acc.balance || 0)}
                  </p>
                </div>
                <div className="mt-10 flex gap-4 text-left">
                  <button className="px-6 py-2.5 bg-white text-[#111827] rounded-xl text-[10px] font-black font-subheading uppercase tracking-widest border border-white shadow-lg shadow-black/50 transition-all hover:-translate-y-1">
                    Download Ledger
                  </button>
                  <button className="px-6 py-2.5 bg-white/5 text-white rounded-xl text-[10px] font-black font-subheading uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-all">
                    Reconcile All
                  </button>
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 text-[180px] font-black font-heading opacity-[0.02] select-none pointer-events-none uppercase">
                ASSET
              </div>
            </div>
          ))
        ) : (
          <div className="md:col-span-2 p-10 bg-gray-50 rounded-[40px] border border-dashed border-gray-200 text-center">
            <p className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-[0.3em]">
              No Bank/Cash accounts configured in General Ledger
            </p>
          </div>
        )}
      </div>

      <div className="space-y-6 text-left">
        <h3 className="font-black font-heading text-[#111827] text-xl tracking-tight px-4 flex items-center justify-between text-left">
          <span className="flex items-center gap-3">
            Operational Stream
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          </span>
          <span className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest">
            Real-time Feed
          </span>
        </h3>
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden text-left relative group">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#F8FAFC]">
                <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em] text-left">
                  Timeline
                </th>
                <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em] text-left">
                  Description / Meta
                </th>
                <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em] text-left">
                  Magnitude
                </th>
                <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em] text-left border-r border-gray-50">
                  Status
                </th>
                <th className="px-8 py-6 text-right text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-left">
              {bankTransactions.length > 0 ? (
                bankTransactions.map((trx) => (
                  <tr
                    key={trx.id}
                    className="hover:bg-blue-50/20 transition-all text-left group"
                  >
                    <td className="px-8 py-6 text-left">
                      <div className="font-mono text-[13px] font-black font-body text-[#1E293B] text-left">
                        {trx.date}
                      </div>
                      <div className="text-[10px] font-bold font-subheading text-gray-400 text-left">
                        TX-{trx.id}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-left">
                      <p className="text-[14px] font-black font-heading text-[#1E293B] text-left mb-1">
                        {trx.desc}
                      </p>
                      <div className="text-[9px] font-bold font-subheading text-gray-400 uppercase tracking-widest">
                        Secured Gateway Node
                      </div>
                    </td>
                    <td className="px-8 py-6 text-left">
                      <span
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black font-subheading uppercase tracking-widest border
                                    ${trx.type === "Credit" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"}`}
                      >
                        {trx.type === "Credit" ? "+" : "-"}$
                        {formatNumber(trx.amount)}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-left">
                      <span
                        className={`flex items-center gap-2 text-[10px] font-black font-subheading uppercase tracking-widest
                                  ${trx.status === "Reconciled" ? "text-emerald-500" : "text-amber-500 animate-pulse"}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${trx.status === "Reconciled" ? "bg-emerald-500" : "bg-amber-500"}`}
                        ></span>
                        {trx.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      {trx.status !== "Reconciled" && (
                        <button className="px-4 py-2 bg-[#111827] text-white text-[9px] font-black font-subheading rounded-lg uppercase tracking-widest hover:bg-blue-600 transition-all">
                          Reconcile
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-8 py-16 text-center">
                    <div className="text-[10px] font-black font-subheading text-gray-300 uppercase tracking-[0.4em]">
                      No transaction feed available. Synchronize with bank.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
