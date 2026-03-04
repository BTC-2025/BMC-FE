export const HR_CONFIG = {
  workspace: {
    id: "hr",
    name: "Human Resources",
    sidebar: {
      enterpriseSections: [
        {
          title: "Personnel",
          items: [
            { id: "overview", label: "Global Presence", icon: "🌐" },
            { id: "employees", label: "Employee Index", icon: "👤" },
            { id: "departments", label: "Organization", icon: "🏢" },
          ],
        },
        {
          title: "Daily Operations",
          items: [
            { id: "attendance", label: "Attendance", icon: "⏰" },
            { id: "leaves", label: "Leave Matrix", icon: "🏖️" },
          ],
        },
        {
          title: "Finance & Growth",
          items: [
            { id: "payroll", label: "Payroll Terminal", icon: "💳" },
            { id: "performance", label: "Appraisals", icon: "⭐" },
          ],
        },
        {
          title: "Acquisition",
          items: [{ id: "recruitment", label: "Hiring Desk", icon: "🎯" }],
        },
        {
          title: "Reporting",
          items: [{ id: "reports", label: "Dossier & Stats", icon: "📜" }],
        },
      ],
      liteSections: [
        {
          title: "Directory",
          items: [
            { id: "overview", label: "Dashboard", icon: "⚡" },
            { id: "employees", label: "Employees", icon: "👤" },
            { id: "departments", label: "Teams", icon: "🏢" },
          ],
        },
        {
          title: "Management",
          items: [
            { id: "attendance", label: "Attendance", icon: "⏰" },
            { id: "leaves", label: "Leaves", icon: "🏖️" },
            { id: "payroll", label: "Payroll", icon: "💳" },
          ],
        },
        {
          title: "Growth",
          items: [
            { id: "performance", label: "Reviews", icon: "⭐" },
            { id: "recruitment", label: "Hiring", icon: "🎯" },
          ],
        },
      ],
    },
  },
};
