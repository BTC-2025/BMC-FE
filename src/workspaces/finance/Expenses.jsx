import { useFinance } from "../../context/FinanceContext";
import { useInventory } from "../../context/InventoryContext"; // Access suppliers
import { useState, useMemo } from "react";
import { formatNumber } from "../../utils/formatters";

export default function ExpensesView() {
  const { expenses, recordExpense, postBill, downloadBillPDF } = useFinance();
  const { suppliers = [] } = useInventory() || {};

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    supplier: "",
    reference: "",
    category: "Operational",
    lines: [{ description: "", quantity: 1, unit_price: 0 }],
  });

  const totalAmount = useMemo(() => {
    return formData.lines.reduce(
      (acc, line) => acc + line.quantity * line.unit_price,
      0,
    );
  }, [formData.lines]);

  const handleAddLine = () => {
    setFormData({
      ...formData,
      lines: [
        ...formData.lines,
        { description: "", quantity: 1, unit_price: 0 },
      ],
    });
  };

  const handleRemoveLine = (index) => {
    const newLines = formData.lines.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      lines: newLines.length
        ? newLines
        : [{ description: "", quantity: 1, unit_price: 0 }],
    });
  };

  const handleLineChange = (index, field, value) => {
    const newLines = [...formData.lines];
    newLines[index][field] = value;
    setFormData({ ...formData, lines: newLines });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await recordExpense({
        ...formData,
        amount: totalAmount,
        status: "Disbursed",
      });
      setShowModal(false);
      setFormData({
        supplier: "",
        reference: "",
        category: "Operational",
        lines: [{ description: "", quantity: 1, unit_price: 0 }],
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePost = async (e, id) => {
    e.stopPropagation();
    try {
      await postBill(id);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1">
          <h2 className="text-4xl font-black font-heading text-[#111827] tracking-tighter leading-none text-left">
            Operational Costs
          </h2>
          <p className="text-[11px] font-black font-subheading text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 text-left">
            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]"></span>
            Expense Tracking & Variance Ledger
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#000000] text-white px-8 py-4 rounded-[20px] text-[11px] font-black font-subheading uppercase tracking-[0.15em] shadow-xl transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3"
        >
          + Log Expense
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden text-left relative group">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr className="bg-[#F8FAFC]">
              <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em] text-left">
                Category / Details
              </th>
              <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em] text-left">
                Magnitude
              </th>
              <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em] text-left">
                Status
              </th>
              <th className="px-8 py-6 text-right text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em]">
                Logged On
              </th>
              <th className="px-8 py-6 text-right text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-left">
            {expenses.length > 0 ? (
              expenses.map((exp) => (
                <tr
                  key={exp.id}
                  className="hover:bg-blue-50/20 transition-all text-left"
                >
                  <td className="px-8 py-6 text-left">
                    <div className="font-black font-heading text-[#1E293B] text-base mb-0.5 text-left">
                      {exp.vendor || exp.vendor_name || "Unknown Vendor"}
                    </div>
                    <div className="text-[11px] font-medium font-body text-gray-400 text-left">
                      {exp.note} ·{" "}
                      <span className="text-gray-300">{exp.category}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-left">
                    <div className="text-base font-black font-heading text-[#111827] text-left">
                      ${formatNumber(exp.amount)}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-left">
                    <span
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-black font-subheading uppercase tracking-widest border
                                ${exp.status === "Reimbursed" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-blue-50 text-blue-600 border-blue-100"}`}
                    >
                      {exp.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="font-mono text-[11px] font-black font-body text-[#111827] text-right">
                      {exp.date}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => downloadBillPDF(exp.id)}
                        className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all border border-gray-100"
                        title="Download PDF"
                      >
                        📥
                      </button>
                      {exp.rawStatus === "DRAFT" && (
                        <button
                          onClick={(e) => handlePost(e, exp.id)}
                          className="px-4 py-2 bg-amber-500 text-white text-[9px] font-black font-subheading rounded-lg uppercase tracking-widest hover:bg-black transition-all"
                        >
                          Post
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-8 py-16 text-center">
                  <div className="text-[10px] font-black font-subheading text-gray-300 uppercase tracking-[0.4em]">
                    No expense records found
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-xl z-[9999] flex items-center justify-center p-6 animate-in zoom-in duration-300 overflow-y-auto">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden border border-white my-10">
            <div className="p-10 border-b border-gray-100 bg-[#F8FAFC] flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black font-heading text-[#111827] tracking-tighter text-left">
                  Log Outflow
                </h2>
                <p className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest mt-1 text-left">
                  Recording new operational expense
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-black text-2xl font-black"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-8 text-left">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest pl-1 text-left">
                    Vendor / Recipient
                  </label>
                  <select
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black font-body text-[#1E293B] outline-none appearance-none"
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
                    <option value="Miscellaneous">Miscellaneous</option>
                  </select>
                </div>
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest pl-1 text-left">
                    Classification
                  </label>
                  <select
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black font-body text-[#1E293B] outline-none appearance-none"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option>Marketing</option>
                    <option>Operational</option>
                    <option>Travel</option>
                    <option>Infrastructure</option>
                    <option>Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest text-left">
                    Itemization
                  </label>
                  <button
                    type="button"
                    onClick={handleAddLine}
                    className="text-[10px] font-black font-subheading text-[#195bac] uppercase tracking-widest hover:underline"
                  >
                    + Add Line
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.lines.map((line, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-3 items-end"
                    >
                      <div className="col-span-6">
                        <input
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[11px] font-black font-body text-[#1E293B] outline-none"
                          placeholder="Description / Detail"
                          required
                          value={line.description}
                          onChange={(e) =>
                            handleLineChange(idx, "description", e.target.value)
                          }
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[11px] font-black font-body text-[#1E293B] outline-none text-center"
                          placeholder="Qty"
                          required
                          value={line.quantity}
                          onChange={(e) =>
                            handleLineChange(
                              idx,
                              "quantity",
                              parseFloat(e.target.value),
                            )
                          }
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[11px] font-black font-body text-[#1E293B] outline-none"
                          placeholder="Amount"
                          required
                          value={line.unit_price}
                          onChange={(e) =>
                            handleLineChange(
                              idx,
                              "unit_price",
                              parseFloat(e.target.value),
                            )
                          }
                        />
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveLine(idx)}
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all border border-rose-100"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-[#111827] rounded-[32px] flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black font-subheading text-rose-400 uppercase tracking-widest mb-1">
                    Total Fiscal Impact
                  </p>
                  <p className="text-3xl font-[1000] font-heading text-white tracking-tighter">
                    ${formatNumber(totalAmount)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold text-gray-500 leading-relaxed uppercase">
                    Auto-generating purchase bill
                    <br />
                    on secure ledger synchronization
                  </p>
                </div>
              </div>

              <div className="pt-6 flex gap-4 text-left">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Abort
                </button>
                <button
                  type="submit"
                  className="flex-[2] bg-[#000000] text-white py-5 rounded-2xl text-[11px] font-black font-subheading uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all"
                >
                  Command Outflow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
