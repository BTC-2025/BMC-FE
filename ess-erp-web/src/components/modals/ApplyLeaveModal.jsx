export default function ApplyLeaveModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow-2xl">
        <h3 className="text-lg font-semibold mb-4">Apply Leave</h3>

        <div className="space-y-3">
          <input className="border p-2 w-full rounded" placeholder="Leave Type" />
          <input className="border p-2 w-full rounded" type="date" />
          <input className="border p-2 w-full rounded" type="date" />
          <textarea className="border p-2 w-full rounded" placeholder="Reason" rows={3}/>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
          <button onClick={onClose} className="bg-blue-600 text-white px-4 py-2 rounded">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
