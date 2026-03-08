import ToggleSwitch from "../components/inputs/ToggleSwitch";

export default function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Notification Preferences */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h3 className="font-semibold text-lg mb-2">Notification Preferences</h3>
        <ToggleSwitch label="Enable Notifications" />
        <ToggleSwitch label="Email Notifications" />
        <ToggleSwitch label="Push Notifications" />
      </div>

      {/* App Preferences */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h3 className="font-semibold text-lg mb-2">App Preferences</h3>
        <ToggleSwitch label="Dark Mode" defaultOn={false} />
        <ToggleSwitch label="Biometric Authentication" />
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-700">Language</span>
          <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>English</option>
            <option>Hindi</option>
            <option>Tamil</option>
          </select>
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-semibold text-lg mb-4">Privacy</h3>
        <button className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium">
          Privacy Settings
        </button>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 p-6 rounded-xl shadow space-y-3">
        <h3 className="font-semibold text-red-600 text-lg">Danger Zone</h3>
        <div className="flex gap-3">
          <button className="border border-red-500 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors font-medium">
            Clear Cache
          </button>
          <button className="border border-red-500 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors font-medium">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
