import { useState } from 'react';
import NewOrderModal from './NewOrderModal';

export default function Procurement({ orders, onUpdateStatus, onCreate, onDelete, onReceive }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Fallback
  const displayOrders = orders || [
    { id: "PR-2024-05", item: "Steel Alloy Sheets", qty: "5000 kg", vendor: "Metallica Corp", status: "Pending Approval", urge: "High" },
  ];

  const handleCreate = (newOrder) => {
      if (onCreate) {
          onCreate(newOrder);
      }
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div>
             <h3 className="text-xl font-black text-gray-900">Purchase Requisitions</h3>
             <p className="text-xs text-gray-500 font-bold mt-1">Manage sourcing requests and vendor orders.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-cyan-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-cyan-700 shadow-lg shadow-cyan-200 transition-all"
          >
             + New Order
          </button>
       </div>

       <div className="grid grid-cols-1 gap-4">
          {displayOrders.map(r => (
             <div key={r.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col md:flex-row items-center justify-between hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-5 w-full md:w-auto">
                   <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-xl">🛍️</div>
                   <div>
                      <h4 className="font-black text-gray-900">{r.item}</h4>
                      <p className="text-xs font-bold text-gray-400 mt-1">{r.vendor} • {r.qty}</p>
                   </div>
                </div>
                
                <div className="flex items-center gap-6 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                   <div className="text-right">
                      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Urgency</p>
                      <p className={`text-xs font-bold ${r.urge === 'High' ? 'text-red-600' : 'text-gray-700'}`}>{r.urge}</p>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="px-4 py-2 bg-gray-50 rounded-lg min-w-[120px] text-center">
                         <span className={`text-[10px] font-black uppercase tracking-widest 
                            ${r.status === 'Ordered' ? 'text-emerald-600' : 
                              r.status === 'Delivered' ? 'text-blue-600' : 
                              r.status === 'Pending Approval' ? 'text-cyan-700' : 'text-gray-400'}`}>
                            {r.status}
                         </span>
                      </div>
                      {onUpdateStatus && r.status === 'Pending Approval' && (
                          <div className="flex gap-1">
                              <button onClick={() => onUpdateStatus(r.id, "Approved")} className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100" title="Approve">✓</button>
                              <button onClick={() => onUpdateStatus(r.id, "Rejected")} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100" title="Reject">✕</button>
                          </div>
                      )}
                      {r.status === 'Ordered' && onReceive && (
                          <button 
                            onClick={() => {
                                const warehouseId = 1; // Default
                                onReceive({ purchase_order_id: r.realId, warehouse_id: warehouseId });
                            }}
                            className="px-3 py-2 bg-[#195bac] text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all"
                          >
                            Receive
                          </button>
                      )}
                      
                      {/* Delete Button - Show for non-final states or all if desired. Showing for Draft/Rejected mostly. */}
                      {onDelete && (
                          <button 
                              onClick={() => onDelete(r.id)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                              title="Delete Requisition"
                          >
                              🗑️
                          </button>
                      )}
                   </div>
                </div>
             </div>
          ))}
       </div>

       <NewOrderModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreate}
       />
    </div>
  );
}
