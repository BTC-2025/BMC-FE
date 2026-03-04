export default function AssetMaintenance() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-8 rounded-2xl border border-gray-100">
        <h3 className="font-black text-gray-900 mb-6">Repair Tickets</h3>
        <div className="space-y-4">
            {[
                { id: "MNT-982", asset: "Server Node #B2", issue: "Fan Failure", status: "In Progress" },
                { id: "MNT-983", asset: "Office HVAC", issue: "Filter Replace", status: "Scheduled" },
            ].map(mnt => (
                <div key={mnt.id} className="p-4 border border-gray-50 rounded-xl flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-blue-600 uppercase mb-1">{mnt.id}</p>
                        <h4 className="text-sm font-bold text-gray-900">{mnt.asset}</h4>
                        <p className="text-xs text-gray-500 mt-1 font-medium">{mnt.issue}</p>
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{mnt.status}</span>
                </div>
            ))}
        </div>
      </div>
      <div className="bg-white p-8 rounded-2xl border border-gray-100">
        <h3 className="font-black text-gray-900 mb-6">Service History</h3>
        <div className="space-y-4">
            {[
                { date: "Oct 20, 2023", asset: "Printer L3", action: "Toner Overhaul" },
                { date: "Sep 15, 2023", asset: "Laptop #44", action: "Battery Swap" },
            ].map((hist, i) => (
                <div key={i} className="flex gap-4 items-start">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase">{hist.date}</p>
                        <p className="text-sm font-bold text-gray-800">{hist.asset}</p>
                        <p className="text-xs text-gray-500 font-medium">{hist.action}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
