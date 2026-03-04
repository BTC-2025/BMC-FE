import { useInventory } from "../../context/InventoryContext";
import { useState } from "react";
import { formatNumber } from "../../utils/formatters";

export default function Warehouses() {
  const { warehouses, addWarehouse, updateWarehouse, removeWarehouse } = useInventory();
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", location: "", id: "" });

  const openAdd = () => {
    setEditMode(false);
    setFormData({ name: "", location: "", id: "" });
    setShowModal(true);
  };

  const openEdit = (wh) => {
    setEditMode(true);
    setFormData(wh);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
        updateWarehouse(formData.id, formData);
    } else {
        addWarehouse(formData);
    }
    setShowModal(false);
  };

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1 text-left">
            <h2 className="text-4xl font-black text-[#111827] tracking-tighter leading-none">Storage & <span className="text-[#195bac]">Logistics Nodes</span></h2>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                Physical Asset Distribution & Facility Management
            </p>
        </div>
        <button 
            onClick={openAdd}
            className="bg-[#195bac] text-white px-8 py-4 rounded-[24px] text-[11px] font-black uppercase tracking-[0.15em] shadow-[0_15px_30px_-10px_rgba(25,91,172,0.4)] transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3"
        >
            <span className="text-xl leading-none">+</span>
            Initialize Facility
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
          {warehouses.map(wh => (
              <div key={wh.id} className="group bg-white rounded-[48px] border border-gray-100 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-700 overflow-hidden relative flex flex-col min-h-[320px]">
                  {/* Decorative Gradient Top Bar */}
                  <div className="h-2 w-full bg-gradient-to-r from-[#195bac]/5 via-[#195bac]/20 to-[#195bac]/5"></div>
                  
                  <div className="p-10 bg-gray-50/30 border-b border-gray-50 flex items-start justify-between relative z-10">
                      <div className="text-left">
                          <h3 className="text-2xl font-[1000] text-[#111827] tracking-tight mb-1">{wh.name}</h3>
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                             {wh.location}
                          </p>
                      </div>
                      <div className="text-right flex flex-col items-end">
                          <div className="text-3xl font-[1000] text-[#195bac] tabular-nums tracking-tighter leading-none mb-1">{formatNumber(wh.stockCount)}</div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest opacity-60">Total Latency Units</p>
                      </div>
                  </div>

                  <div className="p-10 flex-1 flex flex-col justify-between relative z-10">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">
                            <span>Logical Sub-Zones</span>
                            <div className="flex gap-1">
                                <span className="w-1 h-1 rounded-full bg-blue-500 animate-pulse"></span>
                                <span className="w-1 h-1 rounded-full bg-blue-500/40"></span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-[24px] border border-gray-100 hover:border-[#195bac]/20 transition-all group/item cursor-pointer">
                                <p className="text-[12px] font-black text-[#111827] mb-0.5">ZONE_ALPHA</p>
                                <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Operational</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-[24px] border border-gray-100 hover:border-[#195bac]/20 transition-all group/item cursor-pointer">
                                <p className="text-[12px] font-black text-[#111827] mb-0.5">COLD_STORAGE</p>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Idle</p>
                            </div>
                        </div>
                      </div>

                      <div className="mt-8 flex items-center justify-between pt-8 border-t border-gray-50">
                          <div className="flex gap-3">
                             <button onClick={() => openEdit(wh)} className="w-10 h-10 rounded-xl bg-blue-50 text-[#195bac] flex items-center justify-center hover:bg-[#195bac] hover:text-white transition-all shadow-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                             </button>
                             <button onClick={() => removeWarehouse(wh.id)} className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                             </button>
                          </div>
                          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">ID: {wh.id}</span>
                      </div>
                  </div>

                  {/* Geometric Watermark */}
                  <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-blue-50/40 group-hover:scale-150 transition-transform duration-[2000ms] pointer-events-none"></div>
              </div>
          ))}

          {/* New Initiative Placeholder */}
          <div 
            onClick={openAdd}
            className="group rounded-[48px] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center p-12 hover:border-[#195bac]/40 hover:bg-blue-50/10 transition-all cursor-pointer min-h-[320px]"
          >
              <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-6 group-hover:bg-[#195bac] group-hover:text-white transition-all duration-500 group-hover:scale-110 shadow-sm border border-gray-100 group-hover:border-transparent">
                <span className="text-4xl leading-none font-light">+</span>
              </div>
              <p className="text-[11px] font-[1000] text-gray-400 uppercase tracking-[0.3em] group-hover:text-[#195bac] transition-colors">Expand Network Node</p>
          </div>
      </div>

      {showModal && (
          <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-xl z-[9999] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
              <div className="bg-white rounded-[48px] shadow-2xl w-full max-w-xl overflow-hidden border border-white">
                  <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                      <div className="text-left space-y-1">
                        <h2 className="text-2xl font-black text-[#111827] tracking-tighter leading-none">{editMode ? 'Synch Node Parameters' : 'Provision Hub Node'}</h2>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Facility Infrastructure Deployment</p>
                      </div>
                      <button onClick={() => setShowModal(false)} className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-rose-500 transition-all shadow-sm font-black">✕</button>
                  </div>
                  <form onSubmit={handleSubmit} className="p-12 space-y-8 text-left bg-white">
                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">Facility Designation</label>
                          <input 
                            className="w-full bg-gray-50 border border-gray-200 rounded-[20px] px-8 py-5 text-base font-black text-[#1E293B] focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-gray-300" 
                            required 
                            placeholder="e.g. Northern Distribution Hub"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})} 
                          />
                      </div>
                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">Geographic Coordinates (City/Region)</label>
                          <input 
                            className="w-full bg-gray-50 border border-gray-200 rounded-[20px] px-8 py-5 text-base font-black text-[#1E293B] focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-gray-300" 
                            required 
                            placeholder="e.g. Berlin, DE"
                            value={formData.location}
                            onChange={e => setFormData({...formData, location: e.target.value})} 
                          />
                      </div>
                      <div className="pt-6">
                        <button type="submit" className="w-full bg-[#111827] text-white py-6 rounded-[24px] text-[11px] font-black uppercase tracking-[0.25em] shadow-2xl transition-all hover:-translate-y-1 hover:bg-black active:scale-95">
                          {editMode ? 'Commit Parameter Sync' : 'Initialize Fleet Node'}
                        </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
}


