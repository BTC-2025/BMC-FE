import { useState } from "react";
import { useHR } from "../../context/HRContext";
import { Clock, MapPin, ShieldCheck, Cpu } from "lucide-react";
import BaseModal from "../../components/ui/BaseModal";

export default function AttendanceView() {
  const { attendance, employees, logAttendance, loading } = useHR();
  const [showPunch, setShowPunch] = useState(false);
  const [punchData, setPunchData] = useState({ employee_id: "", action: "IN" });

  const handlePunch = async (e) => {
    e.preventDefault();
    if (!punchData.employee_id) return;
    await logAttendance({ ...punchData, employee_id: Number(punchData.employee_id) });
    setShowPunch(false);
    setPunchData({ employee_id: "", action: "IN" });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "---";
    const date = new Date(timeStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (timeStr) => {
    if (!timeStr) return "---";
    return new Date(timeStr).toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-10 animate-in fade-in duration-500 text-left">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-gray-100/50">
        <div className="space-y-2">
          <h2 className="text-5xl font-black font-heading text-[#111827] tracking-tighter leading-none">
            Attendance Protocol
          </h2>
          <p className="text-[11px] font-black font-subheading text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Operational Presence & Chronological Ledger
          </p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-2xl h-fit">
          <button
            onClick={() => setShowPunch(true)}
            className="px-6 py-2.5 rounded-xl bg-[#111827] text-white shadow-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:-translate-y-0.5"
          >
            + Punch Clock
          </button>
          <button className="px-6 py-2.5 rounded-xl bg-white text-[#111827] shadow-sm text-[10px] font-black uppercase tracking-widest transition-all ml-1">
            Daily Presence
          </button>
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="bg-white rounded-[40px] border border-gray-100/50 shadow-sm overflow-hidden text-left">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#F8FAFC]/50">
              <th className="px-10 py-8 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.3em] text-left">
                Employee Node
              </th>
              <th className="px-10 py-8 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.3em] text-left">
                Terminal Index
              </th>
              <th className="px-10 py-8 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.3em] text-left">
                Sync Status
              </th>
              <th className="px-10 py-8 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.3em] text-left text-right">
                Log Identity
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {attendance.map((att) => (
              <tr
                key={att.id}
                className="hover:bg-blue-50/20 transition-all group"
              >
                <td className="px-10 py-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-black font-heading text-[#1E293B] text-lg mb-0.5">
                        {att.name}
                      </div>
                      <div className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest flex items-center gap-2 text-left">
                        <MapPin className="w-3 h-3" />
                        {att.department}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8 text-left">
                  <div className="flex items-center gap-6">
                    <div>
                      <div className="text-xl font-black text-[#1E293B] flex items-center gap-2 text-left">
                        {formatTime(att.punch_in)}
                        <span className="text-gray-300">→</span>
                        <span
                          className={
                            att.punch_out
                              ? "text-[#1E293B]"
                              : "text-gray-300 font-normal italic"
                          }
                        >
                          {formatTime(att.punch_out)}
                        </span>
                      </div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 text-left">
                        {formatDate(att.punch_in)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black font-subheading uppercase tracking-widest border shadow-sm
                                 ${att.status === "PRESENT" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {att.status}
                  </span>
                </td>
                <td className="px-10 py-8 text-right">
                  <div className="flex flex-col items-end">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#111827] group-hover:text-white transition-all cursor-pointer">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mt-2">
                      REF: # {att.id.toString().padStart(4, "0")}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {attendance.length === 0 && (
          <div className="p-20 text-center flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-[30px] bg-slate-50 flex items-center justify-center text-slate-300">
              <Clock className="w-10 h-10" />
            </div>
            <div>
              <p className="text-lg font-black text-[#1E293B]">
                No logs found in the protocol
              </p>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mt-1">
                Initiate check-ins to populate the ledger
              </p>
            </div>
          </div>
        )}
      </div>

      <BaseModal
        isOpen={showPunch}
        onClose={() => setShowPunch(false)}
        className="max-w-md"
      >
        <div className="p-8 border-b border-gray-100 bg-[#F8FAFC]">
          <h2 className="text-2xl font-black text-[#111827] tracking-tighter text-left">
            Chronological Punch
          </h2>
        </div>
        <form onSubmit={handlePunch} className="p-8 space-y-6 text-left">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
              Select Professional
            </label>
            <select
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none"
              required
              value={punchData.employee_id}
              onChange={(e) =>
                setPunchData({ ...punchData, employee_id: e.target.value })
              }
            >
              <option value="" disabled>Select an employee</option>
              {employees.map((emp) => (
                <option key={emp.realId} value={emp.realId}>
                  {emp.name} ({emp.department})
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
              Action Node
            </label>
            <select
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] outline-none"
              value={punchData.action}
              onChange={(e) =>
                setPunchData({ ...punchData, action: e.target.value })
              }
            >
              <option value="IN">Punch IN</option>
              <option value="OUT">Punch OUT</option>
            </select>
          </div>
          <div className="pt-6 flex gap-4">
            <button
              type="button"
              onClick={() => setShowPunch(false)}
              className="flex-1 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
            >
              Abort
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] bg-[#000000] text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50"
            >
              {loading ? "Recording..." : "Log Attendance"}
            </button>
          </div>
        </form>
      </BaseModal>
    </div>
  );
}
