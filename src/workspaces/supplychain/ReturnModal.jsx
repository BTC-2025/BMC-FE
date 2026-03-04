import { useState, useEffect } from 'react';

export default function ReturnModal({ isOpen, mode, rma, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    customer: '',
    product: '',
    reason: '',
    status: 'Processing'
  });

  useEffect(() => {
    if (isOpen && mode === 'edit' && rma) {
       setFormData(rma);
    } else if (isOpen && mode === 'create') {
        setFormData({ customer: '', product: '', reason: '', status: 'Processing' });
    }
  }, [isOpen, mode, rma]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: mode === 'edit' ? rma.id : `RET-${Math.floor(Math.random() * 9000) + 1000}`
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
           <div>
              <h2 className="text-2xl font-black text-gray-900">{mode === 'edit' ? 'Edit Request' : 'New Return Request'}</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Manage RMA</p>
           </div>
           <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Customer Name</label>
              <input 
                 type="text" 
                 required
                 className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-cyan-500 hover:bg-white border-2 rounded-xl text-sm font-bold transition-all outline-none"
                 placeholder="e.g. John Doe"
                 value={formData.customer}
                 onChange={e => setFormData({...formData, customer: e.target.value})}
              />
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Product</label>
              <input 
                 type="text" 
                 required
                 className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-cyan-500 hover:bg-white border-2 rounded-xl text-sm font-bold transition-all outline-none"
                 placeholder="e.g. Wireless Mouse"
                 value={formData.product}
                 onChange={e => setFormData({...formData, product: e.target.value})}
              />
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Reason for Return</label>
              <input 
                 type="text" 
                 required
                 className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-cyan-500 hover:bg-white border-2 rounded-xl text-sm font-bold transition-all outline-none"
                 placeholder="e.g. Defective, Wrong Item"
                 value={formData.reason}
                 onChange={e => setFormData({...formData, reason: e.target.value})}
              />
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Status</label>
              <div className="grid grid-cols-2 gap-2">
                 {['Processing', 'Approved', 'Received', 'Rejected'].map(s => (
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
              {mode === 'edit' ? 'Update RMA' : 'Initiate Return'}
           </button>
        </form>
      </div>
    </div>
  );
}
