import { useState } from 'react';
import EditShipmentModal from './EditShipmentModal';

export default function Logistics({ routes, onUpdate, onDelete }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState(null);

  const handleEdit = (route) => {
      setCurrentRoute(route);
      setIsEditModalOpen(true);
  };

  const handleUpdate = (updatedRoute) => {
      onUpdate(updatedRoute.id, updatedRoute);
  };

  // Fallback
  const displayRoutes = routes || [
    { id: "RTE-101", origin: "Hamburg", dest: "New York", method: "Sea", eta: "4 Days", status: "On Time" },
    { id: "RTE-104", origin: "Shanghai", dest: "Los Angeles", method: "Air", eta: "12 Hours", status: "Delayed" },
    { id: "RTE-202", origin: "Texas Hub", dest: "Mexico City", method: "Road", eta: "2 Days", status: "On Time" },
  ];

  return (
    <div className="space-y-8">
       <div className="bg-[#f8fafc] border border-gray-200 rounded-2xl p-1 overflow-hidden">
          <table className="w-full text-left">
             <thead className="bg-[#f1f5f9]">
                <tr>
                   <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Route ID</th>
                   <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Origin ➔ Destination</th>
                   <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Method</th>
                   <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">ETA</th>
                   <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</th>
                   <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-200 bg-white">
                {displayRoutes.map(r => (
                   <tr key={r.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4 font-black text-gray-900">{r.id}</td>
                      <td className="px-6 py-4 font-bold text-gray-600">{r.origin} <span className="text-gray-300 mx-2">➔</span> {r.dest}</td>
                      <td className="px-6 py-4 text-2xl">{r.method === 'Sea' ? '🚢' : r.method === 'Air' ? '✈️' : '🚛'}</td>
                      <td className="px-6 py-4 font-bold text-gray-800">{r.eta}</td>
                      <td className="px-6 py-4">
                         <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest
                            ${r.status === 'On Time' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                            {r.status}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                          <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleEdit(r)} className="px-3 py-1 bg-gray-50 text-cyan-600 rounded text-[10px] font-black uppercase tracking-widest hover:bg-cyan-50">Edit</button>
                              {onDelete && <button onClick={() => onDelete(r.id)} className="px-3 py-1 bg-gray-50 text-red-400 rounded text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500">Delete</button>}
                          </div>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-4">
             <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-black text-xl">14</div>
             <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Fleet</p>
                <p className="text-sm font-bold text-gray-900">Trucks & Vans</p>
             </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-4">
             <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 font-black text-xl">$12k</div>
             <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Freight Cost</p>
                <p className="text-sm font-bold text-gray-900">This Month</p>
             </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-4">
             <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 font-black text-xl">99%</div>
             <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Delivery Success</p>
                <p className="text-sm font-bold text-gray-900">Last 30 Days</p>
             </div>
          </div>
       </div>

       <EditShipmentModal 
          isOpen={isEditModalOpen}
          route={currentRoute}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleUpdate}
       />
    </div>
  );
}
