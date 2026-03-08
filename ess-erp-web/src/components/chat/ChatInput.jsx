import { useState } from "react";

export default function ChatInput({ onSend }) {
  const [msg, setMsg] = useState("");

  const handleSend = () => {
    if (msg.trim()) {
      onSend(msg);
      setMsg("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-3">
      <input
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        onKeyPress={handleKeyPress}
        className="border border-gray-300 flex-1 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Type your message..."
      />
      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Send
      </button>
    </div>
  );
}
