import { useState } from "react";
import { useFinance } from "../../context/FinanceContext";
import { useInventory } from "../../context/InventoryContext";
import { formatNumber } from "../../utils/formatters";
import InvoiceTemplate from "../finance/InvoiceTemplate";

export default function Bills() {
  const { bills, addBill, updateBill, removeBill, postBill } = useFinance();
  const { suppliers } = useInventory();
  const [showModal, setShowModal] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    supplier: suppliers[0]?.name || "",
    amount: 0,
    status: "Draft",
  });

  const openAdd = () => {
    setEditMode(false);
    setFormData({
      id: null,
      supplier: suppliers[0]?.name || "",
      amount: 0,
      status: "Draft",
    });
    setShowModal(true);
  };

  const openEdit = (bill) => {
    setEditMode(true);
    setFormData({
      id: bill.id,
      supplier: bill.vendor_name || bill.supplier || "",
      amount: bill.total_amount || bill.amount || 0,
      status: bill.status || "Draft",
    });
    setShowModal(true);
  };

  const handleView = (bill) => {
    // Map bill to template format
    setSelectedBill({
      ...bill,
      target: bill.vendor_name || bill.supplier,
      amount: bill.total_amount || bill.amount || 0,
      date: bill.invoice_date || bill.date || "2024-xx-xx",
      type: "Purchasing", // Used in template description
      tax: (bill.total_amount || bill.amount || 0) * 0.1,
    });
    setShowTemplate(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      updateBill(formData.id, formData);
    } else {
      addBill(formData);
    }
    setShowModal(false);
  };

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      {/* Header & Tools */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1">
          <h2 className="text-4xl font-black text-[#111827] tracking-tighter">
            Purchase <span className="text-rose-500">Bills</span>
          </h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"></span>
            Accounts Payable & Expenditure Sync
          </p>
        </div>
        <button
          onClick={openAdd}
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
          Record Bill
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8FAFC]">
                <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">
                  Bill Ref
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">
                  Strategic Vendor
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">
                  Record Date
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">
                  Liability Value
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">
                  Sync Status
                </th>
                <th className="px-8 py-6 text-right text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">
                  Operational Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bills.map((bill) => {
                const supplierName =
                  bill.vendor_name ||
                  bill.supplier ||
                  "Vendor #" + (bill.vendor_id || "Unknown");
                const dateText = bill.invoice_date || bill.date || "2024-xx-xx";
                const amount = bill.total_amount || bill.amount || 0;
                const rawStatus = bill.status;

                return (
                  <tr
                    key={bill.id}
                    className="hover:bg-rose-50/10 transition-all group"
                  >
                    <td className="px-8 py-6">
                      <span className="font-mono text-[11px] font-black text-rose-500 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100 group-hover:bg-white transition-colors uppercase">
                        {bill.id}
                      </span>
                    </td>
                    <td className="px-8 py-6 font-black text-[#111827] text-sm">
                      {supplierName}
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-gray-400 tabular-nums">
                      {dateText}
                    </td>
                    <td className="px-8 py-6 font-mono text-sm font-black text-[#1E293B]">
                      ${formatNumber(amount)}
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                          rawStatus === "PAID"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : rawStatus === "POSTED"
                              ? "bg-blue-50 text-blue-600 border-blue-100"
                              : "bg-gray-50 text-gray-400 border-gray-100"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            rawStatus === "PAID"
                              ? "bg-emerald-500"
                              : rawStatus === "POSTED"
                                ? "bg-blue-500"
                                : "bg-gray-400"
                          }`}
                        ></span>
                        {rawStatus}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleView(bill)}
                          className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                          title="View Bill Template"
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

                        {rawStatus === "DRAFT" && (
                          <>
                            <button
                              onClick={() => openEdit(bill)}
                              className="p-3 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                              title="Edit Bill"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                viewBox="0 0 24 24"
                              >
                                <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => {
                                if (
                                  confirm(
                                    "Are you sure you want to delete this bill?",
                                  )
                                ) {
                                  removeBill(bill.id);
                                }
                              }}
                              className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                              title="Delete Bill"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                viewBox="0 0 24 24"
                              >
                                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                            <button
                              onClick={() => postBill(bill.id)}
                              className="text-[10px] font-[1000] text-rose-500 uppercase tracking-[0.2em] bg-rose-50 px-6 py-3 rounded-2xl border border-rose-100 hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95"
                            >
                              Post
                            </button>
                          </>
                        )}
                        {rawStatus === "POSTED" && (
                          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                            Posted
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-xl z-[9999] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
          <div className="bg-white rounded-[48px] shadow-2xl w-full max-w-xl overflow-hidden border border-white text-left">
            <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-[#111827] tracking-tighter leading-none">
                  {editMode
                    ? "Configure Liability Record"
                    : "Record Purchase Bill"}
                </h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                  {editMode
                    ? `Modifying Bill Reference: ${formData.id}`
                    : "Accounts Payable Entry Configuration"}
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
                  Vendor Entity
                </label>
                <select
                  className="w-full bg-gray-50 border border-gray-200 rounded-[20px] px-8 py-5 text-base font-black text-[#1E293B] focus:ring-4 focus:ring-rose-50/50 outline-none transition-all"
                  required
                  value={formData.supplier}
                  onChange={(e) =>
                    setFormData({ ...formData, supplier: e.target.value })
                  }
                >
                  <option value="">Select Vendor</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">
                  Liability Amount ($)
                </label>
                <input
                  type="number"
                  className="w-full bg-gray-50 border border-gray-200 rounded-[20px] px-8 py-5 text-base font-black text-[#1E293B] focus:ring-4 focus:ring-rose-50/50 outline-none transition-all"
                  required
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: Number(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">
                  Lifecycle State
                </label>
                <select
                  className="w-full bg-gray-50 border border-gray-200 rounded-[20px] px-8 py-5 text-sm font-black text-[#1E293B] focus:ring-4 focus:ring-rose-50/50 outline-none"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option>Draft</option>
                  <option>Pending</option>
                  <option>Paid</option>
                </select>
              </div>
              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full bg-rose-500 text-white py-6 rounded-[24px] text-[11px] font-black uppercase tracking-[0.25em] shadow-2xl transition-all hover:-translate-y-1 hover:bg-rose-600 active:scale-95"
                >
                  {editMode
                    ? "Update Liability Record"
                    : "Commit Liability Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showTemplate && selectedBill && (
        <InvoiceTemplate
          invoice={selectedBill}
          onClose={() => setShowTemplate(false)}
        />
      )}
    </div>
  );
}
