import { useManufacturing } from "../../context/ManufacturingContext";

export default function BillsOfMaterials() {
  const { boms, createBOM, loading } = useManufacturing();

  // Fallback for empty list
  const displayBoms = boms && boms.length > 0 ? boms : [
    { id: "BOM-1001", name: "Executive Desk Chair", product: "Furniture / Seating", version: "v2.1", status: "Active" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-gray-900">Active Formulations</h3>
        <button 
           onClick={() => {
               // Quick hack to create a BOM for testing if none exist
               createBOM({
                   name: "Standard Office Desk",
                   finished_item_id: 1, // Assume item 1 is desk
                   items: [
                       { raw_item_id: 2, quantity_required: 4 } // 4 legs
                   ]
               });
           }}
           className="px-6 py-2.5 bg-amber-500 text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg shadow-amber-200"
        >
           + New BOM
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">BOM ID</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Name</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Category</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Version</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
             {displayBoms.map((bom) => (
               <tr key={bom.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                 <td className="px-6 py-5 font-black text-gray-900">{typeof bom.id === 'string' ? bom.id : `BOM-${bom.id}`}</td>
                 <td className="px-6 py-5 font-bold text-gray-700">{bom.name}</td>
                 <td className="px-6 py-5 text-gray-500 font-medium">{bom.product || "General"}</td>
                 <td className="px-6 py-5 font-bold text-gray-900">{bom.version || "v1.0"}</td>
                 <td className="px-6 py-5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
                       ${bom.status === 'Active' || !bom.status ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-600'}`}>
                       {bom.status || "Active"}
                    </span>
                 </td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
