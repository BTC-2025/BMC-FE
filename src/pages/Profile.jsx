import { useState } from 'react';

import { useAuth } from '../context/AuthContext';

export default function Profile({ onBack }) {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "Gautam Karthik",
    email: user?.username ? `${user.username}@btc-enterprise.com` : "gautam.karthik@btc-enterprise.com",
    role: "Senior Operations Director",
    department: "Executive Management",
    location: "Mumbai, India",
    phone: "+91 98765 43210",
    timezone: "IST (UTC +5:30)",
    joinedDate: "October 12, 2024",
    bio: "Passionate about scaling enterprise operations and building high-performance teams. Focused on AI-driven ERP optimizations."
  });

  const stats = [
    { label: "Tasks Completed", value: "1,284", icon: "✅" },
    { label: "Active Projects", value: "12", icon: "📁" },
    { label: "Team Velocity", value: "94%", icon: "⚡" },
    { label: "Service Score", value: "4.9", icon: "⭐" },
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Logic to save profile data would go here
  };

  return (
    <div className="w-full min-h-full p-8 lg:p-12 max-w-6xl mx-auto bg-[#CFECF7] text-left">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#195bac] hover:border-[#195bac] transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">User Profile</h1>
            <p className="text-sm font-bold text-gray-400 mt-1">Manage your professional identity and preferences</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Avatar & Basic Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="w-40 h-40 bg-gradient-to-br from-[#195bac] to-blue-400 rounded-full flex items-center justify-center text-5xl text-white font-black shadow-2xl border-4 border-white">
                {profileData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <button className="absolute bottom-1 right-1 w-10 h-10 bg-white rounded-full border border-gray-100 shadow-lg flex items-center justify-center text-gray-600 hover:text-[#195bac] transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </button>
            </div>
            
            <h2 className="text-2xl font-black text-gray-900 leading-tight">{profileData.name}</h2>
            <p className="text-sm font-bold text-[#195bac] mt-1">{profileData.role}</p>
            <p className="text-xs font-bold text-gray-400 mt-3 uppercase tracking-widest">{profileData.department}</p>
            
            <div className="w-full h-px bg-gray-100 my-8"></div>
            
            <div className="w-full space-y-4">
              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 shrink-0">📍</div>
                <p className="text-sm font-bold text-gray-600">{profileData.location}</p>
              </div>
              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 shrink-0">📧</div>
                <p className="text-sm font-bold text-gray-600 truncate">{profileData.email}</p>
              </div>
              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 shrink-0">📅</div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Joined {profileData.joinedDate}</p>
              </div>
            </div>

            <div className="w-full h-px bg-gray-100 my-8"></div>
            
            <button 
              onClick={logout}
              className="w-full py-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-600 font-bold text-xs uppercase tracking-widest transition-all border border-red-500/10 hover:border-red-500/30 flex items-center justify-center gap-3 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Terminate Session
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map(s => (
              <div key={s.label} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between aspect-[1.2/1]">
                <div className="text-2xl mb-2">{s.icon}</div>
                <div>
                  <p className="text-xl font-black text-gray-900">{s.value}</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Detailed Info & Editing */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 opacity-20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="flex justify-between items-center mb-10 relative z-10">
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Personal Details</h3>
              <button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                  ${isEditing 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-600' 
                    : 'bg-[#195bac] text-white shadow-lg shadow-blue-200 hover:bg-[#11407a]'}`}
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 relative z-10">
              {Object.entries(profileData).map(([key, value]) => {
                if (key === 'joinedDate') return null;
                return (
                  <div key={key} className={key === 'bio' ? 'md:col-span-2' : ''}>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">{key.replace(/([A-Z])/g, ' $1')}</label>
                    {isEditing ? (
                      key === 'bio' ? (
                        <textarea 
                          rows="3"
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none"
                          value={value}
                          onChange={(e) => setProfileData({...profileData, [key]: e.target.value})}
                        ></textarea>
                      ) : (
                        <input 
                          type="text" 
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                          value={value}
                          onChange={(e) => setProfileData({...profileData, [key]: e.target.value})}
                        />
                      )
                    ) : (
                      <p className={`text-sm font-bold text-gray-900 ${key === 'bio' ? 'leading-relaxed' : ''}`}>
                        {value}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Account Security Extra Section */}
          <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-8">Role Responsibilities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "Strategic Oversight", desc: "Approving high-level project milestones and budget allocations for Q3.", icon: "🎯" },
                { title: "Node Management", desc: "Overseeing 4 regional ERP hubs and ensuring inter-departmental data sync.", icon: "🌐" },
                { title: "Policy Integrity", desc: "Maintaining organizational compliance and operational security standards.", icon: "🛡️" },
                { title: "Talent Catalyst", desc: "Driving employee performance through AI-assisted KPI tracking systems.", icon: "🚀" }
              ].map(item => (
                <div key={item.title} className="p-6 bg-gray-50 rounded-3xl border border-transparent hover:border-[#195bac]/10 transition-all group">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-xl">{item.icon}</div>
                    <h4 className="text-sm font-black text-gray-900 group-hover:text-[#195bac] transition-colors">{item.title}</h4>
                  </div>
                  <p className="text-xs font-bold text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
