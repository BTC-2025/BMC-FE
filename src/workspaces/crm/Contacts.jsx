import { useCRM } from "../../context/CRMContext";
import { useState } from "react";
import BaseModal from "../../components/ui/BaseModal";

export default function ContactsView() {
  const { contacts, customers, addContact, loading, error, clearError } =
    useCRM();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    job_title: "",
    customer_id: "",
  });

  const openAdd = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      job_title: "",
      customer_id: "",
    });
    setShowModal(true);
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        customer_id: formData.customer_id
          ? parseInt(formData.customer_id)
          : null,
      };
      await addContact(data);
      setShowModal(false);
    } catch (err) {
      console.error("Failed to add contact:", err);
    }
  };

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1">
          <h2 className="text-4xl font-black font-heading text-[#111827] tracking-tighter leading-none">
            Stakeholder Directory
          </h2>
          <p className="text-[11px] font-black font-subheading text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            Key Contacts & Decision Makers
          </p>
        </div>
        <button
          onClick={openAdd}
          className="bg-[#195bac] text-white px-8 py-4 rounded-[20px] text-[11px] font-black uppercase tracking-[0.15em] shadow-xl transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3"
        >
          + Create Contact
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#F8FAFC]">
              <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em]">
                Individual Identity
              </th>
              <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em]">
                Contact Metadata
              </th>
              <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em]">
                Organization Role
              </th>
              <th className="px-8 py-6 text-right text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {contacts.map((c) => {
              const customer = customers.find(
                (cust) => cust.id === c.customer_id,
              );
              return (
                <tr
                  key={c.id}
                  className="hover:bg-blue-50/20 transition-all group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[#1E293B] font-black border border-gray-100">
                        {(c.first_name?.[0] || "") + (c.last_name?.[0] || "")}
                      </div>
                      <div>
                        <div className="font-black font-heading text-[#1E293B] text-base">
                          {c.first_name} {c.last_name}
                        </div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase">
                          CNT-{c.id.toString().padStart(4, "0")}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-[13px] font-black font-subheading text-[#1E293B]">
                      {c.email || "No Email"}
                    </p>
                    <p className="text-[11px] font-bold text-gray-400">
                      {c.phone || "No Phone"}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <p className="text-[13px] font-black font-subheading text-[#195bac]">
                        {customer?.company_name || "Direct Link"}
                      </p>
                      <span className="text-[10px] font-black font-body text-gray-400 uppercase tracking-widest">
                        {c.job_title || "Role Unset"}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="w-10 h-10 rounded-xl hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#195bac] transition-all ml-auto">
                      ✎
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <BaseModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        className="max-w-xl"
      >
        <div className="p-10 border-b border-gray-100 bg-[#F8FAFC]">
          <h2 className="text-2xl font-black text-[#111827] tracking-tighter">
            Add New Stakeholder
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest animate-in shake">
              {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest pl-1">
                First Name
              </label>
              <input
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black font-body text-[#1E293B] outline-none"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                Last Name
              </label>
              <input
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
              />
            </div>
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
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
              Organization Link
            </label>
            <select
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none"
              value={formData.customer_id}
              onChange={(e) =>
                setFormData({ ...formData, customer_id: e.target.value })
              }
            >
              <option value="">Select Organization...</option>
              {customers.map((cust) => (
                <option key={cust.id} value={cust.id}>
                  {cust.company_name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
              Job Title / Role
            </label>
            <input
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none"
              value={formData.job_title}
              onChange={(e) =>
                setFormData({ ...formData, job_title: e.target.value })
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
              {loading ? "Processing..." : "Command Create"}
            </button>
          </div>
        </form>
      </BaseModal>
    </div>
  );
}
