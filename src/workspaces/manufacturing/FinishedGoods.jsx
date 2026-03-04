export default function FinishedGoods() {
  const goods = [
    { batch: "BATCH-2024-001", product: "Executive Desk Chair", qty: 120, date: "Jan 10, 2024", location: "Warehouse A" },
    { batch: "BATCH-2024-002", product: "Office Cabinet (Metal)", qty: 45, date: "Jan 09, 2024", location: "Warehouse B" },
    { batch: "BATCH-2024-003", product: "Corner Desk Unit", qty: 88, date: "Jan 08, 2024", location: "Zone C-1" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Total Produced (Today)</p>
            <h3 className="text-3xl font-black text-emerald-900">420</h3>
            <p className="text-xs text-emerald-700 mt-2 font-bold">Units</p>
         </div>
         <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Avg. Cycle Time</p>
            <h3 className="text-3xl font-black text-blue-900">42m</h3>
            <p className="text-xs text-blue-700 mt-2 font-bold">Per Unit</p>
         </div>
         <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
            <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-1">Ready to Ship</p>
            <h3 className="text-3xl font-black text-purple-900">1,050</h3>
            <p className="text-xs text-purple-700 mt-2 font-bold">In Warehouse</p>
         </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
         <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
             <h3 className="text-lg font-black text-gray-900">Production Output Log</h3>
             <button className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">Export CSV</button>
         </div>
         <div className="divide-y divide-gray-50">
             {goods.map(item => (
                 <div key={item.batch} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                     <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl">📦</div>
                         <div>
                             <p className="text-sm font-black text-gray-900">{item.product}</p>
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.batch}</p>
                         </div>
                     </div>
                     <div className="text-right">
                         <p className="text-sm font-black text-emerald-600">{item.qty} Units</p>
                         <p className="text-[10px] text-gray-400 uppercase tracking-widest">{item.location}</p>
                     </div>
                 </div>
             ))}
         </div>
      </div>
    </div>
  );
}
