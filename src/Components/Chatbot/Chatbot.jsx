import React, { useState } from "react";
import "./Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋 How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  // Check login status from localStorage
  const isLoggedIn = !!localStorage.getItem("token");

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages([...messages, newMessage]);

    // Bot reply based on login condition
    setTimeout(() => {
      if (isLoggedIn) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: `✅ You are logged in! I will process: "${input}"` },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "⚠️ Kindly login to use the chatbot features." },
        ]);
      }
    }, 500);

    setInput("");
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">💬 Chatbot</div>
      <div className="chatbot-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
