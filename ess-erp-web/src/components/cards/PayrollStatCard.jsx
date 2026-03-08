export default function PayrollStatCard({ title, value, color, bg }) {
  return (
    <div className={`${bg || 'bg-white'} p-6 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md hover:scale-[1.02]`}>
      <p className="text-gray-500 text-xs font-black uppercase tracking-widest">{title}</p>
      <h2 className={`text-3xl font-black mt-2 ${color}`}>${value.toLocaleString()}</h2>
    </div>
  );
}
