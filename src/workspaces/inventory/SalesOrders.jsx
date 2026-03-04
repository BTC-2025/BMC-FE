import { useInventory } from "../../context/InventoryContext";
import { useState } from "react";
import { formatNumber } from "../../utils/formatters";

export default function SalesOrders() {
  const { salesOrders, addSalesOrder, fulfillSalesOrder, updateSalesOrder, customers, products, warehouses } = useInventory();
  const [showModal, setShowModal] = useState(false);
  const [showFulfillModal, setShowFulfillModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSO, setSelectedSO] = useState(null);
  const [formData, setFormData] = useState({ 
    customer: customers[0]?.name || "", 
    product: products[0]?.name || "",
    qty: 0,
    amount: 0
  });
  const [editData, setEditData] = useState({ customer_name: "", status: "" });
  const [fulfillWarehouseId, setFulfillWarehouseId] = useState(warehouses[0]?.id || 1);

  const openAdd = () => {
    setFormData({ customer: customers[0]?.name || "", product: products[0]?.name || "", qty: 0, amount: 0 });
    setShowModal(true);
  };

  const handleFulfillOpen = (so) => {
    setSelectedSO(so);
    setShowFulfillModal(true);
  };

  const handleEditOpen = (so) => {
    setSelectedSO(so);
    setEditData({ customer_name: so.customer_name, status: so.status });
    setShowEditModal(true);
  };

  const executeUpdate = async () => {
    try {
        await updateSalesOrder(selectedSO.id, editData);
        setShowEditModal(false);
    } catch (e) {
        console.error(e);
    }
  };

  const executeFulfill = async () => {
    try {
        await fulfillSalesOrder(selectedSO.id, fulfillWarehouseId);
        setShowFulfillModal(false);
    } catch (e) {
        console.error(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addSalesOrder(formData);
    setShowModal(false);
  };

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      
      {/* Header & Tools */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1">
            <h2 className="text-4xl font-black text-[#111827] tracking-tighter text-left">Sales <span className="text-[#195bac]">Pipeline</span></h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 text-left">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Outbound Commerce & Fulfillment Logistics
            </p>
        </div>
        <button 
            onClick={openAdd}
            className="bg-[#195bac] text-white px-8 py-4 rounded-[20px] text-[11px] font-black uppercase tracking-[0.15em] shadow-xl transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3"
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
            Initialize SO
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-[#F8FAFC]">
                        <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em] text-left">SO ID</th>
                        <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em] text-left">Commercial Partner</th>
                        <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em] text-left">Allocation</th>
                        <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em] text-left">Revenue Vector</th>
                        <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em] text-left">Status</th>
                        <th className="px-8 py-6 text-right text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 uppercase">
                    {salesOrders.map((so) => (
                        <tr key={so.id} className="hover:bg-blue-50/20 transition-all group">
                            <td className="px-8 py-6 text-left">
                                <span className="font-mono text-[11px] font-black text-[#1E293B] bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 group-hover:bg-white transition-colors uppercase">
                                    SO-{so.id.toString().padStart(4, '0')}
                                </span>
                            </td>
                            <td className="px-8 py-6 text-left">
                                <p className="text-[14px] font-black text-[#1E293B] text-left">{so.customer_name}</p>
                                <p className="text-[10px] font-bold text-gray-400 mt-0.5 uppercase tracking-tighter text-left">Multiple Items ({so.items?.length})</p>
                            </td>
                            <td className="px-8 py-6 text-left">
                                <span className="text-sm font-black text-[#1E293B] tabular-nums text-left">{so.items?.reduce((acc, i) => acc + Number(i.quantity), 0)}</span>
                                <span className="ml-1 text-[10px] font-black text-gray-400 uppercase text-left">units</span>
                            </td>
                            <td className="px-8 py-6 font-mono text-sm font-black text-[#1E293B] text-left">
                                ${formatNumber(Number(so.total_amount))}
                            </td>
                            <td className="px-8 py-6 text-left">
                                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                    so.status === 'FULFILLED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                    so.status === 'PENDING' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                                    'bg-gray-50 text-gray-400 border-gray-100'
                                }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                        so.status === 'FULFILLED' ? 'bg-emerald-500' : 
                                        so.status === 'PENDING' ? 'bg-blue-500' : 'bg-gray-400'
                                    }`}></span>
                                    {so.status}
                                </span>
                            </td>
                            <td className="px-8 py-6 text-right">
                                <div className="flex items-center justify-end gap-3">
                                    {so.status === 'PENDING' && (
                                        <>
                                            <button 
                                                onClick={() => handleFulfillOpen(so)}
                                                className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                                            >
                                                Fulfill
                                            </button>
                                            <button 
                                                onClick={() => handleEditOpen(so)}
                                                className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                                            >
                                                Edit
                                            </button>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {showModal && (
          <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-xl z-[9999] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
              <div className="bg-white rounded-[48px] shadow-2xl w-full max-w-xl overflow-hidden border border-white">
                  <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                      <div className="text-left space-y-1">
                        <h2 className="text-2xl font-black text-[#111827] tracking-tighter leading-none text-left">Initialize Transaction</h2>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none text-left">Commerce Lifecycle Configuration</p>
                      </div>
                      <button onClick={() => setShowModal(false)} className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-rose-500 transition-all shadow-sm font-black">✕</button>
                  </div>
                  <form onSubmit={handleSubmit} className="p-12 space-y-8 text-left bg-white">
                      <div className="grid grid-cols-2 gap-8 text-left">
                        <div className="space-y-2 col-span-2 text-left">
                            <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1 text-left">Client / Commercial Partner</label>
                            <input 
                                className="w-full bg-gray-50 border border-gray-200 rounded-[20px] px-8 py-5 text-sm font-black text-[#1E293B] focus:ring-4 focus:ring-blue-50 outline-none transition-all" 
                                required 
                                value={formData.customer} 
                                onChange={e => setFormData({...formData, customer: e.target.value})} 
                                placeholder="Customer Name"
                            />
                        </div>
                        <div className="space-y-2 col-span-2 text-left">
                            <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1 text-left">Target Asset Allocation</label>
                            <select className="w-full bg-gray-50 border border-gray-200 rounded-[20px] px-8 py-5 text-sm font-black text-[#1E293B] focus:ring-4 focus:ring-blue-50 outline-none transition-all" required value={formData.product} onChange={e => setFormData({...formData, product: e.target.value})}>
                                {products.map(p => <option key={p.sku} value={p.name}>{p.name} ({p.sku})</option>)}
                            </select>
                        </div>
                        <div className="space-y-2 text-left">
                            <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1 text-left">Sales Volume</label>
                            <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-[20px] px-8 py-5 text-base font-black text-[#1E293B] focus:ring-4 focus:ring-blue-50 outline-none" required value={formData.qty} onChange={e => setFormData({...formData, qty: e.target.value})} />
                        </div>
                        <div className="space-y-2 text-left">
                            <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1 text-left">Total Value ($)</label>
                            <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-[20px] px-8 py-5 text-base font-black text-[#1E293B] focus:ring-4 focus:ring-blue-50 outline-none" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                        </div>
                      </div>
                      <div className="pt-6">
                        <button type="submit" className="w-full bg-[#111827] text-white py-6 rounded-[24px] text-[11px] font-black uppercase tracking-[0.25em] shadow-2xl transition-all hover:-translate-y-1 hover:bg-black active:scale-95">
                          Initialize Fulfillment Vector
                        </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {showFulfillModal && (
          <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-xl z-[9999] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
               <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden border border-white p-12 text-left">
                  <h2 className="text-2xl font-black text-[#111827] tracking-tighter mb-8 text-left uppercase">Fulfill Order SO-{selectedSO?.id}</h2>
                  <div className="space-y-6 text-left">
                      <div className="space-y-2 text-left">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1 text-left">Source Warehouse</label>
                          <select 
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-black text-gray-900 outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                            value={fulfillWarehouseId}
                            onChange={e => setFulfillWarehouseId(e.target.value)}
                          >
                              {warehouses.map(wh => <option key={wh.id} value={wh.id}>{wh.name}</option>)}
                          </select>
                      </div>
                      <div className="pt-6 flex gap-4 text-left">
                          <button onClick={() => setShowFulfillModal(false)} className="flex-1 px-8 py-4 bg-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-200 transition-all text-center">Cancel</button>
                          <button onClick={executeFulfill} className="flex-2 px-8 py-4 bg-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl hover:-translate-y-1 transition-all text-center">Commit Fulfillment</button>
                      </div>
                  </div>
              </div>
          </div>
      )}
      {showEditModal && (
          <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-xl z-[9999] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
               <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden border border-white p-12 text-left">
                  <h2 className="text-2xl font-black text-[#111827] tracking-tighter mb-8 text-left uppercase">Edit SO-{selectedSO?.id}</h2>
                  <div className="space-y-6 text-left">
                      <div className="space-y-2 text-left">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1 text-left">Customer Name</label>
                          <input 
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-black text-gray-900 outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                            value={editData.customer_name}
                            onChange={e => setEditData({...editData, customer_name: e.target.value})}
                          />
                      </div>
                      <div className="space-y-2 text-left">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1 text-left">Commercial Status</label>
                          <select 
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-black text-gray-900 outline-none focus:ring-4 focus:ring-blue-100 transition-all appearance-none"
                            value={editData.status}
                            onChange={e => setEditData({...editData, status: e.target.value})}
                          >
                              <option value="PENDING">PENDING</option>
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="PROCESSING">PROCESSING</option>
                              <option value="CANCELLED">CANCELLED</option>
                          </select>
                      </div>
                      <div className="pt-6 flex gap-4 text-left">
                          <button onClick={() => setShowEditModal(false)} className="flex-1 px-8 py-4 bg-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-200 transition-all text-center">Cancel</button>
                          <button onClick={executeUpdate} className="flex-2 px-8 py-4 bg-[#111827] rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl hover:-translate-y-1 transition-all text-center">Update Record</button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}

