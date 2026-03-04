import { useInventory } from "../../context/InventoryContext";
import { useState } from "react";

export default function Assemblies() {
  const {
    assemblies,
    createAssembly,
    buildAssembly,
    warehouses,
    items,
    loading,
    error,
    clearError,
  } = useInventory();
  const [showBuildModal, setShowBuildModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAssembly, setSelectedAssembly] = useState(null);

  // Create Modal State
  const [newAsm, setNewAsm] = useState({
    name: "",
    finished_item_id: items[0]?.id || "",
    items: [{ component_item_id: items[0]?.id || "", quantity: 1 }],
  });

  const [buildData, setBuildData] = useState({
    quantity: 1,
    warehouse_id: warehouses[0]?.id || 1,
  });

  const handleStartBuild = (asm) => {
    setSelectedAssembly(asm);
    setBuildData({ ...buildData, warehouse_id: warehouses[0]?.id || 1 });
    clearError();
    setShowBuildModal(true);
  };

  const handleAddComponent = () => {
    setNewAsm({
      ...newAsm,
      items: [
        ...newAsm.items,
        { component_item_id: items[0]?.id || "", quantity: 1 },
      ],
    });
  };

  const handleRemoveComponent = (index) => {
    const updated = newAsm.items.filter((_, i) => i !== index);
    setNewAsm({ ...newAsm, items: updated });
  };

  const executeCreate = async () => {
    try {
      await createAssembly(newAsm);
      setShowCreateModal(false);
      setNewAsm({
        name: "",
        finished_item_id: items[0]?.id || "",
        items: [{ component_item_id: items[0]?.id || "", quantity: 1 }],
      });
    } catch (e) {
      console.error(e);
    }
  };

  const executeBuild = async () => {
    try {
      await buildAssembly({
        assembly_id: selectedAssembly.id,
        quantity: parseFloat(buildData.quantity),
        warehouse_id: parseInt(buildData.warehouse_id),
      });
      setShowBuildModal(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-[#111827] tracking-tighter text-left uppercase">
            Master Templates
          </h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 text-left">
            <span className="w-2 h-2 rounded-full bg-[#195bac]"></span>
            Composite items and assembly instructions
          </p>
        </div>
        <button
          onClick={() => {
            clearError();
            setShowCreateModal(true);
          }}
          className="bg-[#111827] text-white px-8 py-4 rounded-[20px] text-[11px] font-black uppercase tracking-[0.15em] shadow-xl transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            viewBox="0 0 24 24"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Create Assembly
        </button>
      </div>

      {!loading && assemblies.length === 0 && (
        <div className="bg-white/50 border-2 border-dashed border-gray-200 rounded-[40px] p-20 text-center space-y-4">
          <div className="text-4xl mb-4">🛠️</div>
          <h3 className="text-xl font-black text-gray-900 uppercase">
            No Assemblies Found
          </h3>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            Create a record or run seeds to begin production
          </p>
          <button
            onClick={() => {
              clearError();
              setShowCreateModal(true);
            }}
            className="mt-4 bg-[#195bac] text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
          >
            Define First Assembly
          </button>
        </div>
      )}

      {/* Existing List Rendering */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {assemblies.map((asm) => (
          <div
            key={asm.id}
            className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-xl transition-all"
          >
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30 text-left">
              <div className="text-left">
                <span className="text-[10px] font-black text-[#195bac] uppercase tracking-widest text-left">
                  ASM-{String(asm.id).padStart(3, "0")}
                </span>
                <h3 className="text-xl font-black text-[#111827] mt-1 text-left">
                  {asm.name}
                </h3>
              </div>
              <span
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600`}
              >
                READY
              </span>
            </div>
            <div className="p-8 flex-1 text-left">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 text-left">
                Components required
              </p>
              <div className="flex flex-wrap gap-2 mb-8 justify-start">
                {asm.bom_items?.map((bom) => (
                  <span
                    key={bom.id}
                    className="px-3 py-1.5 bg-gray-100 rounded-xl text-[11px] font-bold text-gray-600"
                  >
                    {bom.component_item?.sku ||
                      `Item #${bom.component_item_id}`}{" "}
                    ({bom.quantity}x)
                  </span>
                )) || (
                  <p className="text-xs text-gray-400 italic">
                    No components defined
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto text-left">
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">
                    Finished Good
                  </span>
                  <span className="text-lg font-black text-[#111827] text-left">
                    {asm.finished_item?.name || `Item #${asm.finished_item_id}`}
                  </span>
                </div>
                <button
                  onClick={() => handleStartBuild(asm)}
                  className="bg-[#195bac] text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20 transition-all"
                >
                  Start Build
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-xl z-[9999] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
          <div className="bg-white rounded-[48px] shadow-2xl w-full max-w-2xl overflow-y-auto max-h-[90vh] border border-white p-12 text-left">
            <h2 className="text-2xl font-black text-[#111827] tracking-tighter mb-8 text-left uppercase">
              Create Assembly Template
            </h2>
            <div className="space-y-6">
              {error && (
                <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 animate-in shake duration-300">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                  <span className="text-[11px] font-black text-rose-600 uppercase tracking-widest">
                    {error}
                  </span>
                </div>
              )}
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1 text-left">
                  Template Name
                </label>
                <input
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-black text-gray-900 outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                  value={newAsm.name}
                  onChange={(e) =>
                    setNewAsm({ ...newAsm, name: e.target.value })
                  }
                  placeholder="e.g. PC Workstation v1"
                />
              </div>
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1 text-left">
                  Finished Product
                </label>
                <select
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-black text-gray-900 outline-none focus:ring-4 focus:ring-blue-100 transition-all appearance-none"
                  value={newAsm.finished_item_id}
                  onChange={(e) =>
                    setNewAsm({ ...newAsm, finished_item_id: e.target.value })
                  }
                >
                  {items.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name} ({i.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1 text-left">
                    Bill of Materials (BOM)
                  </label>
                  <button
                    onClick={handleAddComponent}
                    className="text-[10px] font-black text-[#195bac] uppercase tracking-widest"
                  >
                    + Add Component
                  </button>
                </div>
                {newAsm.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 items-center animate-in slide-in-from-left-2 duration-300"
                  >
                    <select
                      className="flex-3 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 outline-none"
                      value={item.component_item_id}
                      onChange={(e) => {
                        const updated = [...newAsm.items];
                        updated[idx].component_item_id = e.target.value;
                        setNewAsm({ ...newAsm, items: updated });
                      }}
                    >
                      {items.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.sku}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 outline-none w-20"
                      value={item.quantity}
                      onChange={(e) => {
                        const updated = [...newAsm.items];
                        updated[idx].quantity = e.target.value;
                        setNewAsm({ ...newAsm, items: updated });
                      }}
                    />
                    <button
                      onClick={() => handleRemoveComponent(idx)}
                      className="text-rose-500 hover:scale-110 transition-all font-bold p-2"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-6 flex gap-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-8 py-4 bg-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={executeCreate}
                  disabled={loading}
                  className="flex-2 px-8 py-4 bg-[#111827] rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0"
                >
                  {loading ? "Saving..." : "Save Template"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BUILD MODAL */}
      {showBuildModal && (
        <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-xl z-[9999] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
          <div className="bg-white rounded-[48px] shadow-2xl w-full max-w-md overflow-hidden border border-white p-12 text-left">
            <h2 className="text-2xl font-black text-[#111827] tracking-tighter mb-8 text-left uppercase">
              Build Assembly
            </h2>
            <div className="space-y-6">
              {error && (
                <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 animate-in shake duration-300">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                  <span className="text-[11px] font-black text-rose-600 uppercase tracking-widest">
                    {error}
                  </span>
                </div>
              )}
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1 text-left">
                  Quantity to Build
                </label>
                <input
                  type="number"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-black text-gray-900 outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                  value={buildData.quantity}
                  onChange={(e) =>
                    setBuildData({ ...buildData, quantity: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1 text-left">
                  Source Warehouse
                </label>
                <select
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-black text-gray-900 outline-none focus:ring-4 focus:ring-blue-100 transition-all appearance-none"
                  value={buildData.warehouse_id}
                  onChange={(e) =>
                    setBuildData({ ...buildData, warehouse_id: e.target.value })
                  }
                >
                  {warehouses.map((wh) => (
                    <option key={wh.id} value={wh.id}>
                      {wh.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pt-6 flex gap-4">
                <button
                  onClick={() => setShowBuildModal(false)}
                  className="flex-1 px-8 py-4 bg-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={executeBuild}
                  disabled={loading}
                  className="flex-2 px-8 py-4 bg-[#111827] rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0"
                >
                  {loading ? "Processing..." : "Execute Build"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
