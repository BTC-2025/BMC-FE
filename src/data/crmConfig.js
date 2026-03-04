export const CRM_CONFIG = {
  workspace: {
    id: "crm",
    name: "Customer Relationship",
    sidebar: {
      enterpriseSections: [
        {
          title: "Executive",
          items: [{ id: "overview", label: "Overview Dashboard", icon: "📊" }],
        },
        {
          title: "Sales Pipeline",
          items: [
            { id: "leads", label: "Leads", icon: "🎯" },
            { id: "deals", label: "Deals", icon: "💰" },
            { id: "quotes", label: "Quotations", icon: "🧾" },
            { id: "sales_orders", label: "Sales Orders", icon: "📑" },
          ],
        },
        {
          title: "Relationship Management",
          items: [
            { id: "customers", label: "Customers", icon: "👥" },
            { id: "contacts", label: "Contacts", icon: "📇" },
            { id: "activities", label: "Activities", icon: "📞" },
          ],
        },
        {
          title: "Marketing & Insights",
          items: [{ id: "reports", label: "Deep Analytics", icon: "📈" }],
        },
      ],
      liteSections: [
        {
          title: "Quick Access",
          items: [{ id: "overview", label: "Dashboard", icon: "⚡" }],
        },
        {
          title: "Sales Hub",
          items: [
            { id: "leads", label: "Leads", icon: "🎯" },
            { id: "deals", label: "Deals", icon: "💰" },
            { id: "quotes", label: "Quotes", icon: "🧾" },
            { id: "sales_orders", label: "Orders", icon: "📑" },
          ],
        },
        {
          title: "Directory",
          items: [
            { id: "customers", label: "Customers", icon: "👥" },
            { id: "contacts", label: "Contacts", icon: "📇" },
            { id: "activities", label: "Tasks", icon: "📞" },
            { id: "reports", label: "Stats", icon: "📈" },
          ],
        },
      ],
    },
  },
};
