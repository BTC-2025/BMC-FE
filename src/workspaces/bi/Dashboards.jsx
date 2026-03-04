import { useBI } from "../../context/BIContext";
import { useState } from "react";
import DashboardView from "./DashboardView";

export default function Dashboards() {
  const { dashboards, deleteDashboard, stats } = useBI();
  const [selectedDashboard, setSelectedDashboard] = useState(null);

  // Real-time KPI data for dashboard display
  const kpiData = [
    { label: "System Pulse", value: `${stats.livePulse}%`, icon: "⚡", color: "bg-amber-50 text-amber-600", change: "Optimal" },
    { label: "Data Throughput", value: stats.dataPoints, icon: "🔍", color: "bg-blue-50 text-blue-600", change: "+1.2M/s" },
    { label: "Prediction Delta", value: "96.4%", icon: "🎯", color: "bg-emerald-50 text-emerald-600", change: "High" },
    { label: "Active Nodes", value: "14", icon: "🌐", color: "bg-purple-50 text-purple-600", change: "Synced" },
    { label: "Pending Analysis", value: "3", icon: "🕒", color: "bg-rose-50 text-rose-600", change: "Queue" },
    { label: "Global Sync", value: "100%", icon: "🔄", color: "bg-indigo-50 text-indigo-600", change: "Complete" },
  ];

  if (selectedDashboard) {
    return (
      <DashboardView 
        dashboard={selectedDashboard} 
        onBack={() => setSelectedDashboard(null)} 
      />
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Real-time KPI Cards - Visual Summary */}
      <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h4 className="text-xl font-[1000] text-[#111827] tracking-tighter">Quick Overview</h4>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Real-time</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kpiData.map((kpi, idx) => (
            <div 
              key={idx}
              className="p-6 bg-gray-50 rounded-[24px] border border-gray-100 hover:shadow-lg transition-all duration-500 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl ${kpi.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                  {kpi.icon}
                </div>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest bg-white px-2 py-1 rounded-lg">{kpi.change}</span>
              </div>
              <p className="text-3xl font-[1000] text-[#111827] mb-1 tracking-tighter">{kpi.value}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{kpi.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Saved Dashboard Templates */}
      <div className="space-y-6">
        <h4 className="text-lg font-[1000] text-[#111827] tracking-tighter px-4">Saved Dashboards</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboards.map(dashboard => (
            <div 
              key={dashboard.id}
              onClick={() => setSelectedDashboard(dashboard)}
              className="bg-white p-8 rounded-[32px] border border-gray-100 hover:border-[#195bac]/20 shadow-sm hover:shadow-xl transition-all duration-500 group cursor-pointer text-left"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📊</div>
                <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest ${dashboard.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'}`}>
                  {dashboard.status}
                </span>
              </div>
              
              <h4 className="text-lg font-[1000] text-[#111827] mb-2 group-hover:text-[#195bac] transition-colors">{dashboard.name}</h4>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">{dashboard.category}</p>
              
              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <div className="text-left">
                  <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Widgets</p>
                  <p className="text-sm font-black text-gray-900">{dashboard.widgets}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Updated</p>
                  <p className="text-xs font-bold text-gray-600">{dashboard.lastUpdated}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dashboard Characteristics Info */}
      <div className="bg-[#111827] text-white p-10 rounded-[48px] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full"></div>
        <div className="relative z-10 text-left">
          <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em] mb-4">Dashboard Purpose</h4>
          <p className="text-2xl font-[1000] tracking-tighter mb-4">Visual • Real-time • Read-only</p>
          <p className="text-sm font-bold text-gray-500 leading-relaxed max-w-2xl">
            Dashboards provide quick visibility into business health with charts, cards, and graphs. 
            They show current totals and KPIs without deep logic—designed for at-a-glance monitoring.
          </p>
        </div>
      </div>
    </div>
  );
}

