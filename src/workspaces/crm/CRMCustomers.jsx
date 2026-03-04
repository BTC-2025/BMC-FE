import { useCRM } from "../../context/CRMContext";
import { useState } from "react";
import BaseModal from "../../components/ui/BaseModal";

export default function CRMCustomersView() {
  const { customers, addCustomer, loading, error, clearError } = useCRM();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    industry: "",
    website: "",
  });

  const openAdd = () => {
    setFormData({ company_name: "", industry: "", website: "" });
    setShowModal(true);
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addCustomer(formData);
      setShowModal(false);
    } catch (err) {
      console.error("Failed to add customer:", err);
    }
  };

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1">
          <h2 className="text-4xl font-black font-heading text-[#111827] tracking-tighter leading-none">
            Enterprise Accounts
          </h2>
          <p className="text-[11px] font-black font-subheading text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            Strategic Customer Database
          </p>
        </div>
        <button
          onClick={openAdd}
          className="bg-[#195bac] text-white px-8 py-4 rounded-[20px] text-[11px] font-black font-subheading uppercase tracking-[0.15em] shadow-xl transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3"
        >
          + New Account
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#F8FAFC]">
              <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em]">
                Customer Entity
              </th>
              <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em]">
                Industry Intelligence
              </th>
              <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em]">
                Digital Hub
              </th>
              <th className="px-8 py-6 text-right text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {customers.map((c) => (
              <tr
                key={c.id}
                className="hover:bg-blue-50/20 transition-all group"
              >
                <td className="px-8 py-6">
                  <div className="font-black font-heading text-[#1E293B] text-base mb-1">
                    {c.company_name}
                  </div>
                  <div className="font-mono text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    ACC-{c.id.toString().padStart(4, "0")}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-sm font-black font-body text-[#1E293B] bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                    {c.industry || "General / Unset"}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <a
                    href={
                      c.website?.startsWith("http")
                        ? c.website
                        : `https://${c.website}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="text-[14px] font-black font-body text-[#195bac] hover:underline"
                  >
                    {c.website || "No URL"}
                  </a>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="text-[10px] font-black font-subheading text-[#195bac] uppercase p-3 hover:bg-blue-50 rounded-xl transition-all">
                    View Dossier
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <BaseModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        className="max-w-lg"
      >
        <div className="p-10 border-b border-gray-100 bg-[#F8FAFC]">
          <h2 className="text-2xl font-black text-[#111827] tracking-tighter">
            Register New Account
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest animate-in shake">
              {error}
            </div>
          )}
          <div className="space-y-1">
            <label className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest pl-1">
              Company Name
            </label>
            <input
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black font-body text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100"
              value={formData.company_name}
              onChange={(e) =>
                setFormData({ ...formData, company_name: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                Industry
              </label>
              <input
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none"
                value={formData.industry}
                onChange={(e) =>
                  setFormData({ ...formData, industry: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                Corporate Website
              </label>
              <input
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
              />
            </div>
          </div>
          <div className="pt-6 flex gap-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] bg-[#195bac] text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50"
            >
              {loading ? "Registering..." : "Command Register"}
            </button>
          </div>
        </form>
      </BaseModal>
    </div>
  );
}
