import { useState, useEffect } from "react";
import scmApi from "../../services/scmApi";
import ShipmentModal from "./ShipmentModal";

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const response = await scmApi.getShipments();
      setPackages(response.data);
    } catch (error) {
      console.error("Failed to fetch shipments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const handleInitialize = async (data) => {
    try {
      await scmApi.createShipment(data);
      setIsModalOpen(false);
      fetchShipments();
    } catch (error) {
      console.error("Failed to initialize shipment:", error);
      alert("Error initializing shipment. Please check your permissions.");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'SHIPPED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'PACKED': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'IN_TRANSIT': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const getStatusBarColor = (status) => {
    switch (status) {
      case 'SHIPPED': return 'bg-emerald-500';
      case 'PACKED': return 'bg-blue-500';
      case 'IN_TRANSIT': return 'bg-amber-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      
      {/* Header & Section Brief */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1">
            <h2 className="text-4xl font-black text-[#111827] tracking-tighter leading-none">Shipping & <span className="text-[#195bac]">Fulfillment</span></h2>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                Logistics Orchestration & Unit Tracking
            </p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#111827] text-white px-8 py-4 rounded-[24px] text-[11px] font-black uppercase tracking-[0.15em] shadow-xl transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3"
        >
            <span className="text-xl leading-none">+</span>
            Initialize Shipment
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
             <div className="w-12 h-12 border-4 border-[#195bac]/20 border-t-[#195bac] rounded-full animate-spin"></div>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Synchronizing Logistics Data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div key={pkg.id} className="group bg-white rounded-[40px] border border-gray-100 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] transition-all duration-700 overflow-hidden relative flex flex-col min-h-[300px]">
              {/* Status Bar */}
              <div className={`h-1.5 w-full ${getStatusBarColor(pkg.status)}`}></div>

              <div className="p-10 flex-1 flex flex-col justify-between">
                  <div>
                      <div className="flex justify-between items-start mb-8">
                          <div className="w-16 h-16 bg-gray-50 rounded-[24px] flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-500 shadow-sm border border-gray-100">
                              {pkg.carrier.includes('FedEx') ? '📦' : pkg.carrier.includes('UPS') ? '🚛' : '✈️'}
                          </div>
                          <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(pkg.status)}`}>
                              {pkg.status}
                          </span>
                      </div>

                      <h3 className="text-2xl font-black text-[#111827] tracking-tighter mb-1">{pkg.tracking_number}</h3>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-4">Linked to Origin Code: <span className="text-[#195bac]">{pkg.origin_code}</span></p>
                      
                      <div className="space-y-4">
                          <div className="flex items-center justify-between py-2 border-b border-gray-50">
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Network Carrier</span>
                              <span className="text-xs font-black text-[#111827]">{pkg.carrier}</span>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b border-gray-50">
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Initialization Date</span>
                              <span className="text-xs font-black text-[#111827]">{new Date(pkg.created_at).toLocaleDateString()}</span>
                          </div>
                      </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-between">
                      <button className="text-[10px] font-black text-[#111827] uppercase tracking-widest hover:text-[#195bac] transition-colors flex items-center gap-2">
                          View Analytics
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      </button>
                      <div className="flex -space-x-2">
                          {[1,2,3].map(i => (
                              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100"></div>
                          ))}
                      </div>
                  </div>
              </div>
              
              <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-blue-50/50 rounded-full group-hover:scale-150 transition-transform duration-1000 pointer-events-none"></div>
            </div>
          ))}

          {/* New Unit Placeholder */}
          <div 
            onClick={() => setIsModalOpen(true)}
            className="rounded-[40px] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center p-12 hover:border-[#195bac]/40 hover:bg-blue-50/5 transition-all cursor-pointer min-h-[300px] group"
          >
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-[#195bac] group-hover:text-white transition-all shadow-sm border border-gray-100">
                  <span className="text-3xl leading-none font-light">+</span>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Deploy Fulfillment Unit</p>
          </div>
        </div>
      )}

      <ShipmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleInitialize}
      />
    </div>
  );
}
