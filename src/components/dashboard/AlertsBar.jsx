export default function AlertsBar({ stats }) {
  const alerts = [];

  if (stats.low_stock_items > 0) {
    alerts.push({
      id: "low-stock",
      type: "warning",
      message: `System Alert: ${stats.low_stock_items} categories are currently below safety threshold. Restoration required.`,
      icon: "⚠️"
    });
  }

  if (stats.open_purchase_orders > 10) {
    alerts.push({
      id: "high-po",
      type: "info",
      message: `Operational Notice: High volume of open purchase orders (${stats.open_purchase_orders}). Procurement bottleneck possible.`,
      icon: "ℹ️"
    });
  }

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-4 mb-8">
      {alerts.map((alert) => (
        <div 
          key={alert.id}
          className="bg-white/60 backdrop-blur-md border border-white p-5 rounded-[24px] shadow-sm flex items-center gap-4 animate-in slide-in-from-top-4 duration-500"
        >
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-xl shrink-0 border border-amber-100/50">
            {alert.icon}
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-bold text-gray-800 leading-none mb-1 uppercase tracking-tight">System Notification</p>
            <p className="text-sm font-medium text-gray-500">{alert.message}</p>
          </div>
          <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest px-4 py-2 hover:bg-white rounded-xl transition-colors">Acknowledge</button>
        </div>
      ))}
    </div>
  );
}
