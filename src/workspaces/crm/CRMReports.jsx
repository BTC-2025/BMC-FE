import { useCRM } from "../../context/CRMContext";

export default function CRMReports() {
  const { stats, deals } = useCRM();

  const metrics = [
    {
      label: "MQL to SQL",
      value: "68%",
      sub: "+4% vs Last Month",
      icon: "🚀",
      color: "text-blue-500",
    },
    {
      label: "CAC",
      value: "$420",
      sub: "-12% Efficiency",
      icon: "📉",
      color: "text-emerald-500",
    },
    {
      label: "LTV",
      value: "$8,200",
      sub: "Projected High",
      icon: "💎",
      color: "text-purple-500",
    },
  ];

  return (
    <div className="p-8 md:p-12 max-w-[1700px] mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-[1000] font-heading text-[#111827] tracking-tighter">
          Insights & <span className="text-[#195bac]">Analytics</span>
        </h2>
        <div className="flex gap-2">
          <button className="px-6 py-3 bg-white border border-gray-100 rounded-xl text-[10px] font-black font-subheading uppercase tracking-widest shadow-sm">
            Export Data
          </button>
          <button className="px-6 py-3 bg-[#195bac] text-white rounded-xl text-[10px] font-black font-subheading uppercase tracking-widest shadow-lg shadow-blue-500/20">
            Print Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {metrics.map((m, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group"
          >
            <div className="flex justify-between items-start mb-6">
              <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">
                {m.icon}
              </span>
              <span
                className={`text-[10px] font-black font-subheading px-3 py-1 bg-gray-50 rounded-full ${m.color}`}
              >
                {m.sub}
              </span>
            </div>
            <p className="text-4xl font-[1000] font-heading text-[#111827] mb-1 tracking-tighter">
              {m.value}
            </p>
            <p className="text-[11px] font-black font-subheading text-gray-400 uppercase tracking-widest">
              {m.label}
            </p>
          </div>
        ))}
      </div>

      {/* Visual Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[56px] border border-gray-100 shadow-sm relative overflow-hidden">
          <h4 className="text-xl font-[1000] font-heading mb-8 tracking-tighter">
            Revenue Distribution
          </h4>
          <div className="h-64 flex items-end gap-4 px-4">
            {[60, 40, 85, 30, 95, 55, 75].map((h, i) => (
              <div
                key={i}
                className="flex-1 space-y-3 flex flex-col items-center group"
              >
                <div
                  className="w-full bg-gradient-to-t from-[#195bac] to-blue-400 rounded-2xl transition-all duration-1000 ease-out group-hover:scale-x-110"
                  style={{
                    height: `${h}%`,
                    animation: `growUp 1.5s ease-out ${i * 0.1}s forwards`,
                    opacity: 0,
                  }}
                ></div>
                <span className="text-[9px] font-black font-subheading text-gray-400 uppercase tracking-widest">
                  Q{i + 1}
                </span>
              </div>
            ))}
          </div>
          <style>{`
                    @keyframes growUp {
                        from { height: 0; opacity: 0; }
                        to { opacity: 1; height: var(--h); }
                    }
                `}</style>
        </div>

        <div className="bg-[#111827] p-10 rounded-[56px] shadow-2xl relative overflow-hidden text-left">
          <h4 className="text-xl font-[1000] font-heading text-white mb-2 tracking-tighter">
            Pipeline Intelligence
          </h4>
          <p className="text-slate-400 text-sm font-body mb-10">
            Real-time breakdown of deal stages across the organization.
          </p>

          <div className="space-y-6">
            {[
              { label: "Discovery", val: 75, color: "bg-blue-500" },
              { label: "Proposal", val: 45, color: "bg-indigo-500" },
              { label: "Negotiation", val: 25, color: "bg-purple-500" },
              { label: "Won", val: 90, color: "bg-emerald-500" },
            ].map((s, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-[10px] font-black font-subheading uppercase tracking-widest">
                  <span className="text-slate-300">{s.label}</span>
                  <span className="text-white">{s.val}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${s.color} rounded-full transition-all duration-[2s]`}
                    style={{ width: `${s.val}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[#195bac] opacity-10 blur-[100px] rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
