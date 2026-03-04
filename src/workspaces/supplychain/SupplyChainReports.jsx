export default function SupplyChainReports() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       {[
          { title: "Supplier Scorecard", freq: "Monthly", icon: "🤝" },
          { title: "Inventory Aging", freq: "Weekly", icon: "📦" },
          { title: "Freight Cost Analysis", freq: "Monthly", icon: "🚚" },
          { title: "On-Time Fulfillment", freq: "Daily", icon: "⏱️" },
          { title: "Demand Forecast Accuracy", freq: "Quarterly", icon: "🎯" },
          { title: "Carbon Footprint Log", freq: "Yearly", icon: "🌿" },
       ].map(rep => (
          <div key={rep.title} className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all cursor-pointer group">
             <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl group-hover:bg-cyan-50 transition-colors">{rep.icon}</div>
                <span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-black uppercase tracking-widest text-gray-500">{rep.freq}</span>
             </div>
             <h4 className="font-bold text-gray-900 text-lg mb-1">{rep.title}</h4>
             <p className="text-xs text-gray-400 font-medium">Click to generate PDF report.</p>
             <div className="mt-6 border-t border-gray-50 pt-4 flex justify-end">
                <span className="text-[10px] font-black text-cyan-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Download</span>
             </div>
          </div>
       ))}
    </div>
  );
}
