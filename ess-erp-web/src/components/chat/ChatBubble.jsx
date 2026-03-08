export default function ChatBubble({ message, from }) {
  return (
    <div className={`flex ${from === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 rounded-lg max-w-xs shadow ${
          from === "user" 
            ? "bg-blue-600 text-white" 
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {message}
      </div>
    </div>
  );
}
