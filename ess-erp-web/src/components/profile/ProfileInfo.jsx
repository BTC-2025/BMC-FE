export default function ProfileInfo() {
  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">
      <h3 className="font-semibold">Personal Information</h3>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Email</p>
          <p className="font-medium">gautam@mail.com</p>
        </div>

        <div>
          <p className="text-gray-500">Phone</p>
          <p className="font-medium">+91 9876543210</p>
        </div>

        <div>
          <p className="text-gray-500">Date of Birth</p>
          <p className="font-medium">12 Feb 1998</p>
        </div>

        <div>
          <p className="text-gray-500">Address</p>
          <p className="font-medium">Chennai, India</p>
        </div>
      </div>
    </div>
  );
}
