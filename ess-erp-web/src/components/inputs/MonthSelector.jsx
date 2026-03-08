export default function MonthSelector({ month, setMonth }) {
  return (
    <div className="relative">
      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 transition-all hover:bg-white"
      />
    </div>
  );
}
