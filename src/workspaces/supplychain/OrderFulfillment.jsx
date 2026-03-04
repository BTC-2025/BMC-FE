import { useState } from 'react';
import FulfillmentOrderModal from './FulfillmentOrderModal';

export default function OrderFulfillment({ orders, onProcess, onAdd, onUpdate, onDelete }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentOrder, setCurrentOrder] = useState(null);

  const handleEdit = (order) => {
      setCurrentOrder(order);
      setModalMode('edit');
      setIsModalOpen(true);
  };

  const handleCreate = () => {
      setCurrentOrder(null);
      setModalMode('create');
      setIsModalOpen(true);
  };

  const handleSubmit = (data) => {
      if (modalMode === 'edit') {
          onUpdate(data.id, data);
      } else {
          onAdd(data);
      }
  };

  // Fallback
  const displayOrders = orders || [
     { id: "ORD-9921", items: "3x Office Chair", packer: "Pending", status: "Ready to Pick" },
  ];

  return (
    <div className="space-y-8">
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h3 className="text-xl font-black text-gray-900">Pick & Pack Queue</h3>
                    <div className="flex gap-2 mt-2">
                       <span className="px-3 py-1 bg-gray-100 rounded text-[10px] font-black uppercase text-gray-500">Pick: {displayOrders.filter(o => o.status === 'Ready to Pick').length}</span>
                       <span className="px-3 py-1 bg-gray-100 rounded text-[10px] font-black uppercase text-gray-500">Pack: {displayOrders.filter(o => o.status === 'Packing').length}</span>
                    </div>
                 </div>
                 <button 
                    onClick={handleCreate}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all"
                 >
                    + New Order
                 </button>
              </div>
             <div className="space-y-4">
                {displayOrders.map((ord, i) => (
                   <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                      <div>
                         <div className="flex items-center gap-3">
                            <span className="font-black text-gray-900">{ord.id}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest
                               ${ord.status === 'Ready to Pick' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
                               {ord.status}
                            </span>
                         </div>
                         <p className="text-xs text-gray-500 mt-1 font-bold">{ord.items}</p>
                      </div>
                       <div className="mt-4 md:mt-0 flex items-center gap-4">
                          <div className="text-right">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Packer</p>
                              <p className="text-xs font-bold text-gray-900">{ord.packer}</p>
                          </div>
                           <div className="flex flex-col gap-2">
                               <button 
                                   onClick={() => onProcess && onProcess(ord.id)}
                                   className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-cyan-700 transition-all shadow-md shadow-cyan-100"
                               >
                                   {ord.status === 'Shipped' ? 'Archived' : 'Process ➔'}
                               </button>
                               <div className="flex gap-1 justify-end">
                                  <button onClick={() => handleEdit(ord)} className="text-[10px] font-bold text-gray-400 hover:text-cyan-600 px-1">Edit</button>
                                  {onDelete && <button onClick={() => onDelete(ord.id)} className="text-[10px] font-bold text-gray-400 hover:text-red-500 px-1">Delete</button>}
                               </div>
                           </div>
                       </div>
                    </div>
                ))}
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100">
             <h4 className="font-black text-gray-900 uppercase tracking-widest text-sm mb-6">Fulfillment Health</h4>
             <div className="space-y-6">
                <div>
                   <div className="flex justify-between mb-2">
                      <span className="text-xs font-bold text-gray-600">Accuracy Rate</span>
                      <span className="text-xs font-black text-emerald-600">99.2%</span>
                   </div>
                   <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[99.2%]"></div>
                   </div>
                </div>
                <div>
                   <div className="flex justify-between mb-2">
                      <span className="text-xs font-bold text-gray-600">Avg. Ship Time</span>
                      <span className="text-xs font-black text-blue-600">1.4 Days</span>
                   </div>
                   <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full w-[85%]"></div>
                   </div>
                </div>
                <div>
                   <div className="flex justify-between mb-2">
                      <span className="text-xs font-bold text-gray-600">Backorder Rate</span>
                      <span className="text-xs font-black text-gray-900">0.5%</span>
                   </div>
                   <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gray-900 h-full w-[0.5%]"></div>
                   </div>
                </div>
             </div>
          </div>
       </div>

       <FulfillmentOrderModal 
          isOpen={isModalOpen}
          mode={modalMode}
          order={currentOrder}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
       />
    </div>
  );
}
