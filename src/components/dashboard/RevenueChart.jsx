import { formatNumber } from "../../utils/formatters";

export default function RevenueChart({ data }) {
  if (!data || data.length === 0) return null;

  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const chartHeight = 200;
  const chartWidth = 800;
  const padding = 40;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (chartWidth - padding * 2) + padding;
    const y = chartHeight - padding - (d.revenue / maxRevenue) * (chartHeight - padding * 2);
    return `${x},${y}`;
  }).join(" ");

  const areaPath = `M ${padding},${chartHeight - padding} L ${points} L ${chartWidth - padding},${chartHeight - padding} Z`;

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="bg-white/80 backdrop-blur-md p-10 rounded-[48px] border border-white shadow-xl shadow-blue-900/5 mb-8">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-2xl font-black text-gray-950 tracking-tighter leading-none mb-2">Revenue Growth Trend</h3>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Monthly distribution of won deals (CRM)</p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-blue-50/50 rounded-2xl border border-blue-100/50">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Enterprise Analytics</span>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
          className="w-full h-auto drop-shadow-2xl"
          preserveAspectRatio="none"
        >
          {/* Gradients */}
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#195bac" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#195bac" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#195bac" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
              const y = chartHeight - padding - p * (chartHeight - padding * 2);
              return <line key={i} x1={padding} y1={y} x2={chartWidth - padding} y2={y} stroke="#f1f5f9" strokeWidth="1" />;
          })}

          {/* Area */}
          <path d={areaPath} fill="url(#areaGradient)" />
          
          {/* Line */}
          <polyline
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
            className="animate-in fade-in duration-1000"
          />

          {/* Points */}
          {data.map((d, i) => {
             const x = (i / (data.length - 1)) * (chartWidth - padding * 2) + padding;
             const y = chartHeight - padding - (d.revenue / maxRevenue) * (chartHeight - padding * 2);
             return (
                 <circle 
                    key={i} 
                    cx={x} cy={y} r="6" 
                    fill="white" 
                    stroke="#195bac" 
                    strokeWidth="3"
                    className="cursor-pointer hover:r-8 transition-all"
                >
                    <title>{months[d.month-1]}: ${formatNumber(d.revenue)}</title>
                </circle>
             )
          })}
        </svg>

        {/* Labels */}
        <div className="flex justify-between px-[40px] mt-6">
           {data.map((d, i) => (
               <span key={i} className="text-[10px] font-black text-gray-400 uppercase">
                   {months[d.month-1]}
               </span>
           ))}
        </div>
      </div>
    </div>
  );
}
