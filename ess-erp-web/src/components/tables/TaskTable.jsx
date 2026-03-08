export default function TaskTable() {
  const tasks = [
    ["Q2 Performance Review", "HR / Compliance", "85%", "On Track"],
    ["Internal Audit - IT Security", "Security", "100%", "Completed"],
    ["Updated Policy Handbook", "Policy", "42%", "Action"],
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="font-semibold mb-4">Active Assignments</h3>

      <table className="w-full text-left">
        <thead className="text-gray-500 text-sm border-b">
          <tr>
            <th className="py-2">Task Name</th>
            <th>Category</th>
            <th>Progress</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t, i) => (
            <tr key={i} className="border-b">
              <td className="py-3">{t[0]}</td>
              <td>{t[1]}</td>
              <td>{t[2]}</td>
              <td className="text-green-600">{t[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
