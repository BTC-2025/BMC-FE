export default function WorkspaceSwitcher({
  workspaces,
  active,
  setActive
}) {
  return (
    <select
      value={active}
      onChange={(e) => setActive(e.target.value)}
      className="
        text-sm font-medium
        bg-gray-50 border border-gray-200
        rounded-md px-3 py-1.5
        focus:outline-none focus:ring-2 focus:ring-blue-500
      "
    >
      {workspaces.map(ws => (
        <option key={ws.name}>{ws.name}</option>
      ))}
    </select>
  );
}
