export default function FinanceSidebar({
  sections,
  activeView,
  onSelect,
  onBack,
}) {
  return (
    <aside className="w-72 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 shrink-0 transition-all duration-300 text-left shadow-sm">
      <div className="p-6 border-b border-gray-100 text-left">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest hover:text-[#195bac] transition-all mb-6 group text-left"
        >
          <span className="group-hover:-translate-x-1 transition-transform">
            ←
          </span>{" "}
          Dashboard
        </button>
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 bg-[#111827] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-gray-200 text-left shrink-0">
            <span className="text-xl font-black font-heading">F</span>
          </div>
          <div className="text-left">
            <h2 className="font-black font-heading text-[#111827] text-lg tracking-tighter leading-none text-left">
              Finance Hub
            </h2>
            <p className="text-[10px] text-emerald-500 font-bold font-body uppercase tracking-widest mt-1 text-left">
              Fiscal Sync
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-7 scrollbar-hide text-left">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-2 text-left">
            <h3 className="px-5 text-[9px] font-black font-subheading text-gray-300 uppercase tracking-[0.2em] mb-4 text-left">
              {section.title}
            </h3>
            <div className="space-y-1.5 text-left">
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelect(item.id)}
                  className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 group relative
                    ${
                      activeView === item.id
                        ? "bg-[#195bac] text-white shadow-xl shadow-blue-500/10"
                        : "text-gray-500 hover:bg-gray-50 hover:text-[#111827]"
                    }`}
                >
                  <div className="flex items-center gap-4 text-left">
                    <span
                      className={`text-xl transition-all duration-300 ${activeView === item.id ? "scale-110" : "opacity-60 group-hover:opacity-100 group-hover:scale-110"}`}
                    >
                      {item.icon}
                    </span>
                    <span
                      className={`text-[13px] ${activeView === item.id ? "font-black" : "font-bold"} font-subheading tracking-tight uppercase`}
                    >
                      {item.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
