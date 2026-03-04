import { useState } from "react";
import { useCRM } from "../../context/CRMContext";
import KanbanBoard from "./KanbanBoard";
import BaseModal from "../../components/ui/BaseModal";
import { formatNumber } from "../../utils/formatters";

export default function DealsView() {
  const {
    deals,
    addDeal,
    updateDeal,
    removeDeal,
    leads,
    customers,
    error,
    loading,
    clearError,
  } = useCRM();
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState("Kanban"); // 'Table' or 'Kanban'

  const [formData, setFormData] = useState({
    title: "",
    value: 0,
    stage: "DISCOVERY",
    probability: 10,
    expected_close_date: "",
  });

  const openAdd = () => {
    setEditMode(false);
    setFormData({
      title: "",
      value: 0,
      stage: "DISCOVERY",
      probability: 10,
      expected_close_date: "",
    });
    setShowModal(true);
    clearError();
  };

  const openEdit = (d) => {
    setEditMode(true);
    setFormData({
      ...d,
      expected_close_date: d.expected_close_date
        ? new Date(d.expected_close_date).toISOString().split("T")[0]
        : "",
    });
    setShowModal(true);
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      value: parseFloat(formData.value),
      probability: parseInt(formData.probability),
    };
    try {
      if (editMode) await updateDeal(data.id, data);
      else await addDeal(data);
      setShowModal(false);
    } catch (err) {
      console.error("Deal submission failed:", err);
    }
  };

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1">
          <h2 className="text-4xl font-black font-heading text-[#111827] tracking-tighter leading-none">
            Deal Pipeline
          </h2>
          <p className="text-[11px] font-black font-subheading text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Revenue Forecast & Opportunity Tracking
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 p-1 rounded-2xl mr-4">
            <button
              onClick={() => setViewMode("Table")}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black font-subheading uppercase tracking-widest transition-all ${viewMode === "Table" ? "bg-white text-[#111827] shadow-sm" : "text-gray-400"}`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode("Kanban")}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black font-subheading uppercase tracking-widest transition-all ${viewMode === "Kanban" ? "bg-white text-[#111827] shadow-sm" : "text-gray-400"}`}
            >
              Pipeline
            </button>
          </div>
          <button
            onClick={openAdd}
            className="bg-[#195bac] text-white px-8 py-4 rounded-[20px] text-[11px] font-black font-subheading uppercase tracking-[0.15em] shadow-xl transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3"
          >
            + Create Deal
          </button>
        </div>
      </div>

      {viewMode === "Table" ? (
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8FAFC]">
                <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em]">
                  Opportunity Details
                </th>
                <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em]">
                  Account Link
                </th>
                <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em]">
                  Deal Value
                </th>
                <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em]">
                  Pipeline Stage
                </th>
                <th className="px-8 py-6 text-right text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {deals.map((d) => {
                const lead = leads.find((l) => l.id === d.lead_id);
                return (
                  <tr
                    key={d.id}
                    className="hover:bg-blue-50/20 transition-all group"
                  >
                    <td className="px-8 py-6 text-left">
                      <div className="font-black font-heading text-[#1E293B] text-base mb-1">
                        {d.title}
                      </div>
                      <div className="font-mono text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        DEAL-{d.id.toString().padStart(4, "0")}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-[13px] font-black font-subheading text-[#1E293B]">
                        {lead ? lead.name : "Direct Account"}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400">
                        Exp. Close:{" "}
                        {d.expected_close_date
                          ? new Date(d.expected_close_date).toLocaleDateString()
                          : "TBD"}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-base font-black font-heading text-[#1E293B]">
                        ${formatNumber(d.value)}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400">
                        {d.probability}% Probability
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 text-[10px] font-black uppercase tracking-widest border rounded-lg
                                  ${
                                    d.stage === "WON"
                                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                      : d.stage === "LOST"
                                        ? "bg-rose-50 text-rose-600 border-rose-100"
                                        : "bg-blue-50 text-blue-600 border-blue-100"
                                  }`}
                      >
                        {d.stage}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                        <button
                          onClick={() => openEdit(d)}
                          className="w-10 h-10 rounded-xl bg-blue-50 text-[#195bac] flex items-center justify-center hover:bg-[#195bac] hover:text-white transition-all shadow-sm"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => removeDeal(d.id)}
                          className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <KanbanBoard
          deals={deals}
          onEditDeal={openEdit}
          onUpdateDeal={(id, data) => updateDeal(id, data)}
        />
      )}

      <BaseModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        className="max-w-lg text-left"
      >
        <div className="p-10 border-b border-gray-100 bg-[#F8FAFC]">
          <h2 className="text-2xl font-black font-heading text-[#111827] tracking-tighter text-left">
            {editMode ? "Modify Deal" : "Initialize Opportunity"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-10 space-y-6 text-left">
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest animate-in shake duration-300">
              {error}
            </div>
          )}
          <div className="space-y-1 text-left">
            <label className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest pl-1">
              Deal Title
            </label>
            <input
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black font-body text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100 transition-all"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="space-y-1 text-left">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                Deal Value ($)
              </label>
              <input
                type="number"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                required
                value={formData.value}
                onChange={(e) =>
                  setFormData({ ...formData, value: e.target.value })
                }
              />
            </div>
            <div className="space-y-1 text-left">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                Win Probability (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                required
                value={formData.probability}
                onChange={(e) =>
                  setFormData({ ...formData, probability: e.target.value })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="space-y-1 text-left">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                Pipeline Stage
              </label>
              <select
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none"
                value={formData.stage}
                onChange={(e) =>
                  setFormData({ ...formData, stage: e.target.value })
                }
              >
                <option value="DISCOVERY">Discovery</option>
                <option value="PROPOSAL">Proposal</option>
                <option value="NEGOTIATION">Negotiation</option>
                <option value="WON">Won</option>
                <option value="LOST">Lost</option>
              </select>
            </div>
            <div className="space-y-1 text-left">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                Expected Close
              </label>
              <input
                type="date"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                value={formData.expected_close_date}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    expected_close_date: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="pt-6 flex gap-4 text-left">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
            >
              Abort
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-[2] bg-[#195bac] text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "Processing..." : "Command Submit"}
            </button>
          </div>
        </form>
      </BaseModal>
    </div>
  );
}
