import React, { useState } from "react";
import "./Chatbot.css";
import help_icon from "../Assests/help_icon.png"

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Hi 👋, I'm your shopping assistant. How can I help?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false); // toggle chatbot
  

  const handleSend = () => {
   
    if (input.trim() === "") return;

    // Add user message
    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);

    // Clear input
    setInput("");

    // Fake bot reply (later connect Gemini here)
    setTimeout(() => {
      const botMessage = {
        text: "Got it! (I'll connect to Gemini soon 🤖)",
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <div>
      {/* Floating Chatbot Icon */}
      {!isOpen && (
        <button className="chatbot-icon" onClick={() => setIsOpen(true)}>
          <img src={help_icon} alt="" />
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            💬 Chat Support
            <span className="chatbot-close" onClick={() => setIsOpen(false)}>
              ✖
            </span>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chatbot-message ${
                  msg.sender === "user" ? "user-message" : "bot-message"
                }`}
              >
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
      )}
    </div>
  );
};

export default Chatbot;
