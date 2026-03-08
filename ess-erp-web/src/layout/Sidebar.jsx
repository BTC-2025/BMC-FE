import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { logout } = useAuth();
  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: "dashboard" },
    { name: "Attendance", path: "/attendance", icon: "event_available" },
    { name: "Leave", path: "/leave", icon: "flight_takeoff" },
    { name: "Payroll", path: "/payroll", icon: "payments" },
    { name: "Expenses", path: "/expenses", icon: "receipt_long" },
    { name: "Documents", path: "/documents", icon: "description" },
    { name: "Help & Support", path: "/support", icon: "help_outline" },
    { name: "Settings", path: "/settings", icon: "settings" },
  ];

  return (
    <aside className="w-72 bg-sidebar-blue text-white flex-shrink-0 flex flex-col hidden lg:flex border-r border-white/5 shadow-2xl">
      <div className="p-10 flex items-center gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-lg shadow-blue-500/20">
          <span className="material-icons-outlined text-white">corporate_fare</span>
        </div>
        <div>
          <h1 className="font-black text-2xl tracking-tighter leading-none">EXECUTIVE</h1>
          <p className="text-[10px] font-black text-blue-400 tracking-[0.3em] uppercase mt-1">Enterprise ERP</p>
        </div>
      </div>

      <nav className="mt-4 flex-1 space-y-2 px-6 overflow-y-auto">
        <p className="px-4 text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">Main Menu</p>
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${
                isActive 
                  ? "bg-white/20 shadow-lg text-white" 
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <span className="material-icons-outlined text-[22px]">{item.icon}</span>
            <span className="font-bold tracking-tight">{item.name}</span>
            {item.name === "Payroll" && (
              <span className="ml-auto w-2 h-2 rounded-full bg-white/40"></span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-8">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-all font-bold"
        >
          <span className="material-icons-outlined">logout</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
