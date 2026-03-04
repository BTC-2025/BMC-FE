export default function AssetDisposal() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-rose-50 border border-rose-100 p-8 rounded-2xl">
                    <h3 className="text-xl font-black text-rose-900 mb-4">Retirement Queue</h3>
                    <p className="text-xs text-rose-700 font-medium mb-8">Assets marked for disposal due to obsolescence or damage.</p>
                    <div className="space-y-3">
                        {['Surface Book #01', 'Old Printer HQ-4', 'Projector Room C'].map(item => (
                            <div key={item} className="p-3 bg-white/50 rounded-lg flex justify-between items-center text-sm font-bold text-rose-900">
                                {item}
                                <span className="text-[10px] uppercase font-black opacity-40">Dispose</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white border border-gray-100 p-8 rounded-2xl">
                    <h3 className="text-xl font-black text-gray-900 mb-4">Disposal Summary</h3>
                    <div className="space-y-6 mt-8">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Recovered Value</p>
                            <p className="text-3xl font-black text-gray-900">$12,400</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Disposal Method</p>
                            <p className="text-sm font-bold text-gray-700">60% Recycle · 40% Resale</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
