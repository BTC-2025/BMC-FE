export default function QueueTable({ title, columns, data, onBack, onRowClick }) {
  return (
    <div className="flex-1 bg-white border-r flex flex-col">
      <div className="p-4 border-b flex justify-between items-center shrink-0">
        <div>
          <button
            onClick={onBack}
            className="text-xs text-gray-400 mb-1 hover:text-gray-600 flex items-center gap-1"
          >
           <span>←</span> Back to Workspaces
          </button>
          <h2 className="font-semibold text-lg">
            {title}
          </h2>
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors">
          + New Ticket
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
            <thead className="text-gray-500 bg-gray-50 border-b sticky top-0">
            <tr>
                {columns.map((col, idx) => (
                    <th key={idx} className="p-3 text-left font-medium">{col}</th>
                ))}
            </tr>
            </thead>
            <tbody className="divide-y">
            {data.map((row, idx) => (
                <tr 
                    key={idx} 
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => onRowClick && onRowClick(row)}
                >
                    {row.values.map((val, vIdx) => (
                        <td key={vIdx} className="p-3">{val}</td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}
