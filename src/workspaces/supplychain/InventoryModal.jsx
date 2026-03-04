import { useState, useEffect } from 'react';
import BaseModal from '../../components/ui/BaseModal';

export default function InventoryModal({ isOpen, mode, item, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    status: 'Normal',
    ny: 0,
    ldn: 0,
    tyo: 0
  });

  useEffect(() => {
    if (isOpen && mode === 'edit' && item) {
       setFormData(item);
    } else if (isOpen && mode === 'create') {
        setFormData({ sku: '', name: '', status: 'Normal', ny: 0, ldn: 0, tyo: 0 });
    }
  }, [isOpen, mode, item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: mode === 'edit' ? item.id : `INV-${Math.floor(Math.random() * 9000) + 1000}`
    });
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} className="max-w-lg">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
           <div>
              <h2 className="text-2xl font-black text-gray-900">{mode === 'edit' ? 'Edit Inventory' : 'Add Inventory Item'}</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Manage Stock Levels</p>
           </div>
           <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
           <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">SKU Code</label>
                 <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-cyan-500 hover:bg-white border-2 rounded-xl text-sm font-bold transition-all outline-none"
                    placeholder="e.g. SKU-1001"
                    value={formData.sku}
                    onChange={e => setFormData({...formData, sku: e.target.value})}
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Item Name</label>
                 <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-cyan-500 hover:bg-white border-2 rounded-xl text-sm font-bold transition-all outline-none"
                    placeholder="e.g. Steel Sheets"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                 />
              </div>
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Region Distribution (%)</label>
              <div className="grid grid-cols-3 gap-4">
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-cyan-600">New York</label>
                    <input 
                        type="number" 
                        min="0" max="100"
                        className="w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm font-bold outline-none focus:border-cyan-500"
                        value={formData.ny}
                        onChange={e => setFormData({...formData, ny: Number(e.target.value)})}
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-purple-600">London</label>
                    <input 
                        type="number" 
                        min="0" max="100"
                        className="w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm font-bold outline-none focus:border-purple-500"
                        value={formData.ldn}
                        onChange={e => setFormData({...formData, ldn: Number(e.target.value)})}
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-orange-600">Tokyo</label>
                    <input 
                        type="number" 
                        min="0" max="100"
                        className="w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm font-bold outline-none focus:border-orange-500"
                        value={formData.tyo}
                        onChange={e => setFormData({...formData, tyo: Number(e.target.value)})}
                    />
                 </div>
              </div>
              <p className="text-[10px] text-gray-400 font-medium">Total allocation must not exceed 100%.</p>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Status</label>
              <div className="flex gap-2">
                 {['Normal', 'Imbalance', 'Critical'].map(s => (
                    <button 
                       type="button"
                       key={s}
                       onClick={() => setFormData({...formData, status: s})}
                       className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all
                          ${formData.status === s 
                             ? 'border-cyan-500 bg-cyan-50 text-cyan-700' 
                             : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'}`}
                    >
                       {s}
                    </button>
                 ))}
              </div>
           </div>

           <button 
              type="submit" 
              className="w-full py-4 bg-cyan-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-cyan-700 shadow-xl shadow-cyan-200 transition-all mt-4"
           >
              {mode === 'edit' ? 'Update Allocation' : 'Add Item Strategy'}
           </button>
        </form>
    </BaseModal>
  );
}
