import { useCRM } from "../../context/CRMContext";
import { useState } from "react";
import BaseModal from "../../components/ui/BaseModal";

export default function CRMActivitiesView() {
  const {
    activities,
    addActivity,
    leads,
    customers,
    deals,
    loading,
    error,
    clearError,
  } = useCRM();
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    type: "Call",
    targetType: "Lead",
    targetId: "",
    note: "",
  });

  const openAdd = () => {
    setFormData({ type: "Call", targetType: "Lead", targetId: "", note: "" });
    setShowModal(true);
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        type: formData.type,
        note: formData.note,
      };

      if (formData.targetType === "Lead")
        payload.lead_id = parseInt(formData.targetId);
      if (formData.targetType === "Deal")
        payload.deal_id = parseInt(formData.targetId);
      if (formData.targetType === "Customer")
        payload.customer_id = parseInt(formData.targetId);

      await addActivity(payload);
      setShowModal(false);
    } catch (err) {
      console.error("Failed to log activity:", err);
    }
  };

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1">
          <h2 className="text-4xl font-black font-heading text-[#111827] tracking-tighter leading-none">
            Journal of Engagement
          </h2>
          <p className="text-[11px] font-black font-subheading text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Omni-channel Activity & Interaction Log
          </p>
        </div>
        <button
          onClick={openAdd}
          className="bg-[#195bac] text-white px-8 py-4 rounded-[20px] text-[11px] font-black font-subheading uppercase tracking-[0.15em] shadow-xl transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3"
        >
          + Log Activity
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F8FAFC]">
                  <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em]">
                    Activity Hash
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em]">
                    Engagement Intel
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em]">
                    Origin Node
                  </th>
                  <th className="px-8 py-6 text-right text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em]">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {activities.map((act) => {
                  let origin = "System";
                  if (act.lead_id)
                    origin =
                      leads.find((l) => l.id === act.lead_id)?.name ||
                      "Lead Record";
                  if (act.deal_id)
                    origin =
                      deals.find((d) => d.id === act.deal_id)?.title ||
                      "Sales Deal";
                  if (act.customer_id)
                    origin =
                      customers.find((c) => c.id === act.customer_id)
                        ?.company_name || "Enterprise Account";

                  return (
                    <tr
                      key={act.id}
                      className="hover:bg-blue-50/20 transition-all group"
                    >
                      <td className="px-8 py-6">
                        <div className="font-mono text-[11px] font-black text-[#1E293B] px-3 py-1.5 bg-gray-50 rounded-xl inline-block border border-gray-100">
                          ACT-{act.id.toString().padStart(4, "0")}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-[14px] font-black font-heading text-[#1E293B] mb-1 line-clamp-1">
                          {act.note}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {new Date(
                            act.created_at || Date.now(),
                          ).toLocaleString()}
                        </p>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[11px] font-[1000] font-subheading text-gray-500 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                          {origin}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 text-[10px] font-black font-subheading uppercase tracking-widest border rounded-lg
                                        ${
                                          act.type === "Call" ||
                                          act.type === "CALL"
                                            ? "bg-blue-50 text-blue-600 border-blue-100"
                                            : act.type === "Meeting" ||
                                                act.type === "MEETING"
                                              ? "bg-purple-50 text-purple-600 border-purple-100"
                                              : act.type === "CONVERT"
                                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                : "bg-gray-50 text-gray-600 border-gray-100"
                                        }`}
                        >
                          {act.type}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-4">
            <h4 className="text-[11px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em]">
              Activity Distribution
            </h4>
            <div className="space-y-3">
              {[
                { label: "Strategic Calls", color: "blue" },
                { label: "Field Meetings", color: "purple" },
                { label: "Email Outreach", color: "indigo" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0"
                >
                  <span className="text-xs font-bold font-body text-[#1E293B]">
                    {item.label}
                  </span>
                  <span
                    className={`text-[10px] font-black text-${item.color}-600 bg-${item.color}-50 px-2 py-0.5 rounded-lg`}
                  >
                    {Math.floor(Math.random() * 40) + 10}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <BaseModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        className="max-w-xl"
      >
        <div className="p-10 border-b border-gray-100 bg-[#F8FAFC]">
          <h2 className="text-2xl font-black text-[#111827] tracking-tighter text-left">
            Engagement Log Entry
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-10 space-y-6 text-left">
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest animate-in shake">
              {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest pl-1">
                Activity Channel
              </label>
              <select
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black font-body text-[#1E293B] outline-none"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <option value="CALL">Call</option>
                <option value="MEETING">Meeting</option>
                <option value="EMAIL">Email</option>
                <option value="NOTE">Note</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                Target Entity Type
              </label>
              <select
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none"
                value={formData.targetType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    targetType: e.target.value,
                    targetId: "",
                  })
                }
              >
                <option value="Lead">Lead</option>
                <option value="Deal">Deal</option>
                <option value="Customer">Account</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
              Associate with Specific Record
            </label>
            <select
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none"
              required
              value={formData.targetId}
              onChange={(e) =>
                setFormData({ ...formData, targetId: e.target.value })
              }
            >
              <option value="">Select Target...</option>
              {formData.targetType === "Lead" &&
                leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.company})
                  </option>
                ))}
              {formData.targetType === "Deal" &&
                deals.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              {formData.targetType === "Customer" &&
                customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company_name}
                  </option>
                ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
              Engagement Notes
            </label>
            <textarea
              rows="4"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold text-[#1E293B] outline-none resize-none focus:ring-4 focus:ring-blue-100 transition-all"
              required
              placeholder="Describe the outcome of this interaction..."
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
            />
          </div>

          <div className="pt-6 flex gap-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-400"
            >
              Abort
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] bg-[#111827] text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50"
            >
              {loading ? "Command Registry..." : "Command Registry"}
            </button>
          </div>
        </form>
      </BaseModal>
    </div>
  );
}
