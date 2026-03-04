import { useState } from "react";

export default function ShipmentModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    origin_code: "SO-" + Math.floor(1000 + Math.random() * 9000),
    carrier: "FedEx",
    status: "PACKED"
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-xl z-[9999] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
      <div className="bg-white rounded-[48px] shadow-2xl w-full max-w-xl overflow-hidden border border-white">
        <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="text-left space-y-1">
            <h2 className="text-2xl font-black text-[#111827] tracking-tighter leading-none">Initialize Shipment</h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Logistics & Fulfillment Protocol</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-rose-500 transition-all shadow-sm font-black"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-12 space-y-8 text-left bg-white">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">Origin Code / Reference</label>
              <input 
                type="text" 
                className="w-full bg-gray-50 border border-gray-200 rounded-[20px] px-8 py-5 text-base font-black text-[#1E293B] focus:ring-4 focus:ring-blue-50 outline-none" 
                required 
                placeholder="e.g. SO-1204"
                value={formData.origin_code} 
                onChange={e => setFormData({...formData, origin_code: e.target.value})} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">Network Carrier</label>
              <select 
                className="w-full bg-gray-50 border border-gray-200 rounded-[20px] px-8 py-5 text-sm font-black text-[#1E293B] focus:ring-4 focus:ring-blue-50 outline-none transition-all" 
                required 
                value={formData.carrier} 
                onChange={e => setFormData({...formData, carrier: e.target.value})}
              >
                <option value="FedEx">FedEx - Priority Overnight</option>
                <option value="UPS">UPS - Ground Logistics</option>
                <option value="DHL">DHL - Express Worldwide</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">Initial Status</label>
              <select 
                className="w-full bg-gray-50 border border-gray-200 rounded-[20px] px-8 py-5 text-sm font-black text-[#1E293B] focus:ring-4 focus:ring-blue-50 outline-none" 
                value={formData.status} 
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option value="PACKED">PACKED - Ready for Pickup</option>
                <option value="IN_TRANSIT">IN TRANSIT - Logistics Hub</option>
                <option value="SHIPPED">SHIPPED - Outbound Complete</option>
              </select>
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit" 
              className="w-full bg-[#111827] text-white py-6 rounded-[24px] text-[11px] font-black uppercase tracking-[0.25em] shadow-2xl transition-all hover:-translate-y-1 hover:bg-black active:scale-95 flex items-center justify-center gap-3"
            >
              <span className="text-lg">📦</span>
              Generate Shipment Token
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
