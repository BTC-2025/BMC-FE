import { useFinance } from "../../context/FinanceContext";
import { useState } from "react";
import { formatNumber } from "../../utils/formatters";

export default function PayablesView() {
  const { bills, recordPayment } = useFinance();
  const apBills = bills.filter(
    (b) => b.status !== "PAID" && b.status !== "DRAFT",
  );

  const [showModal, setShowModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");

  const openSettlement = (bill) => {
    setSelectedBill(bill);
    setShowModal(true);
  };

  const handleSettle = (e) => {
    e.preventDefault();
    recordPayment({
      invoiceId: selectedBill.id,
      amount: selectedBill.total_amount,
      type: "Outgoing",
      method: paymentMethod,
      target: selectedBill.vendor_name,
    });
    setShowModal(false);
  };

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1 text-left">
          <h2 className="text-4xl font-black font-heading text-[#111827] tracking-tighter leading-none text-left">
            Accounts Payable (AP)
          </h2>
          <p className="text-[11px] font-black font-subheading text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 text-left">
            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]"></span>
            Strategic Obligations & Disbursement Ledger
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden text-left">
        {apBills.length === 0 ? (
          <div className="p-20 text-center text-gray-400 font-bold bg-gray-50/30">
            <div className="text-4xl mb-4">✨</div>
            <p className="text-sm font-black font-subheading uppercase tracking-widest text-gray-300">
              All Obligations Settled
            </p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8FAFC]">
                <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em] text-left">
                  Vendor Node
                </th>
                <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em] text-left">
                  Voucher / Reference
                </th>
                <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em] text-left">
                  Settlement Sum
                </th>
                <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em] text-left">
                  Status
                </th>
                <th className="px-8 py-6 text-right text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em]">
                  Disbursement
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-left">
              {apBills.map((bill) => (
                <tr
                  key={bill.id}
                  className="hover:bg-blue-50/20 transition-all text-left group"
                >
                  <td className="px-8 py-6 text-left">
                    <div className="font-black font-heading text-[#1E293B] text-base mb-0.5 text-left">
                      {bill.vendor_name}
                    </div>
                    <div className="text-[9px] font-bold font-subheading text-rose-500 uppercase tracking-widest">
                      Priority Entity
                    </div>
                  </td>
                  <td className="px-8 py-6 text-left">
                    <div className="font-mono font-bold font-body text-gray-400">
                      {bill.reference || `BILL-${bill.id}`}
                    </div>
                    <div className="text-[9px] font-bold font-body text-gray-300 mt-1">
                      {bill.bill_date}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-left">
                    <div className="text-base font-black font-heading text-[#111827] text-left">
                      ${formatNumber(bill.total_amount || 0)}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-left">
                    <span
                      className={`px-3 py-1 rounded-lg text-[10px] font-black font-subheading uppercase tracking-widest border
                                 ${bill.status === "POSTED" ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-gray-50 text-gray-400 border-gray-100"}`}
                    >
                      {bill.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button
                      onClick={() => openSettlement(bill)}
                      className="px-5 py-2.5 bg-[#111827] text-white rounded-xl text-[10px] font-black font-subheading uppercase tracking-widest hover:bg-[#000000] transition-all shadow-xl shadow-gray-200"
                    >
                      Issue Payment
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="p-10 bg-gray-50 rounded-[40px] border border-gray-100 flex items-center justify-between text-left">
        <div className="text-left">
          <h4 className="text-sm font-black font-subheading text-[#111827] uppercase tracking-[0.1em] mb-1 text-left">
            Operational Protocol
          </h4>
          <p className="text-xs font-bold font-body text-gray-500 leading-relaxed max-w-xl text-left">
            Issuing a payment will immediately deduct funds from the Primary
            Reserve and reconcile the General Ledger. All tax credits associated
            with this purchase will be finalized.
          </p>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#111827]/90 backdrop-blur-xl z-[9999] flex items-center justify-center p-6 animate-in zoom-in duration-300">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20">
            <div className="p-10 border-b border-gray-100 bg-[#F8FAFC]">
              <h2 className="text-2xl font-black font-heading text-[#111827] tracking-tighter text-left">
                Disbursement Terminal
              </h2>
              <p className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest mt-1 text-left">
                Authorizing payment for {selectedBill?.vendor_name} —{" "}
                {selectedBill?.reference}
              </p>
            </div>
            <form onSubmit={handleSettle} className="p-10 space-y-8 text-left">
              <div className="p-8 bg-rose-50/50 rounded-[32px] border border-rose-100/50 text-left">
                <p className="text-[10px] font-black font-subheading text-rose-400 uppercase tracking-widest mb-2 text-left">
                  Principal Settlement Sum
                </p>
                <p className="text-4xl font-black font-heading text-rose-500 tracking-tighter text-left">
                  ${formatNumber(selectedBill?.total_amount || 0)}
                </p>
              </div>

              <div className="space-y-4 text-left">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1 text-left">
                  Funding Method
                </label>
                <div className="grid grid-cols-2 gap-4 text-left">
                  {[
                    "Bank Wire",
                    "Credit Line",
                    "Fleet Card",
                    "Treasury Check",
                  ].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`py-4 rounded-2xl text-[10px] font-black font-subheading uppercase tracking-widest border transition-all text-left
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
                  className="flex-[2] bg-[#111827] text-white py-5 rounded-2xl text-[11px] font-black font-subheading uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all"
                >
                  Authorize Outflow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
