import { useState } from "react";
import { BI_KPI_TEMPLATES } from "../../data/biKpiData";

export default function BICustomization() {
  const [selectedModule, setSelectedModule] = useState('Sales');
  const [activeWidgets, setActiveWidgets] = useState([]);

  const toggleWidget = (kpi) => {
    if (activeWidgets.find(w => w.id === kpi.id)) {
      setActiveWidgets(activeWidgets.filter(w => w.id !== kpi.id));
    } else {
      setActiveWidgets([...activeWidgets, kpi]);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 text-left">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="text-left">
            <h3 className="text-3xl font-[1000] text-[#111827] tracking-tighter mb-2 leading-none uppercase">Dashboard Builder</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">Customize your visual workspace by pinning key metrics</p>
         </div>
         <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
            {Object.keys(BI_KPI_TEMPLATES).map(mod => (
              <button 
                key={mod}
                onClick={() => setSelectedModule(mod)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedModule === mod ? 'bg-[#195bac] text-white' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {mod}
              </button>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
         {/* KPI Library */}
         <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {BI_KPI_TEMPLATES[selectedModule].map((kpi) => (
                  <div 
                    key={kpi.id}
                    onClick={() => toggleWidget(kpi)}
                    className={`p-8 rounded-[40px] border transition-all duration-500 cursor-pointer group relative overflow-hidden flex flex-col justify-between min-h-[180px] ${activeWidgets.find(w => w.id === kpi.id) ? 'bg-[#195bac] border-[#195bac] shadow-xl shadow-blue-500/20' : 'bg-white border-gray-100 hover:border-[#195bac]/30 shadow-sm'}`}
                  >
                     <div className="flex justify-between items-start">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all ${activeWidgets.find(w => w.id === kpi.id) ? 'bg-white/20 text-white' : 'bg-gray-50 text-gray-400 group-hover:scale-110'}`}>
                           {kpi.id.startsWith('SC') ? '🌐' : 
                            kpi.id.startsWith('S-') ? '📈' : 
                            kpi.id.startsWith('F') ? '🏦' : 
                            kpi.id.startsWith('I') ? '📦' : 
                            kpi.id.startsWith('H') ? '👥' : 
                            kpi.id.startsWith('C') ? '🤝' : 
                            kpi.id.startsWith('P') ? '🚀' : '🏭'}
                        </div>
                        {activeWidgets.find(w => w.id === kpi.id) && (
                           <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-[10px] text-[#195bac]">✓</div>
                        )}
                     </div>
                     <div>
                        <h4 className={`text-lg font-[1000] mb-1 leading-tight ${activeWidgets.find(w => w.id === kpi.id) ? 'text-white' : 'text-[#111827]'}`}>{kpi.label}</h4>
                        <p className={`text-[9px] font-black uppercase tracking-widest ${activeWidgets.find(w => w.id === kpi.id) ? 'text-white/60' : 'text-gray-400'}`}>Template: {kpi.formula}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Sidebar Preview */}
         <div className="lg:col-span-4 bg-gray-900 rounded-[56px] p-10 flex flex-col text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full"></div>
            <div className="relative z-10 flex-1 space-y-8">
               <div className="text-left">
                  <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4">Preview Layout</h4>
                  <p className="text-xl font-[1000] tracking-tighter mb-2">My Custom View</p>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{activeWidgets.length} Metrics Selected</p>
               </div>

               <div className="space-y-4">
                  {activeWidgets.length === 0 ? (
                    <div className="py-20 border-2 border-dashed border-white/10 rounded-[32px] flex flex-col items-center justify-center text-center opacity-40">
                       <span className="text-4xl mb-4">🎨</span>
                       <p className="text-xs font-black uppercase tracking-widest">Select KPIs to preview</p>
                    </div>
                  ) : (
                    activeWidgets.map((w, idx) => (
                      <div key={idx} className="p-5 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
                         <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl shrink-0">📍</div>
                         <div className="flex-1 text-left">
                            <p className="text-sm font-black text-white">{w.label}</p>
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{w.unit} • {w.formula}</p>
                         </div>
                         <button onClick={(e) => { e.stopPropagation(); toggleWidget(w); }} className="text-gray-500 hover:text-white transition-colors">×</button>
                      </div>
                    ))
                  )}
               </div>

               <button className="mt-auto w-full py-4 bg-white text-[#111827] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center justify-center gap-3">
                  Save Dashboard
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
