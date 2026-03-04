import { useState } from "react";

export default function WhatIfAnalysis() {
  const [salesGrowth, setSalesGrowth] = useState(10);
  const [costReduction, setCostReduction] = useState(5);
  const [taxRate, setTaxRate] = useState(18);

  const baseSales = 2500000;
  const baseCosts = 1800000;

  const projectedSales = baseSales * (1 + salesGrowth / 100);
  const projectedCosts = baseCosts * (1 - costReduction / 100);
  const grossProfit = projectedSales - projectedCosts;
  const netProfit = grossProfit * (1 - taxRate / 100);

  const impactMetrics = [
    { label: "Projected Revenue", value: projectedSales, color: "text-indigo-600", icon: "💰" },
    { label: "Projected Costs", value: projectedCosts, color: "text-red-600", icon: "📉" },
    { label: "Gross Margin", value: grossProfit, color: "text-emerald-600", icon: "📊" },
    { label: "Net Profit (Post-Tax)", value: netProfit, color: "text-purple-600", icon: "🏦" },
  ];

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 text-left">
      
      {/* Simulation Controls */}
      <div className="bg-white p-12 rounded-[56px] border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <div className="text-left">
                <h3 className="text-2xl font-[1000] text-[#111827] tracking-tighter mb-2 leading-none uppercase">Simulation Parameters</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">Adjust variables to see business impact</p>
            </div>
            <div className="px-6 py-3 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Live Recalculation</span>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
           {/* Sales Growth */}
           <div className="space-y-6">
              <div className="flex justify-between items-end">
                <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Expected Sales Growth</label>
                <span className="text-2xl font-black text-indigo-600">{salesGrowth}%</span>
              </div>
              <input 
                type="range" 
                min="-20" 
                max="50" 
                value={salesGrowth} 
                onChange={(e) => setSalesGrowth(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase">
                <span>-20%</span>
                <span>Base (0%)</span>
                <span>+50%</span>
              </div>
           </div>

           {/* Cost Reduction */}
           <div className="space-y-6">
              <div className="flex justify-between items-end">
                <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Cost Optimization</label>
                <span className="text-2xl font-black text-emerald-600">-{costReduction}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="25" 
                value={costReduction} 
                onChange={(e) => setCostReduction(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase">
                <span>0%</span>
                <span>10%</span>
                <span>25%</span>
              </div>
           </div>

           {/* Tax Rate */}
           <div className="space-y-6">
              <div className="flex justify-between items-end">
                <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Projected Tax Rate</label>
                <span className="text-2xl font-black text-purple-600">{taxRate}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="40" 
                value={taxRate} 
                onChange={(e) => setTaxRate(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase">
                <span>0%</span>
                <span>18%</span>
                <span>40%</span>
              </div>
           </div>
        </div>
      </div>

      {/* Impact Calculation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {impactMetrics.map((metric, i) => (
          <div key={i} className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group text-left flex flex-col justify-between min-h-[220px]">
            <div className="flex justify-between items-start">
               <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  {metric.icon}
               </div>
               <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest border border-gray-100 px-3 py-1 rounded-full">Simulated</span>
               </div>
            </div>
            
            <div className="mt-8">
               <p className={`text-4xl font-[1000] tracking-tighter mb-2 leading-none tabular-nums ${metric.color}`}>
                  {formatCurrency(metric.value)}
               </p>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{metric.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="bg-[#111827] text-white p-12 rounded-[56px] shadow-2xl relative overflow-hidden border border-white/5">
         <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full"></div>
         
         <div className="relative z-10">
            <h3 className="text-2xl font-[1000] tracking-tighter mb-8 uppercase">Base vs. Simulated Performance</h3>
            
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10 uppercase tracking-widest font-black text-[10px] text-gray-500">
                      <th className="py-6">Metric</th>
                      <th className="py-6">Current (Base)</th>
                      <th className="py-6">Simulated</th>
                      <th className="py-6">Variance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-bold">
                    <tr>
                      <td className="py-8">Total Revenue</td>
                      <td className="py-8 text-gray-400">{formatCurrency(baseSales)}</td>
                      <td className="py-8 text-indigo-400">{formatCurrency(projectedSales)}</td>
                      <td className="py-8 text-emerald-400">+{salesGrowth}%</td>
                    </tr>
                    <tr>
                      <td className="py-8">Operating Costs</td>
                      <td className="py-8 text-gray-400">{formatCurrency(baseCosts)}</td>
                      <td className="py-8 text-red-400">{formatCurrency(projectedCosts)}</td>
                      <td className="py-8 text-emerald-400">-{costReduction}%</td>
                    </tr>
                    <tr>
                      <td className="py-8">Net Profit</td>
                      <td className="py-8 text-gray-400">{formatCurrency((baseSales - baseCosts) * 0.82)}</td>
                      <td className="py-8 text-purple-400">{formatCurrency(netProfit)}</td>
                      <td className="py-8 text-emerald-400">
                        {Math.round((netProfit / ((baseSales - baseCosts) * 0.82) - 1) * 100)}%
                      </td>
                    </tr>
                  </tbody>
               </table>
            </div>

            <div className="mt-12 flex items-center justify-between p-8 bg-white/5 rounded-[32px] border border-white/10">
               <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 text-2xl">⚡</div>
                  <div>
                    <p className="text-sm font-black mb-1">Impact Analysis Result</p>
                    <p className="text-xs text-gray-400 max-w-lg leading-relaxed">
                      Based on these parameters, the business would see a <span className="text-emerald-400">significant increase</span> in liquidity within 120 days.
                    </p>
                  </div>
               </div>
               <button className="px-8 py-4 bg-white text-[#111827] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-colors">
                  Save Scenario
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
