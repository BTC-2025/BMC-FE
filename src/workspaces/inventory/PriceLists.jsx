import { useState, useEffect } from "react";
import { inventoryApi } from "../../services/inventoryApi";
import { useInventory } from "../../context/InventoryContext";
import BaseModal from "../../components/ui/BaseModal";

export default function PriceLists() {
  const { updatePriceList, deletePriceList } = useInventory();
  const [priceLists, setPriceLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingList, setEditingList] = useState(null); // null = create, object = edit
  const [formData, setFormData] = useState({ name: "", type: "SALES", currency: "USD" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPriceLists();
  }, []);

  const fetchPriceLists = async () => {
    try {
      const res = await inventoryApi.getPriceLists();
      setPriceLists(res.data);
    } catch (err) {
      console.error("Failed to fetch price lists:", err);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingList(null);
    setFormData({ name: "", type: "SALES", currency: "USD" });
    setError(null);
    setShowModal(true);
  };

  const openEdit = (pl) => {
    setEditingList(pl);
    setFormData({ name: pl.name, type: pl.type, currency: pl.currency });
    setError(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (editingList) {
        await updatePriceList(editingList.id, formData);
        // Optimistically update local state to avoid refetch
        setPriceLists((prev) => prev.map(p => p.id === editingList.id ? { ...p, ...formData } : p));
      } else {
        const res = await inventoryApi.createPriceList(formData);
        setPriceLists((prev) => [...prev, res.data]);
      }
      setShowModal(false);
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (pl) => {
    if (!window.confirm(`Delete price list "${pl.name}"? This cannot be undone.`)) return;
    try {
      await deletePriceList(pl.id);
      setPriceLists((prev) => prev.filter(p => p.id !== pl.id));
    } catch (err) {
      alert(err?.response?.data?.detail || "Failed to delete price list");
    }
  };

  if (loading) return (
    <div className="p-10 flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-[#111827] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 text-left">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-gray-100">
        <div className="space-y-2">
            <h2 className="text-5xl font-[1000] text-[#111827] tracking-tighter leading-none">Commercial <span className="text-[#195bac]">Tiers</span></h2>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                Dynamic Valuation & Multi-Currency Pricing Ledger
            </p>
        </div>
        <button 
          onClick={openCreate}
          className="bg-[#111827] text-white px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all hover:-translate-y-1 hover:bg-black active:scale-95 flex items-center gap-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
            Create Price List
        </button>
      </div>

      {priceLists.length === 0 ? (
        <div className="py-32 text-center rounded-[48px] bg-gray-50/50 border border-dashed border-gray-200">
           <div className="w-24 h-24 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6 text-4xl">🏷️</div>
           <p className="text-lg font-black text-gray-400 uppercase tracking-widest">No pricing schemas defined</p>
        </div>
      ) : (
        <div className="bg-white rounded-[48px] border border-gray-100 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.03)] overflow-hidden">
          <table className="w-full text-left">
              <thead>
                  <tr className="bg-[#F8FAFC]">
                      <th className="px-10 py-8 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.3em] rounded-tl-[48px]">Schema UID</th>
                      <th className="px-10 py-8 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.3em]">Valuation Name</th>
                      <th className="px-10 py-8 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.3em]">Channel Type</th>
                      <th className="px-10 py-8 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.3em]">Currency</th>
                      <th className="px-10 py-8 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.3em]">Protocol</th>
                      <th className="px-10 py-8 text-right text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.3em] rounded-tr-[48px]">Actions</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                  {priceLists.map((pl) => (
                      <tr key={pl.id} className="hover:bg-[#195bac]/[0.02] transition-all group">
                          <td className="px-10 py-8 font-mono text-[11px] font-[1000] text-[#1E293B] tabular-nums tracking-tighter">PL-{String(pl.id).padStart(4, '0')}</td>
                          <td className="px-10 py-8">
                            <p className="text-sm font-black text-[#111827]">{pl.name}</p>
                            <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">Primary Market Rate</p>
                          </td>
                          <td className="px-10 py-8">
                              <span className={`text-[9px] font-[1000] px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-sm border ${
                                  pl.type === 'SALES' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                  pl.type === 'PURCHASE' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                  'bg-gray-50 text-gray-500 border-gray-100'
                              }`}>
                                  {pl.type}
                              </span>
                          </td>
                          <td className="px-10 py-8 font-mono text-sm font-black text-[#1E293B]">{pl.currency}</td>
                          <td className="px-10 py-8">
                              <div className="flex items-center gap-2">
                                  <div className={`w-1.5 h-1.5 rounded-full ${pl.is_active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-gray-300'}`}></div>
                                  <span className={`text-[10px] font-black uppercase tracking-widest ${pl.is_active ? 'text-emerald-500' : 'text-gray-400'}`}>
                                      {pl.is_active ? 'Encoded' : 'Disabled'}
                                  </span>
                              </div>
                          </td>
                          <td className="px-10 py-8">
                              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                                  <button
                                      onClick={() => openEdit(pl)}
                                      className="w-10 h-10 rounded-xl bg-[#195bac]/10 text-[#195bac] flex items-center justify-center hover:bg-[#195bac] hover:text-white transition-all shadow-sm"
                                      title="Edit Price List"
                                  >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                          <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                  </button>
                                  <button
                                      onClick={() => handleDelete(pl)}
                                      className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                      title="Delete Price List"
                                  >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                  </button>
                              </div>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <BaseModal isOpen={showModal} onClose={() => setShowModal(false)} className="max-w-xl">
          <div className="p-10 border-b border-gray-100 flex items-center justify-between text-left">
              <div>
                <h2 className="text-3xl font-[1000] text-[#111827] tracking-tighter leading-none">
                  {editingList ? "Edit Price List" : "Price List Archetype"}
                </h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">
                  {editingList ? `Updating: ${editingList.name}` : "Valuation Schema Configuration"}
                </p>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-xl hover:bg-rose-50 hover:text-rose-500 transition-all font-black"
              >
                ✕
              </button>
          </div>
          <form onSubmit={handleSubmit} className="p-12 space-y-8 text-left bg-white">
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-[12px] font-bold text-rose-600">
                {error}
              </div>
            )}
            <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">List Identity</label>
                <input
                  type="text"
                  placeholder="e.g. Q1 Global Wholesale"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-[24px] px-8 py-5 text-base font-black text-[#1E293B] focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-gray-300"
                  required
                />
            </div>
            <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Channel Vector</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-100 rounded-[24px] px-8 py-5 text-sm font-black text-[#1E293B] focus:ring-4 focus:ring-blue-50 outline-none"
                    >
                      <option value="SALES">Sales</option>
                      <option value="PURCHASE">Purchase</option>
                      <option value="INTERNAL">Internal</option>
                    </select>
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Base Currency</label>
                    <input
                      type="text"
                      placeholder="USD"
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value.toUpperCase() })}
                      className="w-full bg-gray-50 border border-gray-100 rounded-[24px] px-8 py-5 text-base font-black text-[#1E293B] focus:ring-4 focus:ring-blue-50 outline-none"
                      maxLength={3}
                    />
                </div>
            </div>
            <button 
              type="submit" 
              disabled={saving}
              className="w-full bg-[#111827] text-white py-6 rounded-[28px] text-[11px] font-black uppercase tracking-[0.25em] shadow-2xl hover:bg-black transition-all active:scale-95 disabled:opacity-60"
            >
              {saving ? "Processing..." : editingList ? "Save Changes" : "Deploy Pricing Schema"}
            </button>
          </form>
      </BaseModal>
    </div>
  );
}
