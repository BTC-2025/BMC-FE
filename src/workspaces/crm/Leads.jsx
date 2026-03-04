import { useCRM } from "../../context/CRMContext";
import { useState } from "react";
import BaseModal from "../../components/ui/BaseModal";

export default function LeadsView({ autoOpen }) {
  const {
    leads,
    addLead,
    updateLead,
    removeLead,
    convertLead,
    error,
    loading,
    clearError,
  } = useCRM();
  const [showModal, setShowModal] = useState(autoOpen || false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    source: "Web",
    status: "NEW",
  });

  const [showConvertModal, setShowConvertModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [convertData, setConvertData] = useState({ title: "", value: 0 });

  const openAdd = () => {
    setEditMode(false);
    setFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      source: "Web",
      status: "NEW",
    });
    setShowModal(true);
    clearError();
  };

  const openEdit = (l) => {
    setEditMode(true);
    setFormData(l);
    setShowModal(true);
    clearError();
  };

  const openConvert = (l) => {
    setSelectedLead(l);
    setConvertData({ title: `${l.company} - Deal`, value: 1000 });
    setShowConvertModal(true);
    clearError();
  };

  const handleConvert = (e) => {
    e.preventDefault();
    convertLead(selectedLead.id, convertData);
    setShowConvertModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) await updateLead(formData.id, formData);
      else await addLead(formData);
      setShowModal(false);
    } catch (err) {
      console.error("Submission failed:", err);
    }
  };

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1">
          <h2 className="text-4xl font-black font-heading text-[#111827] tracking-tighter leading-none">
            Lead Acquisition
          </h2>
          <p className="text-[11px] font-black font-subheading text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Prospect Management & Qualification
          </p>
        </div>
        <button
          onClick={openAdd}
          className="bg-[#195bac] text-white px-8 py-4 rounded-[20px] text-[11px] font-black font-subheading uppercase tracking-[0.15em] shadow-xl transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3"
        >
          + New Lead
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#F8FAFC]">
              <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em]">
                Contact Identity
              </th>
              <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em]">
                Company / Entity
              </th>
              <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em]">
                Source
              </th>
              <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em]">
                Status
              </th>
              <th className="px-8 py-6 text-right text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {leads.map((l) => (
              <tr
                key={l.id}
                className="hover:bg-blue-50/20 transition-all group"
              >
                <td className="px-8 py-6">
                  <div className="font-black font-heading text-[#1E293B] text-base mb-1">
                    {l.name}
                  </div>
                  <div className="font-mono text-[10px] text-gray-400 font-bold">
                    {l.email}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <p className="text-[13px] font-black font-subheading text-[#1E293B]">
                    {l.company}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400">
                    ProspectID: {l.id}
                  </p>
                </td>
                <td className="px-8 py-6">
                  <span className="text-[10px] font-black font-body text-gray-500 bg-gray-100 px-3 py-1 rounded-lg uppercase tracking-widest">
                    {l.source}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 text-[10px] font-black font-subheading uppercase tracking-widest border rounded-lg
                                ${
                                  l.status === "NEW" || l.status === "New"
                                    ? "bg-blue-50 text-blue-600 border-blue-100"
                                    : l.status === "CONTACTED" ||
                                        l.status === "Contacted"
                                      ? "bg-amber-50 text-amber-600 border-amber-100"
                                      : l.status === "QUALIFIED" ||
                                          l.status === "Qualified"
                                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                        : "bg-rose-50 text-rose-600 border-rose-100"
                                }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        l.status === "NEW" || l.status === "New"
                          ? "bg-blue-500"
                          : l.status === "CONTACTED" || l.status === "Contacted"
                            ? "bg-amber-500"
                            : l.status === "QUALIFIED" ||
                                l.status === "Qualified"
                              ? "bg-emerald-500"
                              : "bg-rose-500"
                      }`}
                    ></span>
                    {l.status}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                    {(l.status === "QUALIFIED" || l.status === "Qualified") && (
                      <button
                        onClick={() => openConvert(l)}
                        className="h-10 px-4 rounded-xl bg-emerald-500 text-white text-[10px] font-black font-subheading uppercase tracking-widest hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-100"
                      >
                        {" "}
                        Convert{" "}
                      </button>
                    )}
                    <button
                      onClick={() => openEdit(l)}
                      className="w-10 h-10 rounded-xl bg-blue-50 text-[#195bac] flex items-center justify-center hover:bg-[#195bac] hover:text-white transition-all shadow-sm"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => removeLead(l.id)}
                      className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                    >
                      ✕
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Entry Modal */}
      <BaseModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        className="max-w-lg"
      >
        <div className="p-10 border-b border-gray-100 bg-[#F8FAFC]">
          <h2 className="text-2xl font-black text-[#111827] tracking-tighter">
            {editMode ? "Modify Prospect" : "New Lead Entry"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 px-6 py-4 rounded-2xl text-[11px] font-black font-subheading uppercase tracking-widest animate-in shake duration-300">
              {error}
            </div>
          )}
          <div className="space-y-1">
            <label className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest pl-1">
              Full Name
            </label>
            <input
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black font-body text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100 transition-all"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest pl-1">
              Company / Entity
            </label>
            <input
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black font-body text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100 transition-all"
              required
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                Electronic Mail
              </label>
              <input
                type="email"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                Phone Number
              </label>
              <input
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                Source
              </label>
              <select
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none"
                value={formData.source}
                onChange={(e) =>
                  setFormData({ ...formData, source: e.target.value })
                }
              >
                <option>Web</option>
                <option>Referral</option>
                <option>Social Media</option>
                <option>Cold Call</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                Status
              </label>
              <select
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="QUALIFIED">Qualified</option>
                <option value="LOST">Lost</option>
              </select>
            </div>
          </div>
          <div className="pt-6 flex gap-4">
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

      {/* Convert Modal */}
      <BaseModal
        isOpen={showConvertModal}
        onClose={() => setShowConvertModal(false)}
        className="max-w-md"
      >
        <div className="p-10 border-b border-gray-100 bg-emerald-50/30">
          <h2 className="text-2xl font-black text-[#111827] tracking-tighter">
            Convert to Opportunity
          </h2>
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">
            Initializing Sales Pipeline Entry
          </p>
        </div>
        <form onSubmit={handleConvert} className="p-10 space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest">
              {error}
            </div>
          )}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
              Opportunity Title
            </label>
            <input
              className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-emerald-100 transition-all"
              required
              value={convertData.title}
              onChange={(e) =>
                setConvertData({ ...convertData, title: e.target.value })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
              Anticipated Value ($)
            </label>
            <input
              type="number"
              className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-emerald-100 transition-all"
              required
              value={convertData.value}
              onChange={(e) =>
                setConvertData({ ...convertData, value: e.target.value })
              }
            />
          </div>
          <div className="pt-6 flex gap-4">
            <button
              type="button"
              onClick={() => setShowConvertModal(false)}
              className="flex-1 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-[2] bg-emerald-500 text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "Processing..." : "Complete Conversion"}
            </button>
          </div>
        </form>
      </BaseModal>
    </div>
  );
}
