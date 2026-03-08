import { useState } from "react";
import { useManufacturing } from "../../context/ManufacturingContext";

function ScheduleModal({ isOpen, onClose, orders, onSchedule }) {
  const plannedOrders = orders.filter((o) => o.status === "Planned");
  const [form, setForm] = useState({ wo_id: "", start_date: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.wo_id || !form.start_date) {
      setError("Please fill all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // API expects ISO datetime string
      const isoDate = new Date(form.start_date).toISOString();
      await onSchedule(parseInt(form.wo_id), isoDate);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to schedule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <h2 className="text-2xl font-black text-gray-900 mb-6">Schedule Production</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Work Order</label>
            <select
              value={form.wo_id}
              onChange={(e) => setForm((p) => ({ ...p, wo_id: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Select Planned Order…</option>
              {plannedOrders.map((o) => (
                <option key={o.id} value={o.realId}>{o.id} - {o.product}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Start Date & Time</label>
            <input
              type="datetime-local"
              value={form.start_date}
              onChange={(e) => setForm((p) => ({ ...p, start_date: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-black text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-black disabled:opacity-50">
              {loading ? "Scheduling…" : "Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ShopFloorControl() {
  const { orders, workCenters, scheduleOrder } = useManufacturing();
  const [issueReported, setIssueReported] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  const activeOrders = orders.filter((o) => o.status === "In Production");
  const plannedOrders = orders.filter((o) => o.status === "Planned");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Live Status Panel */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-black text-gray-900 mb-6">Active Production</h3>
          {activeOrders.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-gray-200 rounded-xl">
              <p className="text-gray-400 font-bold text-sm">No work orders currently in production.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeOrders.map((order) => (
                <div key={order.id} className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <div>
                      <p className="text-sm font-black text-gray-900">{order.id}</p>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{order.product} • {order.qty} units</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-700 uppercase">In Production</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-black text-gray-900 mb-6">Work Center Status</h3>
          {workCenters.length === 0 ? (
            <p className="text-sm text-gray-400 font-bold text-center py-4">No work centers configured.</p>
          ) : (
            <div className="space-y-4">
              {workCenters.map((wc) => (
                <div key={wc.id} className="flex items-center justify-between p-3 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${activeOrders.length > 0 ? "bg-emerald-500 animate-pulse" : "bg-gray-300"}`}></div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{wc.name}</p>
                      <p className="text-[10px] text-gray-400 uppercase">{wc.capacity_per_day}hrs/day capacity</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-700">${parseFloat(wc.cost_per_hour || 0).toFixed(2)}/hr</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      {activeOrders.length > 0 ? "Active" : "Idle"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Queue */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-black text-gray-900">Planned Queue</h3>
            <button
              onClick={() => setScheduleModalOpen(true)}
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-colors"
            >
              + Schedule
            </button>
          </div>
          
          {plannedOrders.length === 0 ? (
            <p className="text-sm text-gray-400 font-bold text-center py-4">No work orders in queue.</p>
          ) : (
            <div className="space-y-3">
              {plannedOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-gray-900">{order.id}</span>
                    <span className="text-xs text-gray-500 font-medium">{order.product} • {order.qty} units</span>
                  </div>
                  <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Planned</span>
                </div>
              ))}
              {plannedOrders.length > 5 && (
                <p className="text-xs text-gray-400 font-bold text-center pt-1">+{plannedOrders.length - 5} more in queue</p>
              )}
            </div>
          )}
        </div>

        {/* Issue Reporting */}
        <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg shadow-blue-200">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-black">Issue Reporting</h3>
              <p className="text-xs text-blue-200 mt-1 max-w-xs">Immediately flag downtime or safety concerns to the floor manager.</p>
            </div>
            <span className="text-3xl">⚠️</span>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {issueReported ? (
              <div className="col-span-2 py-3 bg-emerald-500/30 text-emerald-50 rounded-xl text-xs font-black uppercase tracking-widest text-center flex items-center justify-center gap-2">
                 <span>✓</span> Notification Sent to Floor Manager
              </div>
            ) : (
              <>
                <button onClick={() => setIssueReported(true)} className="py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Report Breakdown</button>
                <button onClick={() => setIssueReported(true)} className="py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Safety Incident</button>
              </>
            )}
          </div>
        </div>
      </div>
      
      <ScheduleModal 
        isOpen={scheduleModalOpen} 
        onClose={() => setScheduleModalOpen(false)} 
        orders={orders} 
        onSchedule={scheduleOrder} 
      />
    </div>
  );
}
