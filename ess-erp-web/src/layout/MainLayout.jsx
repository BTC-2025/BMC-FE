import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout() {
  return (
    <div className="bg-gray-50 text-gray-900 h-screen selection:bg-blue-100 selection:text-blue-900">
      <div className="flex h-full overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 flex flex-col overflow-hidden relative bg-gray-50">
          <Header />
          
          <div className="flex-1 overflow-y-auto px-10 py-10 scroll-smooth custom-scrollbar">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto">
              <Outlet />
            </div>
          </div>

          {/* Decorative gradients for depth */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-orange-100/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
        </main>
      </div>
      
      {/* Mobile Experience (Simplified) */}
      <div className="lg:hidden fixed bottom-8 right-8 z-50">
        <button className="w-16 h-16 rounded-3xl bg-blue-600 text-white shadow-2xl shadow-blue-600/40 flex items-center justify-center active:scale-90 transition-transform">
          <span className="material-icons-outlined text-3xl">menu</span>
        </button>
      </div>
    </div>
  );
}
