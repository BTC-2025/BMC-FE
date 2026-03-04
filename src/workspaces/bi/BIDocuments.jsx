import React, { useState } from 'react';

export default function BIDocuments() {
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const folders = [
    { id: 'all', name: 'All Documents', count: 24, icon: '📁' },
    { id: 'reports', name: 'Financial Reports', count: 12, icon: '📊' },
    { id: 'strategy', name: 'Market Strategy', count: 5, icon: '🎯' },
    { id: 'training', name: 'ML training data', count: 7, icon: '🧬' },
  ];

  const allDocuments = [
    { id: 1, name: 'Q4 Revenue Analysis.pdf', type: 'PDF', size: '2.4 MB', date: '2h ago', folder: 'reports', recent: true },
    { id: 2, name: 'Market Penetration Data.xlsx', type: 'XLSX', size: '1.8 MB', date: '5h ago', folder: 'strategy', recent: true },
    { id: 3, name: 'Consumer Behavior Model.json', type: 'JSON', size: '850 KB', date: 'Yesterday', folder: 'training', recent: false },
    { id: 4, name: 'Regional Performance Hub.doc', type: 'DOC', size: '1.2 MB', date: 'Jan 24, 2026', folder: 'reports', recent: false },
    { id: 5, name: 'Growth Projection 2026.pdf', type: 'PDF', size: '4.5 MB', date: 'Jan 22, 2026', folder: 'strategy', recent: false },
    { id: 6, name: 'Neural Network Weights.h5', type: 'DATA', size: '142 MB', date: '3h ago', folder: 'training', recent: true },
  ];

  const filteredDocuments = allDocuments.filter(doc => {
    const matchesFolder = selectedFolder === 'all' || doc.folder === selectedFolder;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const recentDocs = allDocuments.filter(doc => doc.recent).slice(0, 3);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 text-left pb-20">
      
      {/* Search & Actions Bar */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white/40 backdrop-blur-xl p-6 rounded-[32px] border border-white/50 shadow-sm">
         <div className="relative w-full md:w-96 group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#195bac] transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input 
              type="text" 
              placeholder="Search architecture..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 text-xs font-bold text-gray-900 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#195bac]/20 transition-all"
            />
         </div>
         <div className="flex items-center gap-4 shrink-0">
            <button className="p-3.5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-[#195bac] hover:shadow-lg transition-all">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25" /></svg>
            </button>
            <button className="bg-[#195bac] text-white px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all">
               Initialize Sync
            </button>
         </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Folders Sidebar */}
        <div className="lg:w-72 space-y-6 shrink-0">
          <div className="bg-white p-6 md:p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 mb-4">Intelligence Directories</h3>
            <div className="space-y-2">
              {folders.map(folder => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300
                    ${selectedFolder === folder.id 
                      ? 'bg-[#195bac] text-white shadow-lg' 
                      : 'bg-transparent text-gray-500 hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{folder.icon}</span>
                    <span className="text-[13px] font-bold tracking-tight">{folder.name}</span>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg
                    ${selectedFolder === folder.id ? 'bg-white/20' : 'bg-gray-100 text-gray-400'}`}>
                    {folder.count}
                  </span>
                </button>
              ))}
            </div>
            
            <button className="w-full mt-6 py-4 border-2 border-dashed border-gray-200 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:border-[#195bac] hover:text-[#195bac] transition-all">
              + New Branch
            </button>
          </div>
          
          <div className="bg-[#111827] p-8 rounded-[40px] text-white overflow-hidden relative group">
             <div className="relative z-10">
               <h4 className="text-lg font-black tracking-tighter mb-2">Cloud Storage</h4>
               <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-6">Secured Node Sync</p>
               <div className="w-full h-1.5 bg-white/5 rounded-full mb-2">
                 <div className="w-3/4 h-full bg-blue-500 rounded-full"></div>
               </div>
               <p className="text-[10px] font-black text-blue-400">75% Capacity Reached</p>
             </div>
             <div className="absolute -right-10 -bottom-10 text-[80px] font-black text-white/[0.03] rotate-12">DATA</div>
          </div>
        </div>

        {/* Documents Content */}
        <div className="flex-1 space-y-10">
          
          {/* Recent Section */}
          {!searchQuery && selectedFolder === 'all' && (
            <div className="space-y-6">
               <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-4">Recent Intellectual Assets</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {recentDocs.map(doc => (
                    <div key={doc.id} className="bg-gradient-to-br from-white to-gray-50/50 p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer relative overflow-hidden">
                       <div className="relative z-10">
                          <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                             {doc.type === 'PDF' ? '📄' : doc.type === 'XLSX' ? '📈' : '🧪'}
                          </div>
                          <h4 className="text-[13px] font-black text-gray-900 leading-tight mb-1 truncate">{doc.name}</h4>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{doc.date} • {doc.size}</p>
                       </div>
                       <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-[#195bac]/5 rounded-full blur-xl"></div>
                    </div>
                 ))}
               </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="flex items-center justify-between px-4">
              <div className="text-left">
                <h2 className="text-2xl font-[1000] text-[#111827] tracking-tighter uppercase">{folders.find(f => f.id === selectedFolder)?.name}</h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Found {filteredDocuments.length} tactical units</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="bg-white p-8 rounded-[40px] border border-gray-100 hover:shadow-2xl hover:shadow-[#195bac]/5 transition-all duration-500 group relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                  <div className="relative z-10 flex justify-between items-start">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-transparent group-hover:border-[#195bac]/10 group-hover:bg-white group-hover:shadow-lg">
                        {doc.type === 'PDF' ? '📄' : doc.type === 'XLSX' ? '📈' : doc.type === 'JSON' ? '🧬' : '📝'}
                    </div>
                    <div className="flex gap-2">
                        <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#195bac] hover:text-white transition-all cursor-pointer">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                  </div>
                  
                  <div className="relative z-10 mt-8">
                    <h4 className="text-[15px] font-[1000] text-[#111827] tracking-tight group-hover:text-[#195bac] transition-colors mb-1 truncate">{doc.name}</h4>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{doc.size}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{doc.folder}</span>
                    </div>
                  </div>
                  
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-[#195bac]/[0.02] rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
                </div>
              ))}
              
              {filteredDocuments.length === 0 && (
                <div className="col-span-full py-20 bg-white/20 border-2 border-dashed border-gray-100 rounded-[40px] flex flex-col items-center justify-center gap-4 text-center">
                   <div className="text-4xl opacity-20">🔍</div>
                   <div className="text-left">
                     <p className="text-[13px] font-black text-gray-400 uppercase tracking-widest">No intelligence found matching query</p>
                   </div>
                </div>
              )}

              {/* Add Card */}
              <div className="border-2 border-dashed border-gray-100 rounded-[40px] flex flex-col items-center justify-center p-10 min-h-[220px] group hover:border-[#195bac]/30 transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 text-2xl group-hover:bg-[#195bac] group-hover:text-white transition-all mb-4">+</div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Deploy New Asset</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

