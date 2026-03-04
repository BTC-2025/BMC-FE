export default function AssetAllocation() {
  const allocations = [
    { asset: "MacBook Pro #12", user: "Gautam Karthik", date: "Jan 12, 2024", duration: "12 Months" },
    { asset: "Direct Phone #04", user: "Sarah Jenkins", date: "Feb 05, 2024", duration: "Indefinite" },
    { asset: "Dell Monitor #88", user: "Mike Thompson", date: "Jan 20, 2024", duration: "Project A-1" },
  ];

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg font-black text-gray-900 font-display">Active Assignments</h3>
        <button className="text-xs font-black text-blue-600 uppercase tracking-widest">+ New Allocation</button>
      </div>
      <div className="space-y-4">
        {allocations.map((alloc, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center justify-between hover:shadow-lg hover:shadow-blue-500/5 transition-all">
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-lg">👤</div>
              <div>
                <h4 className="font-bold text-gray-900">{alloc.user}</h4>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{alloc.asset}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-gray-900">{alloc.date}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{alloc.duration}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
