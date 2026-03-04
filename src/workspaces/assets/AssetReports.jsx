export default function AssetReports() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
                { title: "Asset Value Report", icon: "📊" },
                { title: "Lifecycle Analysis", icon: "🔄" },
                { title: "Compliance Audit", icon: "⚖️" },
                { title: "Maintenance Log", icon: "🔨" },
                { title: "Allocation History", icon: "📖" },
            ].map(repo => (
                <div key={repo.title} className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-5 hover:bg-gray-50 cursor-pointer transition-colors shadow-sm">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">{repo.icon}</div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm leading-tight">{repo.title}</h4>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">Generate PDF</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
