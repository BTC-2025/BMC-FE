import { useHR } from "../../context/HRContext";

export default function LeaveManagementView() {
  const { leaves, approveLeave, updateLeaveStatus } = useHR();

  // Helper to handle approval which triggers attendance log in context
  const handleApprove = (id) => {
    approveLeave(id);
  };

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1">
          <h2 className="text-4xl font-black font-heading text-[#111827] tracking-tighter leading-none">
            Leave Matrix
          </h2>
          <p className="text-[11px] font-black font-subheading text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Absence Scheduling & Contingency Planning
          </p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-2xl h-fit">
          <button className="px-6 py-2.5 rounded-xl bg-white text-[#111827] shadow-sm text-[10px] font-black uppercase tracking-widest transition-all">
            Pending Approval
          </button>
          <button className="px-6 py-2.5 rounded-xl text-gray-400 hover:text-gray-600 text-[10px] font-black uppercase tracking-widest transition-all">
            Archived History
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#F8FAFC]">
              <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">
                Requester
              </th>
              <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">
                Absence Type
              </th>
              <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">
                Timeline Index
              </th>
              <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">
                Duration
              </th>
              <th className="px-8 py-6 text-right text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">
                Decision Terminal
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {leaves.map((lv) => (
              <tr
                key={lv.id}
                className="hover:bg-blue-50/20 transition-all group"
              >
                <td className="px-8 py-6">
                  <div className="font-black font-heading text-[#1E293B] text-base mb-0.5">
                    {lv.name}
                  </div>
                  <div className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest">
                    {lv.role} • # {lv.id.toString().padStart(3, "0")}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-[11px] font-black font-subheading text-[#4B5563] bg-gray-100 px-3 py-1.5 rounded-xl uppercase tracking-widest">
                    {lv.leave_type}
                  </span>
                </td>
                <td className="px-8 py-6 text-left">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[11px] font-black text-[#1E293B]">
                      {new Date(lv.start_date).toLocaleDateString()}
                    </span>
                    <span className="text-gray-300">→</span>
                    <span className="font-mono text-[11px] font-black text-[#1E293B]">
                      {new Date(lv.end_date).toLocaleDateString()}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="text-base font-black font-body text-[#195bac]">
                    {Math.ceil(
                      (new Date(lv.end_date) - new Date(lv.start_date)) /
                        (1000 * 60 * 60 * 24),
                    ) + 1}{" "}
                    <span className="text-[10px] font-black font-subheading text-gray-400 uppercase">
                      Days
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex justify-end gap-3">
                    {lv.status === "PENDING" ? (
                      <>
                        <button
                          onClick={() => handleApprove(lv.id)}
                          className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-100"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateLeaveStatus(lv.id, "Rejected")}
                          className="px-5 py-2.5 rounded-xl bg-gray-50 text-[#111827] border border-gray-100 text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border
                                        ${lv.status === "APPROVED" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${lv.status === "APPROVED" ? "bg-emerald-500" : "bg-rose-500"}`}
                        ></span>
                        {lv.status}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-[#1E293B] p-8 rounded-[40px] text-left text-white/90 border border-white/10 shadow-2xl relative overflow-hidden group">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h4 className="text-xl font-black font-heading mb-2 text-white">
              Flow Intelligence
            </h4>
            <p className="text-xs font-black font-subheading text-blue-100 leading-relaxed">
              System monitoring shows seasonal intermission trends are within
              normal operational variance for Q1.
            </p>
          </div>
          <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center text-2xl border border-white/10 group-hover:scale-110 transition-transform">
            ⚙️
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 text-[120px] opacity-5 select-none font-black font-sans pointer-events-none">
          MATRIX
        </div>
      </div>
    </div>
  );
}
