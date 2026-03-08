import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const location = useLocation();
  const { employee } = useAuth();
  const pathName = location.pathname.split("/")[1] || "Dashboard";
  const formattedPath = pathName.charAt(0).toUpperCase() + pathName.slice(1);
  const displayName = employee?.name || "Employee";
  const displayRole = employee?.role || "Employee";
  const initials = displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-40 transition-all">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-widest mb-1">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          System Online
        </div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          {formattedPath}
        </h2>
      </div>

      <div className="flex-1 max-w-xl mx-12 relative group hidden md:block">
        <input 
          type="text" 
          placeholder="Global search for employees, tasks, or documents..." 
          className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-12 py-3.5 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none transition-all"
        />
        <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </div>

      <div className="flex items-center gap-3">
        <Link 
          to="/ai-assistant"
          className="w-12 h-12 flex items-center justify-center bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all duration-300 group"
          title="AI Assistant"
        >
          <span className="material-icons-outlined group-hover:rotate-12 transition-transform">auto_awesome</span>
        </Link>
        
        <Link 
          to="/notifications" 
          className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-400 rounded-2xl hover:bg-white hover:text-blue-600 hover:shadow-md transition-all relative"
        >
          <span className="material-icons-outlined">notifications</span>
          <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </Link>

        <div className="h-8 w-px bg-gray-100 mx-2"></div>
        
        <Link to="/profile" className="flex items-center gap-4 pl-2 hover:opacity-80 transition-opacity">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-gray-900 leading-none">{displayName}</p>
            <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-1">
              {displayRole}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-blue-100 flex items-center justify-center">
            <div className="w-full h-full rounded-[0.9rem] bg-white flex items-center justify-center overflow-hidden">
               <span className="text-blue-600 font-black text-sm">{initials}</span>
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
}
