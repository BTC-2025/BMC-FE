import { useFinance } from "../../context/FinanceContext";
import { useState } from "react";
import { formatNumber } from "../../utils/formatters";

export default function ReceivablesView() {
  const { invoices, recordPayment } = useFinance();
  const arInvoices = invoices.filter((i) => i.status === "Unpaid");

  const [showModal, setShowModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");

  const openSettlement = (inv) => {
    setSelectedInvoice(inv);
    setShowModal(true);
  };

  const handleSettle = (e) => {
    e.preventDefault();
    recordPayment({
      invoiceId: selectedInvoice.id,
      amount: selectedInvoice.amount + selectedInvoice.tax,
      type: "Incoming",
      method: paymentMethod,
      target: selectedInvoice.target,
    });
    setShowModal(false);
  };

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1">
          <h2 className="text-4xl font-black font-heading text-[#111827] tracking-tighter leading-none text-left">
            Accounts Receivable (AR)
          </h2>
          <p className="text-[11px] font-black font-subheading text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 text-left">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"></span>
            Inbound Revenue Pipeline & Collection Desk
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden text-left">
        {arInvoices.length === 0 ? (
          <div className="p-20 text-center text-gray-400 font-bold bg-gray-50/30">
            <div className="text-4xl mb-4">✅</div>
            <p className="text-sm font-black font-subheading uppercase tracking-widest text-gray-300">
              No Outstanding Receivables
            </p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8FAFC]">
                <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em] text-left">
                  Customer Node
                </th>
                <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em] text-left">
                  Transaction ID
                </th>
                <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em] text-left">
                  Due Amount
                </th>
                <th className="px-8 py-6 text-right text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em]">
                  Action Terminal
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {arInvoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-blue-50/20 transition-all group"
                >
                  <td className="px-8 py-6 text-left">
                    <div className="font-black font-heading text-[#1E293B] text-base mb-0.5">
                      {inv.target}
                    </div>
                    <div className="text-[9px] font-bold font-subheading text-emerald-500 uppercase tracking-widest">
                      Active Partner
                    </div>
                  </td>
                  <td className="px-8 py-6 font-mono font-bold font-body text-gray-400 text-left">
                    {inv.id}
                  </td>
                  <td className="px-8 py-6 text-left">
                    <div className="text-base font-black font-heading text-[#111827]">
                      ${formatNumber(inv.amount + inv.tax)}
                    </div>
                    <div className="text-[9px] font-bold font-body text-gray-400 uppercase tracking-tighter">
                      Due date: {inv.date}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button
                      onClick={() => openSettlement(inv)}
                      className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-[10px] font-black font-subheading uppercase tracking-widest shadow-lg shadow-emerald-100 hover:-translate-y-1 transition-all"
                    >
                      Recieve Funds
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="p-10 bg-emerald-50 rounded-[40px] border border-emerald-100 flex items-center justify-between text-left">
        <div className="text-left">
          <h4 className="text-sm font-black font-subheading text-emerald-600 uppercase tracking-[0.1em] mb-1">
            Fiscal Note
          </h4>
          <p className="text-xs font-bold font-body text-gray-500 leading-relaxed max-w-xl text-left">
            Confirming receipt of funds will automatically close the invoice,
            update the General Ledger (AR reduction), and synchronize the Main
            Operating Bank balance.
          </p>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-xl z-[9999] flex items-center justify-center p-6 animate-in zoom-in duration-300">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden border border-white">
            <div className="p-10 border-b border-gray-100 bg-[#F8FAFC]">
              <h2 className="text-2xl font-black font-heading text-[#111827] tracking-tighter text-left">
                Receipt Terminal
              </h2>
              <p className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest mt-1 text-left">
                Processing settlement for {selectedInvoice?.id}
              </p>
            </div>
            <form onSubmit={handleSettle} className="p-10 space-y-8 text-left">
              <div className="p-8 bg-gray-50 rounded-[32px] border border-gray-100 text-left">
                <p className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest mb-2 text-left">
                  Total Settlement Principal
                </p>
                <p className="text-4xl font-black font-heading text-[#111827] tracking-tighter text-left">
                  $
                  {formatNumber(selectedInvoice?.amount + selectedInvoice?.tax)}
                </p>
              </div>

              <div className="space-y-4 text-left">
                <label className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest pl-1 text-left">
                  Settlement Method
                </label>
                <div className="grid grid-cols-2 gap-4 text-left">
                  {[
                    "Bank Transfer",
                    "Cash Depot",
                    "Corporate Check",
                    "Gateway",
                  ].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`py-4 rounded-2xl text-[10px] font-black font-subheading uppercase tracking-widest border transition-all
                                        ${paymentMethod === m ? "bg-[#111827] text-white border-[#111827]" : "bg-white text-gray-400 border-gray-100 hover:border-gray-300"}`}
                    >
                      {m}
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
                  className="flex-[2] bg-emerald-500 text-white py-5 rounded-2xl text-[11px] font-black font-subheading uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all"
                >
                  Confirm Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
