export default function PayrollSummary({ data }) {
  const gross = data.basic + data.hra + data.transport + data.medical;
  const deductions = data.tax + data.pf;
  const net = gross - deductions;

  const cards = [
    { label: "Gross Salary", value: gross, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Deductions", value: deductions, color: "text-red-600", bg: "bg-red-50" },
    { label: "Net Salary", value: net, color: "text-green-600", bg: "bg-green-50" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, i) => (
        <div key={i} className={`${card.bg} p-6 rounded-2xl border border-white shadow-sm`}>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{card.label}</p>
          <p className={`text-2xl font-black mt-1 ${card.color}`}>${card.value.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
