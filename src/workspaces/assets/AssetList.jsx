import { useFinance } from "../../context/FinanceContext";
import { useState } from "react";
import { formatNumber } from "../../utils/formatters";

export default function AssetList() {
  const { assets, addAsset, removeAsset, updateAsset } = useFinance();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAsset, setNewAsset] = useState({ name: "", category: "IT Hardware", value: "", status: "Storage" });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addAsset(newAsset);
    setShowAddModal(false);
    setNewAsset({ name: "", category: "IT Hardware", value: "", status: "Storage" });
  };

  return (
    <div className="p-8 md:p-12 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500 text-left">
      {/* Header and Add Button */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-gray-100">
        <div className="space-y-2 text-left">
            <h2 className="text-4xl font-[1000] text-[#111827] tracking-tighter leading-none">Asset Registry</h2>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#195bac] animate-pulse"></span>
                Official Physical Capital Inventory
            </p>
        </div>
        <button 
            onClick={() => setShowAddModal(true)}
            className="group relative bg-[#195bac] text-white px-8 py-4 rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] shadow-[0_20px_40px_-10px_rgba(25,91,172,0.3)] hover:scale-105 active:scale-95 transition-all duration-500 overflow-hidden"
        >
            <span className="relative z-10">+ Register New Asset</span>
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </button>
      </div>

      {/* Main Registry Table */}
      <div className="bg-white rounded-[48px] border border-gray-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden text-left relative isolate">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent pointer-events-none"></div>
        <table className="w-full relative z-10">
          <thead>
            <tr className="border-b border-gray-100/50 bg-gray-50/30">
              <th className="px-10 py-8 text-[11px] font-black text-[#9CA3AF] uppercase tracking-[0.3em] text-left">Identity</th>
              <th className="px-10 py-8 text-[11px] font-black text-[#9CA3AF] uppercase tracking-[0.3em] text-left">Classification</th>
              <th className="px-10 py-8 text-[11px] font-black text-[#9CA3AF] uppercase tracking-[0.3em] text-left">Valuation</th>
              <th className="px-10 py-8 text-[11px] font-black text-[#9CA3AF] uppercase tracking-[0.3em] text-left">Status</th>
              <th className="px-10 py-8 text-right text-[11px] font-black text-[#9CA3AF] uppercase tracking-[0.3em]">Protocol</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50/80">
            {assets.map((a) => (
              <tr key={a.id} className="hover:bg-[#195bac]/[0.02] transition-all group cursor-pointer">
                <td className="px-10 py-7">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      {a.category === 'IT Hardware' ? '💻' : a.category === 'Furniture' ? '🪑' : '📦'}
                    </div>
                    <div>
                      <p className="text-[15px] font-[900] text-[#1E293B] group-hover:text-[#195bac] transition-colors">{a.name}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">ID: {a.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-7">
                  <span className="text-[11px] font-black text-gray-500 bg-gray-100/50 px-3 py-1.5 rounded-lg border border-gray-100 group-hover:bg-white transition-colors capitalize">{a.category}</span>
                </td>
                <td className="px-10 py-7">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[10px] font-black text-[#195bac] opacity-40">$</span>
                    <span className="text-[16px] font-[1000] text-[#111827] tracking-tighter">{formatNumber(a.value)}</span>
                  </div>
                </td>
                <td className="px-10 py-7">
                  <span className={`inline-flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest border rounded-xl shadow-sm transition-all duration-500
                    ${a.status === 'Allocated' ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' : 
                      a.status === 'Maintenance' ? 'bg-rose-50 text-rose-600 border-rose-100/50 animate-pulse' : 'bg-blue-50 text-blue-600 border-blue-100/50'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      a.status === 'Allocated' ? 'bg-emerald-500' : 
                      a.status === 'Maintenance' ? 'bg-rose-500' : 'bg-blue-500'
                    }`}></span>
                    {a.status}
                  </span>
                </td>
                <td className="px-10 py-7">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                      <button className="w-10 h-10 rounded-xl bg-blue-50 text-[#195bac] flex items-center justify-center hover:bg-[#195bac] hover:text-white transition-all shadow-sm border border-blue-100/30">✎</button>
                      <button onClick={() => removeAsset(a.id)} className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-rose-100/30">✕</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {assets.length === 0 && (
          <div className="p-20 text-center flex flex-col items-center">
             <div className="w-20 h-20 bg-gray-50 rounded-[28px] flex items-center justify-center text-4xl mb-6 border border-gray-100">🛰️</div>
             <p className="text-xl font-black text-gray-900 tracking-tight">No assets found in registry</p>
             <p className="text-sm font-bold text-gray-400 mt-2">Start by registering your first physical asset above.</p>
          </div>
        )}
      </div>

      {/* Add Asset Modal (Simplified for demo) */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 text-left animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-gray-950/40 backdrop-blur-md" onClick={() => setShowAddModal(false)}></div>
           <div className="relative bg-white rounded-[40px] w-full max-w-xl p-10 shadow-2xl border border-white/50 animate-in zoom-in-95 duration-500">
              <h3 className="text-3xl font-[1000] text-gray-950 tracking-tighter mb-8 leading-none">Register Asset</h3>
              <form onSubmit={handleAddSubmit} className="space-y-6">
                 <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Asset Nomenclature</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Workstation X-9"
                      value={newAsset.name}
                      onChange={e => setNewAsset({...newAsset, name: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:bg-white focus:border-[#195bac] outline-none transition-all"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2 text-left">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Classification</label>
                        <select 
                          value={newAsset.category}
                          onChange={e => setNewAsset({...newAsset, category: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 appearance-none outline-none focus:bg-white focus:border-[#195bac] transition-all"
                        >
                            <option>IT Hardware</option>
                            <option>Furniture</option>
                            <option>Networking</option>
                            <option>Facilities</option>
                        </select>
                    </div>
                    <div className="space-y-2 text-left">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Initial Valuation</label>
                        <input 
                          required
                          type="number" 
                          placeholder="Amount in USD"
                          value={newAsset.value}
                          onChange={e => setNewAsset({...newAsset, value: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:bg-white focus:border-[#195bac] outline-none transition-all"
                        />
                    </div>
                 </div>
                 <button className="w-full bg-[#195bac] text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] shadow-xl hover:-translate-y-1 transition-all mt-4">Initialize Registry Node</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
