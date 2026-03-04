import { useState } from "react";
import { useFinance } from "../../context/FinanceContext";
import { formatNumber } from "../../utils/formatters";

export default function PaymentsReceived() {
  const { payments, recordPayment, invoices } = useFinance();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    invoiceId: "",
    amount: "",
    method: "Bank Transfer",
    date: new Date().toISOString().split("T")[0],
    reference: "",
  });

  // Filter only posted (Unpaid/Partial) invoices for the dropdown
  const unpaidInvoices = invoices.filter(
    (inv) => inv.status === "Unpaid" || inv.status === "Partial",
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await recordPayment({
        ...formData,
        amount: parseFloat(formData.amount),
      });
      setShowModal(false);
      setFormData({
        invoiceId: "",
        amount: "",
        method: "Bank Transfer",
        date: new Date().toISOString().split("T")[0],
        reference: "",
      });
    } catch (err) {
      alert("Failed to record payment: " + err.message);
    }
  };

  const handleInvoiceSelect = (e) => {
    const invId = e.target.value;
    const inv = invoices.find((i) => String(i.id) === invId);
    setFormData({
      ...formData,
      invoiceId: invId,
      amount: inv ? inv.amount : "",
    });
  };

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1">
          <h2 className="text-4xl font-black text-[#111827] tracking-tighter">
            Payments Received
          </h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Cash inflow and payment reconciliation
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 text-white px-8 py-4 rounded-[20px] text-[11px] font-black uppercase tracking-[0.15em] shadow-[0_15px_30px_-10px_rgba(16,185,129,0.4)] transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3"
        >
          Record Payment
        </button>
      </div>

      {!payments.length && (
        <div className="bg-white/50 border-2 border-dashed border-gray-200 rounded-[40px] p-20 text-center space-y-4">
          <div className="text-4xl mb-4">💸</div>
          <h3 className="text-xl font-black text-gray-900 uppercase">
            No Payments Recorded
          </h3>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            Record your first incoming payment to track revenue
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {payments.map((pay) => (
          <div
            key={pay.id}
            className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100px] -mr-16 -mt-16 group-hover:bg-emerald-100 transition-colors"></div>
            <div className="relative z-10 text-left">
              <div className="flex justify-between items-start mb-8 text-left">
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg uppercase tracking-widest">
                  {pay.method}
                </span>
                <span className="text-xl font-black text-[#111827]">
                  ${formatNumber(pay.amount)}
                </span>
              </div>
              <h4 className="text-lg font-black text-[#111827] text-left">
                {pay.customer}
              </h4>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1 text-left">
                Ref: {pay.id} • Inv: {pay.invoice}
              </p>
              <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-50 text-left">
                <span className="text-sm font-bold text-gray-500">
                  {pay.date}
                </span>
                <button className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">
                  Receipt 📥
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-xl z-[9999] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
          <div className="bg-white rounded-[48px] shadow-2xl w-full max-w-xl overflow-hidden border border-white">
            <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 text-left">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-[#111827] tracking-tighter leading-none">
                  Record Inflow
                </h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                  Payment Reconciliation
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
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1 text-left">
                  Select Invoice{" "}
                  {unpaidInvoices.length > 0
                    ? `(${unpaidInvoices.length} Available)`
                    : "(No Outstanding Invoices)"}
                </label>
                <select
                  className="w-full bg-gray-50 border border-gray-200 rounded-[20px] px-8 py-5 text-sm font-black text-[#1E293B] focus:ring-4 focus:ring-emerald-50 outline-none transition-all"
                  required
                  value={formData.invoiceId}
                  onChange={handleInvoiceSelect}
                >
                  <option value="">
                    {unpaidInvoices.length > 0
                      ? "Select Outstanding Invoice"
                      : "No Unpaid Invoices Available"}
                  </option>
                  {unpaidInvoices.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      INV-{inv.id} — {inv.target} (${formatNumber(inv.amount)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1 text-left">
                    Amount Received
                  </label>
                  <input
                    type="number"
                    className="w-full bg-gray-50 border border-gray-200 rounded-[20px] px-8 py-5 text-base font-black text-[#1E293B] focus:ring-4 focus:ring-emerald-50 outline-none transition-all"
                    required
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1 text-left">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    className="w-full bg-gray-50 border border-gray-200 rounded-[20px] px-8 py-5 text-sm font-black text-[#1E293B] focus:ring-4 focus:ring-emerald-50 outline-none transition-all"
                    required
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1 text-left">
                  Payment Method
                </label>
                <select
                  className="w-full bg-gray-50 border border-gray-200 rounded-[20px] px-8 py-5 text-sm font-black text-[#1E293B] focus:ring-4 focus:ring-emerald-50 outline-none appearance-none"
                  value={formData.method}
                  onChange={(e) =>
                    setFormData({ ...formData, method: e.target.value })
                  }
                >
                  <option>Bank Transfer</option>
                  <option>Credit Card</option>
                  <option>Crypto Settlement</option>
                  <option>Cash</option>
                  <option>Check</option>
                </select>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full bg-emerald-600 text-white py-6 rounded-[24px] text-[11px] font-black uppercase tracking-[0.25em] shadow-2xl transition-all hover:-translate-y-1 hover:bg-emerald-700 active:scale-95"
                >
                  Confirm Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
