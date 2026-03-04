import React, { useState } from 'react';

export default function ProjectIssues({ issues, updateIssue, removeIssue, addIssue }) {
  const [editingIssue, setEditingIssue] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [newForm, setNewForm] = useState({
    title: "", project: "General", priority: "Medium", status: "Open", description: "", date: "Today"
  });

  const displayIssues = issues || [];

  const startEdit = (issue) => {
    setEditingIssue(issue.id);
    setEditForm({ ...issue });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    updateIssue(editingIssue, editForm);
    setEditingIssue(null);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    addIssue(newForm);
    setShowAddModal(false);
    setNewForm({ title: "", project: "General", priority: "Medium", status: "Open", description: "", date: "Today" });
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      
      {/* Governance Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="text-left">
            <h3 className="text-3xl font-black text-[#111827] tracking-tighter">Issue & <span className="text-rose-600">Risk Control</span></h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">Operational Threat Management & Mitigation</p>
        </div>
        <button 
            onClick={() => setShowAddModal(true)}
            className="bg-rose-600 text-white px-8 py-4 rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-rose-100 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3"
        >
            <span className="text-xl leading-none">!</span>
            Log Incident
        </button>
      </div>

      {/* Issues Queue */}
      <div className="grid grid-cols-1 gap-6">
        {displayIssues.map((iss) => (
          <div key={iss.id} className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] hover:border-rose-100 transition-all group overflow-hidden relative">
            
            {/* Urgency Indicator */}
            <div className={`absolute top-0 left-0 w-2 h-full 
                ${iss.priority === 'Critical' ? 'bg-rose-500' : 
                  iss.priority === 'High' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>

            <div className="flex flex-col lg:flex-row lg:items-center gap-8 text-left">
              {/* Glyph */}
              <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center text-2xl shadow-sm shrink-0
                ${iss.priority === 'Critical' ? 'bg-rose-50 text-rose-500' : 'bg-gray-50 text-gray-400'}`}>
                {iss.priority === 'Critical' ? '⚠️' : '🛡️'}
              </div>

              {/* Identity */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3">
                    <span className="text-[11px] font-black text-rose-600 uppercase tracking-[0.2em] bg-rose-50 px-2 py-0.5 rounded-lg">{iss.id}</span>
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{iss.project}</span>
                    <span className="text-gray-200">•</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Logged: {iss.date}</span>
                </div>
                <h4 className="text-xl font-black text-[#111827] tracking-tight">{iss.title}</h4>
                <p className="text-sm font-medium text-gray-500 max-w-2xl">{iss.description}</p>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-10 shrink-0">
                <div className="text-right">
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Current State</p>
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border
                        ${iss.status === 'Open' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                          iss.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          'bg-blue-50 text-blue-600 border-blue-100'}`}>
                        {iss.status}
                    </span>
                </div>

                <div className="flex gap-3">
                    <button 
                        onClick={() => startEdit(iss)}
                        className="px-6 py-3.5 bg-[#0F172A] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200"
                    >
                        Manage Entry
                    </button>
                    <button 
                        onClick={() => removeIssue(iss.id)}
                        className="w-12 h-12 flex items-center justify-center bg-rose-50 text-rose-500 rounded-2xl border border-rose-100 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                    >
                        🗑️
                    </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Management Modal */}
      {editingIssue && (
        <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-xl z-[9999] flex items-center justify-center p-6 animate-in zoom-in duration-300">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden border border-white">
            <div className="p-10 border-b border-gray-100 bg-rose-50/50">
              <h2 className="text-2xl font-black text-[#111827] tracking-tighter text-left">Incident Management</h2>
              <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mt-1 text-left">Resolving Operational Exceptions</p>
            </div>
            <form onSubmit={handleUpdate} className="p-10 space-y-6 text-left">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Issue Overview</label>
                  <input className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none" value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})} required />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Technical Impact Description</label>
                  <textarea className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-[#1E293B] outline-none resize-none h-24" value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Severity Class</label>
                        <select className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none" value={editForm.priority} onChange={(e) => setEditForm({...editForm, priority: e.target.value})}>
                            <option>Critical</option>
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Resolution Phase</label>
                        <select className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none" value={editForm.status} onChange={(e) => setEditForm({...editForm, status: e.target.value})}>
                            <option>Open</option>
                            <option>Investigating</option>
                            <option>Blocked</option>
                            <option>Resolved</option>
                        </select>
                    </div>
                </div>
              </div>
              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setEditingIssue(null)} className="flex-1 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors">Abort</button>
                <button type="submit" className="flex-[2] bg-rose-600 text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all">Sychronize State</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-xl z-[9999] flex items-center justify-center p-6 animate-in zoom-in duration-300">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden border border-white">
            <div className="p-10 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-2xl font-black text-[#111827] tracking-tighter text-left">Incident Logging</h2>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 text-left">New Operational Exception Entry</p>
            </div>
            <form onSubmit={handleAdd} className="p-10 space-y-6 text-left">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Issue Identity</label>
                  <input autoFocus className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-gray-300" placeholder="Summarize the incident..." value={newForm.title} onChange={(e) => setNewForm({...newForm, title: e.target.value})} required />
                </div>
                <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Assign to Context</label>
                    <input className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none" placeholder="e.g. Website V2" value={newForm.project} onChange={(e) => setNewForm({...newForm, project: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Priority</label>
                        <select className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none" value={newForm.priority} onChange={(e) => setNewForm({...newForm, priority: e.target.value})}>
                            <option>Critical</option>
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Status</label>
                        <select className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none" value={newForm.status} onChange={(e) => setNewForm({...newForm, status: e.target.value})}>
                            <option>Open</option>
                            <option>Investigating</option>
                        </select>
                    </div>
                </div>
              </div>
              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors">Discard</button>
                <button type="submit" className="flex-[2] bg-rose-600 text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all">Initialize Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
