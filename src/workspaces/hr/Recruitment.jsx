import { useHR } from "../../context/HRContext";
import { useState } from "react";

export default function RecruitmentView() {
  const { recruitment, hireCandidate } = useHR();
  const [showPool, setShowPool] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const openPool = (job) => {
    setSelectedJob(job);
    setShowPool(true);
  };

  const handleHire = async (candidate) => {
    try {
      await hireCandidate(selectedJob.id, candidate);
      setShowPool(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1">
          <h2 className="text-4xl font-black font-heading text-[#111827] tracking-tighter leading-none">
            Talent Acquisition
          </h2>
          <p className="text-[11px] font-black font-subheading text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 text-left">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            Hiring Desk & Strategic Workforce Expansion
          </p>
        </div>
        <button className="bg-[#000000] text-white px-8 py-4 rounded-[20px] text-[11px] font-black font-subheading uppercase tracking-[0.15em] shadow-xl transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3">
          + Broadcast Job
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
        {recruitment.map((job) => (
          <div
            key={job.id}
            className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden text-left"
          >
            <div className="flex justify-between items-start mb-10 text-left">
              <span className="text-[10px] font-black font-subheading text-white bg-[#1E293B] px-3 py-1 rounded-lg uppercase tracking-widest leading-none">
                {job.type}
              </span>
              <span className="text-[10px] font-black font-body text-gray-400 font-mono tracking-widest">
                {job.id}
              </span>
            </div>

            <div className="mb-10 text-left">
              <h3 className="text-2xl font-black font-heading text-[#111827] mb-1 text-left">
                {job.title}
              </h3>
              <p className="text-[11px] font-black font-subheading text-[#195bac] uppercase tracking-widest text-left">
                {job.dept}
              </p>
            </div>

            <div className="flex items-center justify-between p-6 bg-gray-50/50 rounded-3xl border border-gray-100">
              <div className="text-left">
                <p className="text-xs font-black font-subheading text-gray-400 uppercase leading-none mb-1">
                  Applications
                </p>
                <p className="text-xl font-black font-heading text-[#1E293B]">
                  {job.candidates.length}
                </p>
              </div>
              <div className="text-right">
                <button
                  onClick={() => openPool(job)}
                  className="bg-white px-5 py-2.5 rounded-xl border border-gray-200 text-[10px] font-black font-subheading uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-sm"
                >
                  Review Pool
                </button>
              </div>
            </div>

            <div className="absolute -right-4 top-1/2 -translate-y-1/2 opacity-[0.03] text-[120px] font-black rotate-90 select-none pointer-events-none">
              {job.title[0]}
            </div>
          </div>
        ))}
      </div>

      {showPool && (
        <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-xl z-[9999] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden border border-white">
            <div className="p-10 border-b border-gray-100 bg-[#F8FAFC]">
              <h2 className="text-2xl font-black font-heading text-[#111827] tracking-tighter text-left">
                Candidate Intelligence
              </h2>
              <p className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest mt-1 text-left">
                Applicant pool for {selectedJob?.title}
              </p>
            </div>
            <div className="p-0 text-left">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-10 py-5 text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest text-left">
                      Applicant
                    </th>
                    <th className="px-10 py-5 text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest text-left">
                      Status
                    </th>
                    <th className="px-10 py-5 text-right text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest">
                      Decision
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {selectedJob?.candidates.map((candidate) => (
                    <tr
                      key={candidate.id}
                      className="hover:bg-blue-50/20 transition-all group"
                    >
                      <td className="px-10 py-6 text-left">
                        <div className="font-black font-heading text-[#1E293B] text-base">
                          {candidate.name}
                        </div>
                        <div className="text-[10px] font-black font-subheading text-gray-400">
                          {candidate.email}
                        </div>
                      </td>
                      <td className="px-10 py-6 text-left">
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black font-subheading uppercase tracking-widest border border-amber-100">
                          {candidate.status}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <button
                          onClick={() => handleHire(candidate)}
                          className="px-5 py-2.5 bg-[#195bac] text-white rounded-xl text-[10px] font-black font-subheading uppercase tracking-widest shadow-lg shadow-blue-100 hover:-translate-y-1 transition-all"
                        >
                          Confirm Hire
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-10 border-t border-gray-50 flex items-center justify-between">
              <p className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest leading-relaxed">
                Confirming a hire automatically initializes the Employee Index
                record and generates an Onboarding Performance track.
              </p>
              <button
                onClick={() => setShowPool(false)}
                className="text-[11px] font-black font-subheading text-gray-400 uppercase tracking-widest hover:text-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
