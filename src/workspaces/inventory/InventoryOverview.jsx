import { useState, useEffect } from "react";
import { useInventory } from "../../context/InventoryContext";
import {
  Skeleton,
  TableSkeleton,
  CardSkeleton,
} from "../../components/ui/Skeleton";
import {
  TransitionWrapper,
  FadeIn,
} from "../../components/ui/TransitionWrapper";
import { simulateNetworkRequest } from "../../data/mockData";
import { formatNumber } from "../../utils/formatters";
import BaseModal from "../../components/ui/BaseModal";

export default function InventoryOverview({ onSelectView }) {
  const {
    stats,
    transactions,
    deleteTransaction,
    updateTransaction,
    moveStock,
    transferStock,
    items,
    warehouses,
  } = useInventory();
  const [editingLog, setEditingLog] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);

  const [transferForm, setTransferForm] = useState({
    item_id: "",
    from_warehouse_id: "",
    to_warehouse_id: "",
    quantity: 0,
    reference: "",
  });
  const [adjustForm, setAdjustForm] = useState({
    item_id: "",
    warehouse_id: "",
    quantity: 0,
    reference: "",
    type: "Stock In",
  });

  const cards = [
    {
      id: "valuation",
      label: "Inventory Valuation",
      value: `$${formatNumber(stats.stockValue)}`,
      icon: "💎",
      color: "bg-blue-500/10 text-blue-600",
      trend: "+12% vs last month",
    },
    {
      id: "products",
      label: "Active SKUs",
      value: formatNumber(stats.totalProducts),
      icon: "📦",
      color: "bg-emerald-500/10 text-emerald-600",
      trend: "Operational",
    },
    {
      id: "low_stock",
      label: "Low Stock Alerts",
      value: stats.lowStockItems,
      icon: "⚠️",
      color: "bg-amber-500/10 text-amber-600",
      trend: "Action Required",
    },
    {
      id: "out_of_stock",
      label: "Stock Outs",
      value: stats.outOfStock,
      icon: "🚫",
      color: "bg-rose-500/10 text-rose-600",
      trend: "Critical Level",
    },
  ];

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      await transferStock(transferForm);
      setShowTransferModal(false);
      setTransferForm({
        item_id: "",
        from_warehouse_id: "",
        to_warehouse_id: "",
        quantity: 0,
        reference: "",
      });
    } catch (err) {
      alert("Transfer failed: " + err.message);
    }
  };

  const handleAdjust = async (e) => {
    e.preventDefault();
    try {
      const qty =
        adjustForm.type === "Stock Out"
          ? -Math.abs(adjustForm.quantity)
          : Math.abs(adjustForm.quantity);
      await moveStock({ ...adjustForm, quantity: qty });
      setShowAdjustModal(false);
      setAdjustForm({
        item_id: "",
        warehouse_id: "",
        quantity: 0,
        reference: "",
        type: "Stock In",
      });
    } catch (err) {
      alert("Adjustment failed: " + err.message);
    }
  };

  const isVisible = true; // Simplified for new logic
  const [loading, setLoading] = useState(false); // Simplified for new logic

  useEffect(() => {
    // Initial data is already fetched by InventoryProvider
  }, [stats]);

  // Dynamic Node Health Calculation
  const nodeHealth = warehouses
    .map((wh) => {
      // Calculate how many unique items are in this warehouse based on transaction ledger
      const itemsInWh = new Set(
        transactions
          .filter((t) => t.warehouse === wh.name)
          .map((t) => t.product),
      );
      const whStockCount = itemsInWh.size;

      // Health is % of total catalog items present in this node
      const healthVal = Math.min(
        100,
        Math.floor((whStockCount / (items.length || 1)) * 100),
      );

      let color = "bg-[#195bac]";
      if (healthVal < 20) color = "bg-rose-500";
      else if (healthVal < 50) color = "bg-amber-400";
      else color = "bg-emerald-500";

      return {
        label: wh.name,
        val: healthVal,
        color: color,
      };
    })
    .slice(0, 3); // Top 3 nodes

  if (nodeHealth.length === 0) {
    nodeHealth.push({ label: "Primary Node", val: 0, color: "bg-gray-400" });
  }

  const startEdit = (mov) => {
    setEditingLog(mov.id);
    setEditForm({ ...mov });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    updateTransaction(editingLog, editForm);
    setEditingLog(null);
  };

  if (loading) {
    return (
      <div className="p-8 md:p-12 max-w-[1700px] mx-auto space-y-12 text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-8">
            <TableSkeleton rows={6} cols={5} />
          </div>
          <div className="space-y-10">
            <Skeleton className="h-[500px] w-full rounded-[60px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <TransitionWrapper className="p-8 md:p-12 max-w-[1700px] mx-auto space-y-12 relative text-left">
      <div className="flex items-center justify-between gap-10">
        <div className="flex-1 text-left space-y-4">
          <h1 className="text-6xl font-[1000] text-[#111827] tracking-[ -0.05em] leading-[0.9]">
            Autonomous <span className="text-[#195bac]">Intelligence</span>
          </h1>
          <p className="text-[14px] font-[1000] text-gray-400 uppercase tracking-[0.4em] flex items-center gap-4">
            <span className="w-12 h-[1px] bg-gray-200"></span>
            Real-Time Inventory Synchronization Terminal
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowTransferModal(true)}
            className="bg-white border border-gray-100 px-8 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3 active:scale-95"
          >
            <span className="text-xl">🔄</span> Stock Transfer
          </button>
          <button
            onClick={() => setShowAdjustModal(true)}
            className="bg-[#111827] text-white px-8 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-black hover:-translate-y-1 transition-all flex items-center gap-3 active:scale-95"
          >
            <span className="text-xl">⚙️</span> Adjust Stock
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {cards.map((card, i) => (
          <div
            key={i}
            onClick={() => onSelectView?.(card.id)}
            className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-[#195bac]/5 transition-all duration-700 group relative overflow-hidden flex flex-col gap-8 min-h-[220px] text-left cursor-pointer"
          >
            <div className="flex justify-between items-start relative z-10">
              <div
                className={`w-16 h-16 rounded-[24px] ${card.color} flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-sm border border-black/5`}
              >
                {card.icon}
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black bg-gray-50 text-gray-400 px-3 py-1.5 rounded-xl border border-gray-100 uppercase tracking-widest">
                  {card.trend}
                </span>
              </div>
            </div>
            <div className="relative z-10 text-left">
              <p className="text-4xl font-[1000] text-[#111827] mb-1.5 tracking-tighter tabular-nums">
                {card.value}
              </p>
              <p className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-[0.25em]">
                {card.label}
              </p>
            </div>
            <div className="absolute -right-12 -bottom-12 w-40 h-40 rounded-full bg-[#195bac]/[0.02] group-hover:scale-150 transition-transform duration-1000"></div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
        {/* Activity Ledger in Golden Ratio Container */}
        <div className="lg:col-span-2 space-y-8 text-left h-full">
          <div className="flex items-center justify-between px-6">
            <div className="text-left">
              <h3 className="font-[1000] text-[#111827] text-2xl tracking-tighter flex items-center gap-4">
                Terminal Activity
                <div className="flex gap-1.5 items-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse"></span>
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                    Active Sync
                  </span>
                </div>
              </h3>
            </div>
            <button
              onClick={() => onSelectView?.("audit_log")}
              className="px-8 py-4 bg-white border border-gray-100 text-[10px] font-black text-[#195bac] uppercase tracking-[0.2em] rounded-[22px] hover:bg-[#e9f4ff] transition-all shadow-sm flex items-center gap-3 border-transparent hover:border-[#195bac]/20"
            >
              Interactive Ledger
              <span className="text-lg">→</span>
            </button>
          </div>

          <div
            onClick={() => onSelectView?.("audit_log")}
            className="bg-white rounded-[56px] border border-gray-100 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.06)] flex flex-col p-8 overflow-hidden relative group cursor-pointer min-h-[500px]"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#195bac]/40 to-transparent"></div>

            <div className="flex-1 w-full overflow-hidden">
              <table className="w-full h-full text-left">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="px-6 py-8 text-[11px] font-black text-[#9CA3AF] uppercase tracking-[0.3em] text-left">
                      Hash ID
                    </th>
                    <th className="px-6 py-8 text-[11px] font-black text-[#9CA3AF] uppercase tracking-[0.3em] text-left">
                      Operation Type
                    </th>
                    <th className="px-6 py-8 text-[11px] font-black text-[#9CA3AF] uppercase tracking-[0.3em] text-left">
                      Asset Unit
                    </th>
                    <th className="px-6 py-8 text-[11px] font-black text-[#9CA3AF] uppercase tracking-[0.3em] text-left">
                      Delta
                    </th>
                    <th className="px-6 py-8 text-right text-[11px] font-black text-[#9CA3AF] uppercase tracking-[0.3em]">
                      Temporal
                    </th>
                  </tr>
                </thead>
                <tbody className="text-left divide-y divide-gray-50/50">
                  {(transactions || []).slice(0, 5).map((mov, i) => (
                    <tr
                      key={mov.id}
                      className="hover:bg-[#195bac]/[0.02] transition-all duration-500 group/row cursor-default"
                    >
                      <td className="px-6 py-7">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[12px] font-[900] text-[#1E293B] tabular-nums tracking-tighter">
                            #{String(mov.id).padStart(6, "0")}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-7">
                        <div className="flex flex-col">
                          <span
                            className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm border w-fit
                                                ${mov.type === "Stock In" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"}`}
                          >
                            {mov.type}
                          </span>
                          <span className="text-[10px] font-black text-gray-400 mt-1 uppercase tracking-tighter">
                            {mov.ref_type || "GENERAL"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-7 text-left">
                        <p className="text-[14px] font-[1000] text-[#111827] tracking-tighter truncate">
                          {mov.product}
                        </p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                          {mov.warehouse}
                        </p>
                      </td>
                      <td
                        className={`px-6 py-7 font-black text-2xl tabular-nums ${mov.type === "Stock In" ? "text-emerald-500" : "text-rose-500"}`}
                      >
                        {mov.type === "Stock In" ? "+" : "-"}
                        {mov.qty}
                      </td>
                      <td className="px-6 py-7 text-right">
                        <p className="font-mono text-[12px] font-black text-gray-400 tabular-nums">
                          {mov.date}
                        </p>
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                          SYNCHRONIZED
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white via-white/60 to-transparent pointer-events-none"></div>
          </div>
        </div>

        {/* Visual Health Summary */}
        <div className="space-y-10 text-left h-full">
          <h3 className="font-[1000] text-[#111827] text-2xl tracking-tighter px-4">
            Node Health
          </h3>
          <div
            onClick={() => onSelectView?.("warehouses")}
            className="bg-[#111827] text-white p-12 rounded-[60px] shadow-2xl space-y-12 flex flex-col justify-between relative overflow-hidden group border border-white/5 min-h-[500px] cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/20 transition-all duration-1000"></div>

            <div className="relative z-10 text-left">
              <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-4 leading-none">
                Global Sync Status
              </h4>
              <h4 className="text-2xl font-[1000] tracking-tighter mb-4">
                Stock Saturation
              </h4>
              <p className="text-[11px] font-[900] text-gray-500 max-w-[200px] leading-relaxed uppercase tracking-[0.1em]">
                Real-time allocation across primary hub nodes.
              </p>
            </div>

            <div className="space-y-8 relative z-10">
              {nodeHealth.map((w, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-white transition-colors">
                      {w.label}
                    </span>
                    <span className="text-lg font-[1000] text-white tabular-nums">
                      {w.val}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <div
                      className={`h-full ${w.color} transition-all duration-[2.5s] ease-out rounded-full shadow-lg`}
                      style={{ width: `${isVisible ? w.val : 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-10 border-t border-white/5 relative z-10 flex items-center justify-between">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">
                Aggregate Integrity
              </p>
              <span className="text-sm font-[1000] text-emerald-400">
                98.2%
              </span>
            </div>
          </div>
        </div>
      </div>

      <BaseModal
        isOpen={!!editingLog}
        onClose={() => setEditingLog(null)}
        className="max-w-xl"
      >
        <div className="p-12 border-b border-gray-100 flex justify-between items-center text-left">
          <div>
            <p className="text-[10px] font-black text-[#195bac] uppercase tracking-[0.3em] mb-2 leading-none">
              Security Override
            </p>
            <h2 className="text-3xl font-[1000] text-[#111827] tracking-tighter leading-none">
              Correct Log
            </h2>
          </div>
          <button
            onClick={() => setEditingLog(null)}
            className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center text-xl hover:bg-rose-50 hover:text-rose-500 transition-all"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleUpdate} className="p-12 space-y-10 text-left">
          <div className="space-y-4">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">
              Correction Magnitude
            </label>
            <input
              type="number"
              className="w-full bg-gray-50 border border-gray-100 rounded-3xl px-8 py-6 text-4xl font-[1000] text-[#111827] outline-none focus:ring-8 focus:ring-[#195bac]/10 focus:bg-white transition-all tabular-nums"
              value={editForm?.qty || 0}
              onChange={(e) =>
                setEditForm({ ...editForm, qty: Number(e.target.value) })
              }
              required
            />
          </div>
          <div className="pt-8 flex gap-4">
            <button
              type="button"
              onClick={() => setEditingLog(null)}
              className="flex-1 py-6 rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-gray-900 transition-all"
            >
              Abort
            </button>
            <button
              type="submit"
              className="flex-[2] bg-[#111827] text-white py-6 rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-black transition-all"
            >
              Authorize Correction
            </button>
          </div>
        </form>
      </BaseModal>

      {/* Transfer Modal */}
      <BaseModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        className="max-w-2xl"
      >
        <div className="p-10 border-b border-gray-100 flex items-center justify-between text-left">
          <div>
            <h2 className="text-3xl font-[1000] text-[#111827] tracking-tighter">
              Logistics Transfer
            </h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">
              Inter-Node Asset Relocation
            </p>
          </div>
          <button
            onClick={() => setShowTransferModal(false)}
            className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-xl hover:bg-rose-50 hover:text-rose-500 transition-all font-black"
          >
            ✕
          </button>
        </div>
        <form
          onSubmit={handleTransfer}
          className="p-10 space-y-8 text-left bg-white"
        >
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
              Primary Asset
            </label>
            <select
              className="w-full bg-gray-50 border border-gray-100 rounded-[24px] px-8 py-5 text-sm font-black text-[#1E293B] appearance-none"
              value={transferForm.item_id}
              onChange={(e) =>
                setTransferForm({ ...transferForm, item_id: e.target.value })
              }
              required
            >
              <option value="">Select Item to Transfer</option>
              {items.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name} ({i.sku})
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                Origin Node
              </label>
              <select
                className="w-full bg-gray-50 border border-gray-100 rounded-[24px] px-8 py-5 text-sm font-black text-[#1E293B]"
                value={transferForm.from_warehouse_id}
                onChange={(e) =>
                  setTransferForm({
                    ...transferForm,
                    from_warehouse_id: e.target.value,
                  })
                }
                required
              >
                <option value="">Source</option>
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                Destination Node
              </label>
              <select
                className="w-full bg-gray-50 border border-gray-100 rounded-[24px] px-8 py-5 text-sm font-black text-[#1E293B]"
                value={transferForm.to_warehouse_id}
                onChange={(e) =>
                  setTransferForm({
                    ...transferForm,
                    to_warehouse_id: e.target.value,
                  })
                }
                required
              >
                <option value="">Target</option>
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                Magnitude
              </label>
              <input
                type="number"
                className="w-full bg-gray-50 border border-gray-100 rounded-[24px] px-8 py-5 text-xl font-black text-[#1E293B]"
                value={transferForm.quantity}
                onChange={(e) =>
                  setTransferForm({
                    ...transferForm,
                    quantity: Number(e.target.value),
                  })
                }
                required
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                Reference Hash
              </label>
              <input
                className="w-full bg-gray-50 border border-gray-100 rounded-[24px] px-8 py-5 text-sm font-black text-[#1E293B]"
                placeholder="TRF-XXXX"
                value={transferForm.reference}
                onChange={(e) =>
                  setTransferForm({
                    ...transferForm,
                    reference: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-[#111827] text-white py-6 rounded-[28px] text-[11px] font-black uppercase tracking-[0.25em] shadow-2xl hover:bg-black transition-all"
          >
            Execute Transfer Protocol
          </button>
        </form>
      </BaseModal>

      {/* Adjust Modal */}
      <BaseModal
        isOpen={showAdjustModal}
        onClose={() => setShowAdjustModal(false)}
        className="max-w-xl"
      >
        <div className="p-10 border-b border-gray-100 flex items-center justify-between text-left">
          <div>
            <h2 className="text-3xl font-[1000] text-[#111827] tracking-tighter">
              Manual Adjustment
            </h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">
              Inventory Delta Correction
            </p>
          </div>
          <button
            onClick={() => setShowAdjustModal(false)}
            className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-xl hover:bg-rose-50 hover:text-rose-500 transition-all font-black"
          >
            ✕
          </button>
        </div>
        <form
          onSubmit={handleAdjust}
          className="p-10 space-y-8 text-left bg-white"
        >
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                Operation Vector
              </label>
              <select
                className="w-full bg-gray-50 border border-gray-100 rounded-[24px] px-8 py-5 text-sm font-black text-[#1E293B]"
                value={adjustForm.type}
                onChange={(e) =>
                  setAdjustForm({ ...adjustForm, type: e.target.value })
                }
              >
                <option>Stock In</option>
                <option>Stock Out</option>
              </select>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                Primary Node
              </label>
              <select
                className="w-full bg-gray-50 border border-gray-100 rounded-[24px] px-8 py-5 text-sm font-black text-[#1E293B]"
                value={adjustForm.warehouse_id}
                onChange={(e) =>
                  setAdjustForm({ ...adjustForm, warehouse_id: e.target.value })
                }
                required
              >
                <option value="">Select Warehouse</option>
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
              Target Resource
            </label>
            <select
              className="w-full bg-gray-50 border border-gray-100 rounded-[24px] px-8 py-5 text-sm font-black text-[#1E293B]"
              value={adjustForm.item_id}
              onChange={(e) =>
                setAdjustForm({ ...adjustForm, item_id: e.target.value })
              }
              required
            >
              <option value="">Select Item</option>
              {items.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name} ({i.sku})
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                Delta Magnitude
              </label>
              <input
                type="number"
                className="w-full bg-gray-50 border border-gray-100 rounded-[24px] px-8 py-5 text-xl font-black text-[#1E293B]"
                value={adjustForm.quantity}
                onChange={(e) =>
                  setAdjustForm({
                    ...adjustForm,
                    quantity: Number(e.target.value),
                  })
                }
                required
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                Reference
              </label>
              <input
                className="w-full bg-gray-50 border border-gray-100 rounded-[24px] px-8 py-5 text-sm font-black text-[#1E293B]"
                placeholder="ADJ-XXXX"
                value={adjustForm.reference}
                onChange={(e) =>
                  setAdjustForm({ ...adjustForm, reference: e.target.value })
                }
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-[#111827] text-white py-6 rounded-[28px] text-[11px] font-black uppercase tracking-[0.25em] shadow-2xl hover:bg-black transition-all"
          >
            Synchronize Delta
          </button>
        </form>
      </BaseModal>
    </TransitionWrapper>
  );
}
