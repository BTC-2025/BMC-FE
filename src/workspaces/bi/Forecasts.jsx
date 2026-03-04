import { useState } from "react";
import { useBI } from "../../context/BIContext";
import BaseModal from "../../components/ui/BaseModal";

export default function Forecasts() {
  const { forecasts } = useBI();
  const [editingForecast, setEditingForecast] = useState(null);

  const getTrendColor = (trend) => {
    switch(trend) {
      case 'growing': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'declining': return 'bg-red-50 text-red-600 border-red-100';
      case 'warning': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-indigo-50 text-indigo-600 border-indigo-100';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 text-left">
      {/* Forecast Cards */}
      <div className="grid grid-cols-1 gap-12">
        {forecasts.map((forecast) => (
          <div 
            key={forecast.id}
            className="bg-white p-12 rounded-[56px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-700 group relative overflow-hidden text-left"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Prediction Details */}
              <div className="lg:col-span-7 space-y-10">
                 <div className="flex items-start justify-between">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 rounded-[24px] bg-indigo-50 text-indigo-600 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm border border-indigo-100/50">
                          {forecast.metric === 'Operational Cost' ? '📉' : '📈'}
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Target Dimension</p>
                          <h4 className="text-3xl font-[1000] text-[#111827] tracking-tighter leading-none">{forecast.metric}</h4>
                       </div>
                    </div>
                    <button 
                      onClick={() => setEditingForecast(forecast)}
                      className="px-6 py-2.5 bg-gray-50 hover:bg-indigo-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                    >
                      Refine Model
                    </button>
                 </div>

                 <div className="p-8 bg-gradient-to-br from-indigo-50/50 to-white rounded-[32px] border border-indigo-100/30 relative">
                    <div className="flex justify-between items-center mb-8">
                       <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Prediction Statement</p>
                       <span className="px-3 py-1 bg-white border border-indigo-100 rounded-full text-[9px] font-black text-indigo-400 uppercase tracking-widest">AI Certified</span>
                    </div>
                    <p className="text-2xl font-[1000] text-[#111827] leading-tight tracking-tighter">
                       Expected to reach <span className="text-indigo-600">{forecast.predicted}</span> by end of cycle with <span className="text-emerald-500">{forecast.confidence}</span> confidence.
                    </p>
                 </div>

                 <div className="grid grid-cols-2 gap-8">
                    <div className="p-8 bg-gray-50/50 rounded-[32px] border border-gray-100/50">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Model Selection</p>
                       <p className="text-lg font-black text-gray-700">{forecast.model}</p>
                    </div>
                    <div className="p-8 bg-gray-50/50 rounded-[32px] border border-gray-100/50">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Variance Tolerance</p>
                       <p className="text-lg font-black text-gray-700">{forecast.variance}</p>
                    </div>
                 </div>
              </div>

              {/* Time Series Visualization */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                 <div className="bg-[#111827] rounded-[48px] p-10 h-full flex flex-col text-white shadow-2xl relative overflow-hidden group/chart">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full"></div>
                    
                    <div className="flex justify-between items-center mb-12">
                       <h5 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em]">Projected Trendline</h5>
                       <span className="text-[10px] font-black bg-white/5 px-3 py-1 rounded-full text-emerald-400 uppercase tracking-widest animate-pulse">Live</span>
                    </div>

                    <div className="flex-1 flex items-end justify-between gap-3 min-h-[160px] pb-6">
                       {forecast.data?.map((val, i) => (
                         <div key={i} className="flex-1 bg-white/5 rounded-t-lg relative group/bar hover:bg-white/10 transition-all cursor-help" style={{ height: '100%' }}>
                            <div 
                              className="absolute bottom-0 left-0 right-0 bg-indigo-600/40 group-hover/bar:bg-indigo-500 transition-all rounded-t-sm shadow-[0_0_15px_rgba(79,70,229,0.3)]"
                              style={{ height: `${val}%` }}
                            >
                               {i === forecast.data.length - 1 && (
                                 <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full border-2 border-indigo-600 shadow-xl shadow-indigo-600/50 z-10"></div>
                               )}
                            </div>
                         </div>
                       ))}
                    </div>

                    <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pt-6 border-t border-white/5">
                       <span>Historical</span>
                       <span>Current</span>
                       <span className="text-indigo-400 font-black">Predicted (90d)</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Configuration Modal */}
      <BaseModal 
        isOpen={!!editingForecast} 
        onClose={() => setEditingForecast(null)} 
        className="max-w-xl"
      >
        <div className="p-10">
           <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-2xl font-[1000] text-[#111827] tracking-tighter uppercase leading-none">Forecast Config</h3>
                <p className="text-[10px] font-black text-gray-400 mt-2 uppercase tracking-widest">{editingForecast?.metric}</p>
              </div>
              <button onClick={() => setEditingForecast(null)} className="text-gray-400 hover:text-gray-900 transition-colors text-2xl">×</button>
           </div>

           <div className="space-y-8">
              <div>
                <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-4 block">Calculation Method</label>
                <div className="grid grid-cols-1 gap-3">
                   {[
                     { id: 'MA', name: 'Moving Average', desc: 'Smoothes volatility based on N-period history' },
                     { id: 'LT', name: 'Linear Trend', desc: 'Extrapolates growth line into the future' },
                     { id: 'SA', name: 'Seasonal Average', desc: 'Adjusts for cyclical high/low periods' },
                   ].map(method => (
                      <button 
                        key={method.id}
                        className={`p-5 rounded-2xl border text-left transition-all ${editingForecast?.model?.includes(method.name) ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/20' : 'border-gray-100 hover:border-indigo-200'}`}
                      >
                         <p className={`text-sm font-black mb-1 ${editingForecast?.model?.includes(method.name) ? 'text-indigo-600' : 'text-gray-900'}`}>{method.name}</p>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{method.desc}</p>
                      </button>
                   ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Wait Time</label>
                  <select className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none cursor-pointer">
                     <option>3 Months</option>
                     <option>6 Months</option>
                     <option>12 Months</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Confidence Threshold</label>
                  <select className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none cursor-pointer">
                     <option>85% (Aggressive)</option>
                     <option>90% (Standard)</option>
                     <option>95% (Conservative)</option>
                  </select>
                </div>
              </div>

              <div className="pt-6">
                 <button 
                   onClick={() => setEditingForecast(null)}
                   className="w-full py-4 bg-[#111827] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all"
                 >
                   Update Forecast
                 </button>
              </div>
           </div>
        </div>
      </BaseModal>
    </div>
  );
}
