import { useState } from "react";
import { useManufacturing } from "../../context/ManufacturingContext";

function InspectionModal({ isOpen, onClose, orders, inspections, onInspect }) {
  // Only show orders that haven't already passed and are not executed
  const pendingOrders = orders.filter(o => {
    if (o.status === "Executed") return false;
    const hasPassed = inspections.some(i => i.work_order_id === o.realId && i.status === "PASS");
    return !hasPassed;
  });

  const [form, setForm] = useState({ wo_id: "", status: "PASS" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.wo_id) {
      setError("Please select a Work Order.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await onInspect(parseInt(form.wo_id), form.status);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to log inspection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <h2 className="text-2xl font-black text-gray-900 mb-6">New Inspection</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Work Order</label>
            <select
              value={form.wo_id}
              onChange={(e) => setForm((p) => ({ ...p, wo_id: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-indigo-500"
              required
            >
              <option value="">Select Pending Order…</option>
              {pendingOrders.map((o) => (
                <option key={o.id} value={o.realId}>{o.id} - {o.product}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Outcome</label>
            <select
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-indigo-500"
            >
              <option value="PASS">Pass (Ready for Production)</option>
              {/* If backend allowed forced failure via empty array, we could add FAIL. */}
            </select>
            <p className="text-[10px] text-gray-400 mt-2">Currently, quick inspections automatically log all parameters as passing.</p>
          </div>
          {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-black text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-sm font-black disabled:opacity-50 hover:bg-indigo-700 transition-colors">
              {loading ? "Logging…" : "Log Inspection"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function QualityControl() {
  const { inspections, orders, loading, inspect } = useManufacturing();
  const [modalOpen, setModalOpen] = useState(false);

  const total = inspections.length;
  const passed = inspections.filter((i) => i.status === "PASS").length;
  const failed = inspections.filter((i) => i.status === "FAIL").length;
  const pending = inspections.filter((i) => i.status === "PENDING").length;
  const rejectionRate = total > 0 ? ((failed / total) * 100).toFixed(1) : "0.0";

  const getWOLabel = (wo_id) => {
    const wo = orders.find((o) => o.realId === wo_id);
    return wo ? wo.id : `WO-${wo_id}`;
  };

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Quality Management</h2>
          <p className="text-xs font-bold text-gray-500 mt-1">Review inspection logs and log new QA results.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
        >
          + New Inspection
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Inspections", value: total, color: "bg-blue-50 text-blue-700" },
          { label: "Passed", value: passed, color: "bg-emerald-50 text-emerald-700" },
          { label: "Failed", value: failed, color: "bg-red-50 text-red-700" },
          { label: "Pending", value: pending, color: "bg-amber-50 text-amber-700" },
        ].map((s) => (
          <div key={s.label} className={`p-5 rounded-2xl border border-gray-100 ${s.color.split(" ")[0]}`}>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">{s.label}</p>
            <h3 className={`text-3xl font-black ${s.color.split(" ")[1]}`}>{s.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inspection List */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-gray-900">Inspection Records</h3>
            {inspections.length > 0 && (
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                {inspections.length} Total
              </span>
            )}
          </div>

          {inspections.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 font-bold text-sm">No inspections yet.</p>
              <p className="text-gray-400 text-xs mt-1">Inspections are created when a work order is inspected via the API.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {inspections.map((ins) => (
                <div key={ins.id} className="p-4 border border-gray-100 rounded-xl hover:border-blue-200 transition-all flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">INS-{ins.id}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span className="text-[10px] font-bold text-gray-500 uppercase">{getWOLabel(ins.work_order_id)}</span>
                    </div>
                    <p className="text-xs font-bold text-gray-500 mt-0.5">
                      {ins.inspection_date ? new Date(ins.inspection_date).toLocaleString() : "—"}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
                    ${ins.status === "PASS" ? "bg-emerald-100 text-emerald-700" :
                      ins.status === "FAIL" ? "bg-red-100 text-red-700" :
                      "bg-amber-100 text-amber-700"}`}>
                    {ins.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Defect Rate */}
        <div className="space-y-6">
          <div className="bg-rose-50 p-8 rounded-2xl border border-rose-100">
            <h3 className="text-lg font-black text-rose-900 mb-2">Defect Rate</h3>
            <p className="text-xs text-rose-700 font-medium mb-6">Overall rejection rate across all inspections.</p>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-black text-rose-900">{rejectionRate}%</span>
              <span className="text-xs font-bold text-rose-600 mb-2">Rejection Rate</span>
            </div>
            <div className="w-full bg-rose-200 h-2 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full" style={{ width: `${rejectionRate}%` }}></div>
            </div>
            <div className="mt-4 flex gap-4 text-xs font-bold">
              <span className="text-emerald-700">{passed} Passed</span>
              <span className="text-red-700">{failed} Failed</span>
              <span className="text-amber-700">{pending} Pending</span>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest mb-3">About QC Inspections</h3>
            <p className="text-xs text-blue-700 font-medium leading-relaxed mb-4">
              Quality inspections are performed on work orders before production is finalized. 
              A work order must pass inspection before it can be executed. Use the API endpoint 
              <code className="ml-1 bg-blue-100 px-1 rounded text-blue-800 font-mono">POST /mfg/work-orders/{`{id}`}/inspect</code> to submit results.
            </p>
          </div>

          {/* Action List for Open Orders */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mt-6">
            <h3 className="text-lg font-black text-gray-900 mb-4">Awaiting Inspection</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {orders.filter(o => o.status !== "Executed").length === 0 ? (
                <p className="text-xs text-gray-400 font-bold">No active work orders awaiting inspection.</p>
              ) : (
                orders.filter(o => o.status !== "Executed").map(o => {
                  const hasPassed = inspections.some(i => i.work_order_id === o.realId && i.status === "PASS");
                  if (hasPassed) return null; // Hide already passed
                  
                  return (
                    <div key={o.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl bg-gray-50">
                      <div>
                         <p className="text-sm font-black text-gray-900">{o.id}</p>
                         <p className="text-[10px] font-bold text-gray-500 uppercase">{o.product}</p>
                      </div>
                      <button 
                         onClick={() => inspect(o.realId, "PASS")}
                         disabled={loading}
                         className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-md disabled:opacity-50"
                      >
                         Log Pass
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
      
      <InspectionModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        orders={orders} 
        inspections={inspections} 
        onInspect={inspect} 
      />
    </div>
  );
}
