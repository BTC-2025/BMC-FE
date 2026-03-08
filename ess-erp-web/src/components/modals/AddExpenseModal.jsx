export default function AddExpenseModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow-2xl">
        <h3 className="font-semibold mb-4">Add Expense</h3>

        <div className="space-y-3">
          <input className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Category" />
          <input className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Description" />
          <input className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Amount" />
          <input type="file" className="border p-2 w-full rounded" />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors">Cancel</button>
          <button onClick={onClose} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors shadow-sm">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
