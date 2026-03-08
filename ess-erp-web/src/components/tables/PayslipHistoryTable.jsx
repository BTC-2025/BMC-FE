export default function PayslipHistoryTable({ months, onDownload }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-8 border-b border-gray-50 flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900">Payslip History</h3>
        <span className="text-sm text-gray-400 font-medium">{months.length} Records found</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-gray-400 text-xs uppercase tracking-widest font-black">
            <tr>
              <th className="px-8 py-4">Billing Month</th>
              <th className="px-8 py-4">Status</th>
              <th className="px-8 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {months.map((m, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <span className="font-bold text-gray-800">{new Date(m + "-01").toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </td>
                <td className="px-8 py-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Paid
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <button
                    onClick={() => onDownload(m)}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-bold text-sm transition-all active:scale-95"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                    Download PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
