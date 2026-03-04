import { useState } from "react";
import BaseModal from "../../components/ui/BaseModal";

export default function ExternalData() {
  const [sources, setSources] = useState([
    { id: 'EXT-001', name: 'Market Intelligence Feed', type: 'RSS/JSON', url: 'https://api.marketdata.com/v1', status: 'Connected', lastSync: '10 mins ago' },
    { id: 'EXT-002', name: 'Global Logistics API', type: 'REST', url: 'https://logistics.global/track', status: 'Pending', lastSync: 'Never' },
    { id: 'EXT-003', name: 'Competitor Pricing Sheet', type: 'CSV Upload', url: 'competitor_q1.csv', status: 'Active', lastSync: '2 days ago' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 text-left">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="text-left">
            <h3 className="text-3xl font-[1000] text-[#111827] tracking-tighter mb-2 leading-none uppercase">External Data Nodes</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">Connect external endpoints or upload custom data structures</p>
         </div>
         <button 
           onClick={() => setShowAddModal(true)}
           className="px-8 py-4 bg-[#111827] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#195bac] transition-all shadow-xl flex items-center gap-3 w-fit"
         >
           <span>+</span> Add External Source
         </button>
      </div>

      {/* Grid of Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sources.map((source) => (
          <div 
            key={source.id}
            className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden flex flex-col justify-between min-h-[300px]"
          >
             <div className="flex justify-between items-start mb-8">
                <div className="w-16 h-16 bg-gray-50 rounded-[28px] flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                   {source.type === 'REST' ? '🔌' : source.type === 'CSV Upload' ? '📄' : '📡'}
                </div>
                <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest ${source.status === 'Connected' ? 'bg-emerald-50 text-emerald-600' : source.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                   {source.status}
                </span>
             </div>

             <div className="flex-1">
                <h4 className="text-xl font-[1000] text-[#111827] mb-2 leading-tight group-hover:text-[#195bac] transition-colors">{source.name}</h4>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">{source.type} Source</p>
                
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-6">
                   <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Endpoint / Reference</p>
                   <p className="text-xs font-bold text-gray-600 truncate">{source.url}</p>
                </div>
             </div>

             <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <div className="text-left">
                   <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Last Refreshed</p>
                   <p className="text-[10px] font-black text-gray-900">{source.lastSync}</p>
                </div>
                <div className="flex gap-2">
                   <button className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">⚙️</button>
                   <button className="p-3 bg-rose-50 rounded-xl text-rose-500 hover:bg-rose-100 transition-colors">🗑️</button>
                </div>
             </div>
          </div>
        ))}

        {/* Empty Placeholder / Call to Action */}
        <div className="bg-gray-50 border-2 border-dashed border-gray-100 rounded-[48px] p-10 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-[#195bac]/30 transition-all min-h-[300px]">
           <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl mb-6 shadow-sm group-hover:scale-110 transition-transform">
              🔗
           </div>
           <p className="text-sm font-[1000] text-gray-400 uppercase tracking-widest">Connect New Node</p>
        </div>
      </div>

      {/* Integration Guide */}
      <div className="bg-[#111827] text-white p-12 rounded-[56px] shadow-2xl relative overflow-hidden border border-white/5">
         <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full"></div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
            <div>
               <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4">Enterprise Data Lake</h4>
               <p className="text-2xl font-[1000] tracking-tighter mb-4 leading-tight">Bring your own data into the BI Hub.</p>
               <p className="text-sm font-bold text-gray-500 max-w-xl leading-relaxed">
                  The BI Hub supports linking external JSON/REST endpoints and manual CSV uploads. 
                  Once connected, this data can be cross-referenced in the **Analytic Matrix** and **Dashboard Builder**. 
                  No personal identifier data is processed beyond the logic layer.
               </p>
            </div>
            <div className="flex gap-10">
               <div className="text-center">
                  <p className="text-4xl font-[1000] text-white tracking-tighter mb-1">12</p>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Active Links</p>
               </div>
               <div className="text-center">
                  <p className="text-4xl font-[1000] text-blue-400 tracking-tighter mb-1">100%</p>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Safe Tunnel</p>
               </div>
            </div>
         </div>
      </div>

      {/* Mock Add Modal */}
      <BaseModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} className="max-w-lg">
          <div className="p-12">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-[1000] text-[#111827] tracking-tighter uppercase leading-none">New Data Node</h3>
                <button onClick={() => setShowAddModal(false)} className="text-2xl text-gray-400 hover:text-black">×</button>
             </div>

             <div className="space-y-8">
                <div>
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Source Type</label>
                   <div className="grid grid-cols-2 gap-4">
                      <button className="px-5 py-4 bg-[#195bac] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/10">REST API</button>
                      <button className="px-5 py-4 bg-gray-50 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-gray-100">CSV/Excel</button>
                   </div>
                </div>

                <div>
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Node Name</label>
                   <input type="text" placeholder="e.g. Sales Forecast External" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none font-bold text-gray-900 focus:border-[#195bac]/50 transition-colors" />
                </div>

                <div>
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Endpoint URL</label>
                   <input type="text" placeholder="https://" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none font-bold text-gray-600 focus:border-[#195bac]/50 transition-colors" />
                </div>

                <button 
                  onClick={() => setShowAddModal(false)}
                  className="w-full py-4 bg-[#111827] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#195bac] transition-all mt-4"
                >
                  Connect Source
                </button>
             </div>
          </div>
      </BaseModal>
    </div>
  );
}
