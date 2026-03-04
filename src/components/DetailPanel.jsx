export default function DetailPanel({ title, id, meta, details, actionText }) {
  return (
    <aside className="w-96 bg-gray-50 border-l flex flex-col h-full">
      <div className="p-6 border-b bg-white">
        <div className="flex items-center gap-2 mb-4">
             <span className="text-xs font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{id}</span>
             <span className="ml-auto text-xs text-gray-400">{meta}</span>
        </div>
        <h3 className="font-semibold text-lg text-gray-900 leading-tight">
            {title}
        </h3>
      </div>

      <div className="p-6 space-y-6 flex-1 overflow-y-auto">
        <div className="space-y-3 text-sm">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Details</h4>
            {details.map((detail, idx) => (
                <div key={idx} className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500">{detail.label}</span>
                    <span className={`font-medium ${detail.color || 'text-gray-900'}`}>{detail.value}</span>
                </div>
            ))}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
            <p className="font-semibold mb-1">✨ AI Suggestion</p>
            <p>Based on recent patterns, this item requires immediate attention to avoid impact.</p>
        </div>
      </div>

      <div className="p-4 border-t bg-white">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium shadow-sm transition-all active:scale-[0.98]">
            {actionText || "Take Action"}
        </button>
      </div>

    </aside>
  );
}
