import { useState } from 'react';
import WarehouseZoneModal from './WarehouseZoneModal';
import EquipmentModal from './EquipmentModal';

export default function Warehousing({ items, onAdd, onUpdate, onDelete, fleet, onUpdateFleet }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFleetModalOpen, setIsFleetModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentZone, setCurrentZone] = useState(null);

  const handleEdit = (zone) => {
      setCurrentZone(zone);
      setModalMode('edit');
      setIsModalOpen(true);
  };

  const handleCreate = () => {
      setCurrentZone(null);
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
  
  const handleFleetSubmit = (data) => {
      if (onUpdateFleet) {
          onUpdateFleet(data.type, data.count);
      }
  };
  
  // Fleet fallback
  const currentFleet = fleet || { forklifts: 12, palletJacks: 4 };

  // Fallback
  const displayItems = items || [
      { id: "WH-A1", location: "Zone A", capacity: "85%", status: "Operational" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
       <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
             <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-black text-gray-900">Zone Utilization</h3>
                 <button 
                    onClick={handleCreate}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all"
                 >
                    + Add Zone
                 </button>
             </div>
              <div className="space-y-4">
                 {displayItems.filter(z => z.name || z.location || z.zone).map((z, i) => (
                    <div key={i} className="group">
                       <div className="flex justify-between mb-2">
                          <span className="text-xs font-bold text-gray-700">{z.name || z.location || z.zone || `Zone ${i+1}`}</span>
                          <span className="text-xs font-black text-gray-900">{parseFloat(z.capacity || z.use || 0).toFixed(0)}%</span>
                       </div>
                       <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mt-1">
                          <div className={`h-full bg-cyan-500`} style={{ width: `${parseFloat(z.capacity || z.use || 0)}%` }}></div>
                       </div>
                       <div className="flex gap-2 justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => handleEdit(z)} className="text-[10px] font-black text-cyan-600 uppercase tracking-widest hover:underline">Edit</button>
                             {onDelete && <button onClick={() => onDelete(z.id)} className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-600">Delete</button>}
                       </div>
                    </div>
                 ))}
              </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-2xl">🚜</div>
                <div>
                   <h4 className="font-black text-gray-900">Equipment Fleet</h4>
                   <p className="text-xs text-gray-400 font-bold mt-1">{currentFleet.forklifts} Forklifts • {currentFleet.palletJacks} Pallet Jacks</p>
                </div>
             </div>
             <button 
                onClick={() => setIsFleetModalOpen(true)}
                className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
              >
                Manage
              </button>
           </div>

       </div>

       <WarehouseZoneModal 
          isOpen={isModalOpen}
          mode={modalMode}
          zone={currentZone}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
       />
       
       <EquipmentModal
          isOpen={isFleetModalOpen}
          onClose={() => setIsFleetModalOpen(false)}
          onSubmit={handleFleetSubmit}
       />
    </div>
  );
}
