export default function AssetLocations() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-100">
                <h3 className="font-black text-gray-900 mb-2">Location Mapping</h3>
                <p className="text-xs text-gray-500 mb-8 font-medium">Assets distributed across global offices.</p>
                <div className="h-64 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm mb-4">📍</div>
                    <p className="text-xs font-bold text-gray-400 max-w-xs leading-relaxed">Map integration is required to visualize asset density per coordinate.</p>
                </div>
            </div>
            <div className="space-y-4">
                {[
                    { city: "New York HQ", address: "123 Wall St, NY", status: "Operational" },
                    { city: "London Hub", address: "Canary Wharf, LDN", status: "Operational" },
                    { city: "Remote Storage", address: "Cloud Storage A", status: "High Capacity" },
                ].map(loc => (
                    <div key={loc.city} className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between">
                        <div>
                            <h4 className="font-black text-gray-900">{loc.city}</h4>
                            <p className="text-xs text-gray-400 font-medium mt-1">{loc.address}</p>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded uppercase tracking-widest">{loc.status}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
