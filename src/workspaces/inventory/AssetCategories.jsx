import { useState } from "react";
import { useInventory } from "../../context/InventoryContext";
import BaseModal from "../../components/ui/BaseModal";

export default function AssetCategories() {
  const {
    categories,
    addCategory,
    updateCategory,
    removeCategory,
    error,
    clearError,
  } = useInventory();

  const [showModal, setShowModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null); // null = create, object = edit
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const openCreate = () => {
    setEditingCat(null);
    setFormData({ name: "", description: "" });
    setLocalError(null);
    clearError?.();
    setShowModal(true);
  };

  const openEdit = (cat) => {
    setEditingCat(cat);
    setFormData({ name: cat.name, description: cat.description || "" });
    setLocalError(null);
    clearError?.();
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setLocalError(null);
    try {
      if (editingCat) {
        await updateCategory(editingCat.id, { name: formData.name, description: formData.description });
      } else {
        await addCategory(formData.name);
      }
      setShowModal(false);
    } catch (err) {
      setLocalError(err?.response?.data?.detail || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete category "${cat.name}"? Items assigned to it will become uncategorized.`)) return;
    await removeCategory(cat.id);
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1">
          <h2 className="text-4xl font-black text-[#111827] tracking-tighter">
            Asset <span className="text-[#195bac]">Categories</span>
          </h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#195bac]"></span>
            Classification & Taxonomy Management
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative group min-w-[280px]">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-[#195bac] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="3" />
            </svg>
            <input
              type="text"
              placeholder="Search categories..."
              className="w-full bg-white border border-gray-200 rounded-[20px] py-4 pl-12 pr-6 text-[13px] font-bold text-[#1E293B] focus:ring-4 focus:ring-blue-50/50 focus:border-[#195bac] transition-all outline-none placeholder:text-gray-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={openCreate}
            className="bg-[#195bac] text-white px-8 py-4 rounded-[20px] text-[11px] font-black uppercase tracking-[0.15em] shadow-[0_15px_30px_-10px_rgba(0,97,255,0.4)] transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Category
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8FAFC]">
                <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">ID</th>
                <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">Category Name</th>
                <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">Description</th>
                <th className="px-8 py-6 text-right text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length > 0 ? (
                filtered.map((cat) => (
                  <tr key={cat.id} className="hover:bg-blue-50/20 transition-all group">
                    <td className="px-8 py-5">
                      <span className="font-mono text-[11px] font-black text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                        #{cat.id}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#195bac]/10 to-[#195bac]/20 flex items-center justify-center text-[#195bac] font-black text-sm">
                          {cat.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-[14px] font-black text-[#1E293B]">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-[13px] font-bold text-gray-400">
                        {cat.description || <span className="italic text-gray-300">No description</span>}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                        <button
                          onClick={() => openEdit(cat)}
                          className="w-10 h-10 rounded-xl bg-[#195bac]/10 text-[#195bac] flex items-center justify-center hover:bg-[#195bac] hover:text-white transition-all shadow-sm"
                          title="Edit Category"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(cat)}
                          className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                          title="Delete Category"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center">
                    <div className="space-y-3">
                      <div className="text-4xl">🏷️</div>
                      <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">
                        {searchTerm ? "No categories match your search" : "No categories defined yet"}
                      </div>
                      {!searchTerm && (
                        <button onClick={openCreate} className="text-[#195bac] text-[11px] font-black uppercase tracking-widest hover:underline">
                          Add First Category →
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        {filtered.length > 0 && (
          <div className="px-8 py-4 border-t border-gray-50 bg-gray-50/50 flex items-center justify-between">
            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
              {filtered.length} {filtered.length === 1 ? "Category" : "Categories"}
            </span>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <BaseModal isOpen={showModal} onClose={() => setShowModal(false)} className="max-w-lg">
        <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-[#111827] tracking-tighter">
              {editingCat ? "Edit Category" : "New Category"}
            </h2>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">
              {editingCat ? `Updating: ${editingCat.name}` : "Define a new asset classification"}
            </p>
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-rose-500 hover:border-rose-100 transition-all shadow-sm"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6 bg-white">
          {(localError || error) && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-[12px] font-bold text-rose-600">
              {localError || error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">
              Category Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Electronics, Raw Materials..."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold text-[#1E293B] focus:ring-4 focus:ring-blue-50/30 focus:border-[#195bac] outline-none transition-all placeholder:text-gray-300"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">
              Description
            </label>
            <textarea
              placeholder="Optional description for this category..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold text-[#1E293B] focus:ring-4 focus:ring-blue-50/30 focus:border-[#195bac] outline-none transition-all min-h-[120px] placeholder:text-gray-300"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#1E293B] text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl transition-all hover:-translate-y-1 hover:bg-black active:scale-95 disabled:opacity-60"
          >
            {saving ? "Saving..." : editingCat ? "Save Changes" : "Create Category"}
          </button>
        </form>
      </BaseModal>
    </div>
  );
}
