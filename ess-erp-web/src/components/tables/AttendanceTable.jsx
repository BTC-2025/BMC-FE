export default function AttendanceTable() {
  const rows = [
    ["Feb 01", "09:05 AM", "06:02 PM", "8h 57m", "Present"],
    ["Feb 02", "-", "-", "-", "Absent"],
    ["Feb 03", "09:10 AM", "05:55 PM", "8h 45m", "Present"],
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="font-semibold mb-4">Attendance History</h3>

      <table className="w-full text-left">
        <thead className="text-gray-500 border-b">
          <tr>
            <th className="py-2">Date</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Hours</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b">
              <td className="py-3">{r[0]}</td>
              <td>{r[1]}</td>
              <td>{r[2]}</td>
              <td>{r[3]}</td>
              <td className="text-green-600">{r[4]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
