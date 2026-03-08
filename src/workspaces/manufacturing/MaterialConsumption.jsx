import { useManufacturing } from "../../context/ManufacturingContext";

export default function MaterialConsumption() {
  const { rawOrders, boms } = useManufacturing();

  // Aggregate consumed materials from completed orders' BOM items
  const consumptionMap = {};
  rawOrders
    .filter((o) => o.status === "COMPLETED" || o.status === "IN_PROGRESS")
    .forEach((wo) => {
      const bom = boms.find((b) => b.id === wo.bom_id);
      if (bom?.items) {
        bom.items.forEach((item) => {
          const key = item.raw_item_id;
          if (!consumptionMap[key]) {
            consumptionMap[key] = {
              id: `MAT-${String(key).padStart(3, "0")}`,
              name: `Inventory Item #${key}`,
              totalConsumed: 0,
              totalOrders: 0,
            };
          }
          consumptionMap[key].totalConsumed += parseFloat(item.quantity_required) * wo.quantity_to_produce;
          consumptionMap[key].totalOrders += 1;
        });
      }
    });

  const materials = Object.values(consumptionMap);

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-gray-900">Material Consumption Log</h3>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Based on completed & in-progress WOs</span>
        </div>

        {materials.length === 0 ? (
          <div className="py-10 text-center border border-dashed border-gray-200 rounded-xl">
            <p className="text-gray-400 font-bold text-sm">No consumption data available.</p>
            <p className="text-gray-400 text-xs mt-1">Complete a work order to see material consumption here.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="border-b border-gray-100">
              <tr>
                <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Material ID</th>
                <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</th>
                <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Consumed</th>
                <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Used in WOs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {materials.map((mat) => (
                <tr key={mat.id} className="group hover:bg-gray-50 transition-colors">
                  <td className="py-4 font-black text-gray-900">{mat.id}</td>
                  <td className="py-4 font-bold text-gray-600">{mat.name}</td>
                  <td className="py-4 font-bold text-blue-600">{mat.totalConsumed.toLocaleString()} units</td>
                  <td className="py-4 font-medium text-gray-500">{mat.totalOrders} orders</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
          <h4 className="text-lg font-black text-amber-800 mb-2">Restock Guidance</h4>
          <p className="text-xs text-amber-700 font-medium mb-4">Items with high recorded consumption may need restocking. Check inventory module for current stock levels.</p>
          {materials.slice(0, 3).map((m) => (
            <div key={m.id} className="flex justify-between items-center bg-white/60 p-3 rounded-xl border border-amber-100/50 mb-2">
              <span className="text-sm font-bold text-amber-900">{m.name}</span>
              <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{m.totalConsumed.toLocaleString()} used</span>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl mb-4">🧱</div>
          <h4 className="font-black text-gray-900">Material Requisition</h4>
          <p className="text-xs text-gray-500 mt-2 max-w-xs mb-6">Generate a purchase request for low-stock items via the Supply Chain → Procurement module.</p>
          <a href="#" className="px-6 py-2 bg-gray-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">
            Go to Procurement
          </a>
        </div>
      </div>
    </div>
  );
}
