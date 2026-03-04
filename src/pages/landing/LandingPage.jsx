import { useNavigate } from "react-router-dom";
import { ALL_AVAILABLE_WORKSPACES } from "../../config/workspaces";
import { useScaleMode } from "../../context/ScaleModeContext";

export default function LandingPage() {
  const navigate = useNavigate();
  const { setScaleMode } = useScaleMode();

  return (
    <div className="font-sans text-gray-900 pb-20">
      
      {/* Outer Container for the "App Window" look */}
      <div className="p-4 md:p-8 pt-24 md:pt-32 max-w-[1600px] mx-auto">
        
        {/* Hero Section Container - Rounded & Gradient */}
        <div className="relative rounded-[40px] md:rounded-[60px] overflow-hidden bg-white shadow-2xl shadow-blue-900/5 min-h-[90vh] flex flex-col items-center pt-32 md:pt-40 pb-20 px-6 isolate">
            
            {/* Background Blobs (The "E-land" style mesh) */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#a78bfa] rounded-full blur-[120px] opacity-20 -z-10 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[60%] bg-[#38bdf8] rounded-full blur-[120px] opacity-20 -z-10 animate-pulse delay-1000"></div>
            <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-pink-200 rounded-full blur-[100px] opacity-30 -z-10"></div>

            {/* Hero Content */}
            <div className="text-center max-w-4xl mx-auto z-10">
                <h1 className="text-5xl md:text-7xl font-[800] tracking-tight text-gray-900 mb-6 leading-[1.1] animate-fade-in-up">
                    Manage Your Commerce Effortlessly with <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#195bac] to-violet-600">One Smart Dashboard</span>
                </h1>
                <p className="text-xl text-gray-500 font-medium mb-12 animate-fade-in-up delay-100 max-w-2xl mx-auto">
                    Extend ERP beyond simple management. Build vertical solutions and custom workflows that align with your business strategy.
                </p>

                {/* Email Input / CTA Pill */}
                <div className="bg-white p-2 rounded-full shadow-xl shadow-gray-200/50 max-w-lg mx-auto flex items-center gap-2 border border-gray-100 animate-fade-in-up delay-200 hover:scale-[1.02] transition-transform duration-300">
                    <input 
                        type="email" 
                        placeholder="Enter your email address" 
                        className="flex-1 px-6 py-3 bg-transparent outline-none text-gray-700 font-medium placeholder:text-gray-400"
                    />
                    <button 
                        onClick={() => {
                            setScaleMode('SMALL');
                            navigate('/signup');
                        }} 
                        className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                        Try it free <span className="text-lg">→</span>
                    </button>
                </div>
            </div>

            {/* Dashboard Preview - Floating Card */}
            <div className="mt-20 w-full max-w-6xl relative z-10 animate-fade-in-up delay-300 group">
                {/* The Main Dashboard Image Container */}
                <div className="relative rounded-3xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(50,50,93,0.25)] border-4 border-white/50 bg-white/50 backdrop-blur-sm transform group-hover:scale-[1.01] transition-transform duration-700">
                    {/* Mockup Top Bar */}
                    <div className="h-12 bg-white border-b border-gray-100 flex items-center px-4 gap-2">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <div className="flex-1 text-center text-xs font-bold text-gray-400">BTC Enterprise Dashboard</div>
                    </div>
                    {/* Mockup Body - Using a CSS Grid approach to simulate the screenshot provided */}
                    <div className="bg-[#f8f9fc] p-6 lg:p-10 grid grid-cols-12 gap-6 min-h-[600px]">
                        {/* Sidebar Mock */}
                        <div className="col-span-12 lg:col-span-2 space-y-4 hidden lg:block">
                             <div className="h-10 w-full bg-[#195bac] rounded-xl mb-8"></div>
                             {[1,2,3,4,5,6].map(i => <div key={i} className="h-4 w-2/3 bg-gray-200 rounded-lg"></div>)}
                        </div>
                        {/* Main Content Mock */}
                        <div className="col-span-12 lg:col-span-10 grid grid-cols-3 gap-6">
                             {/* Welcom Header */}
                             <div className="col-span-3 h-24 bg-white rounded-2xl p-6 flex flex-col justify-center">
                                <div className="h-6 w-48 bg-gray-900/10 rounded-lg mb-2"></div>
                                <div className="h-4 w-96 bg-gray-900/5 rounded-lg"></div>
                             </div>
                             {/* Stats Cards */}
                             <div className="bg-white p-6 rounded-2xl shadow-sm"><div className="h-8 w-8 rounded-full bg-orange-100 mb-4"></div><div className="h-6 w-24 bg-gray-100 rounded mb-2"></div><div className="h-8 w-32 bg-gray-900 rounded"></div></div>
                             <div className="bg-white p-6 rounded-2xl shadow-sm"><div className="h-8 w-8 rounded-full bg-blue-100 mb-4"></div><div className="h-6 w-24 bg-gray-100 rounded mb-2"></div><div className="h-8 w-32 bg-gray-900 rounded"></div></div>
                             <div className="bg-white p-6 rounded-2xl shadow-sm"><div className="h-8 w-8 rounded-full bg-purple-100 mb-4"></div><div className="h-6 w-24 bg-gray-100 rounded mb-2"></div><div className="h-8 w-32 bg-gray-900 rounded"></div></div>
                             
                             {/* Large Chart Area */}
                             <div className="col-span-3 lg:col-span-2 bg-white h-80 rounded-2xl shadow-sm p-6 relative overflow-hidden">
                                <h4 className="text-sm font-bold text-gray-400 mb-4">Revenue Overview</h4>
                                {/* Smooth Curve SVG */}
                                <svg viewBox="0 0 400 150" className="w-full h-full absolute bottom-0 left-0 text-[#195bac] opacity-20 fill-current">
                                    <path d="M0,100 C150,200 350,0 500,100 L500,00 L0,0 Z"></path>
                                </svg>
                                <svg viewBox="0 0 400 150" className="w-full h-full absolute bottom-0 left-0 stroke-[#195bac] stroke-[3] fill-none">
                                    <path d="M0,100 C150,200 350,0 500,100"></path>
                                </svg>
                             </div>
                             
                             {/* Right Side Panel */}
                             <div className="col-span-3 lg:col-span-1 bg-white h-80 rounded-2xl shadow-sm p-6">
                                <h4 className="text-sm font-bold text-gray-400 mb-4">Top Countries</h4>
                                <div className="space-y-4">
                                    {[1,2,3,4,5].map(i => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-gray-100"></div>
                                            <div className="flex-1 h-2 bg-gray-100 rounded-full"></div>
                                            <div className="w-8 h-2 bg-gray-100 rounded-full"></div>
                                        </div>
                                    ))}
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto px-6 py-32">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
                <div className="space-y-2">
                    <h3 className="text-4xl font-black text-gray-900 flex items-center justify-center md:justify-start gap-2">
                        99k+ <span className="text-2xl">👥</span>
                    </h3>
                    <p className="text-gray-500 font-medium leading-relaxed">
                        Thousands of people trust us and join the team and grow their business.
                    </p>
                </div>
                <div className="space-y-2">
                    <h3 className="text-4xl font-black text-gray-900 flex items-center justify-center md:justify-start gap-2">
                        4.9 <span className="text-amber-400">★</span>
                    </h3>
                    <p className="text-gray-500 font-medium leading-relaxed">
                        Positive ratings by pulse user around the world! Check the review here.
                    </p>
                </div>
                <div className="space-y-2">
                    <h3 className="text-4xl font-black text-gray-900">100%</h3>
                    <p className="text-gray-500 font-medium leading-relaxed">
                        User satisfaction with boardup, reflecting improved project ROI.
                    </p>
                </div>
            </div>
        </div>
        
        {/* Features / Module Grid with Soft Style */}
        <div className="max-w-7xl mx-auto px-6 mb-32">
            <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">E-Land Features?</h2>
                <p className="text-gray-500 max-w-2xl mx-auto">
                    Manage your commerce effortlessly with one smart dashboard. We provide specific tools for every department.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {ALL_AVAILABLE_WORKSPACES.slice(0, 3).map((ws) => (
                    <div key={ws.id} className="group p-8 rounded-[40px] bg-white border border-gray-100 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2">
                        <div className={`w-14 h-14 rounded-2xl ${ws.imageColor} bg-opacity-10 flex items-center justify-center text-3xl mb-6`}>
                            {ws.icon}
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-3">{ws.name}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed mb-6">{ws.description}</p>
                        <span 
                            onClick={() => {
                                setScaleMode('SMALL');
                                navigate('/signup');
                            }}
                            className="text-xs font-bold text-black uppercase tracking-widest group-hover:underline cursor-pointer"
                        >
                            Explore Now
                        </span>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
}
