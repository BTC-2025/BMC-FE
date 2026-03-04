import { useInventory } from "../../context/InventoryContext";
import { useState, useEffect } from "react";
import { formatNumber } from "../../utils/formatters";

export default function PurchaseOrders() {
  const {
    purchaseOrders,
    addPurchaseOrder,
    updatePurchaseOrder,
    removePurchaseOrder,
    suppliers,
    items,
    approvePurchaseOrder,
    receivePurchaseOrder,
    warehouses,
  } = useInventory();
  const products = items; // Bridge
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    supplier: "",
    product: "",
    qty: 0,
    value: 0,
    status: "Draft",
  });

  // Keep formData in sync if it's currently empty and data arrives
  useEffect(() => {
    if (!formData.supplier && suppliers.length > 0 && !editMode) {
      setFormData((prev) => ({ ...prev, supplier: suppliers[0].name }));
    }
  }, [suppliers, editMode]);

  useEffect(() => {
    if (!formData.product && items.length > 0 && !editMode) {
      setFormData((prev) => ({ ...prev, product: items[0].name }));
    }
  }, [items, editMode]);

  const openAdd = () => {
    setEditMode(false);
    setFormData({
      supplier: suppliers[0]?.name || "",
      product: products[0]?.name || "",
      qty: 0,
      value: 0,
      status: "Draft",
    });
    setShowModal(true);
  };

  const openEdit = (po) => {
    setEditMode(true);
    setFormData(po);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      updatePurchaseOrder(formData.id, formData);
    } else {
      addPurchaseOrder(formData);
    }
    setShowModal(false);
  };

  const handleReceive = (poId) => {
    const whId = warehouses[0]?.id || 1;
    receivePurchaseOrder(poId, whId);
  };

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      {/* Header & Tools */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1">
          <h2 className="text-4xl font-black text-[#111827] tracking-tighter">
            Purchase <span className="text-[#195bac]">Protocol</span>
          </h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#195bac]"></span>
            Inbound Asset Acquisition & Supplier Sync
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
          Generate PO
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8FAFC]">
                <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">
                  Order Ref
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">
                  Strategic Partner
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">
                  Asset units
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">
                  Valuation
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">
                  Lifecycle Status
                </th>
                <th className="px-8 py-6 text-right text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {purchaseOrders.map((po) => {
                // Bridge supplier and product if backend returned IDs
                const supplierName =
                  suppliers.find((s) => s.id === po.supplier_id)?.name ||
                  po.supplier ||
                  "Vendor #" + po.supplier_id;
                const productName =
                  items.find((i) => i.id === po.items?.[0]?.item_id)?.name ||
                  po.product ||
                  "Asset #" + po.items?.[0]?.item_id;
                const qty = po.items?.[0]?.quantity_ordered || po.qty || 0;

                return (
                  <tr
                    key={po.id}
                    className="hover:bg-blue-50/20 transition-all group"
                  >
                    <td className="px-8 py-6">
                      <span className="font-mono text-[11px] font-black text-[#1E293B] bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 group-hover:bg-white transition-colors uppercase">
                        {po.id}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-[14px] font-black text-[#1E293B]">
                        {supplierName}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 mt-0.5 uppercase tracking-tighter">
                        {productName}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-black text-[#1E293B] tabular-nums">
                        {qty}
                      </span>
                      <span className="ml-1 text-[10px] font-black text-gray-400 uppercase">
                        pcs
                      </span>
                    </td>
                    <td className="px-8 py-6 font-mono text-sm font-black text-[#1E293B]">
                      ${formatNumber(Number(po.value || 0))}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-2">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                            po.status === "CLOSED"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : po.status === "APPROVED"
                                ? "bg-blue-50 text-blue-600 border-blue-100"
                                : "bg-amber-50 text-amber-600 border-amber-100"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              po.status === "CLOSED"
                                ? "bg-emerald-500"
                                : po.status === "APPROVED"
                                  ? "bg-blue-500"
                                  : "bg-amber-500"
                            }`}
                          ></span>
                          {po.status}
                        </span>
                        {po.status === "DRAFT" && (
                          <button
                            onClick={() => approvePurchaseOrder(po.id)}
                            className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                          >
                            Approve Now
                          </button>
                        )}
                        {po.status === "APPROVED" && (
                          <button
                            onClick={() => handleReceive(po.id)}
                            className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline"
                          >
                            Receive Assets
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                        <button
                          onClick={() => openEdit(po)}
                          className="w-10 h-10 rounded-xl bg-[#195bac]/10 text-[#195bac] flex items-center justify-center hover:bg-[#195bac] hover:text-white transition-all shadow-sm"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                          >
                            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => removePurchaseOrder(po.id)}
                          className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
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
          <div className="bg-white rounded-[48px] shadow-2xl w-full max-w-xl overflow-hidden border border-white">
            <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="text-left space-y-1">
                <h2 className="text-2xl font-black text-[#111827] tracking-tighter leading-none">
                  {editMode ? "Synch PO Data" : "Initialize Acquisition"}
                </h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                  Procurement Lifecycle Management
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-rose-500 transition-all shadow-sm font-black"
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={handleSubmit}
              className="p-12 space-y-8 text-left bg-white"
            >
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">
                    Strategic Vendor Partner
                  </label>
                  <select
                    className="w-full bg-gray-50 border border-gray-200 rounded-[20px] px-8 py-5 text-sm font-black text-[#1E293B] focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                    required
                    value={formData.supplier}
                    onChange={(e) =>
                      setFormData({ ...formData, supplier: e.target.value })
                    }
                  >
                    <option value="">Select Vendor Partner</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">
                    Asset Designation
                  </label>
                  <select
                    className="w-full bg-gray-50 border border-gray-200 rounded-[20px] px-8 py-5 text-sm font-black text-[#1E293B] focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                    required
                    value={formData.product}
                    onChange={(e) =>
                      setFormData({ ...formData, product: e.target.value })
                    }
                  >
                    <option value="">Select Asset Designation</option>
                    {products.map((p) => (
                      <option key={p.sku} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">
                    Vector Quantity
                  </label>
                  <input
                    type="number"
                    className="w-full bg-gray-50 border border-gray-200 rounded-[20px] px-8 py-5 text-base font-black text-[#1E293B] focus:ring-4 focus:ring-blue-50 outline-none"
                    required
                    value={formData.qty}
                    onChange={(e) =>
                      setFormData({ ...formData, qty: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">
                    Acquisition Unit Price ($)
                  </label>
                  <input
                    type="number"
                    className="w-full bg-gray-50 border border-gray-200 rounded-[20px] px-8 py-5 text-base font-black text-[#1E293B] focus:ring-4 focus:ring-blue-50 outline-none"
                    required
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({ ...formData, value: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">
                  Protocol Status
                </label>
                <select
                  className="w-full bg-gray-50 border border-gray-200 rounded-[20px] px-8 py-5 text-sm font-black text-[#1E293B] focus:ring-4 focus:ring-blue-50 outline-none"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option>Draft</option>
                  <option>In Transit</option>
                  <option>Received</option>
                </select>
              </div>
              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full bg-[#111827] text-white py-6 rounded-[24px] text-[11px] font-black uppercase tracking-[0.25em] shadow-2xl transition-all hover:-translate-y-1 hover:bg-black active:scale-95"
                >
                  {editMode
                    ? "Commit Order Sync"
                    : "Initialize Acquisition Vector"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
