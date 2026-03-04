import { useNavigate } from "react-router-dom";
import { useScaleMode } from "../../context/ScaleModeContext";

export default function SolutionsPage() {
  const navigate = useNavigate();
  const { setScaleMode } = useScaleMode();

  const industries = [
    { title: "Manufacturing", icon: "🏭", desc: "Optimize production lines, manage BOMs, and track real-time shop floor metrics." },
    { title: "Retail & E-commerce", icon: "🛍️", desc: "Unified inventory across channels, POS integration, and customer loyalty programs." },
    { title: "Professional Services", icon: "💼", desc: "Project billing, resource resource planning, and client portal management." },
    { title: "Healthcare", icon: "⚕️", desc: "Secure patient data management, supply tracking, and shift scheduling." },
    { title: "Logistics", icon: "🚚", desc: "Fleet management, route optimization, and shipment tracking." },
    { title: "Construction", icon: "🏗️", desc: "Project milestones, contractor payments, and material requirement planning." },
  ];

  const roles = [
    { title: "CEO / Founders", color: "bg-blue-500", desc: "Get a bird's eye view of your entire organization." },
    { title: "Finance Leaders", color: "bg-emerald-500", desc: "Control spend, automate audits, and forecast with AI." },
    { title: "HR Directors", color: "bg-rose-500", desc: "Recruit top talent and manage employee lifecycles." },
    { title: "IT Managers", color: "bg-purple-500", desc: "Secure enterprise-grade infrastructure and access controls." },
  ];

  return (
    <div className="font-sans text-gray-900 pb-20 pt-24 md:pt-32">
      <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
        <div className="relative rounded-[40px] md:rounded-[60px] bg-white shadow-2xl shadow-blue-900/5 min-h-[85vh] px-6 py-20 md:p-20 overflow-hidden isolate">
            
            {/* Soft Gradients */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#195bac]/10 rounded-full blur-[120px] -z-10"></div>

            <div className="max-w-7xl mx-auto text-center mb-24">
                <span className="px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-xs font-black uppercase tracking-widest mb-6 inline-block">Use Cases</span>
                <h1 className="text-5xl md:text-7xl font-[800] tracking-tight text-gray-900 mb-8 leading-[1.1]">
                  Solutions for every <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Industry & Role.</span>
                </h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
                   Whether you're a startup or a Fortune 500, we have tailored workflows designed for your specific industry needs.
                </p>
            </div>

            {/* Industry Grid */}
            <div className="max-w-7xl mx-auto px-6 mb-32">
                <div className="flex items-center gap-4 mb-10">
                   <h2 className="text-3xl font-black text-gray-900">By Industry</h2>
                   <div className="flex-1 h-px bg-gray-100"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {industries.map((ind, i) => (
                    <div 
                        key={ind.title} 
                        className="p-8 rounded-[32px] bg-[#f8f9fc] border border-transparent hover:bg-white hover:border-gray-100 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] transition-all duration-300 cursor-pointer group animate-fade-in-up"
                        style={{ animationDelay: `${i * 100}ms` }}
                    >
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">{ind.icon}</div>
                        <h3 className="text-xl font-black text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">{ind.title}</h3>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed">
                            {ind.desc}
                        </p>
                    </div>
                ))}
                </div>
            </div>

            {/* Role Section - Dark Card Style */}
            <div className="max-w-7xl mx-auto">
                <div className="bg-[#0f172a] rounded-[50px] p-12 md:p-20 relative overflow-hidden isolate">
                    {/* Background Detail */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#195bac] opacity-20 rounded-full blur-[100px] -z-10"></div>
                    
                    <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6 relative z-10">
                        <div className="text-white">
                            <h2 className="text-4xl font-black mb-4">By Role</h2>
                            <p className="text-slate-400 text-lg font-medium max-w-lg">Empower every stakeholder in your organization with dashboards built for them.</p>
                        </div>
                        <button 
                            onClick={() => {
                                setScaleMode('SMALL');
                                navigate('/signup');
                            }}
                            className="px-8 py-3 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-100 transition-colors"
                        >
                            Start Building
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {roles.map((role) => (
                        <div key={role.title} className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[32px] hover:bg-white/10 transition-all cursor-pointer group">
                            <div className={`w-12 h-12 ${role.color} rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform`}></div>
                            <h3 className="text-xl font-bold text-white mb-3 leading-tight">{role.title}</h3>
                            <p className="text-sm text-slate-400 font-medium leading-relaxed">{role.desc}</p>
                        </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}
