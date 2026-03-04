import { useFinance } from "../../context/FinanceContext";
import { formatNumber } from "../../utils/formatters";
import { useState } from "react";

import InvoiceTemplate from "../finance/InvoiceTemplate";

export default function Invoices() {
  const { invoices, addInvoice, postInvoice } = useFinance();
  const [showModal, setShowModal] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [formData, setFormData] = useState({
    target: "",
    amount: 0,
    status: "Draft",
  });

  const handleViewInvoice = (inv) => {
    setSelectedInvoice(inv);
    setShowTemplate(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addInvoice(formData);
      setShowModal(false);
      setFormData({ target: "", amount: 0, status: "Draft" });
    } catch (err) {
      alert("Failed to create invoice: " + err.message);
    }
  };

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      {/* Header & Tools */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1">
          <h2 className="text-4xl font-black text-[#111827] tracking-tighter">
            Commercial <span className="text-[#195bac]">Billing</span>
          </h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#195bac] shadow-[0_0_10px_rgba(25,91,172,0.5)]"></span>
            Accounts Receivable & Revenue Documentation
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#111827] text-white px-8 py-4 rounded-[20px] text-[11px] font-black uppercase tracking-[0.15em] shadow-xl transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            viewBox="0 0 24 24"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Issue Invoice
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8FAFC]">
                <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">
                  Hash / UID
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">
                  Commercial Partner
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">
                  Timestamp
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">
                  Valuation
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">
                  Settlement Status
                </th>
                <th className="px-8 py-6 text-right text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-blue-50/20 transition-all group"
                >
                  <td className="px-8 py-6">
                    <span className="font-mono text-[11px] font-black text-[#1E293B] bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 group-hover:bg-white transition-colors uppercase">
                      {inv.id}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-black text-[#111827] text-sm">
                    {inv.target}
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-gray-400 tabular-nums">
                    {inv.date}
                  </td>
                  <td className="px-8 py-6 font-mono text-sm font-black text-[#1E293B]">
                    ${formatNumber(inv.amount)}
                  </td>
                  <td className="px-8 py-6">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                        inv.status === "Paid"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : inv.status === "Unpaid"
                            ? "bg-blue-50 text-blue-600 border-blue-100"
                            : inv.status === "Draft"
                              ? "bg-yellow-50 text-yellow-600 border-yellow-100"
                              : "bg-gray-50 text-gray-400 border-gray-100"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          inv.status === "Paid"
                            ? "bg-emerald-500"
                            : inv.status === "Unpaid"
                              ? "bg-blue-500"
                              : inv.status === "Draft"
                                ? "bg-yellow-500"
                                : "bg-gray-400"
                        }`}
                      ></span>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3 transition-all">
                      <button
                        onClick={() => handleViewInvoice(inv)}
                        className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-[#195bac] hover:text-white transition-all shadow-sm"
                        title="View Invoice Template"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                        >
                          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>

                      {inv.rawStatus === "DRAFT" && (
                        <button
                          onClick={() => postInvoice(inv.id)}
                          className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all border border-indigo-100"
                        >
                          Post to GL
                        </button>
                      )}
                      {inv.rawStatus === "POSTED" && (
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest flex items-center h-8">
                          Posted
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showTemplate && selectedInvoice && (
        <InvoiceTemplate
          invoice={selectedInvoice}
          onClose={() => setShowTemplate(false)}
        />
      )}

      {showModal && (
        <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-xl z-[9999] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
          <div className="bg-white rounded-[48px] shadow-2xl w-full max-w-xl overflow-hidden border border-white">
            <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 text-left">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-[#111827] tracking-tighter leading-none">
                  Draft Invoice
                </h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                  Accounts Receivable Configuration
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-rose-500 transition-all font-black"
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={handleSubmit}
              className="p-12 space-y-8 text-left bg-white"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">
                  Client Entity
                </label>
                <input
                  className="w-full bg-gray-50 border border-gray-200 rounded-[20px] px-8 py-5 text-base font-black text-[#1E293B] focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-gray-300"
                  required
                  placeholder="Full Legal Name"
                  value={formData.target}
                  onChange={(e) =>
                    setFormData({ ...formData, target: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">
                  Aggregated Value ($)
                </label>
                <input
                  type="number"
                  className="w-full bg-gray-50 border border-gray-200 rounded-[20px] px-8 py-5 text-base font-black text-[#1E293B] focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                  required
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: Number(e.target.value) })
                  }
                />
              </div>
              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full bg-[#111827] text-white py-6 rounded-[24px] text-[11px] font-black uppercase tracking-[0.25em] shadow-2xl transition-all hover:-translate-y-1 hover:bg-black active:scale-95"
                >
                  Publish Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
