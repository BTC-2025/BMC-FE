import { useState } from 'react';

const NOTIFICATIONS = [
  {
    id: 1,
    category: "Inventory",
    type: "update",
    priority: "medium",
    user: "Gautam Karthik",
    action: "updated inventory levels for",
    target: "MacBook Pro 16\"",
    description: "Stock increased from 12 to 24 units",
    time: "2 minutes ago",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    icon: "📦",
    color: "bg-blue-50 border-blue-200",
    iconBg: "bg-blue-100 text-blue-600",
    read: false
  },
  {
    id: 2,
    category: "Finance",
    type: "alert",
    priority: "high",
    user: "System",
    action: "generated",
    target: "Monthly Financial Report",
    description: "Q4 2025 report ready for review",
    time: "15 minutes ago",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    icon: "📊",
    color: "bg-emerald-50 border-emerald-200",
    iconBg: "bg-emerald-100 text-emerald-600",
    read: false
  },
  {
    id: 3,
    category: "CRM",
    type: "success",
    priority: "high",
    user: "Jane Doe",
    action: "closed deal with",
    target: "Acme Corp",
    description: "$125,000 contract signed",
    time: "1 hour ago",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    icon: "🤝",
    color: "bg-purple-50 border-purple-200",
    iconBg: "bg-purple-100 text-purple-600",
    read: false
  },
  {
    id: 4,
    category: "Projects",
    type: "info",
    priority: "medium",
    user: "Alex Rivera",
    action: "started new project",
    target: "Q1 Marketing Campaign",
    description: "Timeline: 8 weeks, Budget: $50K",
    time: "3 hours ago",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    icon: "🚀",
    color: "bg-amber-50 border-amber-200",
    iconBg: "bg-amber-100 text-amber-600",
    read: true
  },
  {
    id: 5,
    category: "Supply Chain",
    type: "warning",
    priority: "high",
    user: "System",
    action: "detected delay in",
    target: "Shipment #SC-9921",
    description: "Expected arrival delayed by 48 hours",
    time: "5 hours ago",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    icon: "⚠️",
    color: "bg-orange-50 border-orange-200",
    iconBg: "bg-orange-100 text-orange-600",
    read: false
  },
  {
    id: 6,
    category: "HR",
    type: "info",
    priority: "low",
    user: "Sarah Chen",
    action: "onboarded new employee",
    target: "Marcus Aurelius",
    description: "Engineering Department - Senior Developer",
    time: "Yesterday",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    icon: "👥",
    color: "bg-indigo-50 border-indigo-200",
    iconBg: "bg-indigo-100 text-indigo-600",
    read: true
  },
  {
    id: 7,
    category: "Manufacturing",
    type: "success",
    priority: "medium",
    user: "Production Team",
    action: "completed work order",
    target: "WO-4521",
    description: "500 units produced, quality check passed",
    time: "Yesterday",
    timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000),
    icon: "🏭",
    color: "bg-cyan-50 border-cyan-200",
    iconBg: "bg-cyan-100 text-cyan-600",
    read: true
  },
  {
    id: 8,
    category: "Finance",
    type: "alert",
    priority: "high",
    user: "System",
    action: "payment reminder for",
    target: "Invoice #INV-8842",
    description: "Due in 3 days - Amount: $12,450",
    time: "2 days ago",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    icon: "💰",
    color: "bg-red-50 border-red-200",
    iconBg: "bg-red-100 text-red-600",
    read: false
  }
];

export default function RecentActivity({ onBack }) {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="w-full min-h-full p-8 lg:p-12 max-w-7xl mx-auto bg-[#CFECF7] text-left">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-10 gap-6">
        <div className="text-left">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-3 py-1 bg-red-500 text-white text-xs font-black rounded-full">
                {unreadCount} New
              </span>
            )}
          </div>
          <p className="text-sm font-bold text-gray-400">Real-time activity feed across all modules</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={markAllAsRead}
            className="px-5 py-2.5 text-xs font-black text-[#195bac] bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all uppercase tracking-widest"
          >
            Mark All Read
          </button>
          <button 
            onClick={onBack}
            className="px-5 py-2.5 text-xs font-black text-white bg-[#195bac] rounded-xl hover:bg-[#11407a] transition-all uppercase tracking-widest shadow-lg shadow-[#195bac]/20"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
              🔔
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">No notifications</h3>
            <p className="text-sm font-bold text-gray-400">
              You're all caught up!
            </p>
          </div>
        ) : (
          notifications.map((notif, index) => (
            <div 
              key={notif.id} 
              className={`group relative bg-white border rounded-2xl p-6 flex gap-5 hover:shadow-xl hover:shadow-black/5 transition-all duration-300 animate-in slide-in-from-bottom ${notif.color} ${!notif.read ? 'border-l-4 border-l-[#195bac]' : ''}`}
              style={{ animationDelay: `${index * 30}ms` }}
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl ${notif.iconBg} flex items-center justify-center text-2xl shrink-0 shadow-sm`}>
                {notif.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-black text-gray-900">{notif.user}</p>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[9px] font-black uppercase tracking-wider rounded">
                        {notif.category}
                      </span>
                      {notif.priority === 'high' && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[9px] font-black uppercase tracking-wider rounded">
                          High Priority
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                      {notif.action} <span className="font-bold text-gray-900">{notif.target}</span>
                    </p>
                    <p className="text-xs text-gray-400 font-bold mt-1">{notif.description}</p>
                  </div>
                  
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    {notif.time}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!notif.read && (
                    <button 
                      onClick={() => markAsRead(notif.id)}
                      className="px-3 py-1.5 bg-[#195bac] text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-[#11407a] transition-all"
                    >
                      Mark Read
                    </button>
                  )}
                  <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-gray-200 transition-all">
                    View Details
                  </button>
                  <button 
                    onClick={() => deleteNotification(notif.id)}
                    className="px-3 py-1.5 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-red-100 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Unread Indicator */}
              {!notif.read && (
                <div className="absolute top-6 right-6 w-2.5 h-2.5 bg-[#195bac] rounded-full animate-pulse"></div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Load More */}
      {notifications.length > 0 && (
        <div className="mt-10 text-center">
          <button className="px-10 py-4 bg-white text-gray-900 border border-gray-200 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 hover:border-[#195bac] transition-all shadow-sm">
            Load Older Notifications
          </button>
        </div>
      )}
    </div>
  );
}
