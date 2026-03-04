import { useState, useEffect } from "react";
import { useAdmin } from "../context/AdminContext";
import BaseModal from "../components/ui/BaseModal";
import { auditApi } from "../services/auditApi";

export default function AdminWorkspace({ onBack }) {
    const { users, roles, permissions, assignRoles, createRole, updateRole, loading, error } = useAdmin();
    const [activeTab, setActiveTab] = useState("users");
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [editRole, setEditRole] = useState(null);
    const [roleForm, setRoleForm] = useState({ name: "", description: "", permissions: [] });

    const [showUserRolesModal, setShowUserRolesModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userRoles, setUserRoles] = useState([]);

    const [auditLogs, setAuditLogs] = useState([]);
    const [auditLoading, setAuditLoading] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);

    useEffect(() => {
        if (activeTab === "audit") {
            loadAuditLogs();
        }
    }, [activeTab]);

    const loadAuditLogs = async () => {
        setAuditLoading(true);
        try {
            const res = await auditApi.getLogs();
            setAuditLogs(res.data);
        } catch (err) {
            console.error("Failed to load audit logs", err);
        } finally {
            setAuditLoading(false);
        }
    };

    // Group permissions by module
    const groupedPermissions = permissions.reduce((acc, perm) => {
        const module = perm.code.split('.')[0] || 'System';
        if (!acc[module]) acc[module] = [];
        acc[module].push(perm);
        return acc;
    }, {});

    const openCreateRole = () => {
        setEditRole(null);
        setRoleForm({ name: "", description: "", permissions: [] });
        setShowRoleModal(true);
    };

    const openEditRole = (role) => {
        setEditRole(role);
        setRoleForm({ 
            name: role.name, 
            description: role.description || "", 
            permissions: role.permissions.map(p => p.id) 
        });
        setShowRoleModal(true);
    };

    const handleRoleSubmit = async (e) => {
        e.preventDefault();
        if (editRole) {
            await updateRole(editRole.id, roleForm);
        } else {
            await createRole(roleForm);
        }
        setShowRoleModal(false);
    };

    const togglePermission = (id) => {
        const newPerms = roleForm.permissions.includes(id)
            ? roleForm.permissions.filter(pId => pId !== id)
            : [...roleForm.permissions, id];
        setRoleForm({ ...roleForm, permissions: newPerms });
    };

    const openAssignRoles = (user) => {
        setSelectedUser(user);
        setUserRoles(user.roles.map(r => r.id));
        setShowUserRolesModal(true);
    };

    const handleAssignRoles = async () => {
        await assignRoles(selectedUser.id, userRoles);
        setShowUserRolesModal(false);
    };

    return (
        <div className="p-10 max-w-[1700px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-gray-100">
                <div className="space-y-3">
                    <button 
                        onClick={onBack}
                        className="flex items-center gap-2 text-[10px] font-black text-[#195bac] uppercase tracking-[0.2em] hover:gap-3 transition-all mb-4"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M15 19l-7-7 7-7" /></svg>
                        Return to Hub
                    </button>
                    <h2 className="text-5xl font-[1000] text-[#111827] tracking-tighter">System Governance</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#195bac] shadow-[0_0_10px_rgba(25,91,172,0.4)]"></span>
                        Enterprise Auth & Access Control Matrix
                    </p>
                </div>

                <div className="flex bg-gray-100/50 p-1.5 rounded-[24px] border border-gray-200/50 backdrop-blur-sm">
                    {["users", "roles", "permissions", "audit"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-3.5 rounded-[18px] text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-500
                                ${activeTab === tab 
                                    ? "bg-white text-[#195bac] shadow-xl shadow-blue-500/5 scale-[1.02]" 
                                    : "text-gray-400 hover:text-gray-900"}`}
                        >
                            {tab === "audit" ? "Audit Ledger" : tab}
                        </button>
                    ))}
                </div>
            </div>

            {error && (
                <div className="p-6 bg-rose-50 border border-rose-100 rounded-[30px] flex items-center gap-4 text-rose-600 animate-in slide-in-from-top-4">
                    <span className="text-2xl">⚠️</span>
                    <p className="text-[13px] font-bold uppercase tracking-tight">{error}</p>
                </div>
            ) }

            {/* Main Content Area */}
            <div className="min-h-[600px]">
                {activeTab === "users" && (
                    <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_20px_70px_-15px_rgba(0,0,0,0.03)] overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-[#F8FAFC]">
                                    <th className="px-10 py-8 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.3em]">Identity</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.3em]">Assigned Roles</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.3em]">System Status</th>
                                    <th className="px-10 py-8 text-right text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.3em]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-blue-50/20 transition-all group">
                                        <td className="px-10 py-8">
                                            <div className="text-[15px] font-black text-[#1E293B]">{u.username}</div>
                                            <div className="text-[11px] font-bold text-gray-400 mt-1 lowercase">{u.email}</div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-wrap gap-2">
                                                {u.roles.map(r => (
                                                    <span key={r.id} className="px-3 py-1 bg-blue-50 text-[#195bac] text-[9px] font-black rounded-lg uppercase tracking-widest border border-blue-100/50">
                                                        {r.name}
                                                    </span>
                                                ))}
                                                {u.roles.length === 0 && <span className="text-[10px] font-bold text-gray-300 italic uppercase">Unassigned</span>}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border
                                                ${u.is_active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                                <span className={`w-2 h-2 rounded-full ${u.is_active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`}></span>
                                                {u.is_active ? 'Online' : 'Locked'}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <button 
                                                onClick={() => openAssignRoles(u)}
                                                className="px-6 py-3 bg-[#195bac] text-white text-[10px] font-black rounded-2xl uppercase tracking-[0.1em] shadow-xl shadow-blue-500/10 hover:-translate-y-1 transition-all active:scale-95"
                                            >
                                                Manage Roles
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === "roles" && (
                    <div className="space-y-8">
                        <div className="flex justify-end">
                            <button 
                                onClick={openCreateRole}
                                className="bg-[#195bac] text-white px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/20 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
                                Construct Role
                            </button>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {roles.map((r) => (
                                <div key={r.id} className="bg-white p-10 rounded-[45px] border border-gray-100 shadow-[0_25px_60px_-20px_rgba(0,0,0,0.06)] hover:border-[#195bac]/20 transition-all group flex flex-col justify-between">
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div className="w-14 h-14 bg-blue-50 rounded-[20px] flex items-center justify-center text-[#195bac] text-2xl group-hover:scale-110 transition-all">🛡️</div>
                                            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">#{r.id} Class Role</span>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-[1000] text-[#111827] tracking-tighter uppercase">{r.name}</h3>
                                            <p className="text-[13px] font-bold text-gray-400 mt-2 leading-relaxed">{r.description || "No classification provided for this role node."}</p>
                                        </div>
                                        <div className="pt-4 space-y-3">
                                            <p className="text-[9px] font-black text-[#195bac] uppercase tracking-[0.2em]">Active Permissions</p>
                                            <div className="flex flex-wrap gap-2">
                                                {(r.permissions || []).slice(0, 5).map(p => (
                                                    <span key={p.id} className="px-2.5 py-1 bg-gray-50 text-gray-500 text-[8px] font-black rounded-lg border border-gray-100">
                                                        {p.code}
                                                    </span>
                                                ))}
                                                {r.permissions.length > 5 && (
                                                    <span className="text-[9px] font-black text-gray-300">+{r.permissions.length - 5} more</span>
                                                )}
                                                {r.permissions.length === 0 && (
                                                    <span className="text-[10px] font-bold text-gray-300 italic uppercase">Zero Access</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => openEditRole(r)}
                                        className="mt-10 w-full py-5 bg-gray-50 text-gray-950 text-[10px] font-black rounded-2xl uppercase tracking-[0.2em] border border-gray-100 hover:bg-[#111827] hover:text-white transition-all shadow-sm"
                                    >
                                        Edit Policy
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === "audit" && (
                    <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_20px_70px_-15px_rgba(0,0,0,0.03)] overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-[#F8FAFC]">
                                    <th className="px-10 py-8 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.3em]">Timestamp</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.3em]">Operator</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.3em]">Action</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.3em]">Entity</th>
                                    <th className="px-10 py-8 text-right text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.3em]">State</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {auditLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-blue-50/20 transition-all group">
                                        <td className="px-10 py-8 whitespace-nowrap">
                                            <div className="text-[12px] font-black text-[#1E293B]">{new Date(log.created_at).toLocaleDateString()}</div>
                                            <div className="text-[10px] font-bold text-[#195bac]">{new Date(log.created_at).toLocaleTimeString()}</div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-col">
                                                <span className="text-[12px] font-black text-[#1E293B]">User ID: {log.user_id}</span>
                                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">{log.ip_address || "Internal"}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-1 bg-gray-100 rounded-lg text-[9px] font-[1000] text-gray-600 uppercase tracking-widest">{log.module}</span>
                                                <span className="text-[11px] font-black text-gray-950 uppercase tracking-tight">{log.action.replace('admin.', '').replace('finance.', '').replace('inventory.', '')}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-[1000] text-gray-950 uppercase">{log.entity_type}</span>
                                                <span className="text-[10px] font-bold text-gray-400">ID: {log.entity_id || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            {(log.before || log.after) ? (
                                                <button 
                                                    onClick={() => setSelectedLog(log)}
                                                    className="px-5 py-2.5 bg-gray-50 text-gray-950 text-[10px] font-black rounded-xl uppercase tracking-widest border border-gray-200 hover:bg-[#111827] hover:text-white transition-all"
                                                >
                                                    View Diff
                                                </button>
                                            ) : (
                                                <span className="text-[9px] font-black text-gray-300 uppercase italic">No Snapshot</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {auditLoading && (
                            <div className="p-20 text-center text-[10px] font-black text-[#195bac] uppercase tracking-[0.3em] animate-pulse">
                                Retrieving Decrypted Logs...
                            </div>
                        )}
                        {!auditLoading && auditLogs.length === 0 && (
                            <div className="p-20 text-center text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
                                No Audit Records Found in this Cluster
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Role Construction Modal */}
            <BaseModal isOpen={showRoleModal} onClose={() => setShowRoleModal(false)} className="max-w-4xl">
                <div className="p-10 border-b border-gray-100 bg-gray-50/30 flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-[1000] text-[#111827] tracking-tighter uppercase">{editRole ? 'Edit Security Policy' : 'Construct New Class Role'}</h2>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">RBAC System Terminal</p>
                    </div>
                    <button onClick={() => setShowRoleModal(false)} className="w-12 h-12 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-rose-500 transition-all flex items-center justify-center font-black">✕</button>
                </div>
                <form onSubmit={handleRoleSubmit} className="p-10 space-y-10">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Role Identifier</label>
                            <input 
                                className="w-full bg-gray-50 border border-gray-200 rounded-[20px] px-8 py-5 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-[#195bac] transition-all"
                                value={roleForm.name}
                                onChange={e => setRoleForm({...roleForm, name: e.target.value})}
                                placeholder="E.G. INVENTORY_MANAGER"
                                required
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Role Description</label>
                            <input 
                                className="w-full bg-gray-50 border border-gray-200 rounded-[20px] px-8 py-5 text-sm font-bold text-gray-500 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-[#195bac] transition-all"
                                value={roleForm.description}
                                onChange={e => setRoleForm({...roleForm, description: e.target.value})}
                                placeholder="Purpose of this access level..."
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                            <p className="text-[11px] font-black text-[#195bac] uppercase tracking-[0.2em]">Permission Matrix</p>
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{roleForm.permissions.length} nodes selected</span>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[400px] overflow-y-auto pr-4 scrollbar-hide">
                            {Object.entries(groupedPermissions).map(([module, perms]) => (
                                <div key={module} className="space-y-3">
                                    <h4 className="text-[10px] font-black text-gray-950 uppercase tracking-widest bg-gray-100 px-3 py-1.5 rounded-lg inline-block">{module}</h4>
                                    <div className="space-y-2">
                                        {perms.map(p => (
                                            <label 
                                                key={p.id} 
                                                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
                                                    ${roleForm.permissions.includes(p.id) 
                                                        ? 'bg-blue-50/50 border-blue-200 text-[#195bac] shadow-sm' 
                                                        : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'}`}
                                            >
                                                <input 
                                                    type="checkbox" 
                                                    className="hidden" 
                                                    checked={roleForm.permissions.includes(p.id)}
                                                    onChange={() => togglePermission(p.id)}
                                                />
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all
                                                    ${roleForm.permissions.includes(p.id) ? 'bg-[#195bac] border-[#195bac]' : 'border-gray-300'}`}>
                                                    {roleForm.permissions.includes(p.id) && <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>}
                                                </div>
                                                <span className="text-[11px] font-black uppercase tracking-tight">{p.code.split('.')[1] || p.code}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-8">
                        <button type="submit" className="w-full py-6 bg-gray-950 text-white rounded-[24px] text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl hover:-translate-y-1 active:scale-95 transition-all">
                            {editRole ? 'Commit Matrix Changes' : 'Initialize Class Role'}
                        </button>
                    </div>
                </form>
            </BaseModal>

            {/* User Roles Assignment Modal */}
            <BaseModal isOpen={showUserRolesModal} onClose={() => setShowUserRolesModal(false)} className="max-w-xl">
                 <div className="p-10 border-b border-gray-100 bg-gray-50/30">
                    <h2 className="text-2xl font-[1000] text-[#111827] tracking-tighter uppercase">Assign User Roles</h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Target Identity: {selectedUser?.username}</p>
                </div>
                <div className="p-10 space-y-8">
                    <div className="space-y-4">
                        <p className="text-[10px] font-black text-[#195bac] uppercase tracking-[0.2em]">Available Role Nodes</p>
                        <div className="grid grid-cols-1 gap-3">
                            {roles.map(r => (
                                <label 
                                    key={r.id} 
                                    className={`flex items-center justify-between p-5 rounded-[24px] border cursor-pointer transition-all
                                        ${userRoles.includes(r.id) 
                                            ? 'bg-[#195bac]/5 border-[#195bac]/20 text-[#195bac]' 
                                            : 'bg-gray-50/50 border-gray-100 text-gray-500 hover:border-gray-200'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                                            ${userRoles.includes(r.id) ? 'border-[#195bac] bg-[#195bac]/10' : 'border-gray-200'}`}>
                                            {userRoles.includes(r.id) && <div className="w-2 h-2 rounded-full bg-[#195bac] animate-pulse"></div>}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[13px] font-black uppercase tracking-tight">{r.name}</span>
                                            <span className="text-[10px] font-bold text-gray-400">{r.permissions.length} active permissions</span>
                                        </div>
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        className="hidden" 
                                        checked={userRoles.includes(r.id)}
                                        onChange={() => {
                                            const newRoles = userRoles.includes(r.id)
                                                ? userRoles.filter(rid => rid !== r.id)
                                                : [...userRoles, r.id];
                                            setUserRoles(newRoles);
                                        }}
                                    />
                                </label>
                            ))}
                        </div>
                    </div>
                    <button 
                        onClick={handleAssignRoles}
                        className="w-full py-6 bg-gray-950 text-white rounded-[24px] text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl hover:-translate-y-1 active:scale-95 transition-all"
                    >
                        Apply Access Matrix
                    </button>
                </div>
            </BaseModal>

            {/* State Diff Modal */}
            <BaseModal isOpen={!!selectedLog} onClose={() => setSelectedLog(null)} className="max-w-3xl">
                <div className="p-10 border-b border-gray-100 bg-gray-50/30">
                    <h2 className="text-2xl font-[1000] text-[#111827] tracking-tighter uppercase">State Snapshot Diff</h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Refrence Identity: {selectedLog?.entity_type} #{selectedLog?.entity_id}</p>
                </div>
                <div className="p-10 grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] border-b border-rose-50 pb-2">Previous State (Before)</p>
                        <pre className="p-6 bg-gray-950 text-emerald-400 text-[11px] font-mono rounded-[24px] overflow-auto max-h-[400px]">
                            {JSON.stringify(selectedLog?.before || {}, null, 2)}
                        </pre>
                    </div>
                    <div className="space-y-4">
                        <p className="text-[10px] font-black text-[#195bac] uppercase tracking-[0.2em] border-b border-blue-50 pb-2">Resultant State (After)</p>
                        <pre className="p-6 bg-gray-950 text-blue-400 text-[11px] font-mono rounded-[24px] overflow-auto max-h-[400px]">
                            {JSON.stringify(selectedLog?.after || {}, null, 2)}
                        </pre>
                    </div>
                </div>
                <div className="p-10 pt-0">
                    <button 
                        onClick={() => setSelectedLog(null)}
                        className="w-full py-6 bg-gray-950 text-white rounded-[24px] text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl hover:-translate-y-1 active:scale-95 transition-all"
                    >
                        Close Inspector
                    </button>
                </div>
            </BaseModal>
        </div>
    );
}
