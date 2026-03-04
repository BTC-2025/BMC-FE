import { useState } from 'react';
import ReturnModal from './ReturnModal';

export default function ReturnsManagement({ returns, onAdd, onUpdate, onDelete }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentRMA, setCurrentRMA] = useState(null);

  const handleEdit = (rma) => {
      setCurrentRMA(rma);
      setModalMode('edit');
      setIsModalOpen(true);
  };

  const handleCreate = () => {
      setCurrentRMA(null);
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
  const displayReturns = returns || [
     { id: "RET-901", customer: "John Doe", product: "Wireless Mouse", reason: "Defective", status: "Processing" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
       <div className="bg-white p-8 rounded-2xl border border-gray-100">
          <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-900">RMA Requests</h3>
              <button 
                 onClick={handleCreate}
                 className="px-4 py-2 bg-gray-900 text-white rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all"
              >
                 + Support Ticket
              </button>
          </div>
          <div className="space-y-4">
             {displayReturns.map(r => (
                <div key={r.id} className="p-4 bg-gray-50 rounded-xl border border-transparent hover:border-gray-200 transition-all cursor-pointer group">
                   <div className="flex justify-between items-start mb-2">
                      <span className="font-black text-gray-900 text-sm">{r.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase
                         ${r.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-600'}`}>
                         {r.status}
                      </span>
                   </div>
                   <p className="text-xs font-bold text-gray-600 mb-1">{r.reason}</p>
                   <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{r.customer}</p>
                   
                   <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                       <button onClick={(e) => { e.stopPropagation(); handleEdit(r); }} className="text-[10px] font-bold text-cyan-600 hover:underline">Edit</button>
                       {onDelete && <button onClick={(e) => { e.stopPropagation(); onDelete(r.id); }} className="text-[10px] font-bold text-red-500 hover:underline">Delete</button>}
                   </div>
                </div>
             ))}
          </div>
       </div>

       <div className="space-y-6">
          <div className="bg-orange-50 p-8 rounded-2xl border border-orange-100">
             <h3 className="text-lg font-black text-orange-900 mb-2">Return Rate Alert</h3>
             <p className="text-xs text-orange-700 font-medium mb-6">Product 'Office Chair V2' showing abnormally high return rate for 'Wobble'.</p>
             <button className="px-6 py-2 bg-white text-orange-700 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-orange-100 transition-colors">Investigate QC</button>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
             <h4 className="font-black text-gray-900 uppercase tracking-widest text-sm mb-4">Disposition Summary</h4>
             <div className="flex gap-4">
                <div className="flex-1 text-center p-3 bg-gray-50 rounded-xl">
                   <p className="text-2xl font-black text-emerald-600">65%</p>
                   <p className="text-[10px] font-bold text-gray-400 uppercase">Restock</p>
                </div>
                <div className="flex-1 text-center p-3 bg-gray-50 rounded-xl">
                   <p className="text-2xl font-black text-red-600">12%</p>
                   <p className="text-[10px] font-bold text-gray-400 uppercase">Scrap</p>
                </div>
                <div className="flex-1 text-center p-3 bg-gray-50 rounded-xl">
                   <p className="text-2xl font-black text-blue-600">23%</p>
                   <p className="text-[10px] font-bold text-gray-400 uppercase">Refurb</p>
                </div>
             </div>
          </div>
       </div>

       <ReturnModal 
          isOpen={isModalOpen}
          mode={modalMode}
          rma={currentRMA}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
       />
    </div>
  );
}
