export const FINANCE_CONFIG = {
  workspace: {
    id: "finance",
    name: "Finance & Accounting",
    sidebar: {
      enterpriseSections: [
        {
          title: "Intelligence",
          items: [
            { id: "overview", label: "Executive Summary", icon: "📊" },
            { id: "reports", label: "Financial Dossiers", icon: "📜" },
          ],
        },
        {
          title: "Ledgers",
          items: [
            { id: "accounts", label: "Chart of Accounts", icon: "📑" },
            { id: "bank_cash", label: "Liquidity (Bank/Cash)", icon: "🏦" },
          ],
        },
        {
          title: "Commercial",
          items: [
            { id: "invoices", label: "Billing & Invoices", icon: "🧾" },
            { id: "receivables", label: "Receivables (AR)", icon: "📥" },
            { id: "payables", label: "Payables (AP)", icon: "📤" },
          ],
        },
        {
          title: "Operations",
          items: [
            { id: "expenses", label: "Operational Costs", icon: "💸" },
            { id: "payments", label: "Settlement Ledger", icon: "💳" },
            { id: "taxes", label: "Tax Compliance", icon: "🏛️" },
          ],
        },
        {
          title: "Fixed Assets",
          items: [
            { id: "asset_overview", label: "Asset Overview", icon: "🛡️" },
            { id: "asset_registry", label: "Asset Registry", icon: "📋" },
            { id: "asset_categories", label: "Asset Categories", icon: "📂" },
            { id: "asset_depreciation", label: "Depreciation Log", icon: "📉" },
          ],
        },
      ],
      liteSections: [
        {
          title: "Quick View",
          items: [{ id: "overview", label: "Dashboard", icon: "⚡" }],
        },
        {
          title: "Daily Ledger",
          items: [
            { id: "bank_cash", label: "Bank & Cash", icon: "🏦" },
            { id: "invoices", label: "Invoices", icon: "🧾" },
            { id: "expenses", label: "Expenses", icon: "💸" },
          ],
        },
        {
          title: "Cash Flow",
          items: [
            { id: "receivables", label: "Receivables", icon: "📥" },
            { id: "payables", label: "Payables", icon: "📤" },
            { id: "payments", label: "Payments", icon: "💳" },
            { id: "reports", label: "Reports", icon: "📜" },
          ],
        },
      ],
    },
  },
};
