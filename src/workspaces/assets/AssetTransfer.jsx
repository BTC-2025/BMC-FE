export default function AssetTransfer() {
    return (
        <div className="max-w-3xl">
            <div className="bg-[#111827] text-white p-12 rounded-[32px] mb-8 overflow-hidden relative">
                <div className="relative z-10">
                    <h3 className="text-3xl font-black mb-4">Transfer Protocol</h3>
                    <p className="text-sm text-gray-400 mb-8 max-w-md">Safe-keeping of assets during internal movement between departments or locations.</p>
                    <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">Initialite Movement</button>
                </div>
                <div className="absolute right-[-40px] bottom-[-40px] w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Pending Approvals</h4>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex gap-4 items-center">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl shadow-sm">🚛</div>
                            <div>
                                <h5 className="font-bold text-gray-900">IT Bundle #402</h5>
                                <p className="text-xs text-gray-500 font-medium">NYC HQ ➔ LDN Tech Hub</p>
                            </div>
                        </div>
                        <button className="text-xs font-black text-emerald-500 uppercase tracking-widest">Approve</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
