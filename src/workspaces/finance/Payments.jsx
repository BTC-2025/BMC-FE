import { useFinance } from "../../context/FinanceContext";
import { useState, useMemo } from "react";
import { formatNumber } from "../../utils/formatters";

export default function PaymentsView() {
  const { payments, invoices, bills, recordPayment } = useFinance();
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    invoiceId: "",
    amount: "",
    method: "Bank Transfer",
    type: "Incoming",
  });

  const filteredPayments = useMemo(() => {
    if (filter === "All") return payments;
    return payments.filter((p) => p.type === filter);
  }, [payments, filter]);

  const totals = useMemo(() => {
    const incoming = payments
      .filter((p) => p.type === "Incoming")
      .reduce((acc, p) => acc + (p.amount || 0), 0);
    const outgoing = payments
      .filter((p) => p.type === "Outgoing")
      .reduce((acc, p) => acc + (p.amount || 0), 0);
    return {
      incoming,
      outgoing,
      net: incoming - outgoing,
      count: payments.length,
    };
  }, [payments]);

  const handleSubmit = (e) => {
    e.preventDefault();
    recordPayment({
      invoiceId: Number(formData.invoiceId),
      amount: Number(formData.amount),
      method: formData.method,
      type: formData.type,
      target: "Manual Entry",
    });
    setShowModal(false);
    setFormData({
      invoiceId: "",
      amount: "",
      method: "Bank Transfer",
      type: "Incoming",
    });
  };

  const unpaidInvoices = invoices.filter(
    (i) => i.status === "Unpaid" || i.rawStatus === "POSTED",
  );

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1">
          <h2 className="text-4xl font-black font-heading text-[#111827] tracking-tighter leading-none text-left">
            Settlement Ledger
          </h2>
          <p className="text-[11px] font-black font-subheading text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 text-left">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"></span>
            Inbound & Outbound Payment Logs
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#111827] text-white px-8 py-4 rounded-[20px] text-[11px] font-black font-subheading uppercase tracking-[0.15em] shadow-xl transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3"
        >
          + Record Payment
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Total Inflow",
            value: totals.incoming,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            border: "border-emerald-100",
            icon: "📥",
          },
          {
            label: "Total Outflow",
            value: totals.outgoing,
            color: "text-rose-600",
            bg: "bg-rose-50",
            border: "border-rose-100",
            icon: "📤",
          },
          {
            label: "Net Settlement",
            value: totals.net,
            color: totals.net >= 0 ? "text-emerald-600" : "text-rose-600",
            bg: "bg-gray-50",
            border: "border-gray-100",
            icon: "⚖️",
          },
          {
            label: "Transactions",
            value: totals.count,
            color: "text-blue-600",
            bg: "bg-blue-50",
            border: "border-blue-100",
            icon: "🔁",
            isCount: true,
          },
        ].map((card, i) => (
          <div
            key={i}
            className={`p-6 rounded-[28px] border ${card.border} ${card.bg} text-left`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="text-xl">{card.icon}</div>
              <p className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest">
                {card.label}
              </p>
            </div>
            <p
              className={`text-2xl font-black font-heading tracking-tighter ${card.color}`}
            >
              {card.isCount ? card.value : `$${formatNumber(card.value)}`}
            </p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {["All", "Incoming", "Outgoing"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-6 py-3 rounded-2xl text-[10px] font-black font-subheading uppercase tracking-widest border transition-all
              ${
                filter === tab
                  ? "bg-[#111827] text-white border-[#111827]"
                  : "bg-white text-gray-400 border-gray-100 hover:border-gray-300"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden text-left">
        {filteredPayments.length === 0 ? (
          <div className="p-20 text-center bg-gray-50/30">
            <div className="text-5xl mb-6">💳</div>
            <p className="text-sm font-black font-subheading uppercase tracking-widest text-gray-300 mb-2">
              No Payment Records Found
            </p>
            <p className="text-xs text-gray-400 font-medium font-body max-w-md mx-auto leading-relaxed">
              Payments appear here when you settle invoices from Accounts
              Receivable, issue payments from Accounts Payable, or record manual
              transactions.
            </p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8FAFC]">
                <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em] text-left">
                  Voucher ID
                </th>
                <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em] text-left">
                  Counterparty / Invoice
                </th>
                <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em] text-left">
                  Settlement Sum
                </th>
                <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em] text-left">
                  Direction
                </th>
                <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em] text-left">
                  Method
                </th>
                <th className="px-8 py-6 text-right text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em]">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-left">
              {filteredPayments.map((pay) => (
                <tr
                  key={pay.id}
                  className="hover:bg-blue-50/20 transition-all text-left"
                >
                  <td className="px-8 py-6 text-left">
                    <div className="font-mono text-[13px] font-black font-body text-[#195bac]">
                      {pay.id}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-left">
                    <div className="font-black font-heading text-[#1E293B] text-sm mb-0.5">
                      {pay.customer || pay.target || "—"}
                    </div>
                    <div className="text-[10px] font-bold font-subheading text-gray-400 font-mono">
                      {pay.invoice || `INV-${pay.invoiceId}`}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-left">
                    <span
                      className={`text-base font-black font-heading ${
                        pay.type === "Incoming"
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}
                    >
                      {pay.type === "Incoming" ? "+" : "-"}$
                      {formatNumber(pay.amount)}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-left">
                    <span
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black font-subheading uppercase tracking-widest border
                      ${
                        pay.type === "Incoming"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : "bg-rose-50 text-rose-600 border-rose-100"
                      }`}
                    >
                      <span
                        className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${
                          pay.type === "Incoming"
                            ? "bg-emerald-500"
                            : "bg-rose-500"
                        }`}
                      ></span>
                      {pay.type}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-left">
                    <span className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-black font-subheading text-gray-500 uppercase tracking-widest">
                      {pay.method}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="font-mono text-[11px] font-black font-body text-gray-400 tabular-nums">
                      {pay.date}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Info Banner */}
      <div className="bg-emerald-50/50 p-8 rounded-[40px] border border-emerald-100/50 flex gap-6 items-start text-left">
        <div className="p-4 bg-white rounded-2xl shadow-sm border border-emerald-100">
          💡
        </div>
        <div>
          <h4 className="text-[11px] font-black font-subheading text-emerald-600 uppercase tracking-[0.2em] mb-1 text-left">
            Settlement Protocol
          </h4>
          <p className="text-sm text-gray-500 font-medium font-body leading-relaxed max-w-4xl text-left">
            Payments are automatically logged when you confirm receipt in
            Accounts Receivable or authorize outflow in Accounts Payable. Each
            settlement triggers a General Ledger journal entry for full
            double-entry compliance.
          </p>
        </div>
      </div>

      {/* Record Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-xl z-[9999] flex items-center justify-center p-6 animate-in zoom-in duration-300">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden border border-white">
            <div className="p-10 border-b border-gray-100 bg-[#F8FAFC] flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black font-heading text-[#111827] tracking-tighter text-left">
                  Record Settlement
                </h2>
                <p className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest mt-1 text-left">
                  Log a manual payment entry
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
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest pl-1 text-left">
                  Direction
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {["Incoming", "Outgoing"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: t })}
                      className={`py-4 rounded-2xl text-[10px] font-black font-subheading uppercase tracking-widest border transition-all
                        ${
                          formData.type === t
                            ? t === "Incoming"
                              ? "bg-emerald-500 text-white border-emerald-500"
                              : "bg-rose-500 text-white border-rose-500"
                            : "bg-white text-gray-400 border-gray-100 hover:border-gray-300"
                        }`}
                    >
                      {t === "Incoming" ? "📥 " : "📤 "}
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest pl-1 text-left">
                  Associated Invoice
                </label>
                <select
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black font-body text-[#1E293B] outline-none appearance-none"
                  required
                  value={formData.invoiceId}
                  onChange={(e) =>
                    setFormData({ ...formData, invoiceId: e.target.value })
                  }
                >
                  <option value="">Select Invoice</option>
                  {unpaidInvoices.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.reference || `INV-${inv.id}`} — {inv.target} ($
                      {formatNumber(inv.amount)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest pl-1 text-left">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black font-body text-[#1E293B] outline-none"
                    placeholder="0.00"
                    required
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest pl-1 text-left">
                    Payment Method
                  </label>
                  <select
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black font-body text-[#1E293B] outline-none appearance-none"
                    value={formData.method}
                    onChange={(e) =>
                      setFormData({ ...formData, method: e.target.value })
                    }
                  >
                    <option>Bank Transfer</option>
                    <option>Cash</option>
                    <option>Corporate Check</option>
                    <option>Gateway</option>
                    <option>Credit Line</option>
                  </select>
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
                  className={`flex-[2] text-white py-5 rounded-2xl text-[11px] font-black font-subheading uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all
                    ${formData.type === "Incoming" ? "bg-emerald-500" : "bg-rose-500"}`}
                >
                  {formData.type === "Incoming"
                    ? "Confirm Receipt"
                    : "Authorize Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
