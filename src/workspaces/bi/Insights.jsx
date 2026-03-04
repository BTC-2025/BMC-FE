import { useBI } from "../../context/BIContext";

export default function Insights() {
  const { insights } = useBI();

  // Business-language insights - interpreted conclusions
  const businessInsights = [
    {
      id: "INS-001",
      title: "Receivables Concentration Risk",
      statement: "Receivables increased by 18% mainly from 3 customers.",
      implication: "High dependency on few customers increases payment risk",
      type: "Risk",
      priority: "High",
      category: "Finance",
      focusArea: "Credit Management",
      icon: "🚨"
    },
    {
      id: "INS-002",
      title: "Inventory Turnover Slowdown",
      statement: "Inventory turnover is slowing for electronics category.",
      implication: "Capital locked in slow-moving stock, potential obsolescence risk",
      type: "Issue",
      priority: "Medium",
      category: "Operations",
      focusArea: "Inventory Optimization",
      icon: "📦"
    },
    {
      id: "INS-003",
      title: "Regional Growth Opportunity",
      statement: "North region showing 18% growth with high customer satisfaction.",
      implication: "Potential to expand market share and replicate success in other regions",
      type: "Opportunity",
      priority: "High",
      category: "Sales",
      focusArea: "Market Expansion",
      icon: "🎯"
    },
    {
      id: "INS-004",
      title: "Customer Acquisition Cost Rising",
      statement: "CAC increased 24% while customer lifetime value remained flat.",
      implication: "Marketing efficiency declining, need to optimize acquisition channels",
      type: "Issue",
      priority: "Medium",
      category: "Marketing",
      focusArea: "Cost Optimization",
      icon: "💸"
    },
    {
      id: "INS-005",
      title: "Product Mix Shift Detected",
      statement: "High-margin products now represent 42% of sales, up from 28%.",
      implication: "Positive trend improving overall profitability despite volume decline",
      type: "Opportunity",
      priority: "Low",
      category: "Revenue",
      focusArea: "Product Strategy",
      icon: "📈"
    }
  ];

  const getTypeColor = (type) => {
    switch(type) {
      case 'Risk': return 'bg-red-50 text-red-600 border-red-100';
      case 'Issue': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Opportunity': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-indigo-50 text-indigo-600 border-indigo-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'bg-red-500 text-white';
      case 'Medium': return 'bg-amber-500 text-white';
      case 'Low': return 'bg-indigo-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Redundant header removed - handled by BIWorkspace */}

      {/* Insight Cards */}
      <div className="space-y-6">
        {businessInsights.map((insight, idx) => (
          <div 
            key={insight.id}
            className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group text-left"
          >
            <div className="flex items-start gap-8">
              <div className="w-16 h-16 bg-purple-50 rounded-[24px] flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                {insight.icon}
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="text-xl font-[1000] text-[#111827] group-hover:text-indigo-600 transition-colors">{insight.title}</h4>
                      <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest ${getPriorityColor(insight.priority)}`}>
                        {insight.priority}
                      </span>
                    </div>
                    
                    {/* Key Statement */}
                    <div className="mb-4 p-4 bg-gray-50 rounded-2xl border-l-4 border-indigo-600">
                      <p className="text-sm font-[1000] text-[#111827] leading-relaxed">
                        {insight.statement}
                      </p>
                    </div>

                    {/* Business Implication */}
                    <div className="mb-6">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Business Implication</p>
                      <p className="text-sm font-bold text-gray-600 leading-relaxed">
                        {insight.implication}
                      </p>
                    </div>
                  </div>
                  
                  <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${getTypeColor(insight.type)} shrink-0 ml-4`}>
                    {insight.type}
                  </span>
                </div>
                
                <div className="flex items-center gap-6 pt-6 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Category:</span>
                    <span className="px-3 py-1 bg-gray-50 rounded-lg text-[10px] font-black text-gray-600 uppercase tracking-wider">{insight.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Focus Area:</span>
                    <span className="px-3 py-1 bg-indigo-50 rounded-lg text-[10px] font-black text-indigo-600 uppercase tracking-wider">{insight.focusArea}</span>
                  </div>
                  <button className="ml-auto px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:shadow-lg transition-all">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Insights Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm text-left">
          <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-2xl mb-4">🚨</div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Risks Flagged</p>
          <p className="text-3xl font-black text-gray-900">2</p>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm text-left">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl mb-4">🎯</div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Opportunities</p>
          <p className="text-3xl font-black text-gray-900">2</p>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm text-left">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-2xl mb-4">⚠️</div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Issues Highlighted</p>
          <p className="text-3xl font-black text-gray-900">2</p>
        </div>
      </div>

      {/* Insights Characteristics */}
      <div className="bg-[#111827] text-white p-10 rounded-[48px] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full"></div>
        <div className="relative z-10 text-left">
          <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em] mb-4">Insights Purpose</h4>
          <p className="text-2xl font-[1000] tracking-tighter mb-4">Meaningful • Automated • Business-Language</p>
          <p className="text-sm font-bold text-gray-500 leading-relaxed max-w-2xl">
            Insights provide interpreted conclusions to help decision-makers understand implications. 
            They highlight key issues, point out opportunities, flag risks, and suggest focus areas—all in business language, not technical jargon.
          </p>
        </div>
      </div>
    </div>
  );
}
