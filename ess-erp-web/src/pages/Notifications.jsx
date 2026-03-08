import { useState } from "react";
import NotificationFilter from "../components/filters/NotificationFilter";
import NotificationItem from "../components/cards/NotificationItem";

export default function Notifications() {
  const [filter, setFilter] = useState("All");

  const data = [
    { title: "Payslip Generated", message: "Jan payslip is ready.", read: false },
    { title: "Leave Approved", message: "Your leave request was approved.", read: true },
    { title: "New Policy Update", message: "HR policy updated for 2026.", read: false },
  ];

  const filtered =
    filter === "All"
      ? data
      : data.filter((n) => (filter === "Read" ? n.read : !n.read));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors">Mark all as read</button>
      </div>

      <NotificationFilter active={filter} setActive={setFilter} />

      <div className="space-y-4">
        {filtered.map((n, i) => (
          <NotificationItem
            key={i}
            title={n.title}
            message={n.message}
            read={n.read}
          />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-10 bg-white rounded-xl shadow">
            <p className="text-gray-400">No notifications found</p>
          </div>
        )}
      </div>
    </div>
  );
}
