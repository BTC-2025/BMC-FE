import { useInventory } from "../../context/InventoryContext";
import { useState } from "react";

export default function AuditLog() {
  const { transactions, deleteTransaction, updateTransaction, products } =
    useInventory();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const filteredLogs = transactions.filter(
    (t) =>
      String(t.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.user.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const startEdit = (log) => {
    setEditingId(log.id);
    setEditForm({ ...log });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    updateTransaction(editingId, editForm);
    setEditingId(null);
  };

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1">
          <h2 className="text-4xl font-black text-[#111827] tracking-tighter leading-none">
            Terminal <span className="text-[#195bac]">Ledger</span>
          </h2>
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
            Stock Adjustment & Movement Logs
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm w-full md:w-96">
          <span className="pl-3 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search by ID, Item, or User..."
            className="w-full bg-transparent border-none outline-none text-sm font-bold text-gray-900 placeholder:text-gray-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F8FAFC]">
                  <th className="px-8 py-5 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em] rounded-l-2xl">
                    Hash ID
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">
                    Operation Type
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">
                    Asset Unit
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">
                    Delta
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">
                    Operator
                  </th>
                  <th className="px-8 py-5 text-right text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em] rounded-r-2xl">
                    Synchronized
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-blue-50/10 transition-colors group"
                  >
                    <td className="px-8 py-5 align-middle">
                      <span className="font-mono text-[11px] font-[900] text-[#1E293B] tabular-nums tracking-tighter">
                        #{String(log.id).padStart(6, "0")}
                      </span>
                    </td>
                    <td className="px-8 py-5 align-middle text-left">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${
                              log.type === "Stock In"
                                ? "bg-emerald-50 text-emerald-600"
                                : log.type === "Stock Out"
                                  ? "bg-rose-50 text-rose-600"
                                  : "bg-blue-50 text-blue-600"
                            }`}
                          >
                            {log.type === "Stock In"
                              ? "↓"
                              : log.type === "Stock Out"
                                ? "↑"
                                : "⚙️"}
                          </div>
                          <span className="text-xs font-black text-gray-900 uppercase tracking-widest">
                            {log.type}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 align-middle text-left">
                      <p className="text-xs font-black text-gray-900">
                        {log.product}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">
                        {log.warehouse}{" "}
                        {log.bin_id ? `• BIN #${log.bin_id}` : ""}
                      </p>
                    </td>
                    <td className="px-8 py-5 align-middle">
                      <p
                        className={`text-xl font-black tabular-nums ${log.qty > 0 ? "text-emerald-500" : "text-rose-500"}`}
                      >
                        {log.qty > 0 ? "+" : ""}
                        {log.qty}
                      </p>
                    </td>
                    <td className="px-8 py-5 align-middle">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-[20%] bg-[#195bac] text-white flex items-center justify-center text-[8px] font-black uppercase">
                          {log.user?.slice(0, 2).toUpperCase() || "SYS"}
                        </div>
                        <span className="text-[11px] font-black text-gray-700 uppercase tracking-widest">
                          {log.user}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right align-middle">
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                            Live Verified
                          </span>
                        </div>
                        <p className="mt-1 font-mono text-[10px] font-black text-gray-300 tabular-nums">
                          {log.date}
                        </p>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#1E293B] p-8 rounded-[40px] text-white space-y-6 shadow-2xl">
            <h3 className="text-lg font-black tracking-tight">Audit Metrics</h3>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1">
                  Total Entries
                </p>
                <p className="text-2xl font-black">{transactions.length}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[10px] font-black text-emerald-300 uppercase tracking-widest mb-1">
                  Compliance Score
                </p>
                <p className="text-2xl font-black">99.8%</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[10px] font-black text-rose-300 uppercase tracking-widest mb-1">
                  Anomalies
                </p>
                <p className="text-2xl font-black">0</p>
              </div>
            </div>
            <button className="w-full bg-white text-[#1E293B] py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-colors shadow-lg">
              Export CSV Report
            </button>
          </div>
        </div>
      </div>

      {editingId && (
        <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-xl z-[9999] flex items-center justify-center p-6 animate-in zoom-in duration-300">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden border border-white">
            <div className="p-10 border-b border-gray-100 bg-[#F8FAFC]">
              <h2 className="text-2xl font-black text-[#111827] tracking-tighter">
                Correct Log Entry
              </h2>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                Refining System Audit History
              </p>
            </div>
            <form onSubmit={handleUpdate} className="p-10 space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">
                  Operation Class
                </label>
                <select
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100"
                  value={editForm.type}
                  onChange={(e) =>
                    setEditForm({ ...editForm, type: e.target.value })
                  }
                >
                  <option>Stock In</option>
                  <option>Stock Out</option>
                  <option>Adjustment</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">
                  Effective Delta (Qty)
                </label>
                <input
                  type="number"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-xl font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100"
                  value={editForm.qty}
                  onChange={(e) =>
                    setEditForm({ ...editForm, qty: Number(e.target.value) })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">
                  Correction Notes
                </label>
                <textarea
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100 min-h-[100px]"
                  value={editForm.notes || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, notes: e.target.value })
                  }
                  placeholder="Reason for correction..."
                />
              </div>
              <div className="pt-6 flex gap-4">
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="flex-1 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Abort
                </button>
                <button
                  type="submit"
                  className="flex-[2] bg-[#195bac] text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all"
                >
                  Update Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
