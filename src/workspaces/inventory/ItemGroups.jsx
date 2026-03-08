import { useState, useEffect } from "react";
import { inventoryApi } from "../../services/inventoryApi";
import BaseModal from "../../components/ui/BaseModal";

export default function ItemGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null); // null = create, object = edit
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await inventoryApi.getItemGroups();
      setGroups(res.data);
    } catch (err) {
      console.error("Failed to fetch item groups:", err);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingGroup(null);
    setFormData({ name: "", description: "" });
    setError(null);
    setShowModal(true);
  };

  const openEdit = (group) => {
    setEditingGroup(group);
    setFormData({ name: group.name, description: group.description || "" });
    setError(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (editingGroup) {
        const res = await inventoryApi.updateItemGroup(editingGroup.id, formData);
        setGroups((prev) => prev.map((g) => (g.id === editingGroup.id ? res.data : g)));
      } else {
        const res = await inventoryApi.createItemGroup(formData);
        setGroups((prev) => [res.data, ...prev]);
      }
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (group) => {
    if (!window.confirm(`Delete item group "${group.name}"? This cannot be undone.`)) return;
    try {
      await inventoryApi.deleteItemGroup(group.id);
      setGroups((prev) => prev.filter((g) => g.id !== group.id));
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to delete item group");
    }
  };

  if (loading) return (
    <div className="p-10 flex items-center justify-center min-h-[400px]">
      <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 text-left">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-gray-100">
        <div className="space-y-2">
          <h2 className="text-5xl font-[1000] text-[#111827] tracking-tighter leading-none">Resource <span className="text-[#195bac]">Clusters</span></h2>
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#195bac] shadow-[0_0_10px_rgba(25,91,172,0.5)]"></span>
            Taxonomy & Asset Classification Architecture
          </p>
        </div>
        <button
          onClick={openCreate}
          className="bg-[#111827] text-white px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all hover:-translate-y-1 hover:bg-black active:scale-95 flex items-center gap-4">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
          Initialize Cluster
        </button>
      </div>

      {groups.length === 0 ? (
        <div className="py-32 text-center rounded-[48px] bg-gray-50/50 border border-dashed border-gray-200">
          <div className="w-24 h-24 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6 text-4xl">📂</div>
          <p className="text-lg font-black text-gray-400 uppercase tracking-widest">No active clusters detected</p>
          <button onClick={openCreate} className="mt-8 text-blue-600 font-black uppercase tracking-widest text-[11px] hover:underline">Provision Initial Cluster →</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {groups.map((group) => (
            <div key={group.id} className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/30 rounded-bl-[100px] -mr-12 -mt-12 transition-all group-hover:bg-[#195bac]/10"></div>

              {/* Edit / Delete action buttons */}
              <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                <button
                  onClick={() => openEdit(group)}
                  className="w-9 h-9 rounded-xl bg-[#195bac]/10 text-[#195bac] flex items-center justify-center hover:bg-[#195bac] hover:text-white transition-all shadow-sm"
                  title="Edit Group"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(group)}
                  className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                  title="Delete Group"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <div className="flex justify-between items-start mb-10 relative z-10">
                <div className="w-16 h-16 bg-gray-50 rounded-[28px] flex items-center justify-center text-3xl font-[1000] text-[#111827] group-hover:bg-[#111827] group-hover:text-white transition-all duration-500 shadow-sm">
                  {group.name.charAt(0)}
                </div>
                <span className={`text-[9px] font-[1000] px-4 py-2 rounded-xl uppercase tracking-[0.2em] shadow-sm border ${
                  group.is_active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                }`}>
                  {group.is_active ? "Operational" : "Offline"}
                </span>
              </div>

              <div className="relative z-10">
                <h3 className="text-2xl font-[1000] text-[#111827] mb-3 tracking-tighter">{group.name}</h3>
                <p className="text-[13px] font-bold text-gray-400 mb-8 leading-relaxed line-clamp-3">
                  {group.description || "No classification parameters defined for this specific asset cluster."}
                </p>
                <div className="flex items-center justify-between pt-8 border-t border-gray-50">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[8px] font-black">📦</div>
                    ))}
                  </div>
                  <button className="text-[10px] font-black text-[#195bac] uppercase tracking-widest hover:underline">View Assets →</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <BaseModal isOpen={showModal} onClose={() => setShowModal(false)} className="max-w-xl">
        <div className="p-10 border-b border-gray-100 flex items-center justify-between text-left">
          <div>
            <h2 className="text-3xl font-[1000] text-[#111827] tracking-tighter leading-none">
              {editingGroup ? "Edit Cluster" : "Cluster Provisioning"}
            </h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">
              {editingGroup ? `Updating: ${editingGroup.name}` : "Initialize Resource Group"}
            </p>
          </div>
          <button onClick={() => setShowModal(false)} className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-xl hover:bg-rose-50 hover:text-rose-500 transition-all font-black">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-10 space-y-8 text-left bg-white">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-[12px] font-bold text-rose-600">{error}</div>
          )}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Cluster Label</label>
            <input
              type="text"
              placeholder="e.g. High-Velocity Components"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-gray-50 border border-gray-100 rounded-[24px] px-8 py-5 text-base font-black text-[#1E293B] focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-gray-300"
              required
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Operational Description</label>
            <textarea
              placeholder="Define scope and classification logic..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-gray-50 border border-gray-100 rounded-[28px] px-8 py-6 text-sm font-bold text-[#1E293B] focus:ring-4 focus:ring-blue-50 outline-none transition-all min-h-[140px] placeholder:text-gray-300"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#111827] text-white py-6 rounded-[28px] text-[11px] font-black uppercase tracking-[0.25em] shadow-2xl hover:bg-black transition-all active:scale-95 disabled:opacity-60"
          >
            {saving ? "Saving..." : editingGroup ? "Save Changes" : "Deploy Cluster Entry"}
          </button>
        </form>
      </BaseModal>
    </div>
  );
}
