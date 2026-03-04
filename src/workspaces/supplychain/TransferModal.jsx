import { useState } from 'react';

export default function TransferModal({ isOpen, item, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    from: 'ny',
    to: 'ldn',
    amount: 10
  });

  if (!isOpen || !item) return null;

  const locations = {
    ny: { label: 'New York', current: item.ny, color: 'cyan' },
    ldn: { label: 'London', current: item.ldn, color: 'purple' },
    tyo: { label: 'Tokyo', current: item.tyo, color: 'orange' }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calculate new distribution
    const newDistribution = {
      ny: item.ny,
      ldn: item.ldn,
      tyo: item.tyo
    };
    
    newDistribution[formData.from] -= formData.amount;
    newDistribution[formData.to] += formData.amount;
    
    // Validate
    if (newDistribution[formData.from] < 0) {
      alert(`Insufficient stock in ${locations[formData.from].label}`);
      return;
    }
    
    onSubmit({
      ...item,
      ...newDistribution
    });
    
    onClose();
    setFormData({ from: 'ny', to: 'ldn', amount: 10 });
  };

  const fromLocation = locations[formData.from];
  const toLocation = locations[formData.to];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
           <div>
              <h2 className="text-2xl font-black text-gray-900">Transfer Stock</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{item.sku} - {item.name}</p>
           </div>
           <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
           {/* Current Distribution Overview */}
           <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">Current Distribution</p>
              <div className="flex gap-4">
                 <div className="flex-1 text-center">
                    <p className="text-xs font-bold text-cyan-600">NY</p>
                    <p className="text-2xl font-black text-gray-900">{item.ny}%</p>
                 </div>
                 <div className="flex-1 text-center">
                    <p className="text-xs font-bold text-purple-600">LDN</p>
                    <p className="text-2xl font-black text-gray-900">{item.ldn}%</p>
                 </div>
                 <div className="flex-1 text-center">
                    <p className="text-xs font-bold text-orange-600">TYO</p>
                    <p className="text-2xl font-black text-gray-900">{item.tyo}%</p>
                 </div>
              </div>
           </div>

           {/* Transfer Configuration */}
           <div className="space-y-4">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">From Location</label>
                 <select 
                    className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-cyan-500 hover:bg-white border-2 rounded-xl text-sm font-bold transition-all outline-none"
                    value={formData.from}
                    onChange={e => setFormData({...formData, from: e.target.value})}
                 >
                    {Object.entries(locations).map(([key, loc]) => (
                       <option key={key} value={key}>{loc.label} ({loc.current}% available)</option>
                    ))}
                 </select>
              </div>

              <div className="flex items-center justify-center">
                 <div className="text-3xl text-gray-300">→</div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">To Location</label>
                 <select 
                    className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-cyan-500 hover:bg-white border-2 rounded-xl text-sm font-bold transition-all outline-none"
                    value={formData.to}
                    onChange={e => setFormData({...formData, to: e.target.value})}
                 >
                    {Object.entries(locations)
                       .filter(([key]) => key !== formData.from)
                       .map(([key, loc]) => (
                          <option key={key} value={key}>{loc.label} ({loc.current}% current)</option>
                       ))}
                 </select>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Transfer Amount (%)</label>
                 <input 
                    type="number" 
                    min="1"
                    max={fromLocation.current}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-cyan-500 hover:bg-white border-2 rounded-xl text-sm font-bold transition-all outline-none"
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: Number(e.target.value)})}
                 />
                 <p className="text-[10px] text-gray-400 font-medium">
                    Max available: {fromLocation.current}% from {fromLocation.label}
                 </p>
              </div>
           </div>

           {/* Preview */}
           <div className="bg-cyan-50 p-4 rounded-xl border border-cyan-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-cyan-700 mb-2">Transfer Preview</p>
              <div className="flex items-center gap-3 text-sm font-bold">
                 <span className={`text-${fromLocation.color}-600`}>
                    {fromLocation.label}: {fromLocation.current}% → {fromLocation.current - formData.amount}%
                 </span>
                 <span className="text-gray-400">|</span>
                 <span className={`text-${toLocation.color}-600`}>
                    {toLocation.label}: {toLocation.current}% → {toLocation.current + formData.amount}%
                 </span>
              </div>
           </div>

           <button 
              type="submit" 
              className="w-full py-4 bg-cyan-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-cyan-700 shadow-xl shadow-cyan-200 transition-all"
           >
              Execute Transfer
           </button>
        </form>
      </div>
    </div>
  );
}
