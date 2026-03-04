import { useState } from 'react';
import { PERMISSIONS, DEFAULT_ROLES } from '../config/accessControl';

export default function AccessControlManagement() {
  const [activeTab, setActiveTab] = useState('roles');
  const [selectedRole, setSelectedRole] = useState(null);
  
  // Mock users for UI demonstration
  const [users, setUsers] = useState([
    { id: 1, name: 'System Admin', username: 'admin', email: 'admin@btc.com', roles: ['ADMIN'], lastActive: '2m ago' },
    { id: 2, name: 'Sanjiv Kumar', username: 'sanjiv', email: 'sanjiv@btc.com', roles: ['INVENTORY_MANAGER'], lastActive: '1h ago' },
    { id: 3, name: 'Priya Sharma', username: 'priya', email: 'priya@btc.com', roles: ['FINANCE_ACCOUNTANT', 'BI_VIEWER'], lastActive: '5h ago' },
    { id: 4, name: 'Anita Roy', username: 'anita', email: 'anita@btc.com', roles: ['HR_MANAGER'], lastActive: 'Yesterday' },
  ]);

  const modules = Object.keys(PERMISSIONS);

  const renderRolesTab = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-bold text-gray-900">Role Management</h4>
          <p className="text-xs text-gray-500 font-medium">Define granular permissions for enterprise roles</p>
        </div>
        <button className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#195bac] transition-all">
          + Create New Role
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(DEFAULT_ROLES).map(([key, role]) => (
          <div 
            key={key} 
            className={`p-5 bg-white border rounded-[32px] cursor-pointer transition-all hover:shadow-lg
              ${selectedRole === key ? 'border-[#195bac] ring-4 ring-[#195bac]/5' : 'border-gray-100'}`}
            onClick={() => setSelectedRole(key)}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg
                ${key === 'ADMIN' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-[#195bac]'}`}>
                {key === 'ADMIN' ? '🛡️' : '👤'}
              </div>
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{role.permissions.length} PERMS</span>
            </div>
            <h5 className="font-extrabold text-[#111827] text-sm mb-1">{role.name}</h5>
            <p className="text-[10px] text-gray-400 font-bold leading-relaxed">{role.description}</p>
          </div>
        ))}
      </div>

      {selectedRole && (
        <div className="mt-10 bg-gray-900 rounded-[40px] p-8 text-white animate-in slide-in-from-bottom-6 duration-700">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
            <div>
              <h4 className="text-xl font-black uppercase tracking-tighter">Editing: {DEFAULT_ROLES[selectedRole].name}</h4>
              <p className="text-[10px] font-black text-[#195bac] uppercase tracking-widest mt-1">Permission Matrix Authorization</p>
            </div>
            <button className="px-6 py-3 bg-white text-gray-950 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">Save Changes</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map(moduleKey => (
              <div key={moduleKey} className="space-y-4">
                <p className="text-[11px] font-black text-[#195bac] uppercase tracking-widest border-l-2 border-[#195bac] pl-3">{moduleKey}</p>
                <div className="space-y-2">
                  {Object.entries(PERMISSIONS[moduleKey]).map(([pKey, pVal]) => {
                     const isAssigned = DEFAULT_ROLES[selectedRole].permissions.includes(pVal) || DEFAULT_ROLES[selectedRole].permissions.includes('*');
                     return (
                       <label key={pVal} className="flex items-center gap-3 cursor-pointer group">
                         <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all 
                           ${isAssigned ? 'bg-[#195bac] border-[#195bac]' : 'bg-white/5 border-white/20 group-hover:border-white/40'}`}>
                           {isAssigned && <span className="text-white text-[10px]">✓</span>}
                         </div>
                         <span className={`text-[11px] font-bold ${isAssigned ? 'text-white' : 'text-white/40'} transition-colors`}>{pKey.replace('_', ' ')}</span>
                       </label>
                     );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderUsersTab = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-bold text-gray-900">User Access Assignment</h4>
          <p className="text-xs text-gray-500 font-medium">Link roles to users and define operational scope</p>
        </div>
        <button className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#195bac] transition-all">
          + Onboard User
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Identity</th>
              <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Assigned Roles</th>
              <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Operational Scope</th>
              <th className="px-6 py-4 text-right text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map(u => (
              <tr key={u.id}>
                <td className="px-6 py-5">
                   <div className="font-extrabold text-gray-900 text-sm">{u.name}</div>
                   <div className="text-[10px] text-gray-500 font-bold tracking-tight">{u.email}</div>
                </td>
                <td className="px-6 py-5">
                   <div className="flex flex-wrap gap-2">
                     {u.roles.map(r => (
                       <span key={r} className="px-2 py-1 bg-blue-50 text-[#195bac] text-[9px] font-black uppercase tracking-widest rounded-lg border border-blue-100">
                         {DEFAULT_ROLES[r]?.name || r}
                       </span>
                     ))}
                   </div>
                </td>
                <td className="px-6 py-5 text-left">
                   <div className="flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                     <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Global Command</span>
                   </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 h-8 w-8 rounded-lg bg-gray-50 text-gray-400 hover:text-[#195bac] hover:bg-blue-50 transition-all flex items-center justify-center">✎</button>
                    <button className="p-2 h-8 w-8 rounded-lg bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center">✕</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderModulesTab = () => (
    <div className="animate-in fade-in duration-500 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {modules.map(moduleKey => (
          <div key={moduleKey} className="bg-white border border-gray-100 p-6 rounded-[32px] hover:shadow-xl transition-all relative overflow-hidden group text-left">
             <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 scale-150 rotate-45 -translate-y-10 translate-x-10 opacity-50 transition-all group-hover:bg-[#195bac]/10"></div>
             <p className="text-[10px] font-black text-[#195bac] uppercase tracking-widest mb-1 leading-none">{moduleKey}</p>
             <h4 className="text-lg font-black tracking-tighter text-gray-900 mb-4">{moduleKey.charAt(0) + moduleKey.slice(1).toLowerCase()}</h4>
             <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Module Active</span>
             </div>
             <div className="space-y-2 pt-2 border-t border-gray-50">
               <p className="text-[8px] font-bold text-gray-400 uppercase">Available Protocols:</p>
               <div className="flex flex-wrap gap-1.5">
                  {Object.keys(PERMISSIONS[moduleKey]).map(p => (
                    <span key={p} className="text-[7px] font-black bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded tracking-tighter">{p}</span>
                  ))}
               </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-10 py-4">
      {/* Tab Navigation */}
      <div className="flex gap-4 p-2 bg-white/50 border border-white/60 rounded-3xl w-fit">
        {[
          { id: 'modules', label: '8 Core Modules', icon: '🔋' },
          { id: 'roles', label: 'Manage Roles', icon: '🔐' },
          { id: 'users', label: 'User Assignment', icon: '👥' },
          { id: 'audit', label: 'Audit Logs', icon: '📜' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all
              ${activeTab === tab.id 
                ? 'bg-gray-900 text-white shadow-xl shadow-black/10' 
                : 'text-gray-400 hover:text-gray-600'}`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dynamic Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'modules' && renderModulesTab()}
        {activeTab === 'roles' && renderRolesTab()}
        {activeTab === 'users' && renderUsersTab()}
        {activeTab === 'audit' && (
          <div className="bg-gray-900 rounded-[40px] p-10 text-white flex flex-col items-center justify-center text-center space-y-6">
             <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center text-3xl animate-pulse">📜</div>
             <div>
               <h4 className="text-xl font-black uppercase tracking-tighter mb-2">Enterprise Audit Log System</h4>
               <p className="text-sm font-medium text-white/40 max-w-sm mx-auto">Tracking all role changes, permission overrides, and security events across the entire ERP infra.</p>
             </div>
             <div className="space-y-3 w-full max-w-md pt-6">
               {[
                 { user: 'Admin', act: 'Updated Finance Role', time: '2m ago' },
                 { user: 'Sanjiv', act: 'Inventory Stock Out (WH01)', time: '14m ago' },
                 { user: 'Admin', act: 'Reset Pass-key: Anita', time: '1h ago' },
               ].map((log, i) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all text-left">
                   <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-[#195bac]">{log.user}</p>
                     <p className="text-xs font-bold text-white mt-0.5">{log.act}</p>
                   </div>
                   <span className="text-[8px] font-black text-white/30 uppercase">{log.time}</span>
                 </div>
               ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
