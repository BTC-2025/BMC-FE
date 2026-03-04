import React, { useState } from 'react';
import BaseModal from "../../components/ui/BaseModal";

export default function ProjectTasks({ tasks, updateTask, removeTask, addTask }) {
  const [editingTask, setEditingTask] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [newForm, setNewForm] = useState({
    title: "", project: "General", priority: "Medium", status: "In Progress", due: "ASAP"
  });

  const displayTasks = tasks || [];

  const startEdit = (task) => {
    setEditingTask(task.id);
    setEditForm({ ...task });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    updateTask(editingTask, editForm);
    setEditingTask(null);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    addTask(newForm);
    setShowAddModal(false);
    setNewForm({ title: "", project: "General", priority: "Medium", status: "In Progress", due: "ASAP" });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="text-left">
            <h3 className="text-2xl font-black text-[#111827] tracking-tight">Active Task Queue</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{displayTasks.length} Operations Pending</p>
        </div>
        <button 
            onClick={() => setShowAddModal(true)}
            className="bg-[#195bac] text-white px-8 py-4 rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3"
        >
            <span className="text-xl leading-none">+</span>
            Define Task
        </button>
      </div>

      <div className="space-y-4">
        {displayTasks.map((task) => (
          <div key={task.id} className="bg-white p-6 rounded-[32px] border border-gray-100 flex items-center justify-between hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] hover:border-blue-100 transition-all group">
            <div className="flex items-center gap-5 text-left">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg shadow-sm
                ${task.status === 'Blocked' ? 'bg-rose-50 text-rose-500' : 
                  task.status === 'Completed' ? 'bg-emerald-50 text-emerald-500' : 
                  'bg-blue-50 text-blue-500'}`}>
                {task.status === 'Blocked' ? '🚫' : task.status === 'Completed' ? '✅' : '⚡'}
              </div>
              <div>
                <h4 className="font-black text-[#111827] text-[15px]">{task.title}</h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] font-black text-[#195bac] uppercase tracking-wider">{task.project}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: {task.id}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-12 text-right">
              <div className="hidden md:block">
                <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">Priority</p>
                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border
                  ${task.priority === 'Critical' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                    task.priority === 'High' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                    'bg-blue-50 text-blue-600 border-blue-100'}`}>
                  {task.priority}
                </span>
              </div>
              
              <div className="hidden lg:block min-w-[100px]">
                <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">Deadline</p>
                <p className="text-xs font-black text-gray-700">{task.due}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                  <button 
                    onClick={() => startEdit(task)}
                    className="w-10 h-10 rounded-xl bg-blue-50 text-[#195bac] flex items-center justify-center hover:bg-[#195bac] hover:text-white transition-all shadow-sm"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => removeTask(task.id)}
                    className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                  >
                    🗑️
                  </button>
                </div>
                <div className={`w-2 h-2 rounded-full group-hover:hidden transition-all
                  ${task.status === 'Blocked' ? 'bg-rose-500' : task.status === 'Completed' ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <BaseModal isOpen={!!editingTask} onClose={() => setEditingTask(null)} className="max-w-lg">
          <div className="p-10 border-b border-gray-100 bg-[#F8FAFC]">
            <h2 className="text-2xl font-black text-[#111827] tracking-tighter text-left">Refine Task</h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 text-left">Workflow Execution Control</p>
          </div>
          <form onSubmit={handleUpdate} className="p-10 space-y-8 text-left">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Task Description</label>
                <input 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                  value={editForm?.title || ''}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Status</label>
                  <select 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                    value={editForm?.status || ''}
                    onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                  >
                    <option>In Progress</option>
                    <option>Blocked</option>
                    <option>Completed</option>
                    <option>Pending</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Priority</label>
                  <select 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                    value={editForm?.priority || ''}
                    onChange={(e) => setEditForm({...editForm, priority: e.target.value})}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Due Date</label>
                <input 
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                  value={editForm?.due || ''}
                  onChange={(e) => setEditForm({...editForm, due: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="pt-6 flex gap-4">
              <button type="button" onClick={() => setEditingTask(null)} className="flex-1 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors">Abort</button>
              <button type="submit" className="flex-[2] bg-[#195bac] text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all">Synchronize Workflow</button>
            </div>
          </form>
      </BaseModal>

      {/* Add Modal */}
      <BaseModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} className="max-w-lg">
          <div className="p-10 border-b border-gray-100 bg-[#F8FAFC]">
            <h2 className="text-2xl font-black text-[#111827] tracking-tighter text-left">Generate Task</h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 text-left">New Operational Unit Entry</p>
          </div>
          <form onSubmit={handleAdd} className="p-10 space-y-8 text-left">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Task Definition</label>
                <input 
                  autoFocus
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-gray-300"
                  placeholder="Describe the objective..."
                  value={newForm.title}
                  onChange={(e) => setNewForm({...newForm, title: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Assign to Project</label>
                <input 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                  value={newForm.project}
                  onChange={(e) => setNewForm({...newForm, project: e.target.value})}
                  required
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
                    <option>In Progress</option>
                    <option>Blocked</option>
                    <option>Pending</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Priority Class</label>
                  <select 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                    value={newForm.priority}
                    onChange={(e) => setNewForm({...newForm, priority: e.target.value})}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Target Deadline</label>
                <input 
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                  placeholder="e.g. Next Friday"
                  value={newForm.due}
                  onChange={(e) => setNewForm({...newForm, due: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="pt-6 flex gap-4">
              <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors">Discard</button>
              <button type="submit" className="flex-[2] bg-[#195bac] text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all">Initialize Task</button>
            </div>
          </form>
      </BaseModal>
    </div>
  );
}
