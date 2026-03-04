import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { notificationApi } from "../services/notificationApi";

export default function TopBar({ onOpenSettings, onOpenActivity, onOpenProfile, onOpenStore, onToggleSidebar, currentWorkspace, onHome, searchQuery, setSearchQuery }) {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  
  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
  };

  useEffect(() => {
    if (user) {
      loadNotifications();
      // Poll every 60s for updates as per enterprise standards 
      const interval = setInterval(loadNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await notificationApi.getNotifications();
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationApi.markRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error("Failed to mark read", err);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="h-16 lg:h-20 bg-[var(--bg-surface)] border-b border-[var(--border-color)] px-4 lg:px-8 flex items-center justify-between sticky top-0 z-[55] transition-all duration-500">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3 md:gap-6 flex-1 min-w-0">
        <button 
          onClick={onToggleSidebar}
          className="w-11 h-11 rounded-2xl flex items-center justify-center bg-gray-50/50 text-gray-900 lg:text-gray-500 hover:bg-white hover:text-[#195bac] hover:shadow-xl transition-all duration-500 border border-transparent hover:border-gray-100 group shrink-0"
        >
            <svg className="w-6 h-6 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>

        <div className="flex items-center text-[10px] sm:text-[11px] font-black text-gray-400 gap-2 shrink-0 uppercase tracking-widest">
            <span className="hover:text-[#195bac] cursor-pointer transition-colors px-2.5 py-1.5 rounded-xl hover:bg-white" onClick={onHome}>Core</span>
            {currentWorkspace && (
              <div className="flex items-center gap-2">
                <span className="text-gray-300 font-light text-base">/</span>
                <span className="bg-[#195bac] px-3 py-1.5 rounded-xl text-white font-[1000] truncate max-w-[100px] sm:max-w-none shadow-lg shadow-blue-500/10">
                  {currentWorkspace}
                </span>
              </div>
            )}
        </div>
      </div>

      {/* Right: Search (Hidden on Mobile) & Actions */}
      <div className="flex items-center gap-2 sm:gap-4 ml-4">
        <div className="hidden xl:flex items-center relative w-72 h-11 group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10">
                <svg className="w-4 h-4 text-gray-400 group-focus-within:text-[#195bac] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input 
                type="text" 
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-full bg-[var(--bg-element)] border border-[var(--border-color)] rounded-2xl pl-11 pr-4 text-[11px] font-bold text-[var(--text-main)] placeholder-gray-400 focus:bg-white focus:border-[#195bac]/20 focus:shadow-xl outline-none transition-all duration-500"
            />
        </div>

        {/* AI Hub / Settings Icon */}
        <button 
          onClick={onOpenSettings}
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-gray-500 hover:bg-white hover:text-[#195bac] hover:shadow-xl transition-all duration-500 border border-transparent hover:border-gray-100 group shrink-0"
          title="AI Automation Hub"
        >
             <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
             </svg>
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-500 border border-transparent group shrink-0
              ${showNotifications ? "bg-white text-[#195bac] shadow-xl border-gray-100" : "text-gray-500 hover:bg-white hover:text-[#195bac] hover:shadow-xl hover:border-gray-100"}`}
            title="Notifications"
          >
               <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
               </svg>
               {unreadCount > 0 && (
                 <span className="absolute top-3 right-3 w-4 h-4 bg-red-500 text-[8px] font-black text-white rounded-full border-2 border-white flex items-center justify-center animate-bounce">
                    {unreadCount}
                 </span>
               )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-4 w-[380px] bg-white rounded-[32px] shadow-[0_25px_80px_-15px_rgba(0,0,0,0.15)] border border-gray-100 py-4 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
              <div className="px-8 py-4 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-[11px] font-black text-[#111827] uppercase tracking-[0.2em]">Notification Ledger</h3>
                <span className="text-[9px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full uppercase">{unreadCount} New</span>
              </div>
              <div className="max-h-[450px] overflow-y-auto scrollbar-hide py-2">
                {notifications.length === 0 ? (
                  <div className="py-20 text-center">
                    <p className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">Station is Silent</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      onClick={() => !n.is_read && handleMarkRead(n.id)}
                      className={`px-8 py-5 hover:bg-gray-50 transition-all cursor-pointer group relative flex gap-4 ${!n.is_read ? 'bg-blue-50/20' : ''}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110
                        ${n.module === 'finance' ? 'bg-emerald-50 text-emerald-600' : n.module === 'hrm' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                        <span className="text-xl">
                          {n.module === 'finance' ? '💰' : n.module === 'hrm' ? '👥' : '🔔'}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-[12px] font-black text-[#1E293B] uppercase tracking-tight">{n.title}</p>
                          {!n.is_read && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>}
                        </div>
                        <p className="text-[11px] font-bold text-gray-400 leading-relaxed">{n.message}</p>
                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest pt-1">{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="px-8 pt-4 border-t border-gray-50">
                <button className="w-full py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#195bac] transition-colors">View All Transmissions</button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Button */}
        <button 
          onClick={onOpenProfile}
          className="flex items-center gap-3 p-1 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-500 group border border-transparent hover:border-gray-100 ml-2"
          title="Profile"
        >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden border-2 border-white bg-[#195bac] shadow-xl flex items-center justify-center text-white font-black text-xs group-hover:scale-105 transition-transform duration-500">
                {getInitials(user?.name)}
            </div>
        </button>

        <button 
          onClick={logout}
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 hover:shadow-xl transition-all duration-500 border border-transparent hover:border-red-100 group shrink-0"
          title="Log Out"
        >
             <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
             </svg>
        </button>
      </div>
    </div>
  );
}
