import { useState } from "react";

export default function ToggleSwitch({ label, defaultOn = true }) {
  const [on, setOn] = useState(defaultOn);

  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-gray-700">{label}</span>
      <button
        onClick={() => setOn(!on)}
        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
          on ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${
            on ? "translate-x-6" : ""
          }`}
        />
      </button>
    </div>
  );
}
