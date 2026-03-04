import { useState } from "react";
import { useSupplyChain } from "../../context/SupplyChainContext";

export default function NewOrderModal({ isOpen, onClose, onSubmit }) {
  const { suppliers, inventory: items = [] } = useSupplyChain();

  const [formData, setFormData] = useState({
    supplier_id: "",
    item_id: "",
    qty: 0,
    urge: "Medium",
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Map to backend schema: { supplier_id: int, items: [{ item_id: int, quantity: int }] }
    const payload = {
      supplier_id: parseInt(formData.supplier_id),
      items: [
        {
          item_id: parseInt(formData.item_id),
          quantity: parseInt(formData.qty),
        },
      ],
    };
    onSubmit(payload);
    onClose();
    setFormData({ supplier_id: "", item_id: "", qty: 0, urge: "Medium" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200 text-left">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-gray-900 leading-none">
              New Purchase Order
            </h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-3">
              Create Requisition
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
              Select Supplier
            </label>
            <select
              required
              className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-cyan-500 hover:bg-white border-2 rounded-xl text-sm font-bold transition-all outline-none"
              value={formData.supplier_id}
              onChange={(e) =>
                setFormData({ ...formData, supplier_id: e.target.value })
              }
            >
              <option value="">Choose a Supplier</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.realId || s.id.split("-")[1]}>
                  {s.name} ({s.location})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                Select Item
              </label>
              <select
                required
                className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-cyan-500 hover:bg-white border-2 rounded-xl text-sm font-bold transition-all outline-none"
                value={formData.item_id}
                onChange={(e) =>
                  setFormData({ ...formData, item_id: e.target.value })
                }
              >
                <option value="">Choose an Item</option>
                {items.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.sku} - {i.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                Quantity
              </label>
              <input
                type="number"
                required
                min="1"
                className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-cyan-500 hover:bg-white border-2 rounded-xl text-sm font-bold transition-all outline-none"
                placeholder="e.g. 500"
                value={formData.qty}
                onChange={(e) =>
                  setFormData({ ...formData, qty: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
              Urgency
            </label>
            <div className="flex gap-3">
              {["Low", "Medium", "High"].map((u) => (
                <button
                  type="button"
                  key={u}
                  onClick={() => setFormData({ ...formData, urge: u })}
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all
                          ${
                            formData.urge === u
                              ? "border-cyan-500 bg-cyan-50 text-cyan-700"
                              : "border-gray-100 bg-white text-gray-400 hover:border-gray-200"
                          }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-cyan-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-cyan-700 shadow-xl shadow-cyan-200 transition-all mt-4"
          >
            Submit Requisition
          </button>
        </form>
      </div>
    </div>
  );
}
