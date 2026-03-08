export default function LeaveHistoryTable() {
  const rows = [
    ["Casual Leave", "Feb 10 - Feb 12", "Approved"],
    ["Sick Leave", "Jan 05", "Rejected"],
    ["Earned Leave", "Dec 20 - Dec 25", "Approved"],
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-semibold mb-4">Leave History</h3>

      <table className="w-full text-left">
        <thead className="text-gray-500 border-b">
          <tr>
            <th className="py-2">Type</th>
            <th>Dates</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b last:border-0">
              <td className="py-3">{r[0]}</td>
              <td>{r[1]}</td>
              <td className={r[2] === "Approved" ? "text-green-600" : "text-red-600"}>{r[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
