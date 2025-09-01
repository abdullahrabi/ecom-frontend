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

  const userMessage = { text: input, sender: "user" };
  setMessages((prev) => [...prev, userMessage]);
  setInput("");
  setLoading(true);

  const lowerInput = input.toLowerCase();

  // 🛒 Add to cart (semantic detection)
  if (lowerInput.includes("add") || lowerInput.includes("buy")) {
    const productName = input.replace(/add|buy/gi, "").trim();
    const product = findProduct(productName);
    if (product) {
      addToCart(product.id);
      setMessages((prev) => [
        ...prev,
        { text: `✅ Great choice! I’ve added **${product.name}** to your cart. 🛍️`, sender: "bot" },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { text: "⚠️ Sorry, I couldn’t find that product in our store.", sender: "bot" },
      ]);
    }
    setLoading(false);
    return;
  }

  // 🗑️ Remove from cart
  if (lowerInput.includes("remove") || lowerInput.includes("delete")) {
    const productName = input.replace(/remove|delete/gi, "").trim();
    const product = findProduct(productName);
    if (product) {
      removeFromCart(product.id, true);
      setMessages((prev) => [
        ...prev,
        { text: `🗑️ No problem! I’ve removed **${product.name}** from your cart.`, sender: "bot" },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { text: "⚠️ I couldn’t find that product in your cart.", sender: "bot" },
      ]);
    }
    setLoading(false);
    return;
  }

  // 💲 Price check
  if (lowerInput.includes("price") || lowerInput.includes("cost")) {
    const productName = input.replace(/price|cost/gi, "").trim();
    const product = findProduct(productName);
    if (product) {
      setMessages((prev) => [
        ...prev,
        {
          text: `💲 The current price of **${product.name}** is **RS ${product.new_price}**.`,
          sender: "bot",
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { text: "⚠️ Hmm, I don’t see that item in our catalog.", sender: "bot" },
      ]);
    }
    setLoading(false);
    return;
  }

  // 🤖 Otherwise → Ask Gemini but restrict it
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
You are a shopping assistant. ONLY talk about the store’s products and shopping-related queries.
If the user asks something unrelated (like history, math, or news), politely say:
"Sorry, I can only help with shopping questions in our store."

User query: ${input}
Available products: ${all_product.map((p) => `${p.name} ($${p.new_price})`).join(", ")}
              `,
            },
          ],
        },
      ],
    });

    const response = await result.response;
    const text = response.text();

    setMessages((prev) => [...prev, { text, sender: "bot" }]);
  } catch (error) {
    console.error("Gemini API Error:", error);
    setMessages((prev) => [
      ...prev,
      { text: "⚠️ Oops! Something went wrong. Please try again.", sender: "bot" },
    ]);
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
