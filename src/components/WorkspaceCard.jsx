export default function WorkspaceCard({ name, description, icon, imageColor, onEnter, onRemove }) {
  // Extract background color class
  const bgColorClass = imageColor.split(' ')[0];

  return (
    <div 
      onClick={onEnter}
      className="group relative bg-white border border-gray-100 rounded-[40px] p-8 cursor-pointer hover:shadow-2xl hover:scale-[1.01] transition-all duration-500 flex flex-col min-h-[200px] overflow-hidden group"
    >

      {/* Icon Container */}
      <div className="w-12 h-12 bg-gray-50/50 rounded-2xl flex items-center justify-center text-2xl mb-5 shadow-sm border border-gray-100/50 group-hover:bg-white transition-colors duration-500">
        <span className="group-hover:scale-110 transition-transform duration-500">{icon}</span>
      </div>

      {/* Content */}
      <div className="flex-1 text-left min-h-0">
        <h3 className="text-xl font-black text-gray-900 mb-1.5 tracking-tight group-hover:text-[#195bac] transition-colors leading-tight">
          {name}
        </h3>
        <p className="text-[11px] font-bold text-gray-400 line-clamp-3 leading-relaxed group-hover:text-gray-600 transition-colors tracking-tight">
          {description}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[9px] font-black text-[#195bac] tracking-[0.2em] group-hover:translate-x-1 transition-transform">
          <span>Launch</span>
          <span className="text-sm">→</span>
        </div>
        
        {/* Status Dot */}
        <div className="flex items-center gap-2">
           <span className="text-[8px] font-black text-gray-300 tracking-widest hidden group-hover:inline-block">Online</span>
           <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]"></div>
        </div>
      </div>

      {/* Liquid Detail Effect */}
      <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-0 group-hover:opacity-10 transition-opacity duration-1000 ${bgColorClass}`}></div>
    </div>
  );
}
