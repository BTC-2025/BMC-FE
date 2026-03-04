export const MOCK_USER = {
  id: "USR-001",
  name: "Gautam",
  role: "ADMIN",
  email: "admin@nexus-erp.io",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gautam",
  access: ["*"],
};

export const MOCK_FINANCE_DATA = {
  ledger: [
    {
      id: "L001",
      date: "2024-03-20",
      description: "Cloud Infrastructure - AWS",
      category: "OpEx",
      debit: 12500,
      credit: 0,
      status: "Verified",
    },
    {
      id: "L002",
      date: "2024-03-19",
      description: "Enterprise License Renewal",
      category: "Software",
      debit: 45000,
      credit: 0,
      status: "Pending",
    },
    {
      id: "L003",
      date: "2024-03-18",
      description: "Customer Payment - Global Logistics",
      category: "Revenue",
      debit: 0,
      credit: 85000,
      status: "Verified",
    },
  ],
  stats: {
    revenue: 2450000,
    expenses: 1120000,
    growth: 12.5,
    pendingInvoices: 14,
  },
};

export const MOCK_HR_DATA = {
  employees: [
    {
      id: "EMP-001",
      name: "Sarah Chen",
      role: "Sr. Architect",
      department: "Engineering",
      status: "Active",
      attendance: 98,
    },
    {
      id: "EMP-002",
      name: "James Wilson",
      role: "Product Manager",
      department: "Product",
      status: "On Leave",
      attendance: 94,
    },
    {
      id: "EMP-003",
      name: "Elena Rodriguez",
      role: "Designer",
      department: "Creative",
      status: "Active",
      attendance: 100,
    },
  ],
  attendanceStats: {
    present: 42,
    onLeave: 3,
    remote: 12,
  },
};

export const simulateNetworkRequest = (data, delay = 800) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};
