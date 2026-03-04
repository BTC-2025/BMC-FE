import { useState } from 'react';

export default function EquipmentModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: 'New Forklift',
    type: 'Forklift',
    count: 1
  });

  if (!isOpen) return null; // Simple check

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
           <div>
              <h2 className="text-2xl font-black text-gray-900">Manage Fleet</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Update Equipment Inventory</p>
           </div>
           <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
           <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Equipment Type</label>
              <div className="grid grid-cols-2 gap-4">
                 <button 
                    type="button"
                    onClick={() => setFormData({...formData, type: 'Forklift'})}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${formData.type === 'Forklift' ? 'border-cyan-500 bg-cyan-50' : 'border-gray-100 hover:border-gray-200'}`}
                 >
                    <span className="text-2xl block mb-2">🚜</span>
                    <span className={`text-xs font-black uppercase tracking-widest ${formData.type === 'Forklift' ? 'text-cyan-700' : 'text-gray-500'}`}>Forklift</span>
                 </button>
                 <button 
                    type="button"
                    onClick={() => setFormData({...formData, type: 'Pallet Jack'})}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${formData.type === 'Pallet Jack' ? 'border-cyan-500 bg-cyan-50' : 'border-gray-100 hover:border-gray-200'}`}
                 >
                    <span className="text-2xl block mb-2">🪜</span>
                    <span className={`text-xs font-black uppercase tracking-widest ${formData.type === 'Pallet Jack' ? 'text-cyan-700' : 'text-gray-500'}`}>Pallet Jack</span>
                 </button>
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Fleet Quantity</label>
              <div className="flex items-center gap-4">
                 <button 
                    type="button"
                    onClick={() => setFormData({...formData, count: Math.max(0, formData.count - 1)})}
                    className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-xl font-black text-gray-500 hover:bg-gray-200"
                 >
                    -
                 </button>
                 <span className="text-3xl font-black text-gray-900 w-16 text-center">{formData.count}</span>
                 <button 
                    type="button"
                    onClick={() => setFormData({...formData, count: formData.count + 1})}
                    className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center text-xl font-black text-cyan-600 hover:bg-cyan-200"
                 >
                    +
                 </button>
              </div>
           </div>

           <button 
              type="submit" 
              className="w-full py-4 bg-cyan-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-cyan-700 shadow-xl shadow-cyan-200 transition-all mt-4"
           >
              Update Fleet Count
           </button>
        </form>
      </div>
    </div>
  );
}
