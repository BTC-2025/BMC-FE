import { useInventory } from "../../context/InventoryContext";
import { useState } from "react";
import BaseModal from "../../components/ui/BaseModal";

export default function CategoriesView() {
  const { products, categories, addCategory, removeCategory } = useInventory();
  const [showModal, setShowModal] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  
  // Calculate counts dynamically for display
  const categoriesWithCounts = (categories || []).map(cat => ({
    ...cat,
    count: (products || []).filter(p => p.category === cat.name).length
  }));

  const handleAdd = (e) => {
    e.preventDefault();
    if (newCatName.trim()) {
      addCategory(newCatName.trim());
      setNewCatName("");
      setShowModal(false);
    }
  };

  return (
    <div className="p-10 max-w-[1600px] mx-auto space-y-12 animate-in fade-in duration-700 text-left">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1 text-left">
            <h2 className="text-4xl font-black text-[#111827] tracking-tighter leading-none">Taxonomy & <span className="text-[#195bac]">Classification</span></h2>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Asset Hierarchy & Logical Grouping
            </p>
        </div>
        <button 
            onClick={() => setShowModal(true)}
            className="bg-[#195bac] text-white px-8 py-4 rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3"
        >
            <span className="text-xl leading-none">+</span>
            Define Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categoriesWithCounts.map((cat, i) => (
            <div key={i} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] transition-all flex items-center justify-between group cursor-default">
                <div className="text-left">
                    <h3 className="font-black text-[#111827] text-xl mb-1">{cat.name}</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{cat.count} Registered Units</p>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => removeCategory(cat.name)}
                        className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 hidden group-hover:flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                        title="Delete Category"
                    >
                        🗑️
                    </button>
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                        <svg className="w-6 h-6 text-gray-300 group-hover:text-[#195bac]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M9 18l6-6-6-6" /></svg>
                    </div>
                </div>
            </div>
        ))}

        {/* Empty State / Add Suggestion */}
        {(categories || []).length < 6 && [1,2].map(x => (
            <div key={x} className="border-2 border-dashed border-gray-100 rounded-[40px] flex items-center justify-center p-8 opacity-40">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 text-xl font-black">
                    ?
                </div>
            </div>
        ))}
      </div>

      <BaseModal isOpen={showModal} onClose={() => setShowModal(false)} className="max-w-lg">
          <div className="p-10 border-b border-gray-100 bg-[#F8FAFC]">
            <h2 className="text-2xl font-black text-[#111827] tracking-tighter text-left">Define Asset Category</h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 text-left">Updating Asset Classification Logic</p>
          </div>
          <form onSubmit={handleAdd} className="p-10 space-y-8 text-left">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Category Label</label>
              <input 
                autoFocus
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-gray-300"
                placeholder="e.g. Raw Materials, Finished Goods..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                required
              />
            </div>
            <div className="pt-6 flex gap-4">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors">Abort</button>
              <button type="submit" className="flex-[2] bg-[#195bac] text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all">Create Class</button>
            </div>
          </form>
      </BaseModal>
    </div>
  );
}
