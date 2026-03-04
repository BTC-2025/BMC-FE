import { useState, useEffect } from 'react';
import BaseModal from '../../components/ui/BaseModal';

export default function WarehouseZoneModal({ isOpen, mode, zone, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    location: '',
    capacity: 0,
    status: 'Operational'
  });

  useEffect(() => {
    if (isOpen && mode === 'edit' && zone) {
       // Convert "85%" string to 85 number if needed
       const cap = typeof zone.capacity === 'string' ? parseInt(zone.capacity) : zone.capacity;
       setFormData({ ...zone, capacity: cap });
    } else if (isOpen && mode === 'create') {
        setFormData({ location: '', capacity: 0, status: 'Operational' });
    }
  }, [isOpen, mode, zone]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      capacity: `${formData.capacity}%`, // Store as string with % to match existing format
      id: mode === 'edit' ? zone.id : `WH-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 10)}`
    });
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} className="max-w-lg">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
           <div>
              <h2 className="text-2xl font-black text-gray-900">{mode === 'edit' ? 'Edit Zone' : 'New Zone'}</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Manage Facility Layout</p>
           </div>
           <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Zone Name/Location</label>
              <input 
                 type="text" 
                 required
                 className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-cyan-500 hover:bg-white border-2 rounded-xl text-sm font-bold transition-all outline-none"
                 placeholder="e.g. Zone D - High Rack"
                 value={formData.location}
                 onChange={e => setFormData({...formData, location: e.target.value})}
              />
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Current Capacity Usage</label>
              <div className="flex items-center gap-4">
                 <input 
                    type="range" 
                    min="0" max="100"
                    className="w-full accent-cyan-600 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                    value={formData.capacity}
                    onChange={e => setFormData({...formData, capacity: Number(e.target.value)})}
                 />
                 <span className="text-xl font-black text-cyan-600 w-16 text-right">{formData.capacity}%</span>
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Operational Status</label>
              <div className="flex gap-2">
                 {['Operational', 'Full', 'Maintenance'].map(s => (
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
              {mode === 'edit' ? 'Update Zone' : 'Initialize Zone'}
           </button>
        </form>
    </BaseModal>
  );
}
