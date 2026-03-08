export default function QuickChips({ onClick }) {
  const chips = [
    "Check my attendance",
    "Apply leave",
    "View payslip",
    "Upcoming holidays",
  ];

  return (
    <div className="flex gap-3 flex-wrap">
      {chips.map((c, i) => (
        <button
          key={i}
          onClick={() => onClick(c)}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-full text-sm transition-colors"
        >
          {c}
        </button>
      ))}
    </div>
  );
}
