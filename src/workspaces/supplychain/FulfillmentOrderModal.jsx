import { useState, useEffect } from 'react';

export default function FulfillmentOrderModal({ isOpen, mode, order, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    items: '',
    packer: 'Pending',
    status: 'Ready to Pick',
    priority: 'Medium'
  });

  useEffect(() => {
    if (isOpen && mode === 'edit' && order) {
       setFormData(order);
    } else if (isOpen && mode === 'create') {
        setFormData({ items: '', packer: 'Pending', status: 'Ready to Pick', priority: 'Medium' });
    }
  }, [isOpen, mode, order]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: mode === 'edit' ? order.id : `ORD-${Math.floor(Math.random() * 9000) + 1000}`
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
           <div>
              <h2 className="text-2xl font-black text-gray-900">{mode === 'edit' ? 'Edit Order' : 'New Fulfillment Order'}</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Pick & Pack Queue</p>
           </div>
           <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Order Items</label>
              <textarea
                 required
                 rows={3}
                 className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-cyan-500 hover:bg-white border-2 rounded-xl text-sm font-bold transition-all outline-none resize-none"
                 placeholder="e.g. 3x Office Chair, 1x Desk Lamp"
                 value={formData.items}
                 onChange={e => setFormData({...formData, items: e.target.value})}
              />
           </div>

           <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Assigned Packer</label>
                 <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-cyan-500 hover:bg-white border-2 rounded-xl text-sm font-bold transition-all outline-none"
                    placeholder="Pending or Name"
                    value={formData.packer}
                    onChange={e => setFormData({...formData, packer: e.target.value})}
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Priority</label>
                 <select 
                    className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-cyan-500 hover:bg-white border-2 rounded-xl text-sm font-bold transition-all outline-none"
                    value={formData.priority}
                    onChange={e => setFormData({...formData, priority: e.target.value})}
                 >
                    <option value="High">🔴 High</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="Low">🟢 Low</option>
                 </select>
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Status</label>
              <div className="grid grid-cols-2 gap-2">
                 {['Ready to Pick', 'Packing', 'Labeling', 'Shipped'].map(s => (
                    <button 
                       type="button"
                       key={s}
                       onClick={() => setFormData({...formData, status: s})}
                       className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all
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
              {mode === 'edit' ? 'Update Order' : 'Create Order'}
           </button>
        </form>
      </div>
    </div>
  );
}
