import { useState, useMemo } from "react";
import { useHR } from "../../context/HRContext";

// ─── Helpers ────────────────────────────────────────────────────────────────
const STATUS_META = {
  PENDING:     { label: "Pending",     bg: "bg-amber-50",  text: "text-amber-600",  border: "border-amber-100"  },
  IN_PROGRESS: { label: "In Progress", bg: "bg-blue-50",   text: "text-blue-600",   border: "border-blue-100"   },
  COMPLETED:   { label: "Completed",   bg: "bg-emerald-50",text: "text-emerald-600",border: "border-emerald-100" },
};

const SCORE_COLOR = (s) => {
  if (s >= 4.5) return { text: "text-emerald-600", bg: "bg-emerald-50", label: "Exemplary" };
  if (s >= 3.5) return { text: "text-blue-600",    bg: "bg-blue-50",    label: "Proficient" };
  if (s >= 2.5) return { text: "text-amber-600",   bg: "bg-amber-50",   label: "Average"    };
  return            { text: "text-red-500",         bg: "bg-red-50",     label: "Needs Work" };
};

const REVIEW_TYPES = ["MANAGER", "SELF", "360"];
const PERIODS = ["Q1-2026", "Q2-2026", "Q3-2026", "Q4-2026", "Annual-2026",
                 "Q1-2025", "Q2-2025", "Q3-2025", "Q4-2025", "Annual-2025"];
const STATUSES = ["PENDING", "IN_PROGRESS", "COMPLETED"];

const EMPTY_FORM = {
  employee_id: "",
  review_period: "Q1-2026",
  review_type: "MANAGER",
  communication_score: 3,
  technical_score: 3,
  teamwork_score: 3,
  leadership_score: 3,
  goals_achieved: 80,
  feedback: "",
  status: "PENDING",
  score: 3,
};

// ─── ScoreSlider sub-component ───────────────────────────────────────────────
function ScoreSlider({ label, value, onChange, icon }) {
  const pct = ((value / 5) * 100).toFixed(0);
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <label className="flex items-center gap-2 text-[10px] font-black font-subheading text-[#1E293B] uppercase tracking-widest">
          <span>{icon}</span>
          {label}
        </label>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black font-subheading text-gray-400 uppercase">{pct}%</span>
          <span className="text-xl font-black font-heading text-[#195bac] font-mono">{Number(value).toFixed(1)}</span>
        </div>
      </div>
      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-blue-400 to-[#195bac] transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <input
        type="range" min="0" max="5" step="0.1"
        className="w-full h-2 opacity-0 -mt-2 cursor-pointer"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
}

// ─── AppraisalModal ───────────────────────────────────────────────────────────
function AppraisalModal({ mode, initial, employees, onClose, onSubmit, loading }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);

  const autoScore = useMemo(() => {
    const weights = { communication_score: 0.25, technical_score: 0.30, teamwork_score: 0.25, leadership_score: 0.20 };
    const cats = ["communication_score", "technical_score", "teamwork_score", "leadership_score"];
    const all = cats.map((k) => parseFloat(form[k]));
    if (all.every((v) => !isNaN(v) && v !== null)) {
      return parseFloat(cats.reduce((sum, k) => sum + weights[k] * parseFloat(form[k]), 0).toFixed(2));
    }
    return parseFloat(form.score) || 0;
  }, [form]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, score: autoScore });
  };

  return (
    <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-xl z-[9999] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl border border-white my-8">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 bg-[#F8FAFC] rounded-t-[40px] flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black font-heading text-[#111827] tracking-tighter">
              {mode === "edit" ? "Edit Appraisal" : "New Appraisal"}
            </h2>
            <p className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest mt-1">
              {mode === "edit" ? "Update performance evaluation" : "Create performance evaluation"}
            </p>
          </div>
          <div className={`w-16 h-16 rounded-[22px] flex items-center justify-center text-3xl font-black font-mono border ${SCORE_COLOR(autoScore).bg} ${SCORE_COLOR(autoScore).text} border-gray-100`}>
            {autoScore.toFixed(1)}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Employee + Meta */}
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest mb-2">Employee</label>
              <select
                required
                value={form.employee_id}
                onChange={(e) => set("employee_id", parseInt(e.target.value))}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[13px] font-black font-heading text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#195bac]/20 focus:border-[#195bac]"
              >
                <option value="">Select employee...</option>
                {employees.map((e) => (
                  <option key={e.realId || e.id} value={e.realId || parseInt(String(e.id).replace("EMP-", ""))}>
                    {e.name} – {e.department || e.role || ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest mb-2">Review Period</label>
              <select value={form.review_period} onChange={(e) => set("review_period", e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[13px] font-black font-heading text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#195bac]/20">
                {PERIODS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest mb-2">Review Type</label>
              <select value={form.review_type} onChange={(e) => set("review_type", e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[13px] font-black font-heading text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#195bac]/20">
                {REVIEW_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Category Scores */}
          <div className="bg-gray-50 rounded-[28px] p-6 space-y-5 border border-gray-100">
            <p className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest">Category Scores</p>
            <ScoreSlider label="Communication" icon="💬" value={form.communication_score} onChange={(v) => set("communication_score", v)} />
            <ScoreSlider label="Technical"     icon="⚙️" value={form.technical_score}     onChange={(v) => set("technical_score", v)}     />
            <ScoreSlider label="Teamwork"      icon="🤝" value={form.teamwork_score}      onChange={(v) => set("teamwork_score", v)}      />
            <ScoreSlider label="Leadership"    icon="🏆" value={form.leadership_score}    onChange={(v) => set("leadership_score", v)}    />
          </div>

          {/* Goals + Status */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest mb-2">Goals Achieved (%)</label>
              <div className="flex items-center gap-3">
                <input type="range" min="0" max="100" step="5"
                  className="flex-1 h-2 rounded-full accent-[#195bac] cursor-pointer"
                  value={form.goals_achieved}
                  onChange={(e) => set("goals_achieved", parseInt(e.target.value))} />
                <span className="text-xl font-black font-heading text-[#195bac] font-mono w-14 text-right">{form.goals_achieved}%</span>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest mb-2">Status</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[13px] font-black font-heading text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#195bac]/20">
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Feedback */}
          <div>
            <label className="block text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest mb-2">Feedback</label>
            <textarea
              rows={3}
              placeholder="Enter qualitative feedback for this employee..."
              value={form.feedback}
              onChange={(e) => set("feedback", e.target.value)}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[13px] font-black font-body text-[#1E293B] resize-none focus:outline-none focus:ring-2 focus:ring-[#195bac]/20 focus:border-[#195bac] placeholder:text-gray-300 placeholder:font-normal"
            />
          </div>

          {/* Auto-score preview */}
          <div className={`p-5 rounded-[24px] border ${SCORE_COLOR(autoScore).bg} ${SCORE_COLOR(autoScore).border || "border-gray-100"} flex items-center justify-between`}>
            <div>
              <p className={`text-[10px] font-black font-subheading uppercase tracking-widest ${SCORE_COLOR(autoScore).text}`}>
                Computed Overall Score
              </p>
              <p className="text-[11px] font-black font-body text-gray-500 mt-0.5">Weighted avg: Comm 25% · Tech 30% · Team 25% · Lead 20%</p>
            </div>
            <div className={`text-4xl font-black font-heading font-mono ${SCORE_COLOR(autoScore).text}`}>
              {autoScore.toFixed(2)}
              <span className="text-base ml-1 font-normal text-gray-400">/ 5</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-5 rounded-2xl text-[11px] font-black font-subheading uppercase tracking-widest text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-[2] bg-[#111827] text-white py-5 rounded-2xl text-[11px] font-black font-subheading uppercase tracking-[0.2em] shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-60">
              {loading ? "Saving..." : mode === "edit" ? "Update Appraisal" : "Create Appraisal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── DeleteConfirmModal ──────────────────────────────────────────────────────
function DeleteModal({ appraisal, onClose, onConfirm, loading }) {
  return (
    <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-xl z-[9999] flex items-center justify-center p-6">
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md border border-white p-10 text-center space-y-6">
        <div className="w-20 h-20 rounded-[30px] bg-red-50 border border-red-100 flex items-center justify-center text-4xl mx-auto">🗑️</div>
        <div>
          <h2 className="text-2xl font-black font-heading text-[#111827] tracking-tighter">Delete Appraisal</h2>
          <p className="text-[11px] font-black font-subheading text-gray-400 uppercase tracking-widest mt-2">
            {appraisal.name} · {appraisal.review_period || "No Period"}
          </p>
          <p className="text-[13px] font-black font-body text-gray-500 mt-4">
            This will permanently remove the appraisal record. This action cannot be undone.
          </p>
        </div>
        <div className="flex gap-4 pt-2">
          <button onClick={onClose}
            className="flex-1 py-5 rounded-2xl text-[11px] font-black font-subheading uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-[2] bg-red-500 text-white py-5 rounded-2xl text-[11px] font-black font-subheading uppercase tracking-[0.2em] hover:-translate-y-0.5 transition-all disabled:opacity-60">
            {loading ? "Deleting..." : "Confirm Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PerformanceView() {
  const {
    performance, appraisalSummary, employees, loading,
    createAppraisal, updateAppraisal, deleteAppraisal, refetchAppraisals,
  } = useHR();

  const [showModal, setShowModal] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [deleteRecord, setDeleteRecord] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterPeriod, setFilterPeriod] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Derived KPI values (from backend summary or compute locally)
  const stats = useMemo(() => {
    if (appraisalSummary) return appraisalSummary;
    const scores = performance.map((p) => parseFloat(p.score));
    const avg = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) : 0;
    return {
      total_reviews: performance.length,
      average_score: parseFloat(avg),
      pending_count: performance.filter((p) => p.status === "PENDING").length,
      completed_count: performance.filter((p) => p.status === "COMPLETED").length,
      in_progress_count: performance.filter((p) => p.status === "IN_PROGRESS").length,
      top_performers: [],
    };
  }, [performance, appraisalSummary]);

  // Available periods for filter
  const availablePeriods = useMemo(() => {
    const set = new Set(performance.map((p) => p.review_period).filter(Boolean));
    return ["ALL", ...set];
  }, [performance]);

  // Filtered list
  const filtered = useMemo(() => {
    return performance.filter((p) => {
      if (filterStatus !== "ALL" && p.status !== filterStatus) return false;
      if (filterPeriod !== "ALL" && p.review_period !== filterPeriod) return false;
      if (searchQuery && !p.name?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [performance, filterStatus, filterPeriod, searchQuery]);

  // Handlers
  const handleCreate = async (data) => {
    await createAppraisal(data);
    setShowModal(false);
  };

  const handleUpdate = async (data) => {
    await updateAppraisal(editRecord.id, data);
    setEditRecord(null);
  };

  const handleDelete = async () => {
    await deleteAppraisal(deleteRecord.id);
    setDeleteRecord(null);
  };

  const openEdit = (row) => {
    setEditRecord({
      ...row,
      employee_id: row.employee_id,
      communication_score: row.communication_score ?? 3,
      technical_score: row.technical_score ?? 3,
      teamwork_score: row.teamwork_score ?? 3,
      leadership_score: row.leadership_score ?? 3,
      goals_achieved: row.goals_achieved ?? 80,
      feedback: row.feedback ?? "",
    });
  };

  const kpiCards = [
    { label: "Total Reviews",   value: stats.total_reviews,   icon: "📋", color: "bg-blue-50 text-blue-600",   border: "border-blue-100/50"    },
    { label: "Avg Score",       value: `${stats.average_score}/5`, icon: "⭐", color: "bg-amber-50 text-amber-600",  border: "border-amber-100/50"   },
    { label: "Pending",         value: stats.pending_count,    icon: "⏳", color: "bg-orange-50 text-orange-600",border: "border-orange-100/50"  },
    { label: "Completed",       value: stats.completed_count,  icon: "✅", color: "bg-emerald-50 text-emerald-600",border:"border-emerald-100/50"},
  ];

  return (
    <div className="p-8 md:p-10 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500 text-left">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1">
          <h2 className="text-4xl font-black font-heading text-[#111827] tracking-tighter leading-none">
            Talent Appraisals
          </h2>
          <p className="text-[11px] font-black font-subheading text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse inline-block" />
            Performance Benchmarking &amp; Evaluation Analytics
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-3 px-8 py-4 bg-[#111827] text-white rounded-2xl text-[11px] font-black font-subheading uppercase tracking-[0.2em] hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300 shrink-0"
        >
          <span className="text-lg">+</span>
          New Appraisal
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, i) => (
          <div key={i}
            className={`bg-white p-8 rounded-[36px] border ${card.border} shadow-sm hover:shadow-lg transition-all duration-500 flex flex-col gap-5`}>
            <div className={`w-14 h-14 rounded-[18px] ${card.color} flex items-center justify-center text-2xl border border-black/5`}>
              {card.icon}
            </div>
            <div>
              <p className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest">{card.label}</p>
              <p className="text-3xl font-black font-heading text-[#111827] tracking-tighter tabular-nums">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Top Performers Strip */}
      {stats.top_performers && stats.top_performers.length > 0 && (
        <div className="bg-gradient-to-r from-[#111827] to-[#1e3a5f] rounded-[32px] p-6 flex items-center gap-8 overflow-x-auto">
          <div className="shrink-0">
            <p className="text-[10px] font-black font-subheading text-blue-400 uppercase tracking-widest">Top Performers</p>
            <p className="text-white font-black font-heading text-lg tracking-tighter">Hall of Excellence</p>
          </div>
          <div className="flex gap-6 flex-1">
            {stats.top_performers.map((tp, i) => {
              const medals = ["🥇", "🥈", "🥉"];
              return (
                <div key={tp.employee_id} className="flex items-center gap-3 bg-white/10 rounded-[20px] px-5 py-3 shrink-0">
                  <span className="text-2xl">{medals[i] || "⭐"}</span>
                  <div>
                    <p className="text-white font-black font-heading text-sm tracking-tight">{tp.name}</p>
                    <p className="text-blue-300 text-[10px] font-black font-subheading uppercase tracking-widest">Score {tp.score.toFixed(2)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Search by employee name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-5 py-4 bg-white border border-gray-100 rounded-2xl text-[13px] font-black font-body text-[#1E293B] placeholder:text-gray-300 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-[#195bac]/20 shadow-sm"
          />
        </div>

        {/* Status filter pills */}
        <div className="flex gap-2">
          {["ALL", ...STATUSES].map((s) => (
            <button key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-3 rounded-xl text-[10px] font-black font-subheading uppercase tracking-widest transition-all ${
                filterStatus === s
                  ? "bg-[#111827] text-white shadow-lg"
                  : "bg-white border border-gray-100 text-gray-400 hover:border-gray-200"
              }`}>
              {s === "ALL" ? "All Status" : STATUS_META[s]?.label}
            </button>
          ))}
        </div>

        {/* Period select */}
        <select
          value={filterPeriod}
          onChange={(e) => setFilterPeriod(e.target.value)}
          className="px-5 py-4 bg-white border border-gray-100 rounded-2xl text-[12px] font-black font-subheading text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#195bac]/20 shadow-sm uppercase tracking-widest"
        >
          {availablePeriods.map((p) => <option key={p}>{p}</option>)}
        </select>

        {(filterStatus !== "ALL" || filterPeriod !== "ALL" || searchQuery) && (
          <button onClick={() => { setFilterStatus("ALL"); setFilterPeriod("ALL"); setSearchQuery(""); }}
            className="px-4 py-3 rounded-xl text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest hover:text-red-400 transition-colors">
            ✕ Clear
          </button>
        )}
      </div>

      {/* Appraisals Table */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {["Employee", "Department", "Period", "Type", "Comm", "Tech", "Team", "Lead", "Goals", "Overall", "Status", "Date", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-5 text-[10px] font-black font-subheading text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={13} className="py-20 text-center">
                    <p className="text-5xl mb-4">📋</p>
                    <p className="text-[13px] font-black font-heading text-gray-300 uppercase tracking-widest">No appraisals found</p>
                    <p className="text-[11px] font-black font-subheading text-gray-200 uppercase tracking-widest mt-1">
                      {performance.length === 0 ? "Create your first appraisal to get started" : "Try adjusting the filters"}
                    </p>
                  </td>
                </tr>
              )}
              {filtered.map((row) => {
                const sc = SCORE_COLOR(row.score);
                const stMeta = STATUS_META[row.status] || STATUS_META.PENDING;
                const fmtScore = (v) => v != null ? parseFloat(v).toFixed(1) : "—";
                return (
                  <tr key={row.id} className="hover:bg-[#195bac]/[0.02] transition-all group">
                    {/* Employee */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-[14px] bg-[#195bac]/10 text-[#195bac] flex items-center justify-center font-black font-heading text-sm shrink-0">
                          {row.name?.[0] || "?"}
                        </div>
                        <div>
                          <p className="font-black font-heading text-[#1E293B] text-[13px] whitespace-nowrap">{row.name}</p>
                          <p className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest">{row.role || "—"}</p>
                        </div>
                      </div>
                    </td>
                    {/* Department */}
                    <td className="px-6 py-5 text-[12px] font-black font-heading text-[#4B5563] uppercase tracking-tight whitespace-nowrap">
                      {row.department || "—"}
                    </td>
                    {/* Period */}
                    <td className="px-6 py-5">
                      <span className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-[10px] font-black font-subheading uppercase tracking-widest border border-gray-100 whitespace-nowrap">
                        {row.review_period || "—"}
                      </span>
                    </td>
                    {/* Type */}
                    <td className="px-6 py-5 text-[10px] font-black font-subheading text-gray-500 uppercase tracking-widest whitespace-nowrap">
                      {row.review_type || "MANAGER"}
                    </td>
                    {/* Category scores */}
                    {["communication_score", "technical_score", "teamwork_score", "leadership_score"].map((key) => (
                      <td key={key} className="px-6 py-5 text-[12px] font-black font-mono text-center text-gray-600">
                        {fmtScore(row[key])}
                      </td>
                    ))}
                    {/* Goals */}
                    <td className="px-6 py-5">
                      {row.goals_achieved != null ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#195bac] rounded-full" style={{ width: `${row.goals_achieved}%` }} />
                          </div>
                          <span className="text-[11px] font-black font-mono text-[#195bac]">{row.goals_achieved}%</span>
                        </div>
                      ) : <span className="text-gray-300">—</span>}
                    </td>
                    {/* Overall score */}
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1.5 rounded-xl text-[12px] font-black font-mono ${sc.bg} ${sc.text} border border-gray-100`}>
                        {row.score?.toFixed ? row.score.toFixed(2) : row.score}
                      </span>
                    </td>
                    {/* Status */}
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black font-subheading uppercase tracking-widest border whitespace-nowrap ${stMeta.bg} ${stMeta.text} ${stMeta.border}`}>
                        {stMeta.label}
                      </span>
                    </td>
                    {/* Date */}
                    <td className="px-6 py-5 text-[11px] font-black font-subheading text-gray-400 uppercase tracking-widest whitespace-nowrap">
                      {row.reviewed_at || row.lastReview || "—"}
                    </td>
                    {/* Actions */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(row)}
                          className="text-[10px] font-black font-subheading text-[#195bac] uppercase tracking-widest px-3 py-2 hover:bg-blue-50 rounded-xl transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteRecord(row)}
                          className="text-[10px] font-black font-subheading text-red-400 uppercase tracking-widest px-3 py-2 hover:bg-red-50 rounded-xl transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {filtered.length > 0 && (
          <div className="px-8 py-5 border-t border-gray-50 flex items-center justify-between">
            <p className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest">
              Showing {filtered.length} of {performance.length} appraisals
            </p>
            <div className="flex items-center gap-2">
              {["PENDING", "IN_PROGRESS", "COMPLETED"].map((s) => {
                const count = filtered.filter((p) => p.status === s).length;
                const m = STATUS_META[s];
                return count > 0 ? (
                  <span key={s} className={`px-3 py-1.5 rounded-lg text-[9px] font-black font-subheading uppercase tracking-widest border ${m.bg} ${m.text} ${m.border}`}>
                    {count} {m.label}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showModal && (
        <AppraisalModal
          mode="create"
          employees={employees}
          onClose={() => setShowModal(false)}
          onSubmit={handleCreate}
          loading={loading}
        />
      )}

      {editRecord && (
        <AppraisalModal
          mode="edit"
          initial={editRecord}
          employees={employees}
          onClose={() => setEditRecord(null)}
          onSubmit={handleUpdate}
          loading={loading}
        />
      )}

      {deleteRecord && (
        <DeleteModal
          appraisal={deleteRecord}
          onClose={() => setDeleteRecord(null)}
          onConfirm={handleDelete}
          loading={loading}
        />
      )}
    </div>
  );
}
