import { useState } from "react";
import { useManufacturing } from "../../context/ManufacturingContext";

export default function ProductionPlanning() {
  const { schedules, workCenters, orders, createWorkCenter, deleteWorkCenter, loading } = useManufacturing();
  const [view, setView] = useState("week");
  const [showWCForm, setShowWCForm] = useState(false);
  const [wcForm, setWcForm] = useState({ name: "", capacity_per_day: 8, cost_per_hour: 0 });

  const handleCreateWC = async (e) => {
    e.preventDefault();
    await createWorkCenter({ ...wcForm, capacity_per_day: parseInt(wcForm.capacity_per_day), cost_per_hour: parseFloat(wcForm.cost_per_hour) });
    setShowWCForm(false);
    setWcForm({ name: "", capacity_per_day: 8, cost_per_hour: 0 });
  };

  // Group schedules by work center
  const schedulesByWC = schedules.reduce((acc, s) => {
    const wc = workCenters.find((w) => w.id === s.work_center_id);
    const key = wc?.name || `WC #${s.work_center_id}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {/* Production Schedule */}
      <div className="bg-white p-8 rounded-2xl border border-gray-100">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="text-xl font-black text-gray-900">Production Schedule</h3>
            <p className="text-sm font-medium text-gray-400 mt-2">Work orders scheduled across all work centers.</p>
          </div>
          <div className="flex gap-2">
            {["day", "week", "month"].map((v) => (
              <button key={v} onClick={() => setView(v)} className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest ${view === v ? "bg-amber-500 text-white shadow-lg shadow-amber-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {v}
              </button>
            ))}
          </div>
        </div>

        {schedules.length === 0 ? (
          <div className="h-48 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center gap-3">
            <span className="text-3xl">📅</span>
            <p className="text-xs font-black text-gray-300 uppercase tracking-[0.2em]">No scheduled production runs yet</p>
            <p className="text-xs text-gray-400">Execute a work order and schedule it to see the plan here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(schedulesByWC).map(([wcName, wcSchedules]) => (
              <div key={wcName} className="border border-gray-100 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-black text-gray-700 uppercase tracking-widest">{wcName}</span>
                  <span className="text-xs text-gray-400 font-bold">({wcSchedules.length} operations)</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {wcSchedules.map((s, i) => {
                    const wo = orders.find((o) => o.realId === s.work_order_id);
                    return (
                      <div key={i} className="px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-black text-gray-900">{wo ? wo.id : `WO-${s.work_order_id}`}</span>
                          <span className="text-xs text-gray-500 font-medium">
                            {new Date(s.scheduled_start).toLocaleString()} → {new Date(s.scheduled_end).toLocaleString()}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${s.actual_end ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                          {s.actual_end ? "Complete" : "Scheduled"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Resource Availability (Work Centers) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Work Centers</h4>
            <button onClick={() => setShowWCForm((p) => !p)} className="text-[10px] font-black text-amber-600 uppercase tracking-widest hover:underline">
              {showWCForm ? "Cancel" : "+ Add"}
            </button>
          </div>

          {showWCForm && (
            <form onSubmit={handleCreateWC} className="mb-4 p-4 bg-amber-50 rounded-xl space-y-3 border border-amber-100">
              <input value={wcForm.name} onChange={(e) => setWcForm((p) => ({ ...p, name: e.target.value }))} placeholder="Name (e.g. Assembly Line 3)" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold focus:outline-none" required />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" value={wcForm.capacity_per_day} onChange={(e) => setWcForm((p) => ({ ...p, capacity_per_day: e.target.value }))} placeholder="Capacity/day (hrs)" className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold focus:outline-none" required />
                <input type="number" step="0.01" value={wcForm.cost_per_hour} onChange={(e) => setWcForm((p) => ({ ...p, cost_per_hour: e.target.value }))} placeholder="Cost/hr ($)" className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold focus:outline-none" />
              </div>
              <button type="submit" disabled={loading} className="w-full py-2 bg-amber-500 text-white rounded-lg text-xs font-black uppercase tracking-widest">Create</button>
            </form>
          )}

          {workCenters.length === 0 ? (
            <p className="text-sm text-gray-400 font-bold text-center py-4">No work centers configured</p>
          ) : (
            <div className="space-y-3">
              {workCenters.map((wc) => {
                const activeWOs = orders.filter((o) => o.status === "In Production").length;
                const load = Math.min(Math.round((activeWOs / Math.max(wc.capacity_per_day, 1)) * 100), 100);
                return (
                  <div key={wc.id} className="flex items-center justify-between group">
                    <div>
                      <p className="text-sm font-bold text-gray-800">{wc.name}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        {wc.capacity_per_day}hrs/day — ${parseFloat(wc.cost_per_hour || 0).toFixed(2)}/hr
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-20 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${load > 80 ? "bg-red-500" : "bg-emerald-500"}`} style={{ width: `${load}%` }}></div>
                      </div>
                      <button onClick={() => window.confirm(`Delete ${wc.name}?`) && deleteWorkCenter(wc.id)} className="opacity-0 group-hover:opacity-100 text-red-400 text-xs hover:text-red-600 transition-all">✕</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Shift Management */}
        <div className="bg-[#111827] text-white p-6 rounded-2xl shadow-lg">
          <h4 className="text-sm font-black uppercase tracking-widest mb-6 border-b border-gray-700 pb-4">Shift Management</h4>
          <div className="space-y-4">
            {[
              { label: "Morning Shift A", time: "06:00 - 14:00", active: true },
              { label: "Afternoon Shift B", time: "14:00 - 22:00", active: false },
              { label: "Night Shift C", time: "22:00 - 06:00", active: false },
            ].map((s) => (
              <div key={s.label} className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                <div>
                  <p className="text-sm font-bold">{s.label}</p>
                  <p className="text-[10px] text-gray-400 uppercase">{s.time}</p>
                </div>
                <span className={s.active ? "bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-black uppercase" : "text-gray-500 text-[10px] font-black uppercase"}>
                  {s.active ? "Active" : "Scheduled"}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-gray-600 mt-6 font-bold uppercase tracking-widest text-center">Shift scheduling is managed through HR module</p>
        </div>
      </div>
    </div>
  );
}
