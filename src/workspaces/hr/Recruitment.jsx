import { useHR } from "../../context/HRContext";
import { useState } from "react";

const STATUS_COLORS = {
  APPLIED:   { bg: "bg-blue-50",   text: "text-blue-600",   border: "border-blue-100",   dot: "bg-blue-500"   },
  INTERVIEW: { bg: "bg-amber-50",  text: "text-amber-600",  border: "border-amber-100",  dot: "bg-amber-500"  },
  HIRED:     { bg: "bg-green-50",  text: "text-green-600",  border: "border-green-100",  dot: "bg-green-500"  },
  REJECTED:  { bg: "bg-red-50",    text: "text-red-600",    border: "border-red-100",    dot: "bg-red-400"    },
};

const JOB_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN"];

function StatPill({ label, value, accent }) {
  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-2xl px-8 py-5 border border-gray-100 shadow-sm min-w-[120px]">
      <span className={`text-2xl font-black font-heading ${accent}`}>{value}</span>
      <span className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest mt-0.5">{label}</span>
    </div>
  );
}

function BroadcastModal({ departments, onClose, onSubmit, loading }) {
  const [form, setForm] = useState({ title: "", type: "FULL_TIME", department_id: "" });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSubmit({ ...form, department_id: form.department_id ? Number(form.department_id) : null });
  };

  return (
    <div className="fixed inset-0 bg-[#0F172A]/75 backdrop-blur-xl z-[9999] flex items-center justify-center p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-[36px] shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="p-10 border-b border-gray-100 bg-[#F8FAFC]">
          <h2 className="text-2xl font-black font-heading text-[#111827] tracking-tighter">Broadcast Job Opening</h2>
          <p className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest mt-1">Post a new position to the hiring desk</p>
        </div>
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          <div>
            <label className="block text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest mb-2">Job Title *</label>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Senior Backend Engineer"
              className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#195bac]/30 focus:border-[#195bac] transition-all"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest mb-2">Type</label>
              <select
                value={form.type}
                onChange={(e) => set("type", e.target.value)}
                className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#195bac]/30 focus:border-[#195bac] transition-all bg-white"
              >
                {JOB_TYPES.map((t) => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest mb-2">Department</label>
              <select
                value={form.department_id}
                onChange={(e) => set("department_id", e.target.value)}
                className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#195bac]/30 focus:border-[#195bac] transition-all bg-white"
              >
                <option value="">General</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <button type="button" onClick={onClose} className="text-[11px] font-black font-subheading text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors">Cancel</button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#111827] text-white px-8 py-3.5 rounded-2xl text-[11px] font-black font-subheading uppercase tracking-widest shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? "Broadcasting…" : "Broadcast Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddCandidateModal({ job, onClose, onSubmit, loading }) {
  const [form, setForm] = useState({ candidate_name: "", email: "" });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.candidate_name.trim() || !form.email.trim()) return;
    onSubmit({ ...form, job_id: job.id });
  };

  return (
    <div className="fixed inset-0 bg-[#0F172A]/75 backdrop-blur-xl z-[9999] flex items-center justify-center p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-[36px] shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-10 border-b border-gray-100 bg-[#F8FAFC]">
          <h2 className="text-2xl font-black font-heading text-[#111827] tracking-tighter">Add Candidate</h2>
          <p className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest mt-1">
            Applying for: <span className="text-[#195bac]">{job.title}</span>
          </p>
        </div>
        <form onSubmit={handleSubmit} className="p-10 space-y-5">
          <div>
            <label className="block text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest mb-2">Full Name *</label>
            <input
              value={form.candidate_name}
              onChange={(e) => set("candidate_name", e.target.value)}
              placeholder="Candidate full name"
              className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#195bac]/30 focus:border-[#195bac] transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest mb-2">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="candidate@email.com"
              className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#195bac]/30 focus:border-[#195bac] transition-all"
              required
            />
          </div>
          <div className="flex items-center justify-between pt-2">
            <button type="button" onClick={onClose} className="text-[11px] font-black font-subheading text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors">Cancel</button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#195bac] text-white px-8 py-3.5 rounded-2xl text-[11px] font-black font-subheading uppercase tracking-widest shadow-lg shadow-blue-100 hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? "Adding…" : "Add Candidate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CandidatePipelineModal({ job, onClose, onUpdateStatus, onHire, loading }) {
  const [filter, setFilter] = useState("ALL");
  const stages = ["APPLIED", "INTERVIEW", "HIRED", "REJECTED"];

  const displayed = filter === "ALL"
    ? job.candidates
    : job.candidates.filter((c) => c.status === filter);

  const countByStage = (s) => job.candidates.filter((c) => c.status === s).length;

  return (
    <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-xl z-[9999] flex items-center justify-center p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-white">
        {/* Header */}
        <div className="p-10 border-b border-gray-100 bg-[#F8FAFC] shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-black font-heading text-[#111827] tracking-tighter">{job.title}</h2>
              <p className="text-[10px] font-black font-subheading text-[#195bac] uppercase tracking-widest mt-1">{job.dept} · {job.type.replace("_", " ")}</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-all flex items-center justify-center text-lg font-bold">×</button>
          </div>

          {/* Stage pills */}
          <div className="flex gap-2 mt-6 flex-wrap">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-4 py-2 rounded-xl text-[10px] font-black font-subheading uppercase tracking-widest transition-all border ${filter === "ALL" ? "bg-[#111827] text-white border-[#111827]" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"}`}
            >
              All ({job.candidates.length})
            </button>
            {stages.map((s) => {
              const c = STATUS_COLORS[s];
              const active = filter === s;
              return (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black font-subheading uppercase tracking-widest transition-all border ${active ? `${c.bg} ${c.text} ${c.border}` : "bg-white text-gray-400 border-gray-200 hover:border-gray-300"}`}
                >
                  {s} ({countByStage(s)})
                </button>
              );
            })}
          </div>
        </div>

        {/* Candidate list */}
        <div className="overflow-y-auto flex-1">
          {displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-sm font-black font-heading text-gray-400">No candidates in this stage</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/60 sticky top-0">
                  <th className="px-10 py-4 text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest">Candidate</th>
                  <th className="px-6 py-4 text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest">Stage</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {displayed.map((c) => {
                  const sc = STATUS_COLORS[c.status] || STATUS_COLORS.APPLIED;
                  return (
                    <tr key={c.id} className="hover:bg-blue-50/10 transition-all group">
                      <td className="px-10 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#195bac] to-[#4f8fe6] flex items-center justify-center text-white text-sm font-black shrink-0">
                            {c.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <div>
                            <div className="font-black font-heading text-[#1E293B] text-sm">{c.name}</div>
                            <div className="text-[10px] font-black font-subheading text-gray-400">{c.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black font-subheading uppercase tracking-widest border ${sc.bg} ${sc.text} ${sc.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}></span>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {c.status === "APPLIED" && (
                            <button
                              onClick={() => onUpdateStatus(c.id, "INTERVIEW")}
                              disabled={loading}
                              className="px-4 py-2 bg-amber-50 text-amber-600 border border-amber-100 rounded-xl text-[10px] font-black font-subheading uppercase tracking-widest hover:bg-amber-100 transition-all disabled:opacity-50"
                            >
                              → Interview
                            </button>
                          )}
                          {c.status === "INTERVIEW" && (
                            <button
                              onClick={() => onHire(c)}
                              disabled={loading}
                              className="px-4 py-2 bg-green-50 text-green-600 border border-green-100 rounded-xl text-[10px] font-black font-subheading uppercase tracking-widest hover:bg-green-100 transition-all disabled:opacity-50"
                            >
                              ✓ Hire
                            </button>
                          )}
                          {(c.status === "APPLIED" || c.status === "INTERVIEW") && (
                            <button
                              onClick={() => onUpdateStatus(c.id, "REJECTED")}
                              disabled={loading}
                              className="px-4 py-2 bg-red-50 text-red-500 border border-red-100 rounded-xl text-[10px] font-black font-subheading uppercase tracking-widest hover:bg-red-100 transition-all disabled:opacity-50"
                            >
                              ✗ Reject
                            </button>
                          )}
                          {(c.status === "HIRED" || c.status === "REJECTED") && (
                            <span className="text-[10px] font-black font-subheading text-gray-300 uppercase tracking-widest">Finalized</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-8 border-t border-gray-100 shrink-0 flex items-center justify-between bg-[#FAFAFA]">
          <p className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest leading-relaxed">
            Hiring confirms employment · Rejection is permanent
          </p>
          <button onClick={onClose} className="text-[11px] font-black font-subheading text-gray-400 uppercase tracking-widest hover:text-gray-700 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RecruitmentView() {
  const {
    recruitment, departments, loading,
    createJob, deleteJob, hireCandidate, updateApplicationStatus, addApplication,
  } = useHR();

  const [showBroadcast, setShowBroadcast] = useState(false);
  const [showPipeline, setShowPipeline] = useState(false);
  const [showAddCandidate, setShowAddCandidate] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // --- derived stats ---
  const totalJobs = recruitment.length;
  const totalCandidates = recruitment.reduce((s, j) => s + j.candidates.length, 0);
  const totalInterviews = recruitment.reduce((s, j) => s + j.candidates.filter((c) => c.status === "INTERVIEW").length, 0);
  const totalHired = recruitment.reduce((s, j) => s + j.candidates.filter((c) => c.status === "HIRED").length, 0);

  const openPipeline = (job) => { setSelectedJob(job); setShowPipeline(true); };
  const openAddCandidate = (job) => { setSelectedJob(job); setShowAddCandidate(true); };

  const handleCreateJob = async (data) => {
    await createJob(data);
    setShowBroadcast(false);
  };

  const handleAddCandidate = async (data) => {
    await addApplication(data);
    setShowAddCandidate(false);
    // Refresh selected job reference from refreshed recruitment list
    setShowPipeline(false);
  };

  const handleUpdateStatus = async (applicationId, status) => {
    await updateApplicationStatus(applicationId, status);
    setShowPipeline(false);
  };

  const handleHire = async (candidate) => {
    await hireCandidate(selectedJob?.id, candidate);
    setShowPipeline(false);
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Delete this job posting? All applications will also be removed.")) return;
    await deleteJob(jobId);
  };

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500 text-left">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1">
          <h2 className="text-4xl font-black font-heading text-[#111827] tracking-tighter leading-none">
            Talent Acquisition
          </h2>
          <p className="text-[11px] font-black font-subheading text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
            Hiring Desk &amp; Strategic Workforce Expansion
          </p>
        </div>
        <button
          onClick={() => setShowBroadcast(true)}
          className="bg-[#000000] text-white px-8 py-4 rounded-[20px] text-[11px] font-black font-subheading uppercase tracking-[0.15em] shadow-xl transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3 whitespace-nowrap"
        >
          + Broadcast Job
        </button>
      </div>

      {/* ── Stats bar ── */}
      <div className="flex gap-4 flex-wrap">
        <StatPill label="Open Roles"      value={totalJobs}        accent="text-[#111827]" />
        <StatPill label="Total Applicants" value={totalCandidates} accent="text-[#195bac]" />
        <StatPill label="In Interview"    value={totalInterviews}  accent="text-amber-500" />
        <StatPill label="Hired"           value={totalHired}       accent="text-green-600" />
      </div>

      {/* ── Empty state ── */}
      {recruitment.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <div className="text-6xl mb-5">📢</div>
          <h3 className="text-xl font-black font-heading text-[#1E293B] mb-2">No open roles yet</h3>
          <p className="text-sm text-gray-400 font-subheading mb-6">Broadcast your first job opening to start building a pipeline.</p>
          <button
            onClick={() => setShowBroadcast(true)}
            className="bg-[#111827] text-white px-8 py-4 rounded-[20px] text-[11px] font-black font-subheading uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all"
          >
            + Broadcast Job
          </button>
        </div>
      )}

      {/* ── Job Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recruitment.map((job) => {
          const applied   = job.candidates.filter((c) => c.status === "APPLIED").length;
          const interview = job.candidates.filter((c) => c.status === "INTERVIEW").length;
          const hired     = job.candidates.filter((c) => c.status === "HIRED").length;
          const rejected  = job.candidates.filter((c) => c.status === "REJECTED").length;

          return (
            <div
              key={job.id}
              className="bg-white p-8 rounded-[36px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden"
            >
              {/* Type badge + ID */}
              <div className="flex justify-between items-start mb-8">
                <span className="text-[10px] font-black font-subheading text-white bg-[#1E293B] px-3 py-1.5 rounded-lg uppercase tracking-widest">
                  {job.type.replace("_", " ")}
                </span>
                <button
                  onClick={() => handleDeleteJob(job.id)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-500 text-gray-400 text-sm font-bold transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                  title="Close job posting"
                >
                  ×
                </button>
              </div>

              {/* Title + Dept */}
              <div className="mb-8">
                <h3 className="text-xl font-black font-heading text-[#111827] mb-1">{job.title}</h3>
                <p className="text-[11px] font-black font-subheading text-[#195bac] uppercase tracking-widest">{job.dept}</p>
              </div>

              {/* Pipeline mini stats */}
              <div className="grid grid-cols-4 gap-2 mb-6">
                {[
                  { label: "Applied",   value: applied,   color: "text-blue-600",  bg: "bg-blue-50"  },
                  { label: "Interview", value: interview,  color: "text-amber-600", bg: "bg-amber-50" },
                  { label: "Hired",     value: hired,      color: "text-green-600", bg: "bg-green-50" },
                  { label: "Rejected",  value: rejected,   color: "text-red-500",   bg: "bg-red-50"   },
                ].map(({ label, value, color, bg }) => (
                  <div key={label} className={`${bg} rounded-2xl p-3 text-center`}>
                    <div className={`text-lg font-black font-heading ${color}`}>{value}</div>
                    <div className="text-[8px] font-black font-subheading text-gray-400 uppercase tracking-widest mt-0.5">{label}</div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => openPipeline(job)}
                  className="flex-1 py-3 bg-[#F8FAFC] border border-gray-100 rounded-2xl text-[10px] font-black font-subheading uppercase tracking-widest text-gray-600 hover:bg-[#111827] hover:text-white transition-all"
                >
                  View Pipeline
                </button>
                <button
                  onClick={() => openAddCandidate(job)}
                  className="flex-1 py-3 bg-[#195bac] text-white rounded-2xl text-[10px] font-black font-subheading uppercase tracking-widest hover:bg-[#1449a0] transition-all shadow-md shadow-blue-100"
                >
                  + Add Candidate
                </button>
              </div>

              {/* Watermark letter */}
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 opacity-[0.025] text-[130px] font-black rotate-90 select-none pointer-events-none">
                {job.title[0]}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Modals ── */}
      {showBroadcast && (
        <BroadcastModal
          departments={departments}
          loading={loading}
          onClose={() => setShowBroadcast(false)}
          onSubmit={handleCreateJob}
        />
      )}

      {showAddCandidate && selectedJob && (
        <AddCandidateModal
          job={selectedJob}
          loading={loading}
          onClose={() => setShowAddCandidate(false)}
          onSubmit={handleAddCandidate}
        />
      )}

      {showPipeline && selectedJob && (
        <CandidatePipelineModal
          job={recruitment.find((j) => j.id === selectedJob.id) || selectedJob}
          loading={loading}
          onClose={() => setShowPipeline(false)}
          onUpdateStatus={handleUpdateStatus}
          onHire={handleHire}
        />
      )}
    </div>
  );
}
