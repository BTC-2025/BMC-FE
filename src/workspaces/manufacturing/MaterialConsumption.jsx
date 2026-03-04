export default function MaterialConsumption() {
  const materials = [
    { id: "MAT-001", name: "Steel Sheets (Grade A)", Consumed: "500 kg", Remaining: "1,200 kg", UnitCost: "$4.50" },
    { id: "MAT-002", name: "Aluminium Rods", Consumed: "120 m", Remaining: "40 m", UnitCost: "$12.00" },
    { id: "MAT-088", name: "Industrial Glue", Consumed: "50 L", Remaining: "150 L", UnitCost: "$22.00" },
  ];

  return (
    <div className="space-y-8">
       <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black text-gray-900 mb-6">Stock Usage Log</h3>
          <table className="w-full text-left">
             <thead className="border-b border-gray-100">
                <tr>
                   <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Material ID</th>
                   <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</th>
                   <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Today's Usage</th>
                   <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Stock</th>
                   <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cost Impact</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-50 text-sm">
                {materials.map(mat => (
                   <tr key={mat.id} className="group hover:bg-gray-50 transition-colors">
                      <td className="py-4 font-black text-gray-900">{mat.id}</td>
                      <td className="py-4 font-bold text-gray-600">{mat.name}</td>
                      <td className="py-4 font-bold text-blue-600">{mat.Consumed}</td>
                      <td className="py-4 font-medium text-gray-500">{mat.Remaining}</td>
                      <td className="py-4 font-black text-gray-900">{mat.UnitCost}</td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
             <h4 className="text-lg font-black text-amber-800 mb-2">Restock Predictions</h4>
             <p className="text-xs text-amber-700 font-medium mb-6">Based on current production velocity.</p>
             <div className="space-y-3">
                <div className="flex justify-between items-center bg-white/60 p-3 rounded-xl border border-amber-100/50">
                   <span className="text-sm font-bold text-amber-900">Aluminium Rods</span>
                   <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">2 Days Left</span>
                </div>
                <div className="flex justify-between items-center bg-white/60 p-3 rounded-xl border border-amber-100/50">
                   <span className="text-sm font-bold text-amber-900">Fastener Type-C</span>
                   <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">5 Days Left</span>
                </div>
             </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center">
             <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl mb-4">🧱</div>
             <h4 className="font-black text-gray-900">Material Requisition</h4>
             <p className="text-xs text-gray-500 mt-2 max-w-xs mb-6">Generate a purchase request for low-stock items automatically.</p>
             <button className="px-6 py-2 bg-gray-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">Create Request</button>
          </div>
       </div>
    </div>
  );
}
