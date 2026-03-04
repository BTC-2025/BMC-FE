export default function LeftPanel({ title, queues }) {
  return (
    <aside className="w-64 bg-white border-r px-5 py-6">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-5">
        {title}
      </h2>

      <nav className="space-y-2">
        {queues.map(q => (
          <div
            key={q}
            className="
              text-sm font-medium text-gray-700
              px-3 py-2 rounded-md
              hover:bg-gray-100 cursor-pointer
            "
          >
            {q}
          </div>
        ))}
      </nav>
    </aside>
  );
}
