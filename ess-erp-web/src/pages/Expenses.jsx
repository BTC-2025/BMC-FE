import { useState } from "react";
import ExpenseStatCard from "../components/cards/ExpenseStatCard";
import ExpenseTable from "../components/tables/ExpenseTable";
import AddExpenseModal from "../components/modals/AddExpenseModal";

export default function Expenses() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Expenses</h1>
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
        >
          <span className="text-xl">+</span> Add Expense
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6">
        <ExpenseStatCard title="This Month" value="$320" />
        <ExpenseStatCard title="Pending Approval" value="$75" />
        <ExpenseStatCard title="Approved" value="$245" />
      </div>

      {/* Table */}
      <ExpenseTable />

      <AddExpenseModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
