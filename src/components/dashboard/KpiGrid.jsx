import { useNavigate } from "react-router-dom";

export default function KpiGrid({ stats, type = "LITE" }) {
  const navigate = useNavigate();

  const kpis = [
    { 
      id: "revenue", 
      label: "Total Revenue", 
      value: stats.total_revenue, 
      format: "currency", 
      icon: "💰", 
      color: "bg-blue-50 text-blue-600",
      route: "/app/crm" 
    },
    { 
      id: "projects", 
      label: "Active Projects", 
      value: stats.active_projects, 
      format: "number", 
      icon: "🚀", 
      color: "bg-amber-50 text-amber-600",
      route: "/app/projects"
    },
    { 
      id: "stock", 
      label: "Low Stock Items", 
      value: stats.low_stock_items, 
      format: "number", 
      icon: "📦", 
      color: "bg-red-50 text-red-600",
      route: "/app/inventory"
    },
    { 
      id: "po", 
      label: "Open Purchase Orders", 
      value: stats.open_purchase_orders, 
      format: "number", 
      icon: "📑", 
      color: "bg-cyan-50 text-cyan-600",
      route: "/app/supplychain"
    },
    { 
      id: "payroll", 
      label: "Payroll (This Month)", 
      value: stats.total_payroll_cost, 
      format: "currency", 
      icon: "👥", 
      color: "bg-indigo-50 text-indigo-600",
      route: "/app/hr"
    },
  ];

  const formatValue = (val, format) => {
    if (format === "currency") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(val);
    }
    return val;
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8`}>
      {kpis.map((kpi) => (
        <div 
          key={kpi.id}
          onClick={() => type === "ENTERPRISE" && navigate(kpi.route)}
          className={`bg-white/80 backdrop-blur-md p-6 rounded-[32px] border border-white shadow-xl shadow-blue-900/5 transition-all duration-500 group overflow-hidden relative ${type === "ENTERPRISE" ? "cursor-pointer hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10" : ""}`}
        >
          {/* Decorative element */}
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-gray-50 rounded-full group-hover:bg-blue-50 transition-colors duration-500 -z-10"></div>
          
          <div className="flex flex-col gap-4">
            <div className={`w-12 h-12 rounded-2xl ${kpi.color} flex items-center justify-center text-2xl shadow-sm border border-white`}>
              {kpi.icon}
            </div>
            
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
                {kpi.label}
              </p>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                {formatValue(kpi.value, kpi.format)}
              </h3>
            </div>

            {type === "ENTERPRISE" && (
                <div className="pt-2 flex items-center gap-1 text-[9px] font-bold text-blue-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    View Details 
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
