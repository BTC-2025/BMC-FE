export default function PageHeader() {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">Employee Dashboard</h1>
        <p className="text-gray-500">
          Real-time attendance tracking and resource management
        </p>
      </div>

      <div className="flex gap-3">
        <button className="px-4 py-2 border rounded-lg">
          Export Logs
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          + Mark Attendance
        </button>
      </div>
    </div>
  );
}
