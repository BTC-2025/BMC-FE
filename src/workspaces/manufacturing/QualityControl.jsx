export default function QualityControl() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
       <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
             <h3 className="text-xl font-black text-gray-900">Inspection Queue</h3>
             <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">3 Pending</span>
          </div>

          <div className="space-y-4">
             {[
                { id: "INS-2029", item: "Batch #445 - Chair Legs", check: "Stress Test", status: "In Progress" },
                { id: "INS-2030", item: "Batch #992 - Glass Tops", check: "Scratch Inspection", status: "Assigned" },
                { id: "INS-2031", item: "Single Unit - Motor A", check: "Voltage Check", status: "Queued" },
             ].map(ins => (
                <div key={ins.id} className="p-4 border border-gray-100 rounded-xl hover:border-blue-200 transition-all flex items-center justify-between group">
                   <div>
                      <div className="flex items-center gap-2 mb-1">
                         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{ins.id}</span>
                         <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                         <span className="text-[10px] font-bold text-gray-500 uppercase">{ins.status}</span>
                      </div>
                      <h4 className="text-sm font-black text-gray-900">{ins.check}</h4>
                      <p className="text-xs font-medium text-gray-500 mt-0.5">{ins.item}</p>
                   </div>
                   <button className="px-4 py-2 bg-gray-50 text-[10px] font-black uppercase tracking-widest rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">Start</button>
                </div>
             ))}
          </div>
       </div>

       <div className="space-y-6">
          <div className="bg-rose-50 p-8 rounded-2xl border border-rose-100">
             <h3 className="text-lg font-black text-rose-900 mb-2">Defect Rate Log</h3>
             <p className="text-xs text-rose-700 font-medium mb-6">Items failed during QC process this week.</p>
             
             <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-black text-rose-900">2.4%</span>
                <span className="text-xs font-bold text-rose-600 mb-2">Rejection Rate</span>
             </div>
             <div className="w-full bg-rose-200 h-2 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full w-[2.4%]"></div>
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100">
             <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">Recent Defects</h3>
             <ul className="space-y-3">
                {[
                   "Misaligned weld on Frame B",
                   "Paint scratch on Surface #22",
                   "Motor noise excessive on Unit 4",
                ].map((def, i) => (
                   <li key={i} className="flex items-center gap-3 text-xs font-bold text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                      {def}
                   </li>
                ))}
             </ul>
          </div>
       </div>
    </div>
  );
}
