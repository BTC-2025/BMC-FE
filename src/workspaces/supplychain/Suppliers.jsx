import { useState } from 'react';
import SupplierModal from './SupplierModal';

export default function Suppliers({ suppliers, onAdd, onUpdate, onDelete }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentSupplier, setCurrentSupplier] = useState(null);

  const handleEdit = (supplier) => {
      setCurrentSupplier(supplier);
      setModalMode('edit');
      setIsModalOpen(true);
  };

  const handleCreate = () => {
      setCurrentSupplier(null);
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
  const displaySuppliers = suppliers || [
    { id: "SUP-001", name: "Metallica Corp", type: "Raw Material", rating: "A", status: "Active", location: "Germany" },
    { id: "SUP-002", name: "PackIt Inc", type: "Packaging", rating: "B", status: "Active", location: "USA" },
  ];

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div>
             <h3 className="text-xl font-black text-gray-900">Supplier Network</h3>
             <p className="text-xs text-gray-500 font-bold mt-1">Manage vendor relationships and performance.</p>
          </div>
          <button 
             onClick={handleCreate}
             className="px-6 py-3 bg-cyan-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-cyan-700 shadow-lg shadow-cyan-200 transition-all"
          >
             + Onboard Supplier
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       {displaySuppliers.map((p, i) => (
          <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-cyan-200 transition-all shadow-sm group">
             <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center text-2xl group-hover:bg-cyan-50 transition-colors">🏢</div>
                <div className="text-right">
                   <div className="flex items-center gap-1 justify-end">
                      <span className="text-amber-400 text-sm">★</span>
                      <span className="font-black text-gray-900">{p.rating}</span>
                   </div>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Score</p>
                </div>
             </div>
             
             <h3 className="text-lg font-black text-gray-900 mb-1">{p.name}</h3>
             <p className="text-sm font-medium text-gray-500 mb-6">{p.location} • {p.type}</p>
             
             <div className="border-t border-gray-50 pt-4 flex justify-between items-center">
                <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest
                   ${p.status === 'Strategic Partner' ? 'bg-purple-50 text-purple-600' : 
                     p.status === 'Under Review' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                   {p.status}
                </span>
                <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest
                   ${p.status === 'Strategic Partner' ? 'bg-purple-50 text-purple-600' : 
                     p.status === 'Under Review' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                   {p.status}
                </span>
                <div className="flex gap-3 items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(p)} className="text-[10px] font-black text-cyan-600 uppercase tracking-widest hover:underline">Edit</button>
                    {onDelete && <button onClick={() => onDelete(p.id)} className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-600">Delete</button>}
                </div>
             </div>
          </div>
       ))}
       </div>

       <SupplierModal 
          isOpen={isModalOpen}
          mode={modalMode}
          supplier={currentSupplier}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
       />
    </div>
  );
}
