export default function DocumentTable() {
  const rows = [
    ["OfferLetter.pdf", "PDF", "Jan 10", "Download"],
    ["Payslip-Jan.pdf", "PDF", "Feb 01", "Download"],
    ["IDProof.png", "Image", "Dec 20", "Download"],
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-semibold mb-4">Documents</h3>

      <table className="w-full text-left">
        <thead className="text-gray-500 border-b">
          <tr>
            <th className="py-2">File Name</th>
            <th>Type</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
              <td className="py-3 font-medium">{r[0]}</td>
              <td>{r[1]}</td>
              <td>{r[2]}</td>
              <td>
                <button className="text-blue-600 hover:text-blue-800 font-medium">{r[3]}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
