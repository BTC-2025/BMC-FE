import { createContext, useContext, useEffect, useState } from "react";
import { biApi } from "../services/biApi";
import { formatNumber } from "../utils/formatters";

const BIContext = createContext();

export const BIProvider = ({ children }) => {
  const [kpis, setKpis] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [operations, setOperations] = useState(null);
  const [insights, setInsights] = useState([]);
  const [topology, setTopology] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const [k, r, o, i, t] = await Promise.all([
        biApi.getDashboard(),
        biApi.getRevenue(),
        biApi.getOperations(),
        biApi.getInsights(),
        biApi.getTopology(),
      ]);
      setKpis(k.data || {});
      setRevenue(r.data || []);
      setOperations(o.data || {});
      setInsights(i.data || []);
      setTopology(t.data || {});
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch BI data");
    } finally {
      setLoading(false);
    }
  };

  // --- COMPATIBILITY BRIDGE ---
  
  // Bridge for old kpiData prop
  const kpiData = {
    total_revenue: kpis?.total_revenue ?? 0,
    active_projects: kpis?.active_projects ?? 0,
    low_stock_items: kpis?.low_stock_items ?? 0,
    total_payroll_cost: kpis?.total_payroll_cost ?? 0,
    open_purchase_orders: kpis?.open_purchase_orders ?? 0
  };

  // Bridge for old trendData prop
  const trendData = revenue;

  // Bridge for stats used in various views
  const stats = {
    totalDashboards: 4, // Mock static for UI structure
    activeReports: 24,
    dataPoints: '2.4M',
    accuracy: '100%',
    livePulse: kpis ? 99 : 0,
  };

  // Mock data for views that haven't been fully migrated to backend yet
  const dashboards = [
    { id: 'DASH-001', name: 'Executive Overview', category: 'Leadership', lastUpdated: 'Just now', widgets: 12, status: 'Active' },
    { id: 'DASH-002', name: 'Sales Performance', category: 'Revenue', lastUpdated: '1 hour ago', widgets: 8, status: 'Active' },
  ];

  const analytics = [
    { id: 'ANA-001', type: 'Revenue Analysis', metric: `$${((kpiData.total_revenue || 0) / 1000000).toFixed(1)}M`, change: '+18.2%', trend: 'up', period: 'Real-time' },
    { id: 'ANA-003', type: 'Operational Efficiency', metric: '94.2%', change: '+2.1%', trend: 'up', period: 'This Month' },
  ];

  const bridgedInsights = insights.map((ins, idx) => ({
    id: `INS-${idx}`,
    title: ins.type === "POSITIVE" ? "Growth Insight" : ins.type === "WARNING" ? "Watch Area" : "Critical Item",
    description: ins.text,
    priority: ins.type === "CRITICAL" ? "High" : "Medium",
    category: "System Analysis",
    timestamp: "Just now"
  }));

  const [forecasts] = useState([]);
  const [scenarios] = useState([]);

  return (
    <BIContext.Provider
      value={{ 
        kpis, 
        revenue, 
        operations, 
        loading, 
        isLoading: loading, // Bridge
        refresh,
        refreshData: refresh, // Bridge
        // Bridged Data
        kpiData,
        trendData,
        stats,
        topology,
        dashboards,
        analytics,
        insights: bridgedInsights,
        forecasts,
        scenarios,
        error,
        addDashboard: () => {},
        updateDashboard: () => {},
        deleteDashboard: () => {},
        runScenario: () => "0.0",
        exportCSV: async () => {
             const response = await biApi.exportCSV();
             // Create blob link to download
             const url = window.URL.createObjectURL(new Blob([response.data]));
             const link = document.createElement('a');
             link.href = url;
             link.setAttribute('download', 'bi_export.csv');
             document.body.appendChild(link);
             link.click();
             link.parentNode.removeChild(link);
        }
      }}
    >
      {children}
    </BIContext.Provider>
  );
};

export const useBI = () => {
    const context = useContext(BIContext);
    if (!context) throw new Error("useBI must be used within a BIProvider");
    return context;
};
