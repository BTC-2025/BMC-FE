import { useState } from 'react';
import BaseModal from '../../components/ui/BaseModal';

export default function NewShipmentModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    origin: '',
    dest: '',
    method: 'Sea',
    eta: '',
    status: 'Scheduled'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: `RTE-${Math.floor(Math.random() * 9000) + 1000}`
    });
    onClose();
    // Reset form
    setFormData({ origin: '', dest: '', method: 'Sea', eta: '', status: 'Scheduled' });
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} className="max-w-lg">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
           <div>
              <h2 className="text-2xl font-black text-gray-900">New Shipment</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Create Logistics Route</p>
           </div>
           <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
           <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Origin</label>
                 <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-cyan-500 hover:bg-white border-2 rounded-xl text-sm font-bold transition-all outline-none"
                    placeholder="e.g. Hamburg"
                    value={formData.origin}
                    onChange={e => setFormData({...formData, origin: e.target.value})}
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Destination</label>
                 <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-cyan-500 hover:bg-white border-2 rounded-xl text-sm font-bold transition-all outline-none"
                    placeholder="e.g. New York"
                    value={formData.dest}
                    onChange={e => setFormData({...formData, dest: e.target.value})}
                 />
              </div>
           </div>

           <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Method</label>
                 <select 
                    className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-cyan-500 hover:bg-white border-2 rounded-xl text-sm font-bold transition-all outline-none appearance-none"
                    value={formData.method}
                    onChange={e => setFormData({...formData, method: e.target.value})}
                 >
                    <option value="Sea">🚢 Sea Freight</option>
                    <option value="Air">✈️ Air Freight</option>
                    <option value="Road">🚛 Road Transport</option>
                    <option value="Rail">🚂 Rail Freight</option>
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">ETA</label>
                 <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-cyan-500 hover:bg-white border-2 rounded-xl text-sm font-bold transition-all outline-none"
                    placeholder="e.g. 4 Days"
                    value={formData.eta}
                    onChange={e => setFormData({...formData, eta: e.target.value})}
                 />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Initial Status</label>
              <div className="flex gap-3">
                 {['Scheduled', 'In Transit', 'Delayed'].map(s => (
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
              Create Shipment Route
           </button>
        </form>
    </BaseModal>
  );
}
