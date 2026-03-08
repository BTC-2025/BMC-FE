import { useState, useEffect } from "react";
import { useManufacturing } from "../../context/ManufacturingContext";

function CreateWOModal({ isOpen, onClose, onSubmit, boms }) {
  const [form, setForm] = useState({ bom_id: "", quantity_to_produce: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.bom_id) { setError("Please select a BOM"); return; }
    setLoading(true);
    setError("");
    try {
      await onSubmit({ bom_id: parseInt(form.bom_id), quantity_to_produce: parseInt(form.quantity_to_produce) });
      onClose();
      setForm({ bom_id: "", quantity_to_produce: 1 });
    } catch (err) {
      setError(err.message || "Failed to create work order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <h2 className="text-2xl font-black text-gray-900 mb-6">New Work Order</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Bill of Materials</label>
            <select
              value={form.bom_id}
              onChange={(e) => setForm((p) => ({ ...p, bom_id: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-amber-400"
              required
            >
              <option value="">Select BOM…</option>
              {boms.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Quantity to Produce</label>
            <input
              type="number"
              min={1}
              value={form.quantity_to_produce}
              onChange={(e) => setForm((p) => ({ ...p, quantity_to_produce: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-amber-400"
              required
            />
          </div>
          {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-black text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-3 bg-gray-900 text-white rounded-xl text-sm font-black disabled:opacity-50">
              {loading ? "Creating…" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const STATUS_FILTERS = ["All Orders", "Planned", "In Production", "Executed"];

export default function WorkOrders() {
  const { orders, boms, createOrder, deleteOrder, produce, loading } = useManufacturing();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All Orders");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    const handler = (e) => {
      if (e.detail === "WorkOrders" || e.detail === "Orders") setModalOpen(true);
    };
    window.addEventListener("open-create-modal", handler);
    return () => window.removeEventListener("open-create-modal", handler);
  }, []);

  const filtered = orders.filter((o) => {
    if (activeFilter === "All Orders") return true;
    if (activeFilter === "In Production") return o.status === "In Production";
    if (activeFilter === "Planned") return o.status === "Planned";
    if (activeFilter === "Executed") return o.status === "Executed";
    return true;
  });

  const handleProduce = async (realId, label) => {
    if (!window.confirm(`Start production for ${label}?`)) return;
    setActionError("");
    try {
      await produce(realId);
    } catch (err) {
      setActionError(err.message || "Production failed");
    }
  };

  const handleDelete = async (realId, label) => {
    if (!window.confirm(`Delete ${label}?`)) return;
    await deleteOrder(realId);
  };

  const statusColor = (s) =>
    s === "Executed" ? "bg-emerald-100 text-emerald-700" :
    s === "In Production" ? "bg-blue-100 text-blue-700" :
    "bg-amber-100 text-amber-700";

  return (
    <div className="space-y-6">
      {actionError && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm font-bold text-red-600">{actionError}</div>
      )}

      {/* Filter + Create */}
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                ${activeFilter === tab ? "bg-gray-900 text-white" : "bg-white border border-gray-100 text-gray-500 hover:border-amber-400 hover:text-amber-600"}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 bg-amber-500 text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg shadow-amber-200"
        >
          + New Work Order
        </button>
      </div>

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-12 text-center">
          <p className="text-gray-400 font-bold text-sm">No work orders found. Create your first one!</p>
        </div>
      )}

      {/* Work Order List */}
      <div className="space-y-4">
        {filtered.map((order) => (
          <div key={order.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-5">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl
                ${order.priority === "High" ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"}`}>
                {order.priority === "High" ? "🔥" : "📋"}
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-lg font-black text-gray-900">{order.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${statusColor(order.status)}`}>
                    {order.status}
                  </span>
                  {order.priority === "High" && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-600">High Priority</span>
                  )}
                </div>
                <p className="text-sm font-bold text-gray-600 mt-1">{order.product} <span className="text-gray-300 mx-2">|</span> {order.qty} Units</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Due: {order.due}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {order.status !== "Executed" && (
                <button
                  onClick={() => handleProduce(order.realId, order.id)}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50"
                >
                  Execute
                </button>
              )}
              <button
                onClick={() => handleDelete(order.realId, order.id)}
                className="p-2 border border-red-100 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-all"
                title="Delete"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      <CreateWOModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={createOrder}
        boms={boms}
      />
    </div>
  );
}
