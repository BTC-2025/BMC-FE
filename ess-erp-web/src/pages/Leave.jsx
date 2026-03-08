import { useState, useEffect } from "react";
import LeaveBalanceCard from "../components/cards/LeaveBalanceCard";
import { leaveApi } from "../services/essApi";
import { useAuth } from "../context/AuthContext";

const LEAVE_TYPE_MAP = {
  "Casual Leave": "CASUAL",
  "Sick Leave": "SICK",
  "Earned Leave": "PAID",
  "Comp Off": "CASUAL",
};

export default function Leave() {
  const { employee } = useAuth();
  const [open, setOpen] = useState(false);
  const [leaveType, setLeaveType] = useState("Casual Leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [filter, setFilter] = useState("All");
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const leaveBalances = {
    "Casual Leave": { used: 0, total: 18 },
    "Sick Leave": { used: 0, total: 10 },
    "Earned Leave": { used: 0, total: 24 },
    "Comp Off": { used: 0, total: 5 },
  };

  useEffect(() => {
    if (!employee?.id) return;
    loadLeaves();
  }, [employee]);

  const loadLeaves = async () => {
    setLoading(true);
    try {
      const res = await leaveApi.getMyLeaves(employee.id);
      setLeaveHistory(res.data);
    } catch (err) {
      console.error("Failed to load leaves:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    return Math.ceil(Math.abs(e - s) / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleApplyLeave = async () => {
    if (!startDate || !endDate) return;
    if (!employee?.id) return alert("Could not identify your employee record. Please re-login.");

    setSubmitting(true);
    try {
      await leaveApi.apply({
        employee_id: employee.id,
        leave_type: LEAVE_TYPE_MAP[leaveType] || "CASUAL",
        start_date: startDate,
        end_date: endDate,
      });
      setOpen(false);
      setStartDate("");
      setEndDate("");
      setReason("");
      await loadLeaves();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to submit leave request");
    } finally {
      setSubmitting(false);
    }
  };

  const normalizeStatus = (s) =>
    s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "Pending";

  const filteredHistory =
    filter === "All"
      ? leaveHistory
      : leaveHistory.filter((l) => normalizeStatus(l.status) === filter);

  return (
    <div className="max-w-6xl mx-auto space-y-10 p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Leave Management</h1>
          <p className="text-gray-500 mt-2 text-lg">Track your balances and request time off.</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-blue-100 hover:shadow-blue-200 active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Apply Leave
        </button>
      </div>

      {/* Balances */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(leaveBalances).map(([type, balance]) => (
          <LeaveBalanceCard key={type} title={type} used={balance.used} total={balance.total} />
        ))}
      </div>

      {/* History Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="text-xl font-bold text-gray-900">Leave History</h3>
          <div className="flex bg-gray-50 p-1 rounded-xl">
            {["All", "Approved", "Pending", "Rejected"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === f ? "bg-white shadow-sm text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-gray-400">Loading leave history…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-gray-400 text-xs uppercase tracking-widest font-black">
                <tr>
                  <th className="px-8 py-4">Leave Type</th>
                  <th className="px-8 py-4">Duration</th>
                  <th className="px-8 py-4">Days</th>
                  <th className="px-8 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-gray-400">
                      No leave records found
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((l) => {
                    const status = normalizeStatus(l.status);
                    const days = calculateDays(l.start_date, l.end_date);
                    return (
                      <tr key={l.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-5 font-bold text-gray-800">{l.leave_type}</td>
                        <td className="px-8 py-5 text-sm text-gray-500 font-medium">
                          {new Date(l.start_date).toLocaleDateString()} - {new Date(l.end_date).toLocaleDateString()}
                        </td>
                        <td className="px-8 py-5">
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-black uppercase">
                            {days} Days
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                            status === "Approved" ? "bg-green-100 text-green-700" :
                            status === "Rejected" ? "bg-red-100 text-red-700" :
                            "bg-orange-100 text-orange-700"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              status === "Approved" ? "bg-green-500" :
                              status === "Rejected" ? "bg-red-500" :
                              "bg-orange-500 animate-pulse"
                            }`} />
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-8 border-b border-gray-50">
              <h3 className="text-2xl font-black text-gray-900">Request Time Off</h3>
              <p className="text-gray-500 mt-1">Submit your leave request for approval.</p>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Leave Category</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-gray-700"
                >
                  <option>Casual Leave</option>
                  <option>Sick Leave</option>
                  <option>Earned Leave</option>
                  <option>Comp Off</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Start Date</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-gray-700" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">End Date</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-gray-700" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Reason (Optional)</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-gray-700 min-h-[100px]"
                  placeholder="Briefly explain your absence…"
                />
              </div>
            </div>

            <div className="p-8 bg-gray-50/50 flex gap-4">
              <button onClick={() => setOpen(false)}
                className="flex-1 px-8 py-4 border-2 border-gray-200 rounded-2xl font-black text-gray-500 hover:bg-white transition-all">
                Cancel
              </button>
              <button onClick={handleApplyLeave} disabled={submitting}
                className="flex-1 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-60">
                {submitting ? "Submitting…" : "Submit Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
