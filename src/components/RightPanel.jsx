export default function RightPanel() {
  return (
    <aside className="w-80 bg-white border-l px-6 py-6">
      <h4 className="text-sm font-semibold mb-4">
        Ticket Details
      </h4>

      <div className="space-y-3 text-sm text-gray-600">
        <div>
          <span className="font-medium text-gray-900">Status:</span> In Progress
        </div>
        <div>
          <span className="font-medium text-gray-900">Priority:</span> High
        </div>
        <div>
          <span className="font-medium text-gray-900">SLA:</span> 45 mins left
        </div>
      </div>
    </aside>
  );
}
