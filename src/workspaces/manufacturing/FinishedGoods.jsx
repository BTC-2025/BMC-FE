import { useManufacturing } from "../../context/ManufacturingContext";

export default function FinishedGoods() {
  const { completedOrders, boms, stats } = useManufacturing();

  const totalProduced = completedOrders.reduce((s, o) => s + (o.quantity_to_produce || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Total Units Produced</p>
          <h3 className="text-3xl font-black text-emerald-900">{totalProduced.toLocaleString()}</h3>
          <p className="text-xs text-emerald-700 mt-2 font-bold">All time</p>
        </div>
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Completed Work Orders</p>
          <h3 className="text-3xl font-black text-blue-900">{completedOrders.length}</h3>
          <p className="text-xs text-blue-700 mt-2 font-bold">Successfully executed</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
          <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-1">Distinct Products</p>
          <h3 className="text-3xl font-black text-purple-900">{new Set(completedOrders.map((o) => o.bom_id)).size}</h3>
          <p className="text-xs text-purple-700 mt-2 font-bold">Unique BOMs produced</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-black text-gray-900">Production Output Log</h3>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{completedOrders.length} records</span>
        </div>

        {completedOrders.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 font-bold text-sm">No completed production runs yet.</p>
            <p className="text-gray-400 text-xs mt-1">Execute a work order to see finished goods here.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {completedOrders.map((wo) => {
              const bom = boms.find((b) => b.id === wo.bom_id);
              const bomName = bom?.name || `BOM #${wo.bom_id}`;
              return (
                <div key={wo.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-xl">📦</div>
                    <div>
                      <p className="text-sm font-black text-gray-900">{bomName}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">WO-{String(wo.id).padStart(4, "0")}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-emerald-600">{wo.quantity_to_produce} Units</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                      {wo.created_at ? new Date(wo.created_at).toLocaleDateString() : "—"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
