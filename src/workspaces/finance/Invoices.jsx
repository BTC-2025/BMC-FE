import { useFinance } from "../../context/FinanceContext";
import { useCRM } from "../../context/CRMContext";
import { useInventory } from "../../context/InventoryContext";
import { useState, useMemo } from "react";
import { formatNumber } from "../../utils/formatters";
import InvoiceTemplate from "./InvoiceTemplate";

export default function InvoicesView({ autoOpen }) {
  const {
    invoices,
    addInvoice,
    recordPayment,
    postInvoice,
    downloadInvoicePDF,
  } = useFinance();
  const { customers: crmCustomers } = useCRM();
  const { items: inventoryItems } = useInventory();

  const [showModal, setShowModal] = useState(autoOpen || false);
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [viewInvoice, setViewInvoice] = useState(null);

  const [formData, setFormData] = useState({
    customer_id: "",
    customer_name: "",
    reference: "",
    lines: [{ description: "", quantity: 1, unit_price: 0, item_id: null }],
    type: "Sales",
  });

  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");

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
        { description: "", quantity: 1, unit_price: 0, item_id: null },
      ],
    });
  };

  const handleRemoveLine = (index) => {
    const newLines = formData.lines.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      lines: newLines.length
        ? newLines
        : [{ description: "", quantity: 1, unit_price: 0, item_id: null }],
    });
  };

  const handleLineChange = (index, field, value) => {
    const newLines = [...formData.lines];
    newLines[index][field] = value;

    // If an item is selected from inventory, auto-populate unit price
    if (field === "item_id" && value) {
      const item = inventoryItems.find((i) => i.id === parseInt(value));
      if (item) {
        newLines[index].description = item.name;
        newLines[index].unit_price = item.valuation_rate || 0;
      }
    }

    setFormData({ ...formData, lines: newLines });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addInvoice({
        ...formData,
        target: formData.customer_name,
        amount: totalAmount,
      });
      setShowModal(false);
      setFormData({
        customer_id: "",
        customer_name: "",
        reference: "",
        lines: [{ description: "", quantity: 1, unit_price: 0, item_id: null }],
        type: "Sales",
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSettle = async (e) => {
    e.preventDefault();
    try {
      await recordPayment({
        invoiceId: selectedInvoice.id,
        amount: selectedInvoice.amount + (selectedInvoice.tax || 0),
        type: selectedInvoice.type === "Sales" ? "Incoming" : "Outgoing",
        method: paymentMethod,
        target: selectedInvoice.target,
        date: new Date().toISOString().split("T")[0],
      });
      setShowSettleModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePost = async (e, id) => {
    e.stopPropagation();
    try {
      await postInvoice(id);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1 text-left">
          <h2 className="text-4xl font-[1000] font-heading text-[#111827] tracking-tighter leading-none text-left">
            Billing & Invoices
          </h2>
          <p className="text-[11px] font-[900] font-subheading text-[#195bac] uppercase tracking-[0.2em] flex items-center gap-2 text-left">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)] animate-pulse"></span>
            Commercial Transaction Ledger
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#111827] text-white px-10 py-5 rounded-[24px] text-[11px] font-black font-subheading uppercase tracking-[0.15em] shadow-2xl transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-1.5 border border-white/10"
        >
          <span className="text-lg leading-none">+</span>
          Generate Invoice
        </button>
      </div>

      <div className="bg-white rounded-[56px] border border-gray-100 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.06)] overflow-hidden text-left relative group">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-10 py-8 text-[11px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.3em] border-b border-gray-100">
                Entity / Client
              </th>
              <th className="px-10 py-8 text-[11px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.3em] border-b border-gray-100">
                Identity / Date
              </th>
              <th className="px-10 py-8 text-[11px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.3em] border-b border-gray-100">
                Financials
              </th>
              <th className="px-10 py-8 text-[11px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.3em] border-b border-gray-100">
                Status
              </th>
              <th className="px-10 py-8 text-right text-[11px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.3em] border-b border-gray-100 rounded-tr-[56px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-left">
            {invoices.length > 0 ? (
              invoices.map((inv) => (
                <tr
                  key={inv.id}
                  onClick={() => setViewInvoice(inv)}
                  className="hover:bg-[#195bac]/[0.02] transition-all duration-500 group/row cursor-pointer text-left"
                >
                  <td className="px-10 py-8">
                    <div className="font-[1000] font-heading text-[#1E293B] text-lg mb-1 tracking-tight text-left group-hover/row:text-[#195bac] transition-colors">
                      {inv.target}
                    </div>
                    <div className="font-[900] font-subheading text-[10px] text-gray-400 uppercase tracking-widest text-left">
                      Partner Node
                    </div>
                  </td>
                  <td className="px-10 py-8 text-left">
                    <div className="font-mono text-sm font-black text-[#1E293B] text-left tabular-nums tracking-tighter">
                      #{inv.id}
                    </div>
                    <div className="text-[11px] font-[900] text-gray-400 text-left uppercase tracking-widest mt-1">
                      {inv.date}
                    </div>
                  </td>
                  <td className="px-10 py-8 text-left">
                    <div className="text-xl font-[1000] font-heading text-[#111827] text-left tabular-nums tracking-tighter">
                      ${formatNumber(inv.amount)}
                    </div>
                    <div className="text-[10px] font-black font-subheading text-[#195bac] text-left mt-1 uppercase tracking-widest">
                      Incl. Tax Verification
                    </div>
                  </td>
                  <td className="px-10 py-8 text-left">
                    <span
                      className={`inline-flex items-center gap-2.5 px-5 py-2 rounded-xl text-[10px] font-black font-subheading uppercase tracking-widest border shadow-sm transition-all duration-500
                                    ${
                                      inv.status === "Paid"
                                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                        : inv.status === "Draft"
                                          ? "bg-amber-50 text-amber-600 border-amber-100"
                                          : "bg-rose-50 text-rose-600 border-rose-100"
                                    }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${inv.status === "Paid" ? "bg-emerald-500" : inv.status === "Draft" ? "bg-amber-500" : "bg-rose-500 animate-pulse"}`}
                      ></span>
                      {inv.status}
                    </span>
                  </td>
                  <td
                    className="px-10 py-8 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => downloadInvoicePDF(inv.id)}
                        className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all border border-gray-100"
                        title="Download PDF"
                      >
                        📥
                      </button>

                      {inv.rawStatus === "DRAFT" ? (
                        <button
                          onClick={(e) => handlePost(e, inv.id)}
                          className="px-6 py-3 bg-amber-500 text-white text-[10px] font-black font-subheading rounded-xl uppercase tracking-widest shadow-lg shadow-amber-500/10 hover:bg-black transition-all"
                        >
                          Post Invoice
                        </button>
                      ) : inv.status !== "Paid" ? (
                        <button
                          onClick={() => {
                            setSelectedInvoice(inv);
                            setShowSettleModal(true);
                          }}
                          className="px-6 py-3 bg-[#195bac] text-white text-[10px] font-black font-subheading rounded-xl uppercase tracking-widest shadow-lg shadow-blue-500/10 hover:bg-black transition-all"
                        >
                          Settle Now
                        </button>
                      ) : (
                        <span className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest">
                          Locked Ledger
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-10 py-20 text-center">
                  <div className="text-[11px] font-black font-subheading text-gray-300 uppercase tracking-[0.5em]">
                    No active ledger entries found
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="p-8 bg-gray-50/50 text-[10px] font-black font-subheading text-gray-400 uppercase tracking-[0.3em] text-center border-t border-gray-100">
          Selection of row initiates secure invoice visualization protocol
        </div>
      </div>

      {viewInvoice && (
        <InvoiceTemplate
          invoice={viewInvoice}
          onClose={() => setViewInvoice(null)}
        />
      )}

      {showModal && (
        <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-xl z-[9999] flex items-center justify-center p-6 animate-in zoom-in duration-300 overflow-y-auto">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-4xl overflow-hidden border border-white my-10">
            <div className="p-10 border-b border-gray-100 bg-[#F8FAFC] flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black font-heading text-[#111827] tracking-tighter text-left">
                  Generate Transaction
                </h2>
                <p className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest mt-1 text-left">
                  Issuing new commercial invoice
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
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest pl-1 text-left">
                    Counterparty Node
                  </label>
                  <select
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black font-body text-[#1E293B] outline-none appearance-none"
                    required
                    value={formData.customer_name}
                    onChange={(e) => {
                      const selected = crmCustomers.find(
                        (c) => c.name === e.target.value,
                      );
                      setFormData({
                        ...formData,
                        customer_name: e.target.value,
                        customer_id: selected?.id || "",
                      });
                    }}
                  >
                    <option value="">Select Partner</option>
                    {crmCustomers.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                    <option value="New Client">New Client (Manual)</option>
                  </select>
                  {formData.customer_name === "New Client" && (
                    <input
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black font-body text-[#1E293B] outline-none mt-2"
                      placeholder="Enter Client Name"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customer_name: e.target.value,
                        })
                      }
                    />
                  )}
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1 text-left">
                    Invoice Classification
                  </label>
                  <div className="flex gap-2">
                    {["Sales", "Purchase"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: t })}
                        className={`flex-1 py-4 rounded-2xl text-[10px] font-black font-subheading uppercase tracking-widest border transition-all
                          ${formData.type === t ? "bg-[#111827] text-white border-[#111827]" : "bg-white text-gray-400 border-gray-100 hover:border-gray-300"}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest text-left">
                    Line Itemization
                  </label>
                  <button
                    type="button"
                    onClick={handleAddLine}
                    className="text-[10px] font-black font-subheading text-[#195bac] uppercase tracking-widest hover:underline"
                  >
                    + Add New Line
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.lines.map((line, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-3 items-end animate-in slide-in-from-right-2 duration-300"
                    >
                      <div className="col-span-4 space-y-1">
                        <select
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[11px] font-black font-body text-[#1E293B] outline-none"
                          value={line.item_id || ""}
                          onChange={(e) =>
                            handleLineChange(idx, "item_id", e.target.value)
                          }
                        >
                          <option value="">Select Product...</option>
                          {inventoryItems.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                          <option value="custom">Manual Entry</option>
                        </select>
                      </div>
                      <div className="col-span-3">
                        <input
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[11px] font-black font-body text-[#1E293B] outline-none"
                          placeholder="Description"
                          value={line.description}
                          onChange={(e) =>
                            handleLineChange(idx, "description", e.target.value)
                          }
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[11px] font-black font-body text-[#1E293B] outline-none"
                          placeholder="Qty"
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
                      <div className="col-span-2">
                        <input
                          type="number"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[11px] font-black font-body text-[#1E293B] outline-none"
                          placeholder="Rate"
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

              <div className="flex items-center justify-between p-8 bg-[#111827] rounded-[32px] overflow-hidden relative group">
                <div className="relative z-10">
                  <p className="text-[10px] font-black font-subheading text-blue-400 uppercase tracking-widest mb-1">
                    Aggregate Settlement Value
                  </p>
                  <p className="text-4xl font-[1000] font-heading text-white tracking-tighter">
                    ${formatNumber(totalAmount)}
                  </p>
                </div>
                <div className="relative z-10 text-right">
                  <p className="text-[10px] font-bold text-gray-400 leading-relaxed uppercase tracking-tighter">
                    Tax Protocol: Standard 10% auto-accrual
                    <br />
                    applied on GH ledger synchronization
                  </p>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700"></div>
              </div>

              <div className="pt-6 flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Abort
                </button>
                <button
                  type="submit"
                  className="flex-[2] bg-[#000000] text-white py-5 rounded-2xl text-[11px] font-black font-subheading uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all border border-white/10"
                >
                  Synchronize & Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSettleModal && (
        <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-xl z-[9999] flex items-center justify-center p-6 animate-in zoom-in duration-300">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden border border-white">
            <div className="p-10 border-b border-gray-100 bg-[#F8FAFC]">
              <h2 className="text-2xl font-black font-heading text-[#111827] tracking-tighter text-left">
                Settle Invoice
              </h2>
              <p className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest mt-1 text-left">
                Recording settlement for {selectedInvoice?.id}
              </p>
            </div>
            <form onSubmit={handleSettle} className="p-10 space-y-8 text-left">
              <div className="p-8 bg-gray-50 rounded-[32px] border border-gray-100">
                <p className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest mb-2">
                  Total Settlement Principal
                </p>
                <p className="text-4xl font-black font-heading text-[#111827] tracking-tighter">
                  $
                  {formatNumber(
                    (selectedInvoice?.amount || 0) +
                      (selectedInvoice?.tax || 0),
                  )}
                </p>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest pl-1">
                  Settlement Method
                </label>
                <div className="grid grid-cols-2 gap-4">
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
              <div className="pt-6 flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowSettleModal(false)}
                  className="flex-1 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Abort
                </button>
                <button
                  type="submit"
                  className="flex-[2] bg-emerald-500 text-white py-5 rounded-2xl text-[11px] font-black font-subheading uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all"
                >
                  Confirm Settlement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
