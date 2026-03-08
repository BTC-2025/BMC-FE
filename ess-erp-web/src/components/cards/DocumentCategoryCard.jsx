export default function DocumentCategoryCard({ title, count }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-2xl font-bold mt-2">{count} Files</h2>
    </div>
  );
}
