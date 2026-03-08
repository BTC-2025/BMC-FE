export default function PayslipTable() {
  const rows = [
    ["Jan 2026", "$8,500", "Paid"],
    ["Dec 2025", "$8,500", "Paid"],
    ["Nov 2025", "$8,500", "Paid"],
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-semibold mb-4">Payslip History</h3>

      <table className="w-full text-left">
        <thead className="text-gray-500 border-b">
          <tr>
            <th className="py-2">Month</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b">
              <td className="py-3">{r[0]}</td>
              <td>{r[1]}</td>
              <td className="text-green-600">{r[2]}</td>
              <td>
                <button className="text-blue-600 hover:text-blue-800 font-medium">Download</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
