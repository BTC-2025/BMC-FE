import React, { useState } from 'react';

export default function ProjectBOM() {
    const [boms, setBoms] = useState([
        { id: "BOM-001", name: "Alpha Case Assembly", category: "Hardware", items: 12, cost: 450, status: "Approved" },
        { id: "BOM-002", name: "Beta Logic Circuit", category: "Electronics", items: 45, cost: 1280, status: "Review" },
        { id: "BOM-003", name: "Cooling Sub-system", category: "Mechanical", items: 8, cost: 210, status: "Draft" },
    ]);

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                <div className="text-left">
                    <h3 className="text-3xl font-black text-[#111827] tracking-tighter">Bill of <span className="text-[#195bac]">Materials</span></h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">Resource Quantification & Material Architecture</p>
                </div>
                <button 
                    className="bg-[#195bac] text-white px-8 py-4 rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3"
                >
                    <span className="text-xl leading-none">+</span>
                    Engine New BOM
                </button>
            </div>

            {/* BOM Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {boms.map((bom) => (
                    <div key={bom.id} className="bg-white rounded-[48px] p-10 border border-gray-100 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] hover:border-blue-100 transition-all duration-500 group relative overflow-hidden text-left">
                        {/* Status chip */}
                        <div className="absolute top-8 right-8">
                            <span className={`px-4 py-1.5 rounded-2xl text-[9px] font-black uppercase tracking-widest border
                                ${bom.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                  bom.status === 'Review' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                  'bg-gray-50 text-gray-400 border-gray-100'}`}>
                                {bom.status}
                            </span>
                        </div>

                        <div className="space-y-6">
                            <div className="w-16 h-16 rounded-3xl bg-gray-50 flex items-center justify-center text-2xl shadow-inner border border-white">
                                📦
                            </div>

                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-[#195bac] uppercase tracking-[0.2em]">{bom.id}</p>
                                <h4 className="text-xl font-black text-gray-900 tracking-tight">{bom.name}</h4>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{bom.category}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                                <div>
                                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Components</p>
                                    <p className="text-sm font-black text-gray-900">{bom.items} Units</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Total value</p>
                                    <p className="text-sm font-black text-emerald-600">${bom.cost}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 flex gap-3">
                            <button className="flex-1 py-4 bg-[#0F172A] text-white rounded-[20px] text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-gray-200">Manage BOM</button>
                            <button className="w-14 h-14 bg-gray-50 text-gray-400 rounded-[20px] flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all">🗑️</button>
                        </div>
                    </div>
                ))}

                {/* Empty State/Placeholder */}
                <div className="border-4 border-dashed border-gray-50 rounded-[48px] p-10 flex flex-col items-center justify-center text-center opacity-40 hover:opacity-100 transition-opacity">
                    <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-3xl text-gray-200 mb-4">
                        +
                    </div>
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Architect New Component Tree</p>
                </div>
            </div>
        </div>
    );
}
