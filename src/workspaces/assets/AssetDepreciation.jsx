import { useFinance } from "../../context/FinanceContext";
import { formatNumber } from "../../utils/formatters";

export default function AssetDepreciation() {
  const { assets } = useFinance();

  // Simple Depreciation Mock Logic (Straight-Line Method)
  // Assuming 5 years average life, 10% salvage value
  const calculateDepreciation = (value, purchaseDate) => {
    const initial = Number(value);
    const purchaseYear = new Date(purchaseDate).getFullYear() || 2025;
    const currentYear = new Date().getFullYear();
    const yearsOwned = Math.max(0.5, currentYear - purchaseYear + 1); 
    const annualDep = (initial * 0.9) / 5; // 5 year life
    const totalDep = Math.min(initial * 0.9, annualDep * yearsOwned);
    return {
        annual: annualDep,
        total: totalDep,
        bookValue: initial - totalDep,
        percent: ((totalDep / initial) * 100).toFixed(1)
    };
  };

  const totalDepreciation = assets.reduce((acc, a) => acc + calculateDepreciation(a.value, a.purchaseDate).total, 0);

  return (
    <div className="p-8 md:p-12 max-w-[1700px] mx-auto space-y-12 animate-in fade-in duration-700 text-left">
      
      {/* Header Segment */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-gray-100">
        <div className="space-y-4 text-left">
            <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 bg-[#111827] text-white text-[10px] font-black uppercase tracking-[0.25em] rounded-full shadow-lg">FISCAL VALUE CURVE</span>
                <span className="text-gray-300">•</span>
                <span className="text-xs font-bold text-gray-400 capitalize">Straight-Line Method (SLM) Baseline</span>
            </div>
            <h2 className="text-5xl font-[1000] text-[#111827] tracking-tighter leading-none text-left">
                Depreciation <span className="text-[#195bac]">Analytics</span>
            </h2>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="p-8 bg-[#111827] rounded-[40px] shadow-2xl flex items-center gap-10 group relative overflow-hidden">
                <div className="relative z-10 text-left">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mb-2">Portfolio Value Loss (YTD)</p>
                    <p className="text-4xl font-[1000] text-white tracking-tighter leading-none">${formatNumber(totalDepreciation)}</p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">📉</div>
                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full"></div>
            </div>
        </div>
      </div>

      {/* Summary Metrics Cards (Golden Ratio) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white p-10 rounded-[56px] border border-gray-100 shadow-sm flex flex-col justify-between aspect-[1.618/1] group hover:shadow-2xl transition-all duration-700 text-left">
              <div className="flex justify-between items-start">
                  <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center text-3xl shadow-sm border border-amber-100/30 group-hover:rotate-6 transition-transform">🕰️</div>
                  <span className="text-[10px] font-black bg-gray-50 text-gray-400 px-4 py-2 rounded-xl border border-gray-100 uppercase tracking-widest">Configuration Active</span>
              </div>
              <div className="text-left">
                  <h4 className="text-4xl font-[1000] text-[#111827] tracking-tighter mb-1.5">5.0 Years</h4>
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Standardized Asset Life-Cycle</p>
              </div>
          </div>

          <div className="bg-white p-10 rounded-[56px] border border-gray-100 shadow-sm flex flex-col justify-between aspect-[1.618/1] group hover:shadow-2xl transition-all duration-700 text-left">
              <div className="flex justify-between items-start">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl shadow-sm border border-emerald-100/30 group-hover:rotate-6 transition-transform">♻️</div>
                  <span className="text-[10px] font-black bg-gray-50 text-gray-400 px-4 py-2 rounded-xl border border-gray-100 uppercase tracking-widest">Global Policy</span>
              </div>
              <div className="text-left">
                  <h4 className="text-4xl font-[1000] text-[#111827] tracking-tighter mb-1.5">10.0%</h4>
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Residual Salvage Threshold</p>
              </div>
          </div>
      </div>

      {/* Depreciation Ledger */}
      <div className="space-y-8 text-left">
          <h3 className="text-2xl font-[1000] text-[#111827] tracking-tighter flex items-center gap-3 px-4">
              Value Erosion Ledger
              <span className="text-xs font-bold text-gray-400 py-1 px-3 bg-gray-100 rounded-lg">Real-time Calculation</span>
          </h3>
          
          <div className="bg-white rounded-[56px] border border-gray-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] overflow-hidden text-left relative isolate">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent pointer-events-none"></div>
            <table className="w-full relative z-10">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="px-12 py-8 text-[11px] font-black text-[#9CA3AF] uppercase tracking-[0.3em] text-left">Asset Details</th>
                  <th className="px-12 py-8 text-[11px] font-black text-[#9CA3AF] uppercase tracking-[0.3em] text-left">Cost Basis</th>
                  <th className="px-12 py-8 text-[11px] font-black text-[#9CA3AF] uppercase tracking-[0.3em] text-left">Accumulated Dep.</th>
                  <th className="px-12 py-8 text-[11px] font-black text-[#9CA3AF] uppercase tracking-[0.3em] text-left">Book Value</th>
                  <th className="px-12 py-8 text-right text-[11px] font-black text-[#9CA3AF] uppercase tracking-[0.3em]">Utilization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50/80 text-left">
                {assets.map((a) => {
                  const dep = calculateDepreciation(a.value, a.purchaseDate);
                  return (
                    <tr key={a.id} className="hover:bg-gray-50 transition-all group">
                      <td className="px-12 py-8 text-left">
                        <p className="text-[15px] font-[900] text-[#1E293B] group-hover:text-[#195bac] transition-colors">{a.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Entered: {a.purchaseDate}</p>
                      </td>
                      <td className="px-12 py-8 text-left">
                        <p className="text-[14px] font-[900] text-gray-500">${formatNumber(a.value)}</p>
                      </td>
                      <td className="px-12 py-8 text-left text-rose-500">
                        <p className="text-[14px] font-[1000] tracking-tighter">-${formatNumber(dep.total)}</p>
                      </td>
                      <td className="px-12 py-8 text-left">
                        <p className="text-[16px] font-[1000] text-[#111827] tracking-tighter">${formatNumber(dep.bookValue)}</p>
                      </td>
                      <td className="px-12 py-8 text-right">
                         <div className="flex flex-col items-end gap-2 text-left">
                           <span className="text-[10px] font-black text-[#195bac] bg-[#e9f4ff] px-2.5 py-1 rounded-lg">{dep.percent}%</span>
                           <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[#195bac]" style={{ width: `${dep.percent}%` }}></div>
                           </div>
                         </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
}
