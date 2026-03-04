import { useState } from 'react';
import { useTheme, THEMES } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import AccessControlManagement from '../components/AccessControlManagement';

export default function Settings({ onBack }) {
  const { 
    darkMode, toggleDarkMode, 
    notificationsEnabled, toggleNotifications, 
    currentTheme, changeTheme, 
  } = useTheme();

  const { user, logout } = useAuth();

  // Local state for settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [language, setLanguage] = useState('English');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');

  const languages = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Chinese'];
  const timezones = ['Asia/Kolkata', 'America/New_York', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney'];
  const dateFormats = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'];

  return (
    <div className="w-full min-h-full p-6 lg:p-10 max-w-[1400px] mx-auto bg-[var(--bg-app)] text-left transition-colors duration-500">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack} 
          className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#195bac] hover:border-[#195bac] transition-all cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--text-main)] tracking-tight transition-colors">System Settings</h1>
          <p className="text-sm font-medium text-[var(--text-muted)] mt-0.5 transition-colors">Customize your workspace preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* AI Automation Control Center - Premium High Impact Section */}
        <section className="col-span-1 lg:col-span-2">
          <div className="bg-gradient-to-br from-[#111827] to-[#195bac] text-white rounded-[40px] p-8 md:p-10 relative overflow-hidden shadow-2xl group border border-white/10">
             {/* Decorative Background Elements */}
             <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-all duration-1000"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
             
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
                <div className="space-y-3">
                   <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/20 text-[9px] font-black uppercase tracking-[0.2em] mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                      Neural Engine Active
                   </div>
                   <h2 className="text-3xl font-[1000] tracking-tighter leading-none flex items-center gap-4">
                     AI Automation <span className="text-emerald-400">Control Hub</span>
                   </h2>
                   <p className="text-sm font-medium text-white/50 max-w-xl leading-relaxed">
                     Configure autonomous enterprise protocols, predictive analysis models, and self-healing systems across your workspace.
                   </p>
                </div>

                <div className="flex flex-col items-end gap-3">
                   <button className="px-8 py-4 bg-white text-gray-950 rounded-2xl font-[1000] text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/20 flex items-center gap-3">
                      <svg className="w-4 h-4 text-[#195bac]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      Initialize Full Automation
                   </button>
                   <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mr-2">Last Sync: 4m ago</p>
                </div>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
                <div className="p-6 bg-white/5 rounded-[32px] border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer group/card">
                   <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover/card:scale-110 transition-transform">🤖</div>
                   <p className="font-black text-xs uppercase tracking-widest mb-1">Auto-Pilot</p>
                   <p className="text-[10px] text-white/40 leading-relaxed font-bold">Autonomous resource balancing and load distribution.</p>
                </div>
                <div className="p-6 bg-white/5 rounded-[32px] border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer group/card">
                   <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover/card:scale-110 transition-transform">📊</div>
                   <p className="font-black text-xs uppercase tracking-widest mb-1">Smart Insights</p>
                   <p className="text-[10px] text-white/40 leading-relaxed font-bold">ML-driven business conclusions and trend detection.</p>
                </div>
                <div className="p-6 bg-white/5 rounded-[32px] border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer group/card">
                   <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover/card:scale-110 transition-transform">🛡️</div>
                   <p className="font-black text-xs uppercase tracking-widest mb-1">Safe-Guard</p>
                   <p className="text-[10px] text-white/40 leading-relaxed font-bold">Predictive maintenance and anomaly containment.</p>
                </div>
                <div className="p-6 bg-white/5 rounded-[32px] border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer group/card">
                   <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover/card:scale-110 transition-transform">🛰️</div>
                   <p className="font-black text-xs uppercase tracking-widest mb-1">Global Sync</p>
                   <p className="text-[10px] text-white/40 leading-relaxed font-bold">Real-time data synchronization across all nodes.</p>
                </div>
             </div>
          </div>
        </section>
        
        {/* Master Security Control Center - Admin Only */}
        {user?.roles?.includes('ADMIN') && (
          <section className="col-span-1 lg:col-span-2 mt-4">
            <div className="bg-white border-2 border-[#195bac]/10 rounded-[48px] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
               {/* Watermark/Brand Background */}
               <div className="absolute top-1/2 right-10 -translate-y-1/2 text-[120px] font-black text-gray-400/5 select-none pointer-events-none rotate-12">RBAC_CORE</div>
               
               <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6 relative z-10">
                  <div className="space-y-3">
                     <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#195bac]/10 text-[#195bac] rounded-full border border-[#195bac]/20 text-[9px] font-black uppercase tracking-[0.2em] mb-2 leading-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#195bac] animate-pulse"></span>
                        Admin Node Authority
                     </div>
                     <h2 className="text-4xl font-[1000] tracking-tighter leading-none text-gray-950 uppercase">
                       Enterprise <span className="text-[#195bac]">Access Protocol</span>
                     </h2>
                     <p className="text-sm font-medium text-gray-500 max-w-2xl leading-relaxed">
                       Centralized management of the 8 core ERP modules. Define roles, configure permission matrices, and assign operational data scopes across the entire workforce.
                     </p>
                  </div>
               </div>

               <AccessControlManagement />
            </div>
          </section>
        )}
        
        {/* Appearance Section */}
        <section className="space-y-6">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[32px] p-6 relative overflow-hidden shadow-sm transition-all duration-500">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#195bac] opacity-[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
             
             <h3 className="font-extrabold text-xl text-[var(--text-main)] mb-6 flex items-center gap-3 transition-colors">
               <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#195bac]">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
               </div>
               Appearance
             </h3>

             {/* Dark Mode Toggle */}
             <div className="flex items-center justify-between p-5 bg-[var(--bg-element)] rounded-2xl border border-[var(--border-color)] transition-all duration-500">
               <div>
                 <p className="font-bold text-[var(--text-main)] text-sm transition-colors">Dark Mode</p>
                 <p className="text-xs text-[var(--text-muted)] font-medium mt-1 transition-colors">Adjust interface contrast</p>
               </div>
               <button 
                 onClick={toggleDarkMode}
                 className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 relative ${darkMode ? 'bg-[#195bac]' : 'bg-gray-300'}`}
               >
                 <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
               </button>
             </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="space-y-6">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[32px] p-6 h-full flex flex-col shadow-sm transition-all duration-500">
             <h3 className="font-extrabold text-xl text-[var(--text-main)] mb-6 flex items-center gap-3 transition-colors">
               <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#195bac]">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
               </div>
               Notifications
             </h3>

             {/* Email Notifications */}
             <div className="flex items-center justify-between p-5 bg-[var(--bg-element)] rounded-2xl mb-4 border border-[var(--border-color)] transition-all duration-500">
               <div>
                 <p className="font-bold text-[var(--text-main)] text-sm transition-colors">Email Notifications</p>
                 <p className="text-xs text-[var(--text-muted)] font-medium mt-1 transition-colors">Receive updates via email</p>
               </div>
               <button 
                 onClick={() => setEmailNotifications(!emailNotifications)}
                 className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 relative ${emailNotifications ? 'bg-[#195bac]' : 'bg-gray-300'}`}
               >
                 <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${emailNotifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
               </button>
             </div>

             {/* Push Notifications */}
             <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl mb-4 border border-gray-100">
               <div>
                 <p className="font-bold text-gray-900 text-sm">Push Notifications</p>
                 <p className="text-xs text-gray-500 font-medium mt-1">Browser alerts and updates</p>
               </div>
               <button 
                 onClick={() => setPushNotifications(!pushNotifications)}
                 className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 relative ${pushNotifications ? 'bg-[#195bac]' : 'bg-gray-300'}`}
               >
                 <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${pushNotifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
               </button>
             </div>

             {/* Sound */}
             <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
               <div>
                 <p className="font-bold text-gray-900 text-sm">Sound Effects</p>
                 <p className="text-xs text-gray-500 font-medium mt-1">Play sounds for notifications</p>
               </div>
               <button 
                 onClick={() => setSoundEnabled(!soundEnabled)}
                 className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 relative ${soundEnabled ? 'bg-[#195bac]' : 'bg-gray-300'}`}
               >
                 <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${soundEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
               </button>
             </div>
          </div>
        </section>

        {/* Preferences Section */}
        <section className="space-y-6">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[32px] p-6 shadow-sm transition-all duration-500">
             <h3 className="font-extrabold text-xl text-[var(--text-main)] mb-6 flex items-center gap-3 transition-colors">
               <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#195bac]">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
               </div>
               Preferences
             </h3>

             {/* Auto Save */}
             <div className="flex items-center justify-between p-5 bg-[var(--bg-element)] rounded-2xl mb-4 border border-[var(--border-color)] transition-all duration-500">
               <div>
                 <p className="font-bold text-[var(--text-main)] text-sm transition-colors">Auto-Save</p>
                 <p className="text-xs text-[var(--text-muted)] font-medium mt-1 transition-colors">Automatically save changes</p>
               </div>
               <button 
                 onClick={() => setAutoSave(!autoSave)}
                 className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 relative ${autoSave ? 'bg-[#195bac]' : 'bg-gray-300'}`}
               >
                 <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${autoSave ? 'translate-x-6' : 'translate-x-0'}`}></div>
               </button>
             </div>

             {/* Language */}
             <div className="mb-4">
               <label className="block font-bold text-gray-900 text-sm mb-2">Language</label>
               <select 
                 value={language}
                 onChange={(e) => setLanguage(e.target.value)}
                 className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 text-sm focus:outline-none focus:border-[#195bac] focus:ring-4 focus:ring-[#195bac]/10 transition-all cursor-pointer"
               >
                 {languages.map(lang => (
                   <option key={lang} value={lang}>{lang}</option>
                 ))}
               </select>
             </div>

             {/* Timezone */}
             <div className="mb-4">
               <label className="block font-bold text-gray-900 text-sm mb-2">Timezone</label>
               <select 
                 value={timezone}
                 onChange={(e) => setTimezone(e.target.value)}
                 className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 text-sm focus:outline-none focus:border-[#195bac] focus:ring-4 focus:ring-[#195bac]/10 transition-all cursor-pointer"
               >
                 {timezones.map(tz => (
                   <option key={tz} value={tz}>{tz}</option>
                 ))}
               </select>
             </div>

             {/* Date Format */}
             <div>
               <label className="block font-bold text-gray-900 text-sm mb-2">Date Format</label>
               <select 
                 value={dateFormat}
                 onChange={(e) => setDateFormat(e.target.value)}
                 className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 text-sm focus:outline-none focus:border-[#195bac] focus:ring-4 focus:ring-[#195bac]/10 transition-all cursor-pointer"
               >
                 {dateFormats.map(format => (
                   <option key={format} value={format}>{format}</option>
                 ))}
               </select>
             </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="space-y-6">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[32px] p-6 flex flex-col shadow-sm transition-all duration-500">
             <h3 className="font-extrabold text-xl text-[var(--text-main)] mb-6 flex items-center gap-3 transition-colors">
               <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#195bac]">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
               </div>
               Security & Account
             </h3>

             {/* Two-Factor Auth */}
             <div className="flex items-center justify-between p-5 bg-[var(--bg-element)] rounded-2xl mb-4 border border-[var(--border-color)] transition-all duration-500">
               <div>
                 <p className="font-bold text-[var(--text-main)] text-sm transition-colors">Two-Factor Authentication</p>
                 <p className="text-xs text-[var(--text-muted)] font-medium mt-1 transition-colors">Extra security for your account</p>
               </div>
               <button 
                 onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                 className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 relative ${twoFactorAuth ? 'bg-[#195bac]' : 'bg-gray-300'}`}
               >
                 <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${twoFactorAuth ? 'translate-x-6' : 'translate-x-0'}`}></div>
               </button>
             </div>

             {/* Change Password */}
             <button className="w-full p-5 bg-gray-50 rounded-2xl mb-4 border border-gray-100 hover:bg-gray-100 hover:border-[#195bac] transition-all text-left group cursor-pointer">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="font-bold text-gray-900 text-sm">Change Password</p>
                   <p className="text-xs text-gray-500 font-medium mt-1">Update your account password</p>
                 </div>
                 <svg className="w-5 h-5 text-gray-400 group-hover:text-[#195bac] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
               </div>
             </button>

             {/* Session Info */}
             <div className="mt-auto pt-6 border-t border-gray-100">
               <div className="bg-gray-50 rounded-2xl p-5 mb-4">
                 <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Current Session</p>
                 <p className="text-sm font-bold text-gray-900">Session ID: 894-XJ-2M</p>
                 <p className="text-xs text-gray-500 font-medium mt-1">Last login: Today at 9:42 AM</p>
               </div>
               
               <button 
                 onClick={logout}
                 className="w-full py-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-600 font-bold text-sm uppercase tracking-widest transition-all border border-red-500/20 hover:border-red-500/50 flex items-center justify-center gap-3 cursor-pointer"
               >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                 Log Out
               </button>
             </div>
          </div>
        </section>

      </div>

      {/* Save Button */}
      <div className="mt-10 flex justify-end pb-10">
        <button className="px-12 py-5 bg-[#195bac] text-white rounded-[20px] font-bold text-xs uppercase tracking-widest hover:bg-[#11407a] transition-all shadow-xl shadow-[#195bac]/20 cursor-pointer">
          Save All Changes
        </button>
      </div>
    </div>
  );
}
