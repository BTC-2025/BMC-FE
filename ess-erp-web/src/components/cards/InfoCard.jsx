export default function InfoCard({ title, value, subtitle, color }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 w-full">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
      <p className={`text-sm mt-2 ${color}`}>{subtitle}</p>
    </div>
  );
}
