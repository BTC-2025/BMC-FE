export default function ProfileHeader() {
  return (
    <div className="bg-white p-6 rounded-xl shadow flex items-center gap-6">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
        GK
      </div>

      <div>
        <h2 className="text-xl font-bold">Gautam Karthik</h2>
        <p className="text-gray-500">EMP001 • Software Engineer</p>
        <p className="text-gray-400 text-sm">IT Department</p>
      </div>
    </div>
  );
}
