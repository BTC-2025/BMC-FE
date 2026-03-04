import { useState } from "react";

export default function ScheduledReports() {
  const [reports, setReports] = useState([
    { id: 'REP-001', name: 'Weekly Sales Summary', frequency: 'Weekly', format: 'PDF', recipients: 'Sales Team, CEO', status: 'Active', lastSent: '2026-01-22' },
    { id: 'REP-002', name: 'Monthly Financial Statement', frequency: 'Monthly', format: 'Excel', recipients: 'Finance Dept', status: 'Active', lastSent: '2026-01-01' },
    { id: 'REP-003', name: 'Daily Inventory Alert', frequency: 'Daily', format: 'Link', recipients: 'Warehouse Mgr', status: 'Active', lastSent: 'Today, 8:00 AM' },
    { id: 'REP-004', name: 'HR Utilization Report', frequency: 'Quarterly', format: 'PDF', recipients: 'HR Director', status: 'Paused', lastSent: '2025-12-31' },
  ]);

  const [showConfig, setShowConfig] = useState(false);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 text-left">
      
      {/* Header with Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="text-left">
            <h3 className="text-3xl font-[1000] text-[#111827] tracking-tighter mb-2 leading-none uppercase">Report Scheduler</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">Automate data delivery to roles and stakeholders</p>
         </div>
         <button 
           onClick={() => setShowConfig(true)}
           className="px-8 py-4 bg-[#195bac] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#11407a] transition-all shadow-xl shadow-blue-500/20 flex items-center gap-3 w-fit"
         >
           <span>+</span> Create Scheduled Report
         </button>
      </div>

      {/* Reports List */}
      <div className="grid grid-cols-1 gap-6">
        {reports.map((report) => (
          <div 
            key={report.id}
            className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8"
          >
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 bg-gray-50 rounded-[24px] flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  {report.format === 'PDF' ? '📄' : report.format === 'Excel' ? '📊' : '🔗'}
               </div>
               <div>
                  <h4 className="text-xl font-[1000] text-[#111827] mb-1">{report.name}</h4>
                  <div className="flex flex-wrap gap-3">
                     <span className="text-[9px] font-black text-[#195bac] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">{report.frequency}</span>
                     <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">{report.format}</span>
                     <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">{report.status}</span>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 flex-1 md:max-w-xl">
               <div>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Recipients</p>
                  <p className="text-sm font-bold text-gray-600 truncate">{report.recipients}</p>
               </div>
               <div>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Last Sent</p>
                  <p className="text-sm font-bold text-gray-600">{report.lastSent}</p>
               </div>
               <div className="hidden lg:block">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Next Run</p>
                  <p className="text-sm font-black text-[#195bac]">Incoming</p>
               </div>
            </div>

            <div className="flex items-center gap-3">
               <button className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <span className="text-lg">⚙️</span>
               </button>
               <button className="p-3 bg-gray-50 rounded-xl hover:bg-rose-50 text-rose-600 transition-colors">
                  <span className="text-lg">🗑️</span>
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      <div className="bg-[#111827] text-white p-12 rounded-[56px] shadow-2xl relative overflow-hidden border border-white/5">
         <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 blur-[100px] rounded-full"></div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
            <div>
               <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em] mb-4">Enterprise Delivery</h4>
               <p className="text-2xl font-[1000] tracking-tighter mb-4 leading-tight">Reliable. Auditable. Role-Based.</p>
               <p className="text-sm font-bold text-gray-500 max-w-xl leading-relaxed">
                  Scheduled reports ensure key stakeholders receive consistent data without manual intervention. 
                  Audit logs track every delivery for financial compliance.
               </p>
            </div>
            <div className="grid grid-cols-2 gap-8 shrink-0">
               <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Total Delivered</p>
                  <p className="text-4xl font-[1000] text-white tracking-tighter">1,248</p>
               </div>
               <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Active Jobs</p>
                  <p className="text-4xl font-[1000] text-purple-400 tracking-tighter">24</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
