export default function WorkOrders({ orders, onProduce }) {
  // Fallback
  const displayOrders = orders || [];

  return (
    <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {["All Orders", "In Progress", "Scheduled", "Delayed"].map(tab => (
             <button key={tab} className="p-4 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-600 hover:border-amber-400 hover:text-amber-600 transition-all text-left">
                {tab}
             </button>
          ))}
       </div>

       <div className="space-y-4">
          {displayOrders.map((order) => (
             <div key={order.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-6">
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl
                      ${order.status === 'Delayed' || order.status === 'Pending Material' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                      {order.priority === 'High' ? '🔥' : '📋'}
                   </div>
                   <div>
                      <div className="flex items-center gap-3">
                         <span className="text-lg font-black text-gray-900">{order.id}</span>
                         <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${order.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                            {order.priority}
                         </span>
                      </div>
                      <p className="text-sm font-bold text-gray-600 mt-1">{order.product} <span className="text-gray-300 mx-2">|</span> {order.qty} Units</p>
                   </div>
                </div>
                
                <div className="flex items-center gap-8 text-right">
                   <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Due Date</p>
                      <p className="text-sm font-bold text-gray-900">{order.due}</p>
                   </div>
                   <div className="w-32 text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{order.status}</p>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                         <div className={`h-full rounded-full ${order.status === 'In Production' ? 'w-2/3 bg-blue-500' : order.status === 'Executed' ? 'w-full bg-emerald-500' : 'w-0 bg-gray-300'}`}></div>
                      </div>
                   </div>
                   {order.status !== 'Executed' && (
                       <button 
                         onClick={() => {
                            if (window.confirm(`Start production for ${order.id}?`)) {
                                if (onProduce) onProduce(order.realId);
                            }
                         }}
                         className="px-4 py-2 bg-[#111827] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
                       >
                         Execute
                       </button>
                   )}
                   <button className="p-2 border border-gray-100 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-50">⋮</button>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
}
