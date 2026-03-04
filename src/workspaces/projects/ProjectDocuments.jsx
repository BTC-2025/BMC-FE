import React from 'react';

export default function ProjectDocuments() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                { name: "ProjectCharter.pdf", size: "2.4 MB", type: "PDF" },
                { name: "BrandGuidelines.ai", size: "48 MB", type: "Design" },
                { name: "Budget_Q1.xlsx", size: "1.2 MB", type: "Excel" },
                { name: "Launch_Deck.pptx", size: "12 MB", type: "Slides" },
            ].map((doc, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all cursor-default aspect-[1.618/1] flex flex-col justify-between">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl mb-4">📄</div>
                    <h5 className="font-bold text-gray-900 text-sm truncate">{doc.name}</h5>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mt-1">{doc.size}</p>
                    <button className="mt-6 w-full py-2 border-t border-gray-50 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 transition-colors">Download</button>
                </div>
            ))}
        </div>
    );
}
