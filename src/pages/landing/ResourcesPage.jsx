import { useNavigate } from "react-router-dom";

export default function ResourcesPage() {
  const navigate = useNavigate();

  const resources = [
    { title: "Documentation", category: "Learn", desc: "Detailed guides on how to configure your modules.", icon: "📚", color: "text-blue-500 bg-blue-50" },
    { title: "API Reference", category: "Developers", desc: "Endpoints and guides for building custom integrations.", icon: "🔌", color: "text-purple-500 bg-purple-50" },
    { title: "Community Forum", category: "Connect", desc: "Ask questions and share tips with other users.", icon: "💬", color: "text-orange-500 bg-orange-50" },
    { title: "Academy", category: "Learn", desc: "Video courses and certifications for admin users.", icon: "🎓", color: "text-emerald-500 bg-emerald-50" },
  ];

  const articles = [
    { title: "10 Ways to Optimize Inventory Flow", date: "Jan 12, 2026", tag: "Operations", gradient: "from-blue-400 to-indigo-500" },
    { title: "The Future of AI in HR Management", date: "Jan 08, 2026", tag: "Future of Work", gradient: "from-purple-400 to-pink-500" },
    { title: "Q4 2025 Product Update Release Notes", date: "Dec 25, 2025", tag: "Product News", gradient: "from-emerald-400 to-teal-500" },
  ];

  return (
    <div className="font-sans text-gray-900 pb-20 pt-24 md:pt-32">
       <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
         <div className="relative rounded-[40px] md:rounded-[60px] bg-white shadow-2xl shadow-blue-900/5 min-h-[85vh] px-6 py-20 md:p-20 overflow-hidden isolate">
            
            {/* Soft Gradients */}
            <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-[120px] -z-10"></div>

            <div className="max-w-7xl mx-auto text-center mb-20">
               <span className="px-4 py-2 rounded-full bg-amber-50 text-amber-600 text-xs font-black uppercase tracking-widest mb-6 inline-block">Support & Content</span>
               <h1 className="text-5xl md:text-7xl font-[800] tracking-tight text-gray-900 mb-8 leading-[1.1]">
                 Resource <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Center.</span>
               </h1>
               
               {/* Search Bar - E-land style pill */}
               <div className="max-w-xl mx-auto relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-200 to-orange-200 rounded-full blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                  <input 
                    type="text" 
                    placeholder="Search guides, tutorials, or articles..." 
                    className="relative w-full py-4 px-8 rounded-full bg-white border border-gray-100 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none font-bold text-gray-900 placeholder:font-medium placeholder:text-gray-400 transition-all shadow-xl shadow-amber-900/5 h-16"
                  />
                  <button className="absolute right-2 top-2 bottom-2 bg-gray-900 px-6 rounded-full text-white font-bold hover:bg-gray-800 transition-colors flex items-center justify-center">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </button>
               </div>
            </div>

            {/* Resources Grid */}
            <div className="max-w-7xl mx-auto mb-32">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {resources.map((res, i) => (
                     <div 
                        key={res.title} 
                        className="p-8 rounded-[32px] bg-[#f8f9fc] border border-transparent hover:bg-white hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] transition-all duration-300 cursor-pointer group hover:-translate-y-2 animate-fade-in-up"
                        style={{ animationDelay: `${i * 100}ms` }}
                     >
                        <div className={`w-14 h-14 rounded-2xl ${res.color} flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:scale-110 transition-transform`}>{res.icon}</div>
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">{res.category}</span>
                        <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">{res.title}</h3>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed">{res.desc}</p>
                     </div>
                  ))}
               </div>
            </div>

            {/* Latest Articles Section */}
            <div className="max-w-7xl mx-auto">
               <div className="flex items-center justify-between mb-10 px-2">
                   <h2 className="text-3xl font-black text-gray-900">Latest from the Blog</h2>
                   <button className="px-6 py-2 rounded-full border border-gray-200 text-sm font-bold hover:bg-gray-50 transition-colors">View All Articles</button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {articles.map((art, i) => (
                     <div key={i} className="group cursor-pointer">
                        <div className="aspect-[1.6/1] bg-gray-100 rounded-[32px] mb-6 overflow-hidden relative shadow-sm">
                            <div className={`absolute inset-0 bg-gradient-to-br ${art.gradient} opacity-80 group-hover:scale-110 transition-transform duration-700`}></div>
                            {/* Dummy Content Lines */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-end opacity-50">
                                <div className="h-4 w-1/2 bg-white/50 rounded-full mb-3"></div>
                                <div className="h-4 w-3/4 bg-white/50 rounded-full"></div>
                            </div>
                        </div>
                        <div className="px-2">
                           <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">{art.date} — {art.tag}</span>
                           <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-amber-600 transition-colors">{art.title}</h3>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

         </div>
       </div>
    </div>
  );
}
