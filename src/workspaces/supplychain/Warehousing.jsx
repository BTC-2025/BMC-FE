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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
       {/* 3D Warehouse Map Placeholder */}
       <div className="bg-gray-900 rounded-3xl p-8 min-h-[400px] flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500 via-transparent to-transparent"></div>
          <span className="text-6xl mb-6">🏗️</span>
          <h3 className="text-2xl font-black text-white mb-2">Facility Digital Twin</h3>
          <p className="text-sm text-gray-400 max-w-xs mx-auto mb-8">Visualization of rack occupancy and forklift telemetry required.</p>
          <button className="px-6 py-3 border border-white/20 rounded-xl text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Launch Viewer</button>
       </div>

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
                {displayItems.map((z, i) => (
                   <div key={i} className="group">
                      <div className="flex justify-between mb-2">
                         <span className="text-xs font-bold text-gray-700">{z.location || z.zone}</span>
                         <span className="text-xs font-black text-gray-900">{parseFloat(z.capacity) || z.use}%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mt-1">
                         <div className={`h-full bg-cyan-500`} style={{ width: `${parseFloat(z.capacity) || z.use}%` }}></div>
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
