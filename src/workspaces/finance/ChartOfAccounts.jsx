import { useFinance } from "../../context/FinanceContext";
import { useState, useMemo } from "react";
import { formatNumber } from "../../utils/formatters";

export default function ChartOfAccounts() {
  const { accounts, addAccount } = useFinance();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    type: "Asset",
    balance: 0,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addAccount(formData);
    setShowModal(false);
    setFormData({ code: "", name: "", type: "Asset", balance: 0 });
  };

  const accountCategories = useMemo(() => {
    return [
      { type: "Asset", color: "blue" },
      { type: "Liability", color: "amber" },
      { type: "Equity", color: "purple" },
      { type: "Income", color: "emerald" },
      { type: "Expense", color: "rose" },
    ];
  }, []);

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1">
          <h2 className="text-4xl font-black font-heading text-[#111827] tracking-tighter leading-none text-left">
            Chart of Accounts
          </h2>
          <p className="text-[11px] font-black font-subheading text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 text-left">
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]"></span>
            General Ledger Structure & Fiscal Taxonomy
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#111827] text-white px-8 py-4 rounded-[20px] text-[11px] font-black font-subheading uppercase tracking-[0.15em] shadow-xl transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3"
        >
          + Create Account
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden text-left relative group">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr className="bg-[#F8FAFC]">
              <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em] text-left">
                Code / ID
              </th>
              <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em] text-left">
                Account Name
              </th>
              <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em] text-left">
                Category
              </th>
              <th className="px-8 py-6 text-right text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em]">
                Current Balance
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-left">
            {accounts.length > 0 ? (
              accounts.map((acc) => (
                <tr
                  key={acc.id}
                  className="hover:bg-blue-50/20 transition-all text-left"
                >
                  <td className="px-8 py-6 font-mono text-[13px] font-black font-body text-[#195bac] text-left">
                    {acc.code}
                  </td>
                  <td className="px-8 py-6 text-left">
                    <p className="text-[15px] font-black font-heading text-[#111827] text-left">
                      {acc.name}
                    </p>
                  </td>
                  <td className="px-8 py-6 text-left">
                    <span
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black font-subheading uppercase tracking-widest border
                                ${
                                  acc.type === "ASSET"
                                    ? "bg-blue-50 text-blue-600 border-blue-100"
                                    : acc.type === "LIABILITY"
                                      ? "bg-amber-50 text-amber-600 border-amber-100"
                                      : acc.type === "INCOME"
                                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                        : acc.type === "EQUITY"
                                          ? "bg-purple-50 text-purple-600 border-purple-100"
                                          : "bg-rose-50 text-rose-600 border-rose-100"
                                }`}
                    >
                      {acc.type}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="text-base font-black font-heading text-[#111827] text-right">
                      ${formatNumber(acc.balance || 0)}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-8 py-16 text-center">
                  <div className="text-[10px] font-black font-subheading text-gray-300 uppercase tracking-[0.4em]">
                    No ledger accounts initialized
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-xl z-[9999] flex items-center justify-center p-6 animate-in zoom-in duration-300">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden border border-white">
            <div className="p-10 border-b border-gray-100 bg-[#F8FAFC] flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black font-heading text-[#111827] tracking-tighter text-left">
                  Define Ledger Account
                </h2>
                <p className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest mt-1 text-left">
                  Creating new node in general ledger
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-black text-2xl font-black"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-6 text-left">
              <div className="grid grid-cols-3 gap-4 text-left">
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest pl-1 text-left">
                    Account Code
                  </label>
                  <input
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none"
                    placeholder="1000"
                    required
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                  />
                </div>
                <div className="col-span-2 space-y-1 text-left">
                  <label className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest pl-1 text-left">
                    Account Title
                  </label>
                  <input
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none"
                    placeholder="e.g. Sales Revenue"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest pl-1 text-left">
                  Fiscal Taxonomy
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {accountCategories.map((cat) => (
                    <button
                      key={cat.type}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, type: cat.type })
                      }
                      className={`py-4 rounded-2xl text-[10px] font-black font-subheading uppercase tracking-widest border transition-all
                                  ${formData.type === cat.type ? `bg-[#111827] text-white border-[#111827]` : "bg-white text-gray-400 border-gray-100 hover:border-gray-200"}`}
                    >
                      {cat.type}
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-6 flex gap-4 text-left">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-5 rounded-2xl text-[11px] font-black font-subheading uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Abort
                </button>
                <button
                  type="submit"
                  className="flex-[2] bg-[#111827] text-white py-5 rounded-2xl text-[11px] font-black font-subheading uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all"
                >
                  Establish Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
