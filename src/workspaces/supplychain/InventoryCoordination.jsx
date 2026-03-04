import { useState } from 'react';
import InventoryModal from './InventoryModal';
import TransferModal from './TransferModal';

export default function InventoryCoordination({ items, onAdd, onUpdate, onDelete }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentItem, setCurrentItem] = useState(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferItem, setTransferItem] = useState(null);

  const handleEdit = (item) => {
      setCurrentItem(item);
      setModalMode('edit');
      setIsModalOpen(true);
  };

  const handleCreate = () => {
      setCurrentItem(null);
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

  const handleTransfer = (item) => {
      setTransferItem(item);
      setIsTransferModalOpen(true);
  };

  const handleTransferSubmit = (updatedItem) => {
      onUpdate(updatedItem.id, updatedItem);
  };

  // Fallback
  const displayItems = items || [
      { sku: "SKU-992", name: "Steel Alloy Sheets", ny: 45, ldn: 20, tyo: 35, status: "Normal" },
      { sku: "SKU-104", name: "Plastic Resins", ny: 10, ldn: 60, tyo: 30, status: "Imbalance" },
  ];

  return (
    <div className="space-y-8">
       <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-900">Cross-Location Balance</h3>
              <button 
                 onClick={handleCreate}
                 className="px-6 py-2 bg-cyan-600 text-white rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-cyan-700 shadow-lg shadow-cyan-200 transition-all"
              >
                 + Add Item Strategy
              </button>
          </div>
          <div className="space-y-6">
             {displayItems.map((item, i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-center gap-6 pb-6 border-b border-gray-50 last:pb-0 last:border-0">
                   <div className="w-48 shrink-0">
                      <p className="font-bold text-gray-900">{item.sku} ({item.name})</p>
                      <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${item.status === 'Imbalance' ? 'text-amber-500' : 'text-emerald-500'}`}>{item.status}</p>
                   </div>
                   <div className="flex-1 flex gap-2 h-8">
                      <div className="bg-cyan-100 h-full rounded-l-lg flex items-center justify-center text-[10px] font-bold text-cyan-800" style={{ width: `${item.ny}%` }}>NY ({item.ny}%)</div>
                      <div className="bg-purple-100 h-full flex items-center justify-center text-[10px] font-bold text-purple-800" style={{ width: `${item.ldn}%` }}>LDN ({item.ldn}%)</div>
                      <div className="bg-orange-100 h-full rounded-r-lg flex items-center justify-center text-[10px] font-bold text-orange-800" style={{ width: `${item.tyo}%` }}>TYO ({item.tyo}%)</div>
                   </div>
                    <div className="flex gap-2">
                        <button 
                           onClick={() => handleTransfer(item)}
                           className="px-4 py-2 border border-gray-200 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 hover:border-cyan-500 hover:text-cyan-600 transition-all"
                        >
                           Transfer
                        </button>
                        <button onClick={() => handleEdit(item)} className="px-3 py-2 bg-gray-50 text-cyan-600 rounded-lg text-lg hover:bg-cyan-50" title="Edit">✎</button>
                        {onDelete && <button onClick={() => onDelete(item.id)} className="px-3 py-2 bg-gray-50 text-red-400 rounded-lg text-lg hover:bg-red-50 hover:text-red-500" title="Delete">🗑</button>}
                    </div>
                </div>
             ))}
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
             <h4 className="font-black text-gray-900 text-sm uppercase tracking-widest mb-4">Stock Alerts</h4>
             <ul className="space-y-3">
                <li className="flex items-center gap-3 text-xs font-bold text-gray-600">
                   <span className="w-2 h-2 rounded-full bg-red-500"></span>
                   NY Hub showing surplus of raw cotton.
                </li>
                <li className="flex items-center gap-3 text-xs font-bold text-gray-600">
                   <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                   London Hub running low on packaging tape.
                </li>
             </ul>
          </div>
          <div className="bg-cyan-50 p-6 rounded-2xl border border-cyan-100 flex items-center justify-between">
             <div>
                <h4 className="font-black text-cyan-900 text-lg">Auto-Balancing</h4>
                <p className="text-xs font-bold text-cyan-700 mt-1">Algorithm is active.</p>
             </div>
             <div className="w-12 h-6 bg-cyan-200 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-cyan-600 rounded-full shadow-sm"></div>
             </div>
          </div>
       </div>
       
       <InventoryModal 
          isOpen={isModalOpen}
          mode={modalMode}
          item={currentItem}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
       />

       <TransferModal 
          isOpen={isTransferModalOpen}
          item={transferItem}
          onClose={() => setIsTransferModalOpen(false)}
          onSubmit={handleTransferSubmit}
       />
    </div>
  );
}
