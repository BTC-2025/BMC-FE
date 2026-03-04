import { useHR } from "../../context/HRContext";
import { useState } from "react";
import BaseModal from "../../components/ui/BaseModal";

export default function EmployeesView() {
  const {
    employees,
    addEmployee,
    updateEmployee,
    removeEmployee,
    departments,
  } = useHR();
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    department: departments[0]?.name || "",
    email: "",
    basic_salary: 0,
  });

  const openAdd = () => {
    setEditMode(false);
    setFormData({
      name: "",
      role: "",
      department: departments[0]?.name || "",
      email: "",
      basic_salary: 0,
    });
    setShowModal(true);
  };

  const openEdit = (emp) => {
    setEditMode(true);
    setFormData({
      ...emp,
      basic_salary: emp.basic_salary || 0,
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedDept = departments.find(
      (d) => d.name === formData.department,
    );
    const submissionData = {
      ...formData,
      department_id: selectedDept?.id || null,
      basic_salary: parseFloat(formData.basic_salary) || 0,
    };

    if (editMode) updateEmployee(formData.id, submissionData);
    else addEmployee(submissionData);
    setShowModal(false);
  };

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1">
          <h2 className="text-4xl font-black font-heading text-[#111827] tracking-tighter leading-none">
            Personnel Index
          </h2>
          <p className="text-[11px] font-black font-subheading text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Master Employee Records & Talent Directory
          </p>
        </div>
        <button
          onClick={openAdd}
          className="bg-[#111827] text-white px-8 py-4 rounded-2xl text-[10px] font-black font-subheading uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 active:scale-95 transition-all"
        >
          + Onboard Professional
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#F8FAFC]">
              <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em] text-left">
                Professional Node
              </th>
              <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em] text-left">
                Department
              </th>
              <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em] text-left">
                Pay Grade
              </th>
              <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em] text-left">
                Status
              </th>
              <th className="px-8 py-6 text-right text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {employees.map((emp) => (
              <tr
                key={emp.id}
                className="hover:bg-blue-50/20 transition-all group"
              >
                <td className="px-8 py-6 text-left">
                  <div className="font-black font-heading text-[#1E293B] text-base mb-0.5">
                    {emp.name}
                  </div>
                  <div className="text-[11px] font-black font-subheading text-gray-400 uppercase tracking-widest">
                    {emp.id}
                  </div>
                </td>
                <td className="px-8 py-6 text-left">
                  <p className="text-[14px] font-black font-body text-[#1E293B]">
                    {emp.role}
                  </p>
                  <p className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-[0.1em]">
                    {emp.department}
                  </p>
                </td>
                <td className="px-8 py-6 text-left font-black font-body text-[#1E293B] font-mono tracking-tighter">
                  {emp.salary}
                </td>
                <td className="px-8 py-6 text-left">
                  <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black font-subheading uppercase tracking-widest border border-emerald-100">
                    {emp.status}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                    <button
                      onClick={() => openEdit(emp)}
                      className="w-10 h-10 rounded-xl bg-blue-50 text-[#195bac] flex items-center justify-center hover:bg-[#195bac] hover:text-white transition-all shadow-sm"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => removeEmployee(emp.id)}
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

      <BaseModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        className="max-w-lg"
      >
        <div className="p-10 border-b border-gray-100 bg-[#F8FAFC]">
          <h2 className="text-2xl font-black text-[#111827] tracking-tighter text-left">
            {editMode ? "Modify Record" : "Onboard Workforce"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-10 space-y-6 text-left">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
              Legal Full Name
            </label>
            <input
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100 transition-all"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                Professional Role
              </label>
              <input
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                required
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                Organization Node
              </label>
              <select
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
              >
                {departments.map((d) => (
                  <option key={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                Enterprise Email
              </label>
              <input
                type="email"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                Basic Monthly Salary
              </label>
              <input
                type="number"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                required
                value={formData.basic_salary}
                onChange={(e) =>
                  setFormData({ ...formData, basic_salary: e.target.value })
                }
              />
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
              className="flex-[2] bg-[#000000] text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all"
            >
              Submit to Index
            </button>
          </div>
        </form>
      </BaseModal>
    </div>
  );
}
