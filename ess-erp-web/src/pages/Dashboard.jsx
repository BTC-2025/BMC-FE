import { useState, useEffect } from "react";
import PageHeader from "../components/layout/PageHeader";
import InfoCard from "../components/cards/InfoCard";
import NotificationCard from "../components/cards/NotificationCard";
import { useAuth } from "../context/AuthContext";
import { leaveApi } from "../services/essApi";

export default function Dashboard() {
  const { employee } = useAuth();
  const [pendingLeaves, setPendingLeaves] = useState(0);

  useEffect(() => {
    if (!employee?.id) return;
    leaveApi.getMyLeaves(employee.id)
      .then((res) => setPendingLeaves(res.data.filter((l) => l.status === "PENDING").length))
      .catch(() => {});
  }, [employee]);
  const initialTasks = [
    {
      name: "Q2 Performance Review",
      category: "HR / Compliance",
      progress: 85,
      status: "On Track",
    },
    {
      name: "Internal Audit - IT Security",
      category: "Security",
      progress: 100,
      status: "Completed",
    },
    {
      name: "Updated Policy Handbook",
      category: "Policy",
      progress: 42,
      status: "Action",
    },
  ];

  const [tasks, setTasks] = useState(initialTasks);
  const [search, setSearch] = useState("");
  const [checkedIn, setCheckedIn] = useState(true);
  const [sortKey, setSortKey] = useState("name");
  const [page, setPage] = useState(1);

  const rowsPerPage = 2;

  const filteredTasks = tasks.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortKey === "progress") return b.progress - a.progress;
    return a.name.localeCompare(b.name);
  });

  const totalPages = Math.ceil(sortedTasks.length / rowsPerPage);

  const paginatedTasks = sortedTasks.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const exportCSV = () => {
    const csv =
      "Task,Category,Progress,Status\n" +
      tasks
        .map((t) => `${t.name},${t.category},${t.progress},${t.status}`)
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "tasks_log.csv";
    a.click();
  };

  return (
    <div>
      <PageHeader />

      {/* Info Cards */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <InfoCard
          title="Current Status"
          value="On-Site"
          subtitle={`Welcome, ${employee?.name?.split(" ")[0] || "Employee"}`}
          color="text-blue-600"
        />
        <InfoCard
          title="Department"
          value={employee?.department || "—"}
          subtitle={employee?.role || "Employee"}
          color="text-green-600"
        />
        <InfoCard
          title="Pending Leaves"
          value={pendingLeaves > 0 ? `${pendingLeaves} Pending` : "None"}
          subtitle={pendingLeaves > 0 ? "Awaiting Approval" : "All Clear"}
          color={pendingLeaves > 0 ? "text-orange-500" : "text-green-600"}
        />
        <InfoCard
          title="Employee ID"
          value={employee?.id ? `EMP-${employee.id}` : "—"}
          subtitle="Active Member"
          color="text-blue-600"
        />
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="flex justify-between mb-3">
            <h3 className="font-semibold">Active Assignments</h3>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="border border-gray-300 rounded-lg px-4 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Task Table */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="text-gray-500 border-b sticky top-0 bg-gray-50 z-10">
                  <tr>
                    <th 
                      className="text-left py-3 px-4 font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                      onClick={() => setSortKey("name")}
                    >
                      Task Name {sortKey === "name" ? "▼" : "⬍"}
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Category</th>
                    <th 
                      className="text-left py-3 px-4 font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                      onClick={() => setSortKey("progress")}
                    >
                      Progress {sortKey === "progress" ? "▼" : "⬍"}
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTasks.map((t, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">{t.name}</td>
                      <td className="py-3 px-4">{t.category}</td>

                      <td className="py-3 px-4 w-40">
                        <div className="bg-gray-200 h-2 rounded mb-1">
                          <div
                            className="bg-green-500 h-2 rounded transition-all"
                            style={{ width: `${t.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{t.progress}%</span>
                      </td>

                      <td
                        className={`py-3 px-4 font-medium ${
                          t.status === "Completed"
                            ? "text-green-600"
                            : t.status === "On Track"
                            ? "text-blue-600"
                            : "text-orange-500"
                        }`}
                      >
                        {t.status}
                      </td>

                      <td className="py-3 px-4 text-gray-400 cursor-pointer hover:text-gray-600 text-xl">
                        ⋮
                      </td>
                    </tr>
                  ))}
                  {paginatedTasks.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-gray-400">
                        No tasks found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center px-4 py-3 border-t bg-gray-50">
              <span className="text-sm text-gray-600">
                Showing {paginatedTasks.length} of {sortedTasks.length} tasks
              </span>
              <div className="flex items-center gap-3">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className={`px-3 py-1 border rounded-lg transition-colors ${
                    page === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  Prev
                </button>

                <span className="text-sm font-medium">
                  Page {page} of {totalPages || 1}
                </span>

                <button
                  disabled={page === totalPages || totalPages === 0}
                  onClick={() => setPage(page + 1)}
                  className={`px-3 py-1 border rounded-lg transition-colors ${
                    page === totalPages || totalPages === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Urgent Notifications</h3>
          <NotificationCard
            title="Tax Document Missing"
            message="Form 10-K required for payroll processing by end of today."
            type="danger"
          />
          <NotificationCard
            title="Overtime Threshold"
            message="You reached 95% of weekly overtime limit."
            type="warn"
          />
        </div>
      </div>
    </div>
  );
}
