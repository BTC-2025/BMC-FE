export default function NotificationCard({ title, message, type }) {
  const colors = {
    danger: "border-l-4 border-red-500 bg-red-50",
    warn: "border-l-4 border-yellow-500 bg-yellow-50",
  };

  return (
    <div className={`p-4 rounded-lg ${colors[type]}`}>
      <h4 className="font-semibold">{title}</h4>
      <p className="text-sm mt-1">{message}</p>
    </div>
  );
}
