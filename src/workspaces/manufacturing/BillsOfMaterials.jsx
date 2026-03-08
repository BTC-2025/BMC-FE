import { useState, useEffect } from "react";
import { useManufacturing } from "../../context/ManufacturingContext";

function CreateBOMModal({ isOpen, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [finishedItemId, setFinishedItemId] = useState("");
  const [items, setItems] = useState([{ raw_item_id: "", quantity_required: 1 }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const addItem = () => setItems((p) => [...p, { raw_item_id: "", quantity_required: 1 }]);
  const removeItem = (i) => setItems((p) => p.filter((_, idx) => idx !== i));
  const updateItem = (i, field, val) =>
    setItems((p) => p.map((item, idx) => (idx === i ? { ...item, [field]: val } : item)));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name || !finishedItemId) { setError("Name and Finished Item ID are required"); return; }
    const validItems = items.filter((it) => it.raw_item_id);
    if (validItems.length === 0) { setError("Add at least one component item"); return; }
    setLoading(true);
    try {
      await onSubmit({
        name,
        finished_item_id: parseInt(finishedItemId),
        items: validItems.map((it) => ({ raw_item_id: parseInt(it.raw_item_id), quantity_required: parseFloat(it.quantity_required) })),
      });
      onClose();
      setName(""); setFinishedItemId(""); setItems([{ raw_item_id: "", quantity_required: 1 }]);
    } catch (err) {
      setError(err.message || "Failed to create BOM");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-black text-gray-900 mb-6">New Bill of Materials</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">BOM Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-amber-400" placeholder="e.g. Standard Office Chair v2" required />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Finished Item ID (from Inventory)</label>
            <input type="number" min={1} value={finishedItemId} onChange={(e) => setFinishedItemId(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-amber-400" placeholder="Item ID" required />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Component Items</label>
              <button type="button" onClick={addItem} className="text-[10px] font-black text-amber-600 uppercase tracking-widest hover:underline">+ Add Row</button>
            </div>
            {items.map((item, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input type="number" min={1} placeholder="Item ID" value={item.raw_item_id} onChange={(e) => updateItem(i, "raw_item_id", e.target.value)} className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:border-amber-400" />
                <input type="number" min={0.01} step="0.01" placeholder="Qty" value={item.quantity_required} onChange={(e) => updateItem(i, "quantity_required", e.target.value)} className="w-24 border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:border-amber-400" />
                {items.length > 1 && (
                  <button type="button" onClick={() => removeItem(i)} className="px-2 text-red-400 hover:text-red-600">✕</button>
                )}
              </div>
            ))}
          </div>

          {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-black text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-3 bg-amber-500 text-white rounded-xl text-sm font-black disabled:opacity-50 hover:bg-amber-600">
              {loading ? "Creating…" : "Create BOM"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function BillsOfMaterials() {
  const { boms, createBOM, deleteBOM, loading } = useManufacturing();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (e.detail === "BOM") setModalOpen(true);
    };
    window.addEventListener("open-create-modal", handler);
    return () => window.removeEventListener("open-create-modal", handler);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-gray-900">Bills of Materials <span className="ml-2 text-sm font-bold text-gray-400">({boms.length})</span></h3>
        <button
          onClick={() => setModalOpen(true)}
          className="px-6 py-2.5 bg-amber-500 text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg shadow-amber-200"
        >
          + New BOM
        </button>
      </div>

      {!loading && boms.length === 0 && (
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-12 text-center">
          <p className="text-gray-400 font-bold text-sm">No BOMs yet. Create your first Bill of Materials!</p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        {boms.length > 0 && (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">BOM ID</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Name</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Finished Item</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Components</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Created</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest"></th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {boms.map((bom) => (
                <tr key={bom.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-5 font-black text-gray-900">BOM-{bom.id}</td>
                  <td className="px-6 py-5 font-bold text-gray-700">{bom.name}</td>
                  <td className="px-6 py-5 text-gray-500 font-medium">Item #{bom.finished_item_id}</td>
                  <td className="px-6 py-5 font-bold text-gray-900">{bom.items?.length ?? 0} items</td>
                  <td className="px-6 py-5 text-gray-400 font-medium">
                    {bom.created_at ? new Date(bom.created_at).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-6 py-5">
                    <button
                      onClick={() => window.confirm(`Delete ${bom.name}?`) && deleteBOM(bom.id)}
                      className="text-red-400 hover:text-red-600 font-black text-xs uppercase tracking-widest"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <CreateBOMModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={createBOM} />
    </div>
  );
}
