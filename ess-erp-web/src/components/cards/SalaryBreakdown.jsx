export default function SalaryBreakdown({ data }) {
  const gross =
    data.basic + data.hra + data.transport + data.medical;
  const deductions = data.tax + data.pf;
  const net = gross - deductions;

  const BreakdownRow = ({ label, value, sub }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <span className={`font-bold ${sub ? 'text-red-500' : 'text-gray-800'}`}>${value.toLocaleString()}</span>
    </div>
  );

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">Salary Breakdown</h3>
        <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold uppercase tracking-wider">Earnings</span>
      </div>

      <div className="space-y-1">
        <BreakdownRow label="Basic Salary" value={data.basic} />
        <BreakdownRow label="HRA" value={data.hra} />
        <BreakdownRow label="Transport" value={data.transport} />
        <BreakdownRow label="Medical" value={data.medical} />
        <BreakdownRow label="Tax (Deduction)" value={data.tax} sub />
        <BreakdownRow label="PF (Deduction)" value={data.pf} sub />
      </div>

      <div className="pt-4 border-t-2 border-dashed border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-lg font-black text-gray-900">Net Salary</span>
          <span className="text-2xl font-black text-blue-600">${net.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
