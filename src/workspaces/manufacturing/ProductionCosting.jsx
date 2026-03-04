export default function ProductionCosting() {
  return (
    <div className="space-y-8">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Avg Cost Per Unit</p>
             <h3 className="text-3xl font-black text-gray-900 mt-2">$42.50</h3>
             <p className="text-xs font-bold text-gray-400 mt-1">Last 30 Days</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Labor Cost</p>
             <h3 className="text-3xl font-black text-gray-900 mt-2">$12.80</h3>
             <p className="text-xs font-bold text-gray-400 mt-1">Per Unit Avg</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Material Cost</p>
             <h3 className="text-3xl font-black text-gray-900 mt-2">$18.20</h3>
             <p className="text-xs font-bold text-gray-400 mt-1">Per Unit Avg</p>
          </div>
       </div>

       <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-black text-gray-900 mb-6">Cost Breakdown Analysis</h3>
          <div className="space-y-6">
             {[
               { label: "Raw Materials", valid: 45, color: "bg-blue-500" },
               { label: "Direct Labor", valid: 30, color: "bg-emerald-500" },
               { label: "Machine Overhead", valid: 15, color: "bg-amber-500" },
               { label: "Utilities", valid: 10, color: "bg-gray-400" },
             ].map((item, i) => (
                <div key={i}>
                   <div className="flex justify-between mb-2">
                      <span className="text-sm font-bold text-gray-700">{item.label}</span>
                      <span className="text-sm font-black text-gray-900">{item.valid}%</span>
                   </div>
                   <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${item.valid}%` }}></div>
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
}
