import { useInventory } from "../../context/InventoryContext";
import { formatNumber } from "../../utils/formatters";
import { useState } from "react";
import BaseModal from "../../components/ui/BaseModal";

export default function BatchesAndSerials() {
  const { batches, serials, items, warehouses, stockInBatch, stockInSerial } = useInventory();
  
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showSerialModal, setShowSerialModal] = useState(false);
  
  const [batchForm, setBatchForm] = useState({
    item_id: "",
    warehouse_id: "",
    batch_number: "",
    quantity: 0,
    mfg_date: "",
    exp_date: ""
  });
  
  const [serialForm, setSerialForm] = useState({
    item_id: "",
    warehouse_id: "",
    serial_numbers: "" // Comma separated string for UI
  });

  const handleBatchSubmit = async (e) => {
    e.preventDefault();
    try {
      await stockInBatch(batchForm);
      setShowBatchModal(false);
      setBatchForm({ item_id: "", warehouse_id: "", batch_number: "", quantity: 0, mfg_date: "", exp_date: "" });
    } catch (err) {
      alert("Failed to stock in batch: " + err.message);
    }
  };

  const handleSerialSubmit = async (e) => {
    e.preventDefault();
    try {
      const serialsList = serialForm.serial_numbers.split(',').map(s => s.trim()).filter(s => s);
      await stockInSerial({ ...serialForm, serial_numbers: serialsList });
      setShowSerialModal(false);
      setSerialForm({ item_id: "", warehouse_id: "", serial_numbers: "" });
    } catch (err) {
      alert("Failed to stock in serials: " + err.message);
    }
  };

  // Mapping backend fields to UI field names if they differ
  // Batch fields from backend: id, batch_number, item_name, quantity, status (implied), expiry_date
  // Serial fields from backend: id, serial_number, item_name, status, warehouse

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1">
            <h2 className="text-4xl font-black text-[#111827] tracking-tighter leading-none">Traceability <span className="text-[#195bac]">Matrix</span></h2>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                Quantum Serialization & Batch Control Systems
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 text-left">
          
          {/* Batches Column */}
          <div className="space-y-6">
              <div className="flex items-center justify-between px-4">
                  <h3 className="text-xl font-black text-[#111827] tracking-tight flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-sm">📁</span>
                      Active Batch Units
                  </h3>
                  <button 
                    onClick={() => setShowBatchModal(true)}
                    className="text-[10px] font-black text-[#195bac] uppercase tracking-widest hover:bg-blue-50 px-3 py-1.5 rounded-xl transition-all"
                  >+ New Batch</button>
              </div>
              <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.03)] overflow-hidden">
                  <table className="w-full text-left">
                      <thead>
                          <tr className="bg-[#F8FAFC]">
                              <th className="px-8 py-5 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">Batch Hash</th>
                              <th className="px-8 py-5 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">Quantity</th>
                              <th className="px-8 py-5 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">State</th>
                              <th className="px-8 py-5 text-right text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                          {batches.map(b => (
                            <tr key={b.id} className="hover:bg-blue-50/10 transition-all group">
                                <td className="px-8 py-6">
                                    <p className="text-sm font-black text-[#111827]">{b.batch_number}</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{b.item_name}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="text-sm font-black text-[#1E293B] tabular-nums">{formatNumber(b.quantity)}</span>
                                    <span className="ml-1 text-[10px] font-black text-gray-400 uppercase">units</span>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                        (new Date(b.expiry_date) > new Date() || !b.expiry_date) ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                    }`}>
                                        {new Date(b.expiry_date) < new Date() ? 'EXPIRED' : 'ACTIVE'}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100">✕</button>
                                </td>
                            </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>

          {/* Serials Column */}
          <div className="space-y-6">
              <div className="flex items-center justify-between px-4">
                  <h3 className="text-xl font-black text-[#111827] tracking-tight flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-[#111827] text-white flex items-center justify-center text-sm">🏷️</span>
                      Individual Serials
                  </h3>
                  <button 
                    onClick={() => setShowSerialModal(true)}
                    className="text-[10px] font-black text-[#195bac] uppercase tracking-widest hover:bg-gray-100 px-3 py-1.5 rounded-xl transition-all"
                  >+ Scan Serial</button>
              </div>
              <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.03)] overflow-hidden">
                  <table className="w-full text-left">
                      <thead>
                          <tr className="bg-[#F8FAFC]">
                              <th className="px-8 py-5 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">Serial ID</th>
                              <th className="px-8 py-5 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">Node</th>
                              <th className="px-8 py-5 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">Status</th>
                              <th className="px-8 py-5 text-right text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                          {serials.map(s => (
                            <tr key={s.id} className="hover:bg-blue-50/10 transition-all group">
                                <td className="px-8 py-6">
                                    <p className="font-mono text-[11px] font-black text-[#111827] bg-gray-50 px-3 py-1 rounded-lg inline-block">{s.serial_number}</p>
                                    <p className="text-[10px] font-black text-gray-400 mt-1 uppercase tracking-tighter">{s.item_name}</p>
                                </td>
                                <td className="px-8 py-6 text-[11px] font-black text-[#1E293B] uppercase tracking-widest">
                                    {s.warehouse}
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${s.status === 'IN_STOCK' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`}></div>
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${s.status === 'IN_STOCK' ? 'text-emerald-500' : 'text-gray-400'}`}>
                                            {s.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100">✕</button>
                                </td>
                            </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>

      {/* Batch Modal */}
      <BaseModal isOpen={showBatchModal} onClose={() => setShowBatchModal(false)} className="max-w-2xl">
          <div className="p-10 border-b border-gray-100 flex justify-between items-center text-left">
            <div>
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-2 leading-none">Traceability Protocol</p>
              <h2 className="text-3xl font-[1000] text-[#111827] tracking-tighter leading-none">Register New Batch</h2>
            </div>
            <button onClick={() => setShowBatchModal(false)} className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-xl hover:bg-rose-50 hover:text-rose-500 transition-all font-black">✕</button>
          </div>
          <form onSubmit={handleBatchSubmit} className="p-10 space-y-8 text-left bg-white">
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Target Resource</label>
                    <select className="w-full bg-gray-50 border border-gray-100 rounded-[20px] px-6 py-4 text-sm font-black text-[#1E293B]" value={batchForm.item_id} onChange={e => setBatchForm({...batchForm, item_id: e.target.value})} required>
                        <option value="">Select Item</option>
                        {items.map(i => <option key={i.id} value={i.id}>{i.name} ({i.sku})</option>)}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Primary Warehouse</label>
                    <select className="w-full bg-gray-50 border border-gray-100 rounded-[20px] px-6 py-4 text-sm font-black text-[#1E293B]" value={batchForm.warehouse_id} onChange={e => setBatchForm({...batchForm, warehouse_id: e.target.value})} required>
                        <option value="">Select Warehouse</option>
                        {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Batch ID / Tag</label>
                    <input className="w-full bg-gray-50 border border-gray-100 rounded-[20px] px-6 py-4 text-sm font-black text-[#1E293B] uppercase" placeholder="BCH-XXXX" value={batchForm.batch_number} onChange={e => setBatchForm({...batchForm, batch_number: e.target.value})} required />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Bulk Magnitude</label>
                    <input type="number" className="w-full bg-gray-50 border border-gray-100 rounded-[20px] px-6 py-4 text-lg font-black text-[#1E293B]" value={batchForm.quantity} onChange={e => setBatchForm({...batchForm, quantity: Number(e.target.value)})} required />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Production Date</label>
                    <input type="date" className="w-full bg-gray-50 border border-gray-100 rounded-[20px] px-6 py-4 text-sm font-black text-[#1E293B]" value={batchForm.mfg_date} onChange={e => setBatchForm({...batchForm, mfg_date: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Expiry Horizon</label>
                    <input type="date" className="w-full bg-gray-50 border border-gray-100 rounded-[20px] px-6 py-4 text-sm font-black text-[#1E293B]" value={batchForm.exp_date} onChange={e => setBatchForm({...batchForm, exp_date: e.target.value})} />
                </div>
            </div>
            <button type="submit" className="w-full bg-[#111827] text-white py-6 rounded-[24px] text-[11px] font-black uppercase tracking-[0.25em] shadow-2xl hover:bg-black transition-all">Synchronize Batch</button>
          </form>
      </BaseModal>

      {/* Serial Modal */}
      <BaseModal isOpen={showSerialModal} onClose={() => setShowSerialModal(false)} className="max-w-xl">
          <div className="p-10 border-b border-gray-100 flex justify-between items-center text-left">
            <div>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-2 leading-none">Quantum Serialization</p>
              <h2 className="text-3xl font-[1000] text-[#111827] tracking-tighter leading-none">Deploy Serials</h2>
            </div>
            <button onClick={() => setShowSerialModal(false)} className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-xl hover:bg-rose-50 hover:text-rose-500 transition-all font-black">✕</button>
          </div>
          <form onSubmit={handleSerialSubmit} className="p-10 space-y-8 text-left bg-white">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Target Resource</label>
                <select className="w-full bg-gray-50 border border-gray-100 rounded-[20px] px-6 py-4 text-sm font-black text-[#1E293B]" value={serialForm.item_id} onChange={e => setSerialForm({...serialForm, item_id: e.target.value})} required>
                    <option value="">Select Item</option>
                    {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Primary Warehouse</label>
                <select className="w-full bg-gray-50 border border-gray-100 rounded-[20px] px-6 py-4 text-sm font-black text-[#1E293B]" value={serialForm.warehouse_id} onChange={e => setSerialForm({...serialForm, warehouse_id: e.target.value})} required>
                    <option value="">Select Warehouse</option>
                    {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Serial String (Comma Separated)</label>
                <textarea className="w-full bg-gray-50 border border-gray-100 rounded-[20px] px-8 py-5 text-sm font-black text-[#1E293B] outline-none min-h-[150px] placeholder:text-gray-300" placeholder="SN-001, SN-002, SN-003..." value={serialForm.serial_numbers} onChange={e => setSerialForm({...serialForm, serial_numbers: e.target.value})} required />
            </div>
            <button type="submit" className="w-full bg-[#111827] text-white py-6 rounded-[24px] text-[11px] font-black uppercase tracking-[0.25em] shadow-2xl hover:bg-black transition-all">Initialize Stream</button>
          </form>
      </BaseModal>
    </div>
  );
}

