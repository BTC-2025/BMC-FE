export default function FilterChips({ active, setActive }) {
  const chips = ["All", "Pending", "Approved", "Rejected"];

  return (
    <div className="flex gap-3">
      {chips.map((c) => (
        <button
          key={c}
          onClick={() => setActive(c)}
          className={`px-4 py-1 rounded-full border transition-colors ${
            active === c 
              ? "bg-blue-600 text-white border-blue-600" 
              : "bg-white text-gray-600 hover:bg-gray-50 border-gray-200"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
