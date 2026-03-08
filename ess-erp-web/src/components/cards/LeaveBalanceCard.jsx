export default function LeaveBalanceCard({ title, used, total }) {
  const remaining = total - used;
  const percent = (used / total) * 100;
  
  // Color logic based on leave type or remaining
  const getColor = () => {
    if (percent > 80) return "bg-red-500";
    if (percent > 50) return "bg-orange-500";
    return "bg-blue-600";
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md hover:scale-[1.02] group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest">{title}</p>
          <h2 className="text-3xl font-black mt-1 text-gray-900">{remaining} <span className="text-sm font-bold text-gray-400">Available</span></h2>
        </div>
        <div className={`p-2 rounded-xl ${percent > 80 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-gray-500">Used: {used}</span>
          <span className="text-gray-900">Total: {total}</span>
        </div>
        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
          <div
            className={`${getColor()} h-full transition-all duration-1000 ease-out`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
