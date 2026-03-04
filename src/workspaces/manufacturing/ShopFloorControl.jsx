export default function ShopFloorControl() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Live Feed Mockup */}
      <div className="bg-black rounded-2xl overflow-hidden relative group aspect-video lg:aspect-auto">
         <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <p className="text-gray-500 font-mono text-sm">CAM_01_FEED_SIGNAL_LOST</p>
         </div>
         <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest animate-pulse">
            Live
         </div>
         <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6">
            <h3 className="text-lg font-bold text-white">Main Assembly Hall</h3>
            <p className="text-xs text-gray-300">Camera Feed 01 • Floor 2</p>
         </div>
      </div>

      <div className="space-y-6">
         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-black text-gray-900 mb-6">Workstation Status</h3>
            <div className="space-y-4">
               {[
                  { station: "Cutting", job: "Job #4002", operator: "John D.", status: "Running" },
                  { station: "Welding", job: "Job #4005", operator: "Sarah M.", status: "Running" },
                  { station: "Painting", job: "Job #3998", operator: "Mike R.", status: "Cleaning" },
                  { station: "Assembly", job: "-", operator: "-", status: "Idle" },
               ].map((ws, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border-b border-gray-50 last:border-0">
                     <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${ws.status === 'Running' ? 'bg-emerald-500 animate-pulse' : ws.status === 'Idle' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                        <div>
                           <p className="text-sm font-bold text-gray-900">{ws.station}</p>
                           <p className="text-[10px] text-gray-400 uppercase">{ws.job !== '-' ? ws.job : 'No Active Job'}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-xs font-bold text-gray-700">{ws.operator}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{ws.status}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg shadow-blue-200">
            <div className="flex justify-between items-start">
               <div>
                  <h3 className="text-xl font-black">Issue Reporting</h3>
                  <p className="text-xs text-blue-200 mt-1 max-w-xs">Immediately flag downtime or safety concerns to the floor manager.</p>
               </div>
               <span className="text-3xl">⚠️</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
               <button className="py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Report Breakdown</button>
               <button className="py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Safety Incident</button>
            </div>
         </div>
      </div>
    </div>
  );
}
