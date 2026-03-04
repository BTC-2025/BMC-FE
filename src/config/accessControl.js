export const PERMISSIONS = {
  INVENTORY: {
    VIEW: "inventory.view",
    CREATE_ITEM: "inventory.create_item",
    EDIT_ITEM: "inventory.edit_item",
    STOCK_IN_OUT: "inventory.stock_in_out",
    ADJUST_STOCK: "inventory.adjust_stock",
    TRANSFER_STOCK: "inventory.transfer_stock",
    APPROVE_ADJUSTMENT: "inventory.approve_adjustment",
    VIEW_REPORTS: "inventory.view_reports",
  },
  SCM: {
    VIEW: "scm.view",
    CREATE_PO: "scm.create_po",
    APPROVE_PO: "scm.approve_po",
    MANAGE_VENDORS: "scm.manage_vendors",
    TRACK_SHIPMENTS: "scm.track_shipments",
    VIEW_PERFORMANCE: "scm.view_performance",
  },
  CRM: {
    VIEW: "crm.view",
    CREATE_LEAD: "crm.create_lead",
    EDIT_LEAD: "crm.edit_lead",
    CONVERT_LEAD: "crm.convert_lead",
    MANAGE_OPPORTUNITIES: "crm.manage_opportunities",
    VIEW_REPORTS: "crm.view_reports",
  },
  FINANCE: {
    VIEW: "finance.view",
    CREATE_INVOICE: "finance.create_invoice",
    POST_JOURNAL: "finance.post_journal",
    APPROVE_ENTRIES: "finance.approve_entries",
    VIEW_REPORTS: "finance.view_reports",
    EXPORT_REPORTS: "finance.export_reports",
  },
  BI: {
    VIEW_DASHBOARD: "bi.view_dashboard",
    CREATE_DASHBOARD: "bi.create_dashboard",
    EDIT_DASHBOARD: "bi.edit_dashboard",
    SHARE_DASHBOARD: "bi.share_dashboard",
    EXPORT_DATA: "bi.export_data",
  },
  MANUFACTURING: {
    VIEW: "mfg.view",
    CREATE_BOM: "mfg.create_bom",
    CREATE_WORK_ORDER: "mfg.create_work_order",
    CONSUME_MATERIAL: "mfg.consume_material",
    RECEIVE_FINISHED_GOODS: "mfg.receive_finished_goods",
    VIEW_REPORTS: "mfg.view_reports",
  },
  PROJECTS: {
    VIEW: "project.view",
    CREATE: "project.create",
    ASSIGN_RESOURCES: "project.assign_resources",
    LOG_TIME: "project.log_time",
    APPROVE_COSTS: "project.approve_costs",
    VIEW_PROFITABILITY: "project.view_profitability",
  },
  HRM: {
    VIEW_EMPLOYEE: "hrm.view_employee",
    CREATE_EMPLOYEE: "hrm.create_employee",
    MANAGE_ATTENDANCE: "hrm.manage_attendance",
    PROCESS_PAYROLL: "hrm.process_payroll",
    VIEW_PAYSLIP: "hrm.view_payslip",
    APPROVE_LEAVE: "hrm.approve_leave",
  },
};

export const DEFAULT_ROLES = {
  ADMIN: {
    name: "Admin",
    permissions: ["*"], // Special wild-card for full access
    description: "Full system control and configuration",
  },
  INVENTORY_STAFF: {
    name: "Inventory Staff",
    permissions: [
      PERMISSIONS.INVENTORY.VIEW,
      PERMISSIONS.INVENTORY.EDIT_ITEM,
      PERMISSIONS.INVENTORY.STOCK_IN_OUT,
    ],
    description: "Basic inventory operations",
  },
  INVENTORY_MANAGER: {
    name: "Inventory Manager",
    permissions: Object.values(PERMISSIONS.INVENTORY),
    description: "Full inventory control including approvals",
  },
  PROCUREMENT_OFFICER: {
    name: "Procurement Officer",
    permissions: [
      PERMISSIONS.SCM.VIEW,
      PERMISSIONS.SCM.CREATE_PO,
      PERMISSIONS.SCM.TRACK_SHIPMENTS,
    ],
    description: "Vendor and purchase order management",
  },
  SCM_MANAGER: {
    name: "Supply Chain Manager",
    permissions: Object.values(PERMISSIONS.SCM),
    description: "Full supply chain oversight",
  },
  CRM_EXECUTIVE: {
    name: "CRM Executive",
    permissions: [
      PERMISSIONS.CRM.VIEW,
      PERMISSIONS.CRM.CREATE_LEAD,
      PERMISSIONS.CRM.EDIT_LEAD,
    ],
    description: "Lead generation and contact management",
  },
  CRM_MANAGER: {
    name: "CRM Manager",
    permissions: Object.values(PERMISSIONS.CRM),
    description: "Sales and lead conversion management",
  },
  FINANCE_ACCOUNTANT: {
    name: "Finance Accountant",
    permissions: [
      PERMISSIONS.FINANCE.VIEW,
      PERMISSIONS.FINANCE.CREATE_INVOICE,
      PERMISSIONS.FINANCE.POST_JOURNAL,
    ],
    description: "Daily accounting operations",
  },
  FINANCE_MANAGER: {
    name: "Finance Manager",
    permissions: Object.values(PERMISSIONS.FINANCE).filter(
      (p) => p !== PERMISSIONS.FINANCE.APPROVE_ENTRIES,
    ),
    description: "Financial oversight",
  },
  FINANCE_CONTROLLER: {
    name: "Finance Controller",
    permissions: Object.values(PERMISSIONS.FINANCE),
    description: "Full financial control and approvals",
  },
  BI_VIEWER: {
    name: "BI Viewer",
    permissions: [PERMISSIONS.BI.VIEW_DASHBOARD, PERMISSIONS.BI.EXPORT_DATA],
    description: "Data visualization consumer",
  },
  PRODUCTION_SUPERVISOR: {
    name: "Production Supervisor",
    permissions: Object.values(PERMISSIONS.MANUFACTURING),
    description: "Manufacturing floor management",
  },
  PROJECT_MANAGER: {
    name: "Project Manager",
    permissions: Object.values(PERMISSIONS.PROJECTS),
    description: "Full project planning and execution",
  },
  HR_MANAGER: {
    name: "HR Manager",
    permissions: Object.values(PERMISSIONS.HRM),
    description: "Strategic HR management and payroll",
  },
};
