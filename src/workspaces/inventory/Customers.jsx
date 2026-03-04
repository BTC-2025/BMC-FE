import { useInventory } from "../../context/InventoryContext";
import { useState } from "react";

export default function CustomersView() {
  const { customers, addCustomer, updateCustomer, removeCustomer } = useInventory();
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", contact: "", email: "", id: "" });

  const openAdd = () => {
    setEditMode(false);
    setFormData({ name: "", contact: "", email: "", id: "" });
    setShowModal(true);
  };

  const openEdit = (c) => {
    setEditMode(true);
    setFormData(c);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) updateCustomer(formData.id, formData);
    else addCustomer(formData);
    setShowModal(false);
  };

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1">
            <h2 className="text-4xl font-black text-[#111827] tracking-tighter leading-none">Client Portfolio</h2>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                B2B & Enterprise Revenue Partners
            </p>
        </div>
        <button 
            onClick={openAdd}
            className="bg-[#000000] text-white px-8 py-4 rounded-[20px] text-[11px] font-black uppercase tracking-[0.15em] shadow-xl transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
            Register Client
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.03)] overflow-hidden">
        <table className="w-full text-left">
            <thead>
                <tr className="bg-[#F8FAFC]">
                    <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">Client Account</th>
                    <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">Key Account Mgr</th>
                    <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">Volume Index</th>
                    <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">Account Status</th>
                    <th className="px-8 py-6 text-right text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {customers.map((cust) => (
                    <tr key={cust.id} className="hover:bg-blue-50/20 transition-all group">
                        <td className="px-8 py-6">
                            <div className="font-black text-[#1E293B] text-base mb-1">{cust.name}</div>
                            <div className="font-mono text-[10px] text-gray-400 font-black uppercase tracking-widest">{cust.id}</div>
                        </td>
                        <td className="px-8 py-6">
                            <p className="text-[13px] font-black text-[#1E293B]">{cust.contact}</p>
                            <p className="text-[11px] font-bold text-gray-400">{cust.email}</p>
                        </td>
                        <td className="px-8 py-6">
                             <div className="flex items-center gap-3">
                                <span className="text-sm font-black text-emerald-600">{cust.soCount}</span>
                                <span className="text-[10px] font-black text-gray-300 uppercase leading-none">Sales<br/>Dispatched</span>
                            </div>
                        </td>
                        <td className="px-8 py-6">
                             <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100 rounded-lg">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Credit Active
                             </span>
                        </td>
                         <td className="px-8 py-6">
                           <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                                <button onClick={() => openEdit(cust)} className="w-10 h-10 rounded-xl bg-blue-50 text-[#195bac] flex items-center justify-center hover:bg-[#195bac] hover:text-white transition-all shadow-sm"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                                <button onClick={() => removeCustomer(cust.id)} className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      {showModal && (
          <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-xl z-[9999] flex items-center justify-center p-6 animate-in fade-in duration-300">
              <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden border border-white">
                  <div className="p-10 border-b border-gray-100 bg-[#F8FAFC]">
                      <h2 className="text-2xl font-black text-[#111827] tracking-tighter">{editMode ? 'Edit Account' : 'Initialize Client Record'}</h2>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Enterprise Portfolio Configuration</p>
                  </div>
                  <form onSubmit={handleSubmit} className="p-10 space-y-6">
                      <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Client Entity Name</label>
                          <input className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Operational Manager</label>
                          <input className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100" required value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Primary Email Address</label>
                          <input type="email" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                      </div>
                       <div className="pt-6 flex gap-4">
                           <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors">Abort</button>
                           <button type="submit" className="flex-[2] bg-[#000000] text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all">Command Submit</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
}
