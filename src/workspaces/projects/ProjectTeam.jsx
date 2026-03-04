import React, { useState } from 'react';
import BaseModal from "../../components/ui/BaseModal";

export default function ProjectTeam({ team, updateMember, removeMember, addMember }) {
  const [editingMember, setEditingMember] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [newForm, setNewForm] = useState({
    name: "", role: "", email: "", department: "Engineering", status: "Active", availability: "High"
  });

  const displayTeam = team || [];

  const startEdit = (m) => {
    setEditingMember(m.id);
    setEditForm({ ...m });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    updateMember(editingMember, editForm);
    setEditingMember(null);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    addMember(newForm);
    setShowAddModal(false);
    setNewForm({ name: "", role: "", email: "", department: "Engineering", status: "Active", availability: "High" });
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      
      {/* Directory Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="text-left">
            <h3 className="text-3xl font-black text-[#111827] tracking-tighter">Resource <span className="text-[#195bac]">Roster</span></h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">Cross-Functional Personnel Inventory</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="bg-white border border-gray-100 rounded-2xl px-6 py-3 shadow-sm hidden lg:block">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Global Headcount</p>
                <p className="text-sm font-black text-gray-900">{displayTeam.length} Active Specialists</p>
            </div>
            <button 
                onClick={() => setShowAddModal(true)}
                className="bg-[#195bac] text-white px-8 py-4 rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3"
            >
                <span className="text-xl leading-none">+</span>
                Onboard Personnel
            </button>
        </div>
      </div>

      {/* Personnel Grid - Unique Card Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {displayTeam.map((member) => (
          <div key={member.id} className="bg-white rounded-[48px] p-10 border border-gray-100 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] hover:border-blue-100 transition-all duration-500 group relative overflow-hidden">
            
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/30 rounded-bl-[100px] -z-0 group-hover:bg-blue-50/50 transition-colors"></div>

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-8">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-[32px] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-3xl shadow-inner border border-white">
                            {member.name.charAt(0)}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white shadow-sm
                            ${member.status === 'Active' ? 'bg-emerald-500' : 
                              member.status === 'Busy' ? 'bg-rose-500' : 'bg-amber-500'}`}></div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => startEdit(member)} className="w-10 h-10 rounded-xl bg-blue-50 text-[#195bac] flex items-center justify-center hover:bg-[#195bac] hover:text-white transition-all shadow-sm">✏️</button>
                        <button onClick={() => removeMember(member.id)} className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm">🗑️</button>
                    </div>
                </div>

                <div className="text-left space-y-1 mb-8">
                    <h4 className="text-xl font-black text-gray-900 tracking-tight">{member.name}</h4>
                    <p className="text-[11px] font-black text-[#195bac] uppercase tracking-[0.15em]">{member.role}</p>
                    <p className="text-xs font-bold text-gray-400">{member.email}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-3xl border border-gray-100/50">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Department</p>
                        <p className="text-[11px] font-black text-gray-700">{member.department}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-3xl border border-gray-100/50">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Load Balance</p>
                        <div className="flex items-center gap-2">
                             <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                                <div className={`h-full ${member.availability === 'High' ? 'bg-rose-500 w-full' : member.availability === 'Moderate' ? 'bg-amber-500 w-[60%]' : 'bg-emerald-500 w-[30%]'}`}></div>
                             </div>
                             <span className="text-[9px] font-black text-gray-500">{member.availability}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-between text-left">
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">UID: {member.id}</span>
                <button className="text-[10px] font-black text-[#195bac] uppercase tracking-widest hover:underline">Full Profile →</button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <BaseModal isOpen={!!editingMember} onClose={() => setEditingMember(null)} className="max-w-lg">
          <div className="p-10 border-b border-gray-100 bg-[#F8FAFC]">
            <h2 className="text-2xl font-black text-[#111827] tracking-tighter text-left">Modify Personnel</h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 text-left">Internal Directory Update</p>
          </div>
          <form onSubmit={handleUpdate} className="p-10 space-y-6 text-left">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Full Name</label>
                <input className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100 transition-all" value={editForm?.name || ''} onChange={(e) => setEditForm({...editForm, name: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Operational Role</label>
                      <input className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100 transition-all" value={editForm?.role || ''} onChange={(e) => setEditForm({...editForm, role: e.target.value})} required />
                  </div>
                  <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Department</label>
                      <select className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none" value={editForm?.department || ''} onChange={(e) => setEditForm({...editForm, department: e.target.value})}>
                          <option>Engineering</option>
                          <option>Creative</option>
                          <option>Operations</option>
                          <option>Management</option>
                      </select>
                  </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Live Status</label>
                      <select className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none" value={editForm?.status || ''} onChange={(e) => setEditForm({...editForm, status: e.target.value})}>
                          <option>Active</option>
                          <option>Busy</option>
                          <option>Remote</option>
                          <option>Away</option>
                      </select>
                  </div>
                  <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Resource Load</label>
                      <select className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none" value={editForm?.availability || ''} onChange={(e) => setEditForm({...editForm, availability: e.target.value})}>
                          <option>Low</option>
                          <option>Moderate</option>
                          <option>High</option>
                          <option>Critical</option>
                      </select>
                  </div>
              </div>
            </div>
            <div className="pt-6 flex gap-4">
              <button type="button" onClick={() => setEditingMember(null)} className="flex-1 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors">Abort</button>
              <button type="submit" className="flex-[2] bg-[#195bac] text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all">Update Roster</button>
            </div>
          </form>
      </BaseModal>

      {/* Add Modal */}
      <BaseModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} className="max-w-lg">
          <div className="p-10 border-b border-gray-100 bg-[#F8FAFC]">
            <h2 className="text-2xl font-black text-[#111827] tracking-tighter text-left">Onboard Personnel</h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 text-left">New Strategic Resource Entry</p>
          </div>
          <form onSubmit={handleAdd} className="p-10 space-y-6 text-left">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Full Name</label>
                <input autoFocus className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-gray-300" placeholder="e.g. Gautam Karthik" value={newForm.name} onChange={(e) => setNewForm({...newForm, name: e.target.value})} required />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Corporate Email</label>
                <input type="email" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100 transition-all focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-gray-300" placeholder="name@btc.com" value={newForm.email} onChange={(e) => setNewForm({...newForm, email: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Target Role</label>
                      <input className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-gray-300" placeholder="e.g. Lead Engineer" value={newForm.role} onChange={(e) => setNewForm({...newForm, role: e.target.value})} required />
                  </div>
                  <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Primary Dept.</label>
                      <select className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none" value={newForm.department} onChange={(e) => setNewForm({...newForm, department: e.target.value})}>
                          <option>Engineering</option>
                          <option>Creative</option>
                          <option>Operations</option>
                          <option>Management</option>
                      </select>
                  </div>
              </div>
            </div>
            <div className="pt-6 flex gap-4">
              <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors">Discard</button>
              <button type="submit" className="flex-[2] bg-[#195bac] text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all">Initialize Personnel</button>
            </div>
          </form>
      </BaseModal>
    </div>
  );
}
