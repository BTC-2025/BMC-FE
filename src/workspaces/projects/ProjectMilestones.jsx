import React, { useState } from 'react';

export default function ProjectMilestones({ milestones, updateMilestone, removeMilestone, addMilestone }) {
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [newForm, setNewForm] = useState({
    title: "", date: "", status: "Upcoming", description: ""
  });

  const displayMilestones = milestones || [];

  const startEdit = (m) => {
    setEditingMilestone(m.id);
    setEditForm({ ...m });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    updateMilestone(editingMilestone, editForm);
    setEditingMilestone(null);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    addMilestone(newForm);
    setShowAddModal(false);
    setNewForm({ title: "", date: "", status: "Upcoming", description: "" });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="flex items-center justify-between px-2">
        <div className="text-left">
            <h3 className="text-3xl font-black text-[#111827] tracking-tighter">Strategic <span className="text-[#195bac]">Milestones</span></h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">Key Objectives & Project Lifecycle</p>
        </div>
        <button 
            onClick={() => setShowAddModal(true)}
            className="bg-[#195bac] text-white px-8 py-4 rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3"
        >
            <span className="text-xl leading-none">+</span>
            Define Milestone
        </button>
      </div>

      <div className="relative border-l-[3px] border-dashed border-gray-100 pl-12 ml-6 space-y-16">
        {displayMilestones.map((m, i) => (
          <div key={m.id} className="relative group text-left">
            {/* Timeline Dot */}
            <div className={`absolute -left-[63px] top-0 w-8 h-8 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-[10px] transition-all duration-500
              ${m.status === 'Completed' ? 'bg-emerald-500 text-white' : 
                m.status === 'In Progress' ? 'bg-blue-600 text-white animate-pulse' : 
                'bg-white text-gray-300 border-gray-50'}`}>
              {m.status === 'Completed' ? '✓' : i + 1}
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] hover:border-blue-100 transition-all relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-[#195bac] uppercase tracking-[0.2em]">{m.date}</p>
                        <h4 className="text-2xl font-black text-gray-900 tracking-tight">{m.title}</h4>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                        <button 
                            onClick={() => startEdit(m)}
                            className="w-10 h-10 rounded-xl bg-blue-50 text-[#195bac] flex items-center justify-center hover:bg-[#195bac] hover:text-white transition-all shadow-sm"
                        >
                            ✏️
                        </button>
                        <button 
                            onClick={() => removeMilestone(m.id)}
                            className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                        >
                            🗑️
                        </button>
                    </div>
                </div>
                
                <p className="text-sm font-medium text-gray-500 leading-relaxed max-w-xl">
                    {m.description || "Significant project achievement required for operational closure and stakeholder reporting."}
                </p>

                <div className="mt-6 pt-6 border-t border-gray-50 flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border
                        ${m.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                          m.status === 'In Progress' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                          'bg-gray-50 text-gray-400 border-gray-100'}`}>
                        {m.status}
                    </span>
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">ID: {m.id}</span>
                </div>

                {/* Decorative background number */}
                <span className="absolute -right-4 -bottom-8 text-[120px] font-black text-gray-50 opacity-[0.03] select-none group-hover:opacity-[0.05] transition-opacity lowercase">
                    {(m.status || '?').slice(0,1)}
                </span>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingMilestone && (
        <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-xl z-[9999] flex items-center justify-center p-6 animate-in zoom-in duration-300">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden border border-white">
            <div className="p-10 border-b border-gray-100 bg-[#F8FAFC]">
              <h2 className="text-2xl font-black text-[#111827] tracking-tighter text-left">Refine Milestone</h2>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 text-left">Strategic Roadmap Correction</p>
            </div>
            <form onSubmit={handleUpdate} className="p-10 space-y-8 text-left">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Milestone Name</label>
                  <input 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                    value={editForm.title}
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Event Description</label>
                  <textarea 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100 transition-all resize-none h-24"
                    value={editForm.description || ""}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Execution Status</label>
                    <select 
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                      value={editForm.status}
                      onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                    >
                      <option>Upcoming</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Target Date</label>
                    <input 
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                      value={editForm.date}
                      onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setEditingMilestone(null)} className="flex-1 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors">Abort</button>
                <button type="submit" className="flex-[2] bg-[#195bac] text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all">Synchronize Roadmap</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-xl z-[9999] flex items-center justify-center p-6 animate-in zoom-in duration-300">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden border border-white">
            <div className="p-10 border-b border-gray-100 bg-[#F8FAFC]">
              <h2 className="text-2xl font-black text-[#111827] tracking-tighter text-left">Generate Milestone</h2>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 text-left">New Strategic Objective Entry</p>
            </div>
            <form onSubmit={handleAdd} className="p-10 space-y-8 text-left">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Milestone Identity</label>
                  <input 
                    autoFocus
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-gray-300"
                    placeholder="e.g. Infrastructure Certification"
                    value={newForm.title}
                    onChange={(e) => setNewForm({...newForm, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Objective Description</label>
                    <textarea 
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100 transition-all resize-none h-24 placeholder:text-gray-300"
                        placeholder="What needs to be achieved?"
                        value={newForm.description}
                        onChange={(e) => setNewForm({...newForm, description: e.target.value})}
                    />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Initial Status</label>
                    <select 
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                      value={newForm.status}
                      onChange={(e) => setNewForm({...newForm, status: e.target.value})}
                    >
                      <option>Upcoming</option>
                      <option>In Progress</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Target Date</label>
                    <input 
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-gray-300"
                      placeholder="e.g. April 20"
                      value={newForm.date}
                      onChange={(e) => setNewForm({...newForm, date: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors">Discard</button>
                <button type="submit" className="flex-[2] bg-[#195bac] text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all">Initialize Objective</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
