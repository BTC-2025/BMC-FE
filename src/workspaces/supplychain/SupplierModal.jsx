import { useState, useEffect } from 'react';

export default function SupplierModal({ isOpen, mode, supplier, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Raw Material',
    rating: 'B',
    location: '',
    status: 'Active'
  });

  useEffect(() => {
    if (isOpen && mode === 'edit' && supplier) {
       setFormData(supplier);
    } else if (isOpen && mode === 'create') {
        setFormData({ name: '', type: 'Raw Material', rating: 'B', location: '', status: 'Active' });
    }
  }, [isOpen, mode, supplier]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Bridge UI fields to backend SupplierCreate
    const payload = {
      name: formData.name,
      email: `${formData.name.toLowerCase().replace(/\s/g, '')}@example.com`, // Bridged
      phone: "+1-555-0000" // Bridged
    };
    onSubmit(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
           <div>
              <h2 className="text-2xl font-black text-gray-900">{mode === 'edit' ? 'Edit Supplier' : 'New Supplier'}</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Manage Vendor Profile</p>
           </div>
           <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Supplier Name</label>
              <input 
                 type="text" 
                 required
                 className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-cyan-500 hover:bg-white border-2 rounded-xl text-sm font-bold transition-all outline-none"
                 placeholder="e.g. Acme Industries"
                 value={formData.name}
                 onChange={e => setFormData({...formData, name: e.target.value})}
              />
           </div>

           <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Type</label>
                 <select 
                    className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-cyan-500 hover:bg-white border-2 rounded-xl text-sm font-bold transition-all outline-none"
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                 >
                    <option value="Raw Material">Raw Material</option>
                    <option value="Packaging">Packaging</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Services">Services</option>
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Rating</label>
                 <select 
                    className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-cyan-500 hover:bg-white border-2 rounded-xl text-sm font-bold transition-all outline-none"
                    value={formData.rating}
                    onChange={e => setFormData({...formData, rating: e.target.value})}
                 >
                    <option value="A">A - Excellent</option>
                    <option value="B">B - Good</option>
                    <option value="C">C - Average</option>
                    <option value="D">D - Poor</option>
                 </select>
              </div>
           </div>
           
           <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Location</label>
                 <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-cyan-500 hover:bg-white border-2 rounded-xl text-sm font-bold transition-all outline-none"
                    placeholder="e.g. Frankfurt, Germany"
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                 />
            </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Status</label>
              <div className="flex gap-2 text-[10px] font-bold">
                 {['Active', 'Under Review', 'Strategic Partner'].map(s => (
                    <button 
                       type="button"
                       key={s}
                       onClick={() => setFormData({...formData, status: s})}
                       className={`px-3 py-2 rounded-lg border transition-all
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
              {mode === 'edit' ? 'Update Supplier' : 'Onboard Supplier'}
           </button>
        </form>
      </div>
    </div>
  );
}
