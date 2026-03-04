export default function ManufacturingReports() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       {[
          { title: "Production Efficiency", date: "Weekly", icon: "⚡" },
          { title: "Downtime Analysis", date: "Monthly", icon: "🛑" },
          { title: "Material Wastage", date: "Weekly", icon: "🗑️" },
          { title: "Cost Variance", date: "Monthly", icon: "💲" },
          { title: "Quality Audit Log", date: "Quarterly", icon: "✅" },
          { title: "Labor Utilization", date: "Weekly", icon: "👥" },
       ].map(report => (
          <div key={report.title} className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all cursor-pointer group">
             <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl group-hover:bg-amber-50 transition-colors">{report.icon}</div>
                <span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-black uppercase tracking-widest text-gray-500">{report.date}</span>
             </div>
             <h4 className="font-bold text-gray-900 text-lg mb-1">{report.title}</h4>
             <p className="text-xs text-gray-400 font-medium">Click to generate PDF report.</p>
             <div className="mt-6 border-t border-gray-50 pt-4 flex justify-end">
                <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Download</span>
             </div>
          </div>
       ))}
    </div>
  );
}
