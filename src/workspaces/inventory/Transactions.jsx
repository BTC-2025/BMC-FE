import { useInventory } from "../../context/InventoryContext";
import { useState } from "react";

export default function InventoryTransactions() {
  const { transactions, executeTransaction, products, warehouses, bins } = useInventory();
  const [activeTab, setActiveTab] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    type: "Stock In", 
    product: products[0]?.name || "", 
    warehouse_id: warehouses[0]?.id || "",
    bin_id: "",
    qty: 0, 
    notes: "" 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    executeTransaction(formData);
    setShowModal(false);
  };

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1">
            <h2 className="text-4xl font-black text-[#111827] tracking-tighter leading-none">Terminal Ledger</h2>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                Stock Adjustment & Movement Logs
            </p>
        </div>
        <div className="flex items-center gap-3">
             <div className="flex bg-gray-100/80 p-1.5 rounded-2xl border border-gray-200/50 backdrop-blur-sm">
                {["all", "Stock In", "Stock Out", "Adjustment"].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            activeTab === tab ? 'bg-white text-[#195bac] shadow-md ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        {tab === 'all' ? 'Universal' : tab}
                    </button>
                ))}
            </div>
            <button 
                onClick={() => setShowModal(true)}
                className="bg-[#000000] text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] shadow-2xl transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3"
            >
                Post Entry
            </button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-[#F8FAFC]">
                        <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase font-mono tracking-[0.2em]">Hash ID</th>
                        <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">Operation Type</th>
                        <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">Asset Unit</th>
                        <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">Delta</th>
                        <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">Operator</th>
                        <th className="px-8 py-6 text-right text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">Synchronized</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {transactions.filter(m => activeTab === 'all' || m.type === activeTab).map((mov) => (
                        <tr key={mov.id} className="hover:bg-blue-50/20 transition-all group">
                            <td className="px-8 py-6">
                                <span className="font-mono text-[11px] font-black text-[#1E293B] bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 group-hover:bg-white transition-colors">
                                    {mov.id}
                                </span>
                            </td>
                            <td className="px-8 py-6">
                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest
                                    ${mov.type === 'Stock In' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                      mov.type === 'Stock Out' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                      'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${mov.type === 'Stock In' ? 'bg-emerald-500' : mov.type === 'Stock Out' ? 'bg-rose-500' : 'bg-amber-500'}`}></span>
                                    {mov.type}
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                <p className="text-[13px] font-black text-[#1E293B]">{mov.product}</p>
                                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">{mov.notes || 'General Terminal Entry'}</p>
                            </td>
                            <td className={`px-8 py-6 font-mono font-black text-sm
                                ${mov.type === 'Stock In' ? 'text-emerald-500' :
                                  mov.type === 'Stock Out' ? 'text-rose-500' :
                                  'text-[#195bac]'}`}>
                                {mov.type === 'Stock In' ? '+' : mov.type === 'Stock Out' ? '-' : ''}{mov.qty.toString().padStart(2, '0')}
                            </td>
                            <td className="px-8 py-6">
                                <span className="text-[11px] font-black text-[#1E293B] flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-gray-200 flex items-center justify-center text-[9px]">JD</div>
                                    {mov.user}
                                </span>
                            </td>
                            <td className="px-8 py-6 text-right font-mono text-[11px] font-black text-gray-300">
                                {mov.date}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {showModal && (
          <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-xl z-[9999] flex items-center justify-center p-6 animate-in zoom-in duration-300">
              <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden border border-white">
                  <div className="p-10 border-b border-gray-100 bg-[#F8FAFC]">
                      <h2 className="text-2xl font-black text-[#111827] tracking-tighter">Terminal Command</h2>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Manual Ledger Adjustment Entry</p>
                  </div>
                  <form onSubmit={handleSubmit} className="p-10 space-y-8">
                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Operation Class</label>
                          <select 
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100"
                            value={formData.type}
                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                          >
                              <option>Stock In</option>
                              <option>Stock Out</option>
                              <option>Adjustment</option>
                          </select>
                      </div>
                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Target Asset</label>
                          <select 
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100"
                            value={formData.product}
                            onChange={(e) => setFormData({...formData, product: e.target.value})}
                          >
                               {products.map(p => <option key={p.sku} value={p.name}>{p.name}</option>)}
                          </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Warehouse Node</label>
                            <select 
                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100"
                                value={formData.warehouse_id}
                                onChange={(e) => setFormData({...formData, warehouse_id: e.target.value, bin_id: ""})}
                            >
                                {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Storage Bin (Optional)</label>
                            <select 
                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100"
                                value={formData.bin_id}
                                onChange={(e) => setFormData({...formData, bin_id: e.target.value})}
                            >
                                <option value="">Floor / General</option>
                                {bins.filter(b => b.warehouse_id == formData.warehouse_id).map(b => (
                                    <option key={b.id} value={b.id}>{b.code}</option>
                                ))}
                            </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Vector Magnitude (Qty)</label>
                          <input 
                            type="number" 
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-xl font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100"
                            placeholder="00"
                            onChange={(e) => setFormData({...formData, qty: e.target.value})}
                            required
                          />
                      </div>
                      <div className="pt-6 flex gap-4">
                          <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors">Abort</button>
                          <button type="submit" className="flex-[2] bg-[#000000] text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all">Submit to Ledger</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
}
