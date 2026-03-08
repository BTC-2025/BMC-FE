export default function NotificationItem({ title, message, read }) {
  return (
    <div
      className={`p-4 rounded-lg shadow bg-white border-l-4 transition-all hover:bg-gray-50 ${
        read ? "border-gray-300 opacity-75" : "border-blue-600"
      }`}
    >
      <div className="flex justify-between items-start">
        <h4 className={`font-semibold ${read ? 'text-gray-700' : 'text-gray-900'}`}>{title}</h4>
        {!read && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
      </div>
      <p className="text-sm text-gray-500 mt-1">{message}</p>
    </div>
  );
}
