import React, { useState, useContext } from "react";
import "./Chatbot.css";
import help_icon from "../Assests/help_icon.png";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ShopContext } from '../../Context/ShopContext';

const Chatbot = () => {
  const { all_product, addToCart, removeFromCart } = useContext(ShopContext);

  const [messages, setMessages] = useState([
    { text: "Hi 👋, I'm your shopping assistant. How can I help?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Initialize Gemini
  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

  // 🔍 Helper: Find product by name (case-insensitive)
  const findProduct = (query) => {
    return all_product.find((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleSend = async () => {
    if (input.trim() === "") return;

    // Add user message
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    setInput("");
    setLoading(true);

    // 🛒 Handle cart-related commands
    const lowerInput = input.toLowerCase();
    if (lowerInput.startsWith("add ")) {
      const productName = input.replace("add", "").trim();
      const product = findProduct(productName);
      if (product) {
        addToCart(product.id);
        setMessages((prev) => [
          ...prev,
          { text: `✅ ${product.name} added to your cart.`, sender: "bot" },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { text: "⚠️ Sorry, I couldn't find that product.", sender: "bot" },
        ]);
      }
      setLoading(false);
      return;
    }

    if (lowerInput.startsWith("remove ")) {
      const productName = input.replace("remove", "").trim();
      const product = findProduct(productName);
      if (product) {
        removeFromCart(product.id, true);
        setMessages((prev) => [
          ...prev,
          { text: `🗑️ ${product.name} removed from your cart.`, sender: "bot" },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { text: "⚠️ Product not found.", sender: "bot" },
        ]);
      }
      setLoading(false);
      return;
    }

    if (lowerInput.includes("price")) {
      const productName = input.replace("price", "").trim();
      const product = findProduct(productName);
      if (product) {
        setMessages((prev) => [
          ...prev,
          {
            text: `💲 The price of ${product.name} is $${product.new_price}.`,
            sender: "bot",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { text: "⚠️ I couldn't find that product.", sender: "bot" },
        ]);
      }
      setLoading(false);
      return;
    }

    // 🤖 Otherwise → Send to Gemini
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(input);
      const response = await result.response;
      const text = response.text();

      const botMessage = { text, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      const errorMessage = {
        text: "⚠️ Oops! Something went wrong. Please try again.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Floating Chatbot Icon */}
      {!isOpen && (
        <button className="chatbot-icon" onClick={() => setIsOpen(true)}>
          <img src={help_icon} alt="Chatbot Icon" />
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
            {loading && <div className="bot-message">🤖 Typing...</div>}
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend} disabled={loading}>
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
