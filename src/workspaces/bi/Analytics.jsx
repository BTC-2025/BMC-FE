import { useState } from "react";

export default function Analytics() {
  const [metric, setMetric] = useState("Revenue");
  const [groupBy, setGroupBy] = useState("Region");
  const [drillPath, setDrillPath] = useState([]); // Array of IDs for drill-down trail
  const [analysisMode, setAnalysisMode] = useState("Composition"); // Composition vs Comparison

  // Hierarchical Data for Drill-Down
  const analyticalData = {
    Region: [
      { id: 'North', label: 'North', value: 12400000, target: 11000000, childrenType: 'Category' },
      { id: 'South', label: 'South', value: 9800000, target: 10500000, childrenType: 'Category' },
      { id: 'East', label: 'East', value: 6400000, target: 6000000, childrenType: 'Category' },
      { id: 'West', label: 'West', value: 14200000, target: 13000000, childrenType: 'Category' },
    ],
    Category: {
      North: [
        { id: 'Electronics', label: 'Electronics', value: 6400000, target: 5800000 },
        { id: 'Apparel', label: 'Apparel', value: 4200000, target: 4000000 },
        { id: 'Grocery', label: 'Grocery', value: 1800000, target: 1200000 },
      ],
      South: [
        { id: 'Electronics', label: 'Electronics', value: 3200000, target: 4500000 },
        { id: 'Apparel', label: 'Apparel', value: 4800000, target: 4500000 },
        { id: 'Grocery', label: 'Grocery', value: 1800000, target: 1500000 },
      ]
    }
  };

  const currentData = drillPath.length === 0 
    ? analyticalData[groupBy] 
    : analyticalData.Category[drillPath[0]] || [];

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const handleDrill = (item) => {
    if (item.childrenType) {
      setDrillPath([...drillPath, item.id]);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 text-left">
      
      {/* Analytics Control Bar */}
      <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm flex flex-wrap items-center justify-between gap-8">
        <div className="flex items-center gap-6">
           {drillPath.length > 0 && (
             <button 
               onClick={() => setDrillPath([])}
               className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-[#195bac] hover:bg-[#195bac]/5 transition-all text-xl"
             >
               ←
             </button>
           )}
           <div>
              <h3 className="text-2xl font-[1000] text-[#111827] tracking-tighter uppercase leading-none">Intelligence Engine</h3>
              <p className="text-[10px] font-black text-gray-400 mt-2 uppercase tracking-[0.2em] leading-none">
                {drillPath.length === 0 ? "Global Data Topology" : `Node Selected: ${drillPath.join(' / ')}`}
              </p>
           </div>
        </div>

        <div className="flex gap-4">
           <select 
             className="bg-gray-50 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#195bac] outline-none border border-transparent hover:border-[#195bac]/20 cursor-pointer appearance-none min-w-[140px]"
             value={metric}
             onChange={(e) => setMetric(e.target.value)}
           >
              <option>Revenue Analysis</option>
              <option>Volume Metrics</option>
              <option>Marginality %</option>
           </select>
           <select 
             className="bg-gray-100/50 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 outline-none border border-transparent hover:border-gray-200 cursor-pointer appearance-none min-w-[140px]"
             value={groupBy}
             onChange={(e) => {setGroupBy(e.target.value); setDrillPath([]);}}
           >
              <option>By Regional Hub</option>
              <option>By Account Tier</option>
              <option>By Logistics Center</option>
           </select>
        </div>
      </div>

      {/* Main Analysis Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
         
         {/* Tree-Map / Bar Analysis (Composition) */}
         <div className="lg:col-span-8 bg-white p-12 rounded-[56px] border border-gray-100 shadow-sm flex flex-col min-h-[600px] relative overflow-hidden">
            <div className="flex items-center justify-between mb-16 relative z-10">
               <div>
                  <h4 className="text-3xl font-[1000] text-[#111827] tracking-tighter uppercase mb-2">Performance Topology</h4>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Visualizing {metric} by {drillPath.length > 0 ? 'Category' : groupBy}</p>
               </div>
               <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-1.5 h-6 bg-indigo-600/10 rounded-full"></div>
                  ))}
               </div>
            </div>

            <div className="space-y-12 flex-1 flex flex-col justify-center relative z-10">
               {currentData.map((item) => {
                 const percentage = Math.round((item.value / item.target) * 100);
                 const isMet = item.value >= item.target;
                 return (
                   <div 
                     key={item.id} 
                     onClick={() => handleDrill(item)}
                     className="group cursor-pointer relative"
                   >
                      <div className="flex justify-between items-end mb-5">
                         <div className="text-left">
                            <p className="text-lg font-black text-[#111827] group-hover:text-[#195bac] transition-colors uppercase tracking-tight">{item.label}</p>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">Target: {formatCurrency(item.target)}</p>
                         </div>
                         <div className="text-right">
                            <p className="text-3xl font-[1000] text-gray-950 tracking-tighter leading-none">{formatCurrency(item.value)}</p>
                            <div className="flex items-center gap-2 justify-end mt-2">
                               <div className={`w-2 h-2 rounded-full ${isMet ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`}></div>
                               <p className={`text-[10px] font-black uppercase ${isMet ? 'text-emerald-500' : 'text-rose-500'}`}>{percentage}% Completion</p>
                            </div>
                         </div>
                      </div>
                       <div className="w-full h-10 bg-gray-50 rounded-[20px] overflow-hidden relative border border-gray-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                          <div 
                            className={`h-full transition-all duration-1000 shadow-[0_4px_20px_rgba(0,0,0,0.1)] relative ${isMet ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500' : 'bg-slate-900'}`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          >
                             <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          </div>
                         {item.childrenType && (
                           <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-white/40 uppercase group-hover:text-white transition-all transform group-hover:translate-x-2">
                               Drill Nodes →
                           </div>
                         )}
                      </div>
                   </div>
                 );
               })}
            </div>

            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-50/50 rounded-full blur-[80px] -z-0"></div>
         </div>

         {/* Statistical Context (Sidebar) */}
         <div className="lg:col-span-4 space-y-12">
            <div className="bg-[#111827] text-white p-12 rounded-[56px] shadow-2xl relative overflow-hidden flex flex-col group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full group-hover:bg-indigo-500/20 transition-all duration-700"></div>
               <div className="relative z-10 text-left">
                  <div className="flex items-center gap-3 mb-10">
                     <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Sector Variance</h4>
                     <div className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[8px] font-black rounded uppercase">Audit Passed</div>
                  </div>
                  
                  <div className="space-y-10">
                     <div className="relative">
                        <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">MoM Growth Curve</p>
                        <p className="text-5xl font-[1000] text-emerald-400 tracking-tighter tabular-nums">+14.2%</p>
                        <div className="absolute top-0 left-full ml-4 opacity-20 hidden md:block">
                           <svg className="w-24 h-12" viewBox="0 0 100 40">
                              <path d="M0 40 L20 30 L40 35 L60 15 L80 20 L100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                           </svg>
                        </div>
                     </div>
                     
                     <div>
                        <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Cycle Std. Deviation</p>
                        <p className="text-5xl font-[1000] text-indigo-400 tracking-tighter tabular-nums">0.08X</p>
                     </div>

                     <div className="pt-10 border-t border-white/5">
                        <p className="text-sm font-bold text-gray-500 leading-relaxed">
                           Analytical engines report <span className="text-white">nominal drift</span> in the current processing window. Resource allocation remains optimal.
                        </p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white p-12 rounded-[56px] border border-gray-100 shadow-sm text-left relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-1/2 h-full bg-gray-50/50 -skew-x-12 translate-x-1/2 group-hover:translate-x-1/3 transition-transform duration-700"></div>
               <div className="relative z-10">
                  <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-10">Global Quota Status</h4>
                  <div className="flex flex-col items-center py-4">
                     <div className="w-40 h-40 rounded-full border-[16px] border-slate-50 relative flex items-center justify-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)]">
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                           <circle 
                             cx="80" cy="80" r="64" 
                             fill="transparent" 
                             stroke="url(#grad1)" 
                             strokeWidth="16" 
                             strokeDasharray="402" 
                             strokeDashoffset="0"
                             strokeLinecap="round"
                             className="transition-all duration-1000"
                           />
                           <defs>
                              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                 <stop offset="0%" style={{ stopColor: '#4f46e5', stopOpacity: 1 }} />
                                 <stop offset="100%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
                              </linearGradient>
                           </defs>
                        </svg>
                        <div className="text-center">
                           <p className="text-3xl font-[1000] text-[#111827] leading-none mb-1">100%</p>
                           <p className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">Active Met</p>
                        </div>
                     </div>
                     <p className="text-[10px] font-black text-center text-gray-400 uppercase tracking-widest mt-10">Real-time aggregate of all hubs</p>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Characteristics Guide */}
      <div className="bg-[#111827] text-white p-12 rounded-[56px] border border-white/5 shadow-2xl relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[120px] rounded-full"></div>
        <div className="relative z-10 max-w-4xl">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/10 text-emerald-400 mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-widest">Analytics Protocol v4.2</span>
           </div>
           <p className="text-4xl font-[1000] tracking-tighter mb-6 leading-tight">
              Granular Data Mining. <br />
              <span className="text-gray-500">Multidimensional Benchmark.</span>
           </p>
           <p className="text-base font-bold text-gray-500 leading-relaxed">
             Our analytics layer converts raw operational streams into actionable intelligence. By slicing metrics across regions and categories, the platform identifies invisible opportunities and predicts frictional variances before they impact the bottom line.
           </p>
        </div>
      </div>
    </div>
  );
}
