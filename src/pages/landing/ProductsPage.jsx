import { useNavigate } from "react-router-dom";
import { ALL_AVAILABLE_WORKSPACES } from "../../config/workspaces";
import { useScaleMode } from "../../context/ScaleModeContext";

export default function ProductsPage() {
  const navigate = useNavigate();
  const { setScaleMode } = useScaleMode();

  return (
    <div className="font-sans text-gray-900 pb-20 pt-24 md:pt-32">
      {/* Container "App Window" */}
      <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
        <div className="relative rounded-[40px] md:rounded-[60px] bg-white shadow-2xl shadow-blue-900/5 min-h-[85vh] px-6 py-20 md:p-20 overflow-hidden isolate">
           
           {/* Background Mesh (consistent with Landing) */}
           <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#a78bfa] rounded-full blur-[120px] opacity-20 -z-10 animate-pulse"></div>
           <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] bg-[#38bdf8] rounded-full blur-[120px] opacity-20 -z-10"></div>

           <div className="max-w-7xl mx-auto text-center mb-24">
              <span className="px-4 py-2 rounded-full bg-blue-50 text-[#195bac] text-xs font-black uppercase tracking-widest mb-6 inline-block">The BTC Ecosystem</span>
              <h1 className="text-5xl md:text-7xl font-[800] tracking-tight text-gray-900 mb-8 leading-[1.1] animate-fade-in-up">
                One Suite. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#195bac] to-violet-500">Infinite Possibilities.</span>
              </h1>
              <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-100">
                 Connect your entire business with apps that talk to each other. From the shop floor to the top floor, we've got you covered.
              </p>
           </div>

           <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
              {ALL_AVAILABLE_WORKSPACES.map((ws, i) => (
                <div 
                    key={ws.id} 
                    className="group relative bg-[#f8f9fc] rounded-[40px] p-8 md:p-10 border border-transparent hover:border-white hover:bg-white hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
                    style={{ animationDelay: `${i * 100}ms` }}
                >
                   <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[40px] pointer-events-none"></div>
                   
                   <div className={`w-16 h-16 rounded-3xl ${ws.imageColor.replace('bg-', 'bg-opacity-10 text-')} mb-8 flex items-center justify-center text-3xl shadow-sm border border-black/5 group-hover:scale-110 transition-transform duration-500`}>
                      {ws.icon}
                   </div>

                   <h3 className="text-2xl font-black text-gray-900 mb-3">{ws.name}</h3>
                   <p className="text-gray-500 leading-relaxed font-medium mb-8 min-h-[48px]">
                      {ws.description}
                   </p>

                   <div className="flex items-center justify-between mt-auto pt-8 border-t border-gray-100">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest group-hover:text-[#195bac] transition-colors">
                        {ws.category}
                      </span>
                      <button onClick={() => navigate('/signup')} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:bg-[#195bac] group-hover:text-white transition-all transform group-hover:rotate-45">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </button>
                   </div>
                </div>
              ))}
           </div>

           {/* Integration Strip */}
           <div className="max-w-7xl mx-auto">
             <div className="rounded-[50px] bg-gray-900 text-white p-12 md:p-20 relative overflow-hidden text-center isolate">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800 to-gray-900 -z-10"></div>
                <div className="absolute top-[-50%] left-[20%] w-[600px] h-[600px] bg-[#195bac] opacity-20 blur-[150px] rounded-full"></div>
                
                <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">Works with your <br/>favorite tools.</h2>
                <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
                   Seamlessly integrate with Slack, Google Workspace, Zoom, and 2000+ other apps via our robust API.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                   <button 
                      onClick={() => {
                          setScaleMode('SMALL');
                          navigate('/signup');
                      }} 
                      className="px-8 py-4 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-100 transition-colors"
                   >
                      Get Started Free
                   </button>
                   <button onClick={() => navigate('/resources')} className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-full font-bold hover:bg-white/20 transition-colors">
                      View API Docs
                   </button>
                </div>
             </div>
           </div>

        </div>
      </div>
    </div>
  );
}
