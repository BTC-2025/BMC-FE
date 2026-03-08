import { useManufacturing } from "../../context/ManufacturingContext";

export default function ProductionCosting() {
  const { costingRecords, orders, loading } = useManufacturing();

  const totalVariance = costingRecords.reduce((s, r) => s + parseFloat(r.variance || 0), 0);
  const totalActual = costingRecords.reduce((s, r) => s + parseFloat(r.total_cost_actual || 0), 0);
  const totalStandard = costingRecords.reduce((s, r) => s + parseFloat(r.total_cost_standard || 0), 0);

  const getWOLabel = (wo_id) => {
    const wo = orders.find((o) => o.realId === wo_id);
    return wo ? wo.id : `WO-${wo_id}`;
  };

  const fmt = (n) => `$${parseFloat(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Actual Cost</p>
          <h3 className="text-3xl font-black text-gray-900 mt-2">{fmt(totalActual)}</h3>
          <p className="text-xs font-bold text-gray-400 mt-1">Across all WOs</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Standard Cost</p>
          <h3 className="text-3xl font-black text-gray-900 mt-2">{fmt(totalStandard)}</h3>
          <p className="text-xs font-bold text-gray-400 mt-1">Budgeted amount</p>
        </div>
        <div className={`p-6 rounded-2xl border shadow-sm ${totalVariance >= 0 ? "bg-red-50 border-red-100" : "bg-emerald-50 border-emerald-100"}`}>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Variance</p>
          <h3 className={`text-3xl font-black mt-2 ${totalVariance >= 0 ? "text-red-600" : "text-emerald-600"}`}>
            {totalVariance >= 0 ? "+" : ""}{fmt(totalVariance)}
          </h3>
          <p className={`text-xs font-bold mt-1 ${totalVariance >= 0 ? "text-red-500" : "text-emerald-600"}`}>
            {totalVariance >= 0 ? "Over budget" : "Under budget"}
          </p>
        </div>
      </div>

      {/* Costing Records Table */}
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-black text-gray-900 mb-6">Cost Analysis by Work Order</h3>

        {costingRecords.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl">
            <p className="text-gray-400 font-bold text-sm">No costing records yet.</p>
            <p className="text-gray-400 text-xs mt-1">Costing is auto-calculated once a work order is executed and completed.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100">
                <tr>
                  <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Work Order</th>
                  <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Material (Std)</th>
                  <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Material (Act)</th>
                  <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Labor</th>
                  <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Overhead</th>
                  <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Std</th>
                  <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Act</th>
                  <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Variance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {costingRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 font-black text-gray-900">{getWOLabel(r.work_order_id)}</td>
                    <td className="py-4 font-medium text-gray-600">{fmt(r.material_cost_standard)}</td>
                    <td className="py-4 font-medium text-gray-600">{fmt(r.material_cost_actual)}</td>
                    <td className="py-4 font-medium text-gray-600">{fmt(r.labor_cost_actual)}</td>
                    <td className="py-4 font-medium text-gray-600">{fmt(r.overhead_cost)}</td>
                    <td className="py-4 font-bold text-gray-900">{fmt(r.total_cost_standard)}</td>
                    <td className="py-4 font-bold text-gray-900">{fmt(r.total_cost_actual)}</td>
                    <td className={`py-4 font-black ${parseFloat(r.variance) >= 0 ? "text-red-600" : "text-emerald-600"}`}>
                      {parseFloat(r.variance) >= 0 ? "+" : ""}{fmt(r.variance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
