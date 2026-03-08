import { useState, useEffect } from "react";
import { ProjectsProvider, useProjects } from "../context/ProjectsContext";
import { useScaleMode } from "../context/ScaleModeContext";
import ProjectSidebar from "../workspaces/projects/ProjectSidebar";
import ProjectOverview from "../workspaces/projects/ProjectOverview";
import ProjectList from "../workspaces/projects/ProjectList";
import ProjectTasks from "../workspaces/projects/ProjectTasks";
import ProjectMilestones from "../workspaces/projects/ProjectMilestones";
import ProjectTeam from "../workspaces/projects/ProjectTeam";
import ProjectTime from "../workspaces/projects/ProjectTime";
import ProjectIssues from "../workspaces/projects/ProjectIssues";
import ProjectDocuments from "../workspaces/projects/ProjectDocuments";
import ProjectReports from "../workspaces/projects/ProjectReports";
import ProjectBOM from "../workspaces/projects/ProjectBOM";

function ProjectContent({ onBack, initialView }) {
  const { scaleMode } = useScaleMode();
  const { projects, allTasks, allMilestones, createProject, updateTask, addTask, removeTask, addMilestone, updateMilestone, removeMilestone, loading, error } = useProjects();
  
  const [activeTab, setActiveTab] = useState(
    initialView === "overview" ? "Overview" : 
    initialView === "projects" ? "Projects" :
    "Overview"
  );
  const [isCreatingProject, setIsCreatingProject] = useState(initialView === "new");
  const [creationStep, setCreationStep] = useState(1);
  
  // These still use mock for now as they are secondary to the goal (team, issues)
  const [team, setTeam] = useState([
    { id: "MEM-001", name: "Gautam Karthik", role: "Project Manager", status: "Active", availability: "High", email: "gautam@btc.com", department: "Operations" },
  ]);
  const [issues, setIssues] = useState([
    { id: "ISS-001", title: "API Endpoint Latency", project: "General", priority: "Critical", status: "Open", date: "Jan 12", description: "Production endpoint responding with 5s delay." },
  ]);

  const enterpriseSections = [
    { title: "Core", items: [{ id: "Overview", label: "Overview", icon: "📊" }, { id: "Projects", label: "Projects", icon: "📁" }, { id: "Tasks", label: "Tasks", icon: "📋" }] },
    { title: "Plan", items: [{ id: "Milestones", label: "Milestones", icon: "🏁" }, { id: "Team", label: "Team", icon: "👥" }, { id: "Time", label: "Timesheets", icon: "⏱️" }] },
    { title: "Review", items: [{ id: "Issues", label: "Issues", icon: "🐞" }, { id: "Documents", label: "Docs", icon: "📄" }, { id: "Reports", label: "Reports", icon: "📈" }] },
    { title: "Resources", items: [{ id: "BOM", label: "Project BOM", icon: "🧱" }] }
  ];

  const liteSections = [
    { title: "Dash", items: [{ id: "Overview", label: "Overview", icon: "📊" }] },
    { title: "Ops", items: [{ id: "Projects", label: "Projects", icon: "📁" }, { id: "Tasks", label: "Tasks", icon: "📋" }] },
    { title: "Team", items: [{ id: "Team", label: "Members", icon: "👥" }, { id: "Reports", label: "Stats", icon: "📈" }] }
  ];

  const sidebarSections = scaleMode === 'SMALL' ? liteSections : enterpriseSections;

  useEffect(() => {
    if (initialView) {
      if (initialView === "overview") setActiveTab("Overview");
      else if (initialView === "projects") setActiveTab("Projects");
      else if (initialView === "new") setIsCreatingProject(true);
      else setActiveTab(initialView);
    }
  }, [initialView]);

  const handleCreateProject = async (newProject) => {
    try {
        await createProject({
            name: newProject.name,
            description: "Initiated from ERP Dashboard",
            status: "PLANNING"
        });
        setIsCreatingProject(false);
        setActiveTab("Projects");
    } catch (err) {
        console.error("Project creation failed", err);
    }
  };

  const renderContent = () => {
    if (isCreatingProject) return <ProjectCreationWizard step={creationStep} setStep={setCreationStep} onCancel={() => setIsCreatingProject(false)} onFinish={handleCreateProject} />;
    
    const props = { onSelectView: setActiveTab };
    switch (activeTab) {
      case "Overview": return <ProjectOverview {...props} projects={projects} milestones={allMilestones} tasks={allTasks} />;
      case "Projects": return <ProjectList projects={projects} updateProject={updateProject} removeProject={removeProject} />;
      case "Tasks": return <ProjectTasks tasks={allTasks} updateTask={updateTask} removeTask={removeTask} addTask={addTask} />;
      case "Milestones": return <ProjectMilestones milestones={allMilestones} updateMilestone={updateMilestone} removeMilestone={removeMilestone} addMilestone={addMilestone} />;
      case "Team": return <ProjectTeam team={team} updateMember={() => {}} removeMember={() => {}} addMember={() => {}} />;
      case "Time": return <ProjectTime />;
      case "Issues": return <ProjectIssues issues={issues} updateIssue={() => {}} removeIssue={() => {}} addIssue={() => {}} />;
      case "BOM": return <ProjectBOM />;
      case "Documents": return <ProjectDocuments />;
      case "Reports": return <ProjectReports />;
      default: return <ProjectOverview {...props} />;
    }
  };

  return (
    <div className="flex min-h-full w-full bg-[#CFECF7] text-left font-sans relative">
      <ProjectSidebar 
        sections={sidebarSections}
        activeView={activeTab}
        onSelect={(tab) => {
          setActiveTab(tab);
          setIsCreatingProject(false);
        }}
        onBack={onBack}
      />
      
      <div className="flex-1 flex flex-col min-w-0 relative">
        {loading && (
             <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
             </div>
        )}

        {activeTab !== 'Overview' && !isCreatingProject && (
          <div className="bg-white/60 backdrop-blur-xl border-b border-white/50 px-6 sm:px-12 py-6 sm:py-8 flex items-center justify-between shrink-0 relative z-10 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.03)]">
            <div className="animate-in slide-in-from-left-4 duration-700 flex items-center gap-4 min-w-0 flex-1">
              <div className="min-w-0">
                <h2 className="text-2xl sm:text-3xl font-[1000] text-gray-950 tracking-tighter leading-none mb-1 uppercase truncate">
                  {isCreatingProject ? "INITIATIVE" : activeTab}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-[pulse_1.5s_infinite] shrink-0"></div>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] hidden sm:block truncate">
                    Tactical Deployment Ledger / Node Sync: <span className="text-emerald-500 font-black">100.0% Synchronized</span>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 shrink-0 px-2">
              {!isCreatingProject && (
                <button 
                  onClick={() => { setIsCreatingProject(true); setCreationStep(1); }}
                  className="bg-[#111827] text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all whitespace-nowrap"
                >
                  + Create
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex-1 p-0 bg-[#CFECF7]/30 relative text-left">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
          <div key={activeTab + isCreatingProject} className="animate-in fade-in slide-in-from-bottom-6 duration-700 h-full">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectWorkspace(props) {
    return (
        <ProjectsProvider>
            <ProjectContent {...props} />
        </ProjectsProvider>
    );
}

function ProjectCreationWizard({ step, setStep, onCancel, onFinish }) {
  const [name, setName] = useState("");

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="flex items-center justify-between mb-16 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
        {[1, 2, 3].map(s => (
          <div key={s} className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-500
            ${s < step ? 'bg-emerald-500 text-white shadow-lg' : s === step ? 'bg-[#195bac] text-white shadow-xl shadow-blue-200' : 'bg-white border-2 border-gray-100 text-gray-300'}`}>
            {s < step ? '✓' : s}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 p-8 sm:p-12 shadow-sm animate-in zoom-in-95 duration-500 relative overflow-hidden">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
            <h2 className="text-2xl font-[1000] text-gray-900 mb-2 tracking-tighter uppercase">Project DNA</h2>
            <p className="text-sm font-bold text-gray-400 mb-8 uppercase tracking-widest">Define the core identity of the initiative.</p>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Project Title</label>
                <input 
                    type="text" 
                    placeholder="e.g. Q3 Infrastructure Overhaul" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-5 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-blue-100 outline-none transition-all" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Department</label>
                  <select className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-5 text-sm font-bold text-gray-900 outline-none">
                    <option>Engineering</option>
                    <option>Marketing</option>
                    <option>Operations</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Budget Alloc.</label>
                  <input type="text" placeholder="$0.00" className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-5 text-sm font-bold text-gray-900 outline-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
            <h2 className="text-2xl font-[1000] text-gray-900 mb-2 tracking-tighter uppercase">Work Breakdown</h2>
            <p className="text-sm font-bold text-gray-400 mb-8 uppercase tracking-widest">Deconstruct the project into tactical task units.</p>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4 p-5 bg-gray-50 rounded-2xl items-center border border-transparent hover:border-gray-200 transition-all">
                  <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-black text-xs text-gray-400 shadow-sm border border-gray-100">{i}</span>
                  <input type="text" placeholder="Entry task name..." className="flex-1 bg-transparent border-none p-0 text-sm font-bold focus:ring-0 outline-none" />
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs text-gray-300 border border-gray-100 hover:text-[#195bac] cursor-pointer">👥</div>
                </div>
              ))}
              <button className="w-full py-5 border-2 border-dashed border-gray-200 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:border-[#195bac] hover:text-[#195bac] transition-all">+ Add Task Item</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
            <div className="w-20 h-20 bg-emerald-500 text-white rounded-3xl flex items-center justify-center text-4xl mx-auto mb-8 animate-bounce shadow-xl shadow-emerald-100">🏁</div>
            <h2 className="text-2xl font-[1000] text-gray-900 mb-2 tracking-tighter uppercase">Ready for Deployment</h2>
            <p className="text-sm font-bold text-gray-400 mb-12 max-w-sm mx-auto uppercase tracking-widest">All systems nominal. Initializing phase zero hub.</p>
            <div className="p-8 bg-gray-950 rounded-[32px] text-left mb-12 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Phase</span>
                    <span className="text-xs font-black text-emerald-400">ALPHA_INIT</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Team Priority</span>
                    <span className="text-xs font-black text-white">04 Tier-1 Assets Assigned</span>
                </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-100">
          <button onClick={step === 1 ? onCancel : () => setStep(step - 1)} className="text-[11px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-950 transition-colors">
            {step === 1 ? 'Abort' : 'Backtrack'}
          </button>
          <button 
            onClick={step === 3 ? () => onFinish({ name }) : () => setStep(step + 1)}
            className={`px-12 py-5 rounded-[24px] font-[1000] text-[11px] uppercase tracking-widest transition-all shadow-xl
              ${step === 3 ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-[#111827] text-white shadow-gray-200 hover:bg-black'}`}
          >
            {step === 3 ? 'Deploy Core' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
