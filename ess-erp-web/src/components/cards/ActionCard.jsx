export default function ActionCard({ title, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white shadow rounded-xl p-6 text-left hover:bg-gray-50"
    >
      <h4 className="font-semibold">{title}</h4>
    </button>
  );
}
