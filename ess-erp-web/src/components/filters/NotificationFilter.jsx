export default function NotificationFilter({ active, setActive }) {
  const filters = ["All", "Unread", "Read"];

  return (
    <div className="flex gap-3">
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => setActive(f)}
          className={`px-4 py-1 rounded-full border transition-colors ${
            active === f 
              ? "bg-blue-600 text-white border-blue-600" 
              : "bg-white text-gray-600 hover:bg-gray-50 border-gray-200"
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
