export default function RequestTable({ filter }) {
  const rows = [
    ["Leave", "Feb 3", "Pending"],
    ["Reimbursement", "Jan 28", "Approved"],
    ["Advance", "Jan 10", "Rejected"],
  ];

  const filtered =
    filter === "All" ? rows : rows.filter((r) => r[2] === filter);

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <table className="w-full text-left">
        <thead className="text-gray-500 border-b">
          <tr>
            <th className="py-2">Type</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r, i) => (
            <tr key={i} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
              <td className="py-3 font-medium">{r[0]}</td>
              <td>{r[1]}</td>
              <td
                className={`font-medium ${
                  r[2] === "Approved"
                    ? "text-green-600"
                    : r[2] === "Pending"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {r[2]}
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan="3" className="py-8 text-center text-gray-400">
                No requests found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
