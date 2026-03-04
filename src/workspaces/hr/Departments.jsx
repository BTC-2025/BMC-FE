import { useState } from "react";
import { useHR } from "../../context/HRContext";
import { Building2, Plus, Pencil, Trash2, X, Check, Users } from "lucide-react";

export default function DepartmentsView() {
  const {
    departments,
    employees,
    addDepartment,
    updateDepartment,
    removeDepartment,
    loading,
  } = useHR();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "" });

  const getHeadcount = (deptName) => {
    // Note: In a real app, we'd use department_id, but here employees have a department name string
    return employees.filter((e) => e.department === deptName).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDepartment(editingId, formData.name);
      } else {
        await addDepartment(formData.name);
      }
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (dept) => {
    setEditingId(dept.id);
    setFormData({ name: dept.name });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this organization node? This will not delete employees but they will lose their department association.",
      )
    ) {
      try {
        await removeDepartment(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: "" });
  };

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500 text-left">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100/50">
        <div className="space-y-2">
          <h2 className="text-5xl font-black font-heading text-[#111827] tracking-tighter leading-none">
            Organization Nodes
          </h2>
          <p className="text-[11px] font-black font-subheading text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Departmental Clusters & Structural Hierarchy
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#111827] text-white px-8 py-4 rounded-[20px] text-[11px] font-black font-subheading uppercase tracking-[0.2em] shadow-2xl hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          Provision New Node
        </button>
      </div>

      {/* Grid of departments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="bg-white p-8 rounded-[40px] border border-gray-100/50 shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all duration-500 group relative overflow-hidden flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-8 z-10">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 flex items-center justify-center text-2xl font-black border border-slate-100 group-hover:border-blue-100 transition-colors">
                <Building2 className="w-7 h-7" />
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(dept)}
                  className="p-2 hover:bg-slate-50 rounded-lg text-slate-300 hover:text-blue-500 transition-colors"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(dept.id)}
                  className="p-2 hover:bg-red-50 rounded-lg text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-grow z-10">
              <h3 className="text-2xl font-black font-heading text-[#111827] group-hover:text-blue-600 transition-colors">
                {dept.name}
              </h3>
              <p className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest mt-1 mb-6">
                NODE ID: #HR-{dept.id.toString().padStart(3, "0")}
              </p>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-50 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-black text-[#1E293B] leading-none">
                    {getHeadcount(dept.name)}
                  </div>
                  <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">
                    Personnel
                  </div>
                </div>
              </div>
              <div className="h-2 w-16 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{
                    width: `${Math.min(100, (getHeadcount(dept.name) / Math.max(1, employees.length)) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Decorative background element */}
            <div className="absolute -right-6 -top-6 opacity-[0.02] text-9xl font-black group-hover:opacity-[0.05] transition-opacity duration-700 pointer-events-none">
              {dept.name[0]}
            </div>
          </div>
        ))}
      </div>

      {/* Provisioning Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
            <div className="p-8 pb-0 flex justify-between items-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <button
                onClick={handleClose}
                className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-8 pt-6 space-y-8 text-left"
            >
              <div>
                <h4 className="text-2xl font-black font-heading text-[#111827]">
                  {editingId ? "Update Cluster" : "Provision Node"}
                </h4>
                <p className="text-xs font-black text-gray-400 uppercase tracking-tight mt-1">
                  Define the structural parameters for this department
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">
                  Department Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Strategic Operations"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all placeholder:text-slate-300"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#111827] text-white py-5 rounded-3xl text-xs font-black font-subheading uppercase tracking-[0.2em] shadow-2xl hover:translate-y-[-2px] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : editingId ? (
                  <>
                    <Check className="w-5 h-5" />
                    Commit Changes
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Initialize Node
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
