import { useState, useEffect, useRef } from "react";
import ChatBubble from "../components/chat/ChatBubble";
import QuickChips from "../components/chat/QuickChips";
import ChatInput from "../components/chat/ChatInput";

export default function AiAssistant() {
  const [messages, setMessages] = useState([
    { from: "assistant", text: "Hello! How can I help you today?" },
  ]);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (text) => {
    const userMsg = { from: "user", text };
    const botMsg = {
      from: "assistant",
      text: "This is a mock AI response for: " + text,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
  };

  return (
    <div className="flex flex-col h-[80vh] bg-white rounded-xl shadow p-6">
      <h1 className="text-2xl font-bold mb-4">AI Assistant</h1>

      {/* Chat Area */}
      <div className="flex-1 overflow-auto space-y-3 mb-4 custom-scrollbar">
        {messages.map((m, i) => (
          <ChatBubble key={i} message={m.text} from={m.from} />
        ))}
        <div ref={chatEndRef} />
      </div>

      <QuickChips onClick={handleSend} />

      <div className="mt-3">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
