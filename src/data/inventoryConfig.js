export const INVENTORY_CONFIG = {
  workspace: {
    id: "inventory",
    name: "Inventory Management",
    sidebar: {
      // Configuration for 'LARGE' (Enterprise) scale
      enterpriseSections: [
        {
          title: "Executive",
          items: [{ id: "overview", label: "Overview", icon: "📊" }],
        },
        {
          title: "Items & Catalog",
          items: [
            { id: "products", label: "Items", icon: "📦" },
            { id: "item_groups", label: "Item Groups", icon: "🗂️" },
            { id: "price_lists", label: "Price List", icon: "🏷️" },
            { id: "categories", label: "Asset Categories", icon: "📂" },
          ],
        },
        {
          title: "Fulfillment",
          items: [
            { id: "packages", label: "Packages", icon: "📦" },
            { id: "assemblies", label: "Assemblies", icon: "🛠️" },
            { id: "transactions", label: "Stock Moves", icon: "🔄" },
          ],
        },
        {
          title: "Sales & Rev",
          items: [
            { id: "sales_orders", label: "Sales Orders", icon: "🧾" },
            { id: "invoices", label: "Invoices", icon: "📄" },
            { id: "payments_received", label: "Payments Received", icon: "💰" },
            { id: "customers", label: "Customers", icon: "👥" },
          ],
        },
        {
          title: "Procurement",
          items: [
            { id: "purchase_orders", label: "Purchase Orders", icon: "🛒" },
            { id: "bills", label: "Bills", icon: "💸" },
            { id: "suppliers", label: "Suppliers", icon: "🤝" },
          ],
        },
        {
          title: "Infrastructure",
          items: [
            { id: "warehouses", label: "Warehouses", icon: "🏢" },
            { id: "batches", label: "Batches & Serials", icon: "🔢" },
            { id: "audit_log", label: "Audit Log", icon: "📋" },
          ],
        },
      ],
      // Configuration for 'SMALL' (Lite) scale - Exactly 8 modules as requested
      liteSections: [
        {
          title: "Quick Start",
          items: [{ id: "overview", label: "Overview Dashboard", icon: "⚡" }],
        },
        {
          title: "Inventory & Catalog",
          items: [
            { id: "products", label: "Items", icon: "📦" },
            { id: "item_groups", label: "Item Groups", icon: "🗂️" },
            { id: "price_lists", label: "Price List", icon: "🏷️" },
          ],
        },
        {
          title: "Sales & Fulfillment",
          items: [
            { id: "invoices", label: "Invoices", icon: "📄" },
            { id: "payments_received", label: "Payments Received", icon: "💰" },
            { id: "packages", label: "Packages", icon: "📦" },
          ],
        },
        {
          title: "Procurement & Assets",
          items: [
            { id: "bills", label: "Bills", icon: "💸" },
            { id: "assemblies", label: "Assemblies", icon: "🛠️" },
          ],
        },
      ],
    },
  },
};

export const MOCK_DATA = {
  stats: {
    totalProducts: 852,
    stockValue: 425600,
    lowStockItems: 12,
    outOfStock: 5,
  },
  products: [
    {
      sku: "IPH-15-PRO",
      name: "iPhone 15 Pro",
      category: "Electronics",
      unit: "pcs",
      cost: 900,
      price: 1099,
      reorder: 10,
      status: "Active",
      stock: 45,
    },
    {
      sku: "MAC-M3-14",
      name: 'MacBook Pro M3 14"',
      category: "Electronics",
      unit: "pcs",
      cost: 1800,
      price: 1999,
      reorder: 5,
      status: "Active",
      stock: 12,
    },
    {
      sku: "DK-CH-01",
      name: "Ergonomic Desk Chair",
      category: "Furniture",
      unit: "pcs",
      cost: 120,
      price: 249,
      reorder: 20,
      status: "Active",
      stock: 85,
    },
  ],
  categories: [
    { name: "Electronics", count: 124 },
    { name: "Furniture", count: 45 },
    { name: "Office Supplies", count: 312 },
  ],
  suppliers: [
    {
      id: "SUP-001",
      name: "TechGlobal Inc",
      contact: "John Doe",
      email: "john@techglobal.com",
      poCount: 12,
    },
    {
      id: "SUP-002",
      name: "Modern Office",
      contact: "Jane Smith",
      email: "jane@modernoffice.com",
      poCount: 5,
    },
  ],
  customers: [
    {
      id: "CUST-001",
      name: "Acme Corp",
      contact: "Alice Brown",
      email: "alice@acme.com",
      soCount: 24,
    },
    {
      id: "CUST-002",
      name: "Skyline Studio",
      contact: "Bob Johnson",
      email: "bob@skyline.com",
      soCount: 8,
    },
  ],
  recentMovements: [
    {
      id: "TRX-101",
      type: "Stock In",
      product: "iPhone 15 Pro",
      qty: 20,
      date: "1h ago",
      user: "Admin",
    },
    {
      id: "TRX-102",
      type: "Stock Out",
      product: "Desk Chair",
      qty: 5,
      date: "2h ago",
      user: "Sam",
    },
    {
      id: "TRX-103",
      type: "Transfer",
      product: "MacBook Pro",
      qty: 2,
      date: "5h ago",
      user: "Admin",
    },
  ],
  warehouses: [
    {
      id: "WH-001",
      name: "Main Warehouse",
      location: "Global City",
      stockCount: 1200,
    },
    { id: "WH-002", name: "East Hub", location: "East Port", stockCount: 450 },
  ],
};
