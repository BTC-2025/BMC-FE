import { useState } from "react";
import FilterChips from "../components/filters/FilterChips";

export default function Requests() {
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState(false);
  const [requestType, setRequestType] = useState("Leave Request");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const initialRequests = [
    { type: "Leave Request", subject: "Annual Leave", date: "Jan 28", status: "Approved" },
    { type: "Advance Request", subject: "Medical Emergency", date: "Jan 20", status: "Pending" },
    { type: "Reimbursement", subject: "Travel Expenses", date: "Jan 15", status: "Rejected" },
  ];

  const [requests, setRequests] = useState(initialRequests);

  const filteredRequests = filter === "All" 
    ? requests 
    : requests.filter(r => r.status === filter);

  const handleSubmitRequest = () => {
    if (!subject || !description) {
      alert("Please fill all fields");
      return;
    }

    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
    
    const newRequest = {
      type: requestType,
      subject: subject,
      date: today,
      status: "Pending"
    };

    setRequests([newRequest, ...requests]);
    
    // Reset form
    setOpen(false);
    setSubject("");
    setDescription("");
  };

  const exportCSV = () => {
    const csv =
      "Type,Subject,Date,Status\n" +
      requests
        .map((r) => `${r.type},${r.subject},${r.date},${r.status}`)
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "requests_log.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Requests</h1>
        <div className="flex gap-3">
          <button
            onClick={exportCSV}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Export Logs
          </button>
          <button
            onClick={() => setOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 font-medium"
          >
            <span className="text-xl">+</span> New Request
          </button>
        </div>
      </div>

      <FilterChips active={filter} setActive={setFilter} />

      {/* Requests Table */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-semibold mb-4">Request History</h3>

        <table className="w-full text-left">
          <thead className="text-gray-500 border-b">
            <tr>
              <th className="py-2">Type</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((r, i) => (
              <tr key={i} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                <td className="py-3 font-medium">{r.type}</td>
                <td>{r.subject}</td>
                <td>{r.date}</td>
                <td className={
                  r.status === "Approved" 
                    ? "text-green-600 font-medium" 
                    : r.status === "Rejected"
                    ? "text-red-600 font-medium"
                    : "text-orange-500 font-medium"
                }>
                  {r.status}
                </td>
              </tr>
            ))}
            {filteredRequests.length === 0 && (
              <tr>
                <td colSpan="4" className="py-8 text-center text-gray-400">
                  No requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* New Request Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">
            <h3 className="font-semibold text-lg mb-4">New Request</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Request Type</label>
                <select
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Leave Request</option>
                  <option>Advance Request</option>
                  <option>Reimbursement</option>
                  <option>Certificate Request</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter subject..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Enter detailed description..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRequest}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
