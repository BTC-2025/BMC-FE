export default function ProductionPlanning() {
  return (
    <div className="space-y-8">
       <div className="bg-white p-8 rounded-2xl border border-gray-100">
          <div className="flex justify-between items-end mb-8">
             <div>
                <h3 className="text-xl font-black text-gray-900">Capacity Scheduler</h3>
                <p className="text-sm font-medium text-gray-400 mt-2">Gantt view of machine and labor allocation for the upcoming cycle.</p>
             </div>
             <div className="flex gap-2">
                <button className="px-4 py-2 bg-gray-100 rounded-lg text-xs font-black text-gray-600 uppercase tracking-widest hover:bg-gray-200">Day</button>
                <button className="px-4 py-2 bg-amber-500 text-white rounded-lg text-xs font-black uppercase tracking-widest shadow-lg shadow-amber-200">Week</button>
                <button className="px-4 py-2 bg-gray-100 rounded-lg text-xs font-black text-gray-600 uppercase tracking-widest hover:bg-gray-200">Month</button>
             </div>
          </div>
          
          <div className="h-80 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center">
             <span className="text-4xl mb-4">📅</span>
             <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Calendar / Gantt Component Required</p>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
             <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 border-b pb-4">Resource Availability</h4>
             <div className="space-y-4">
                {[
                   { name: "Assembly Line 1", status: "Available", load: 20 },
                   { name: "Assembly Line 2", status: "Maintenance", load: 0 },
                   { name: "CNC Machine A", status: "Busy", load: 85 },
                   { name: "Packaging Unit", status: "Busy", load: 60 },
                ].map(res => (
                   <div key={res.name} className="flex items-center justify-between">
                      <div>
                         <p className="text-sm font-bold text-gray-800">{res.name}</p>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{res.status}</p>
                      </div>
                      <div className="w-24 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                         <div className={`h-full rounded-full ${res.load > 80 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${res.load}%` }}></div>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          <div className="bg-[#111827] text-white p-6 rounded-2xl shadow-lg">
             <h4 className="text-sm font-black uppercase tracking-widest mb-6 border-b border-gray-700 pb-4">Shift Management</h4>
             <div className="space-y-4">
                 <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                    <div>
                       <p className="text-sm font-bold">Morning Shift A</p>
                       <p className="text-[10px] text-gray-400 uppercase">06:00 - 14:00</p>
                    </div>
                    <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-black uppercase">Active</span>
                 </div>
                 <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                    <div>
                       <p className="text-sm font-bold">Afternoon Shift B</p>
                       <p className="text-[10px] text-gray-400 uppercase">14:00 - 22:00</p>
                    </div>
                    <span className="text-gray-500 text-[10px] font-black uppercase">Scheduled</span>
                 </div>
             </div>
             <button className="w-full mt-8 py-3 bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all">Manage Shifts</button>
          </div>
       </div>
    </div>
  );
}
