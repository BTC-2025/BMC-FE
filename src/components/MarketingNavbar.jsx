import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import { useScaleMode } from "../context/ScaleModeContext";

export default function MarketingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const { scaleMode, toggleScaleMode, setScaleMode } = useScaleMode();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 border-b ${
      scrolled || isMenuOpen ? "bg-white/95 backdrop-blur-md border-gray-200 py-3 shadow-sm" : "bg-white/0 border-transparent py-6"
    }`}>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 flex items-center justify-between relative z-10">
        <Link to="/" className="flex items-center gap-3 group relative z-50">
          <div className="relative">
             <img src={logo} alt="BTC Logo" className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-500" />
             <div className="absolute inset-0 bg-[#195bac]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div className={`${isMenuOpen ? 'flex' : 'hidden sm:flex'} flex-col`}>
            <span className="text-xl font-[1000] text-gray-900 tracking-tighter leading-none block text-left">BTC</span>
            <span className="text-[10px] font-bold text-[#195bac] tracking-[0.2em] uppercase leading-none block text-left">Enterprise</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
            <Link to="/products" className="text-sm font-[900] text-gray-600 hover:text-[#195bac] transition-colors uppercase tracking-widest text-[11px]">Products</Link>
            <Link to="/solutions" className="text-sm font-[900] text-gray-600 hover:text-[#195bac] transition-colors uppercase tracking-widest text-[11px]">Solutions</Link>
            <Link to="/pricing" className="text-sm font-[900] text-gray-600 hover:text-[#195bac] transition-colors uppercase tracking-widest text-[11px]">Modules</Link>
            <Link to="/resources" className="text-sm font-[900] text-gray-600 hover:text-[#195bac] transition-colors uppercase tracking-widest text-[11px]">Resources</Link>
        </div>

        {/* Action Buttons & Hamburger */}
        <div className="flex items-center gap-4">


            <div className="hidden sm:flex items-center gap-4">
                {!user ? (
                    <>
                        <Link to="/login" className="px-5 py-2.5 text-xs font-black text-gray-700 hover:text-[#195bac] transition-colors uppercase tracking-widest">
                            Sign In
                        </Link>
                        <button 
                            onClick={() => {
                                setScaleMode('SMALL');
                                navigate('/signup');
                            }}
                            className="px-6 py-3 bg-[#f0483e] hover:bg-[#d43f36] text-white text-[11px] font-black rounded-xl shadow-lg shadow-red-500/20 transition-all hover:-translate-y-0.5 uppercase tracking-widest"
                        >
                            Get Started
                        </button>
                    </>
                ) : (
                    <Link to="/app" className="px-6 py-3 bg-[#195bac] hover:bg-[#154d91] text-white text-[11px] font-black rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 flex items-center gap-3 uppercase tracking-[0.2em]">
                        Workspace <span className="text-lg leading-none">→</span>
                    </Link>
                )}
            </div>

            {/* Hamburger Button */}
            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden w-12 h-12 flex flex-col items-center justify-center gap-1.5 relative z-50 group"
                aria-label="Toggle Menu"
            >
                <div className={`w-6 h-0.5 bg-gray-900 rounded-full transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`}></div>
                <div className={`w-6 h-0.5 bg-gray-900 rounded-full transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`}></div>
                <div className={`w-6 h-0.5 bg-gray-900 rounded-full transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></div>
            </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`lg:hidden fixed inset-0 bg-white z-40 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
        isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}>
        <div className="flex flex-col items-center justify-center h-full gap-8 px-10 text-center pt-24">
            <Link to="/products" className="text-4xl font-[1000] text-gray-900 tracking-tighter hover:text-[#195bac] transition-colors">Products</Link>
            <Link to="/solutions" className="text-4xl font-[1000] text-gray-900 tracking-tighter hover:text-[#195bac] transition-colors">Solutions</Link>
            <Link to="/pricing" className="text-4xl font-[1000] text-gray-900 tracking-tighter hover:text-[#195bac] transition-colors">Modules</Link>
            <Link to="/resources" className="text-4xl font-[1000] text-gray-900 tracking-tighter hover:text-[#195bac] transition-colors">Resources</Link>
            
            <div className="w-full h-px bg-gray-100 my-4 max-w-xs"></div>
            
            <div className="flex flex-col w-full max-w-xs gap-4 sm:hidden">
                {!user ? (
                    <>
                        <Link to="/signup" className="w-full py-5 bg-[#f0483e] text-white text-[13px] font-black rounded-2xl shadow-xl shadow-red-500/20 uppercase tracking-widest text-center">
                            Sign Up Free
                        </Link>
                        <Link to="/login" className="w-full py-5 bg-gray-100 text-gray-900 text-[13px] font-black rounded-2xl uppercase tracking-widest text-center">
                            Sign In
                        </Link>
                    </>
                ) : (
                    <Link to="/app" className="w-full py-5 bg-[#195bac] text-white text-[13px] font-black rounded-2xl shadow-xl shadow-blue-500/20 uppercase tracking-[0.2em] text-center">
                        Open Hub
                    </Link>
                )}
            </div>
            
            {/* Background Decorative Element */}
            <div className="absolute -bottom-20 -right-20 text-[200px] font-black text-gray-50/50 select-none pointer-events-none -rotate-12">BTC</div>
        </div>
      </div>
    </nav>
  );
}
