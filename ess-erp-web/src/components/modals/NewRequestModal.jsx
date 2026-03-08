export default function NewRequestModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow-2xl">
        <h3 className="text-lg font-semibold mb-4">New Request</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">Request Type</label>
            <select className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500 outline-none">
              <option>Leave</option>
              <option>Advance</option>
              <option>Reimbursement</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Description</label>
            <textarea className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter details..." rows={3} />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors">Cancel</button>
          <button onClick={onClose} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors shadow-sm">
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
}
