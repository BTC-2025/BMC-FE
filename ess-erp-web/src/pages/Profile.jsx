import { useEffect, useState } from "react";
import { employeeApi } from "../services/essApi";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { employee, logout } = useAuth();
  const [empData, setEmpData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!employee?.id) {
      setEmpData(employee);
      setLoading(false);
      return;
    }
    employeeApi
      .getMe(employee.id)
      .then((res) => setEmpData(res.data))
      .catch(() => setEmpData(employee))
      .finally(() => setLoading(false));
  }, [employee]);

  if (loading) {
    return <div className="p-10 text-center text-gray-400">Loading profile…</div>;
  }

  const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(empData?.name || "E")}`;

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      <h1 className="text-2xl font-bold">My Profile</h1>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600" />
        <div className="px-8 pb-8 -mt-10">
          <div className="flex items-end gap-5">
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg object-cover bg-white"
            />
            <div className="mb-1">
              <h2 className="text-xl font-black text-gray-900">{empData?.name || "—"}</h2>
              <p className="text-sm text-gray-500 font-medium">{empData?.role || "Employee"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Contact & Employment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "Employee ID", value: empData?.id ? `EMP-${empData.id}` : "—" },
            { label: "Full Name", value: empData?.name || "—" },
            { label: "Email", value: empData?.email || "—" },
            { label: "Department", value: empData?.department || "—" },
            { label: "Role / Designation", value: empData?.role || "—" },
            { label: "Basic Salary", value: empData?.basic_salary ? `$${Number(empData.basic_salary).toLocaleString()}` : "—" },
          ].map(({ label, value }) => (
            <div key={label} className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
              <p className="text-gray-800 font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
          Edit Profile
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
          Change Password
        </button>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium ml-auto"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
