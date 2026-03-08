export default function ExpenseTable() {
  const rows = [
    ["Travel", "Taxi to client office", "$45", "Pending"],
    ["Food", "Team lunch", "$120", "Approved"],
    ["Supplies", "Stationery", "$30", "Rejected"],
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-semibold mb-4">Expense History</h3>

      <table className="w-full text-left">
        <thead className="text-gray-500 border-b">
          <tr>
            <th className="py-2">Category</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
              <td className="py-3 font-medium">{r[0]}</td>
              <td>{r[1]}</td>
              <td>{r[2]}</td>
              <td
                className={`font-medium ${
                  r[3] === "Approved"
                    ? "text-green-600"
                    : r[3] === "Pending"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {r[3]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
