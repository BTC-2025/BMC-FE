import React, { useState } from 'react';

export default function ProjectList({ projects, updateProject, removeProject }) {
  const [editingProject, setEditingProject] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const displayProjects = projects || [];

  const startEdit = (p) => {
    setEditingProject(p.id);
    setEditForm({ ...p });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    updateProject(editingProject, editForm);
    setEditingProject(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#F8FAFC]">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] rounded-tl-2xl">ID</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Project Identity</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Lead</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Timeline</th>
              <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] rounded-tr-2xl">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {displayProjects.map(p => (
              <tr key={p.id} className="hover:bg-blue-50/10 transition-all group">
                <td className="px-8 py-6">
                  <span className="font-mono text-[11px] font-black text-gray-900 bg-gray-50 px-2.5 py-1.5 rounded-xl border border-gray-100 group-hover:bg-white transition-colors">
                    {p.id}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <p className="font-black text-[#111827] text-sm">{p.name}</p>
                  <p className="text-[10px] font-bold text-gray-400 mt-0.5 uppercase tracking-widest">Global Infrastructure</p>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#195bac] text-white flex items-center justify-center text-[10px] font-black uppercase shadow-lg shadow-blue-100">
                      {(p.lead || '?').slice(0,2)}
                    </div>
                    <span className="text-sm font-bold text-gray-600">{p.lead}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border
                    ${p.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                      p.status === 'Review' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      'bg-gray-50 text-gray-500 border-gray-100'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-sm font-bold text-gray-400 tabular-nums">
                  {p.timeline}
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                    <button 
                      className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                      title="View BOM"
                    >
                      📦
                    </button>
                    <button 
                      onClick={() => startEdit(p)}
                      className="w-10 h-10 rounded-xl bg-blue-50 text-[#195bac] flex items-center justify-center hover:bg-[#195bac] hover:text-white transition-all shadow-sm"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => removeProject(p.id)}
                      className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingProject && (
        <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-xl z-[9999] flex items-center justify-center p-6 animate-in zoom-in duration-300">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden border border-white">
            <div className="p-10 border-b border-gray-100 bg-[#F8FAFC]">
              <h2 className="text-2xl font-black text-[#111827] tracking-tighter text-left">Update Project</h2>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 text-left">Strategic Initiative Modification</p>
            </div>
            <form onSubmit={handleUpdate} className="p-10 space-y-8 text-left">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Project Name</label>
                  <input 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Lead</label>
                    <input 
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                      value={editForm.lead}
                      onChange={(e) => setEditForm({...editForm, lead: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Status</label>
                    <select 
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                      value={editForm.status}
                      onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                    >
                      <option>Active</option>
                      <option>Review</option>
                      <option>Pending</option>
                      <option>Completed</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Timeline</label>
                  <input 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                    value={editForm.timeline}
                    onChange={(e) => setEditForm({...editForm, timeline: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setEditingProject(null)} className="flex-1 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors">Abort</button>
                <button type="submit" className="flex-[2] bg-[#195bac] text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all">Synchronize Data</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
