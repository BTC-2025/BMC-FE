export default function SalaryCard() {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-semibold mb-4">Current Month Salary</h3>

      <div className="grid grid-cols-3 gap-6">
        <div>
          <p className="text-gray-500 text-sm">Net Salary</p>
          <h2 className="text-2xl font-bold">$8,500</h2>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Gross Salary</p>
          <h2 className="text-2xl font-bold">$10,000</h2>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Deductions</p>
          <h2 className="text-2xl font-bold">$1,500</h2>
        </div>
      </div>

      {/* Breakdown */}
      <div className="mt-6 border-t pt-4 grid grid-cols-2 gap-4 text-sm">
        <div>Basic Salary: $6,000</div>
        <div>HRA: $2,000</div>
        <div>Transport: $1,000</div>
        <div>Medical: $1,000</div>
        <div>Tax: $1,000</div>
        <div>PF: $500</div>
      </div>
    </div>
  );
}
