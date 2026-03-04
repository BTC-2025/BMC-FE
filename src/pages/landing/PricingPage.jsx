import { useNavigate } from "react-router-dom";
import { useScaleMode } from "../../context/ScaleModeContext";

export default function PricingPage() {
  const navigate = useNavigate();
  const { scaleMode, setScaleMode } = useScaleMode();

  return (
    <div className="font-sans text-gray-900 pb-20 pt-24 md:pt-32">
      <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
        <div className="relative rounded-[40px] md:rounded-[60px] bg-white shadow-2xl shadow-blue-900/5 min-h-[90vh] flex flex-col items-center justify-center py-20 px-6 isolate overflow-hidden">
          {/* Background Blobs */}
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#8b5cf6]/5 rounded-full blur-[120px] -z-10"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#195bac]/5 rounded-full blur-[120px] -z-10"></div>
      
      <div className="text-center max-w-3xl mx-auto px-6 mb-20">
        <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-6 uppercase">
          {scaleMode === 'SMALL' ? 'Small Scale (Lite)' : 'Large Scale (Enterprise)'} Modules
        </h1>
        <p className="text-gray-500 font-medium max-w-2xl mx-auto">
            {scaleMode === 'SMALL' 
              ? 'Optimized for agile operations and precision management. Deploy a curated set of 8 core functional modules.' 
              : 'Our highest-tier industrial architecture. Full access to thousands of neural-integrated modules for global complexity.'}
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 w-full">
        
        {/* Small Scale Plan */}
        <div className="p-12 rounded-[48px] border border-gray-100 bg-white hover:border-gray-200 transition-all flex flex-col relative group hover:-translate-y-2 duration-500 shadow-sm">
            <div className="mb-10 text-left">
                <div className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">Standard Configuration</div>
                <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter uppercase">Lite Engine</h3>
                <p className="text-xs font-bold text-gray-400 mb-8 uppercase tracking-widest leading-relaxed">Fundamental efficiency for startups and regional boutique operations.</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-sm font-black text-[#195bac] uppercase tracking-widest">Precision Tier Access</span>
                </div>
            </div>
            <ul className="space-y-5 mb-12 flex-1">
                {[
                  "8 Core Modules per Workspace",
                  "Single Warehouse Node",
                  "Standard Inventory Sync",
                  "Basic Payroll & HRM",
                  "Standard Audit Ledger",
                  "Up to 10 Team Members"
                ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-4 text-sm font-bold text-gray-500 text-left">
                        <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0 text-[10px]">✓</div>
                        {feature}
                    </li>
                ))}
            </ul>
            <button 
                onClick={() => {
                    setScaleMode('SMALL');
                    navigate('/signup');
                }} 
                className="w-full py-5 rounded-2xl bg-gray-900 text-white font-[1000] text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200"
            >
                Initialize Lite Node
            </button>
        </div>

        {/* Large Scale Plan (Enterprise) */}
        <div className="p-12 rounded-[48px] bg-white border-2 border-[#195bac] shadow-[0_40px_80px_-20px_rgba(25,91,172,0.15)] relative z-10 flex flex-col group hover:-translate-y-2 transition-all duration-500">
            <div className="absolute top-0 right-10 -translate-y-1/2">
                <span className="bg-[#195bac] text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">High Performance</span>
            </div>
            <div className="mb-10 text-left">
                <div className="inline-block px-4 py-1.5 bg-blue-50 text-[#195bac] rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">Industrial Core</div>
                <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter uppercase">Enterprise Engine</h3>
                <p className="text-xs font-bold text-gray-400 mb-8 uppercase tracking-widest leading-relaxed">Industrial strength for complex supply chains and global reach.</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-sm font-black text-[#195bac] uppercase tracking-widest">Global Matrix Access</span>
                </div>
            </div>
            <ul className="space-y-5 mb-12 flex-1">
                {[
                  "Thousands of Enterprise Modules",
                  "Multi-Node Warehouse Sync",
                  "Quantum Demand Prediction",
                  "Global Talent Acquisition",
                  "Deep Fiscal Analysis (Full AR/AP)",
                  "Unlimited Team Assets",
                  "24/7 Dedicated Architect"
                ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-4 text-sm font-bold text-gray-700 text-left">
                        <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-[#195bac] flex-shrink-0 text-[10px]">✓</div>
                        {feature}
                    </li>
                ))}
            </ul>
            <button 
                onClick={() => {
                    setScaleMode('LARGE');
                    navigate('/signup');
                }} 
                className="w-full py-5 rounded-2xl bg-gradient-to-r from-[#195bac] to-[#1e40af] text-white font-[1000] text-[11px] uppercase tracking-widest hover:shadow-2xl hover:shadow-blue-500/30 transition-all transform active:scale-95 leading-none"
            >
                Initialize Enterprise Node
            </button>
        </div>

      </div>
        </div>
      </div>
    </div>
  );
}
