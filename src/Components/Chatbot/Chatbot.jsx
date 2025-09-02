import React, { useState, useEffect, useContext } from "react";
import "./Chatbot.css";
import help_icon from "../Assests/help_icon.png";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ShopContext } from "../../Context/ShopContext";
import axios from "axios";

const Chatbot = () => {
  const {
    all_product,
    addToCart,
    removeFromCart,
    cartItems,
    getTotalCartAmount,
    getTotalCartItems,
  } = useContext(ShopContext);

  const [messages, setMessages] = useState([
    { text: "Hi 👋, I'm your shopping assistant. How can I help?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
  const API_BASE = process.env.REACT_APP_BACKEND_URL;

  // ✅ Load chat history when chatbot opens
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${API_BASE}/chat/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success && res.data.chat) {
          setMessages(res.data.chat.messages);
        }
      } catch (err) {
        console.error("Error loading chat history:", err);
      }
    };

    if (isOpen) fetchHistory();
  }, [isOpen]);

  // ✅ Save chat history on every update
  useEffect(() => {
    const saveHistory = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token || messages.length === 0) return;

        await axios.post(
          `${API_BASE}/chat/save`,
          { messages },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Error saving chat history:", err);
      }
    };

    saveHistory();
  }, [messages]);

  // 🔍 Helper: Find product by name
  const findProduct = (query) => {
    return all_product.find((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  // 📋 Helper: Show all products neatly with spacing
  const showAllProducts = () => {
    if (!all_product.length) return "No products available.";
    const categories = {};
    all_product.forEach((p) => {
      if (!categories[p.category]) categories[p.category] = [];
      categories[p.category].push(`${p.name} (Rs ${p.new_price})`);
    });

    return Object.keys(categories)
      .map(
        (cat) =>
          `📌 ${cat.replace("_", " & ")}:\n- ${categories[cat].join("\n- ")}`
      )
      .join("\n\n");
  };

  // 🚀 Handle Send
  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const lowerInput = input.toLowerCase();

    // 🛒 Add to cart
    if (lowerInput.includes("add") || lowerInput.includes("buy")) {
      const productName = input.replace(/add|buy/gi, "").trim();
      const product = findProduct(productName);
      if (product) {
        addToCart(product.id);
        setMessages((prev) => [
          ...prev,
          { text: `✅ Added ${product.name} to your cart. 🛍️`, sender: "bot" },
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
          { text: `🗑️ Removed ${product.name} from your cart.`, sender: "bot" },
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
          { text: `💲 The price of ${product.name} is Rs ${product.new_price}.`, sender: "bot" },
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

    // 📋 View cart items
    if (lowerInput.includes("show cart") || lowerInput.includes("view cart")) {
      const items = Object.keys(cartItems)
        .filter((id) => cartItems[id] > 0)
        .map((id) => {
          const product = all_product.find((p) => p.id === Number(id));
          return product ? `${product.name} (x${cartItems[id]})` : null;
        })
        .filter(Boolean);

      setMessages((prev) => [
        ...prev,
        {
          text: items.length
            ? `🛒 Your cart contains:\n- ${items.join("\n- ")}`
            : "🛒 Your cart is empty.",
          sender: "bot",
        },
      ]);
      setLoading(false);
      return;
    }

    // 🔢 Total cart items
    if (lowerInput.includes("how many items") || lowerInput.includes("cart items")) {
      const totalItems = getTotalCartItems();
      setMessages((prev) => [
        ...prev,
        { text: `🔢 You currently have ${totalItems} item(s) in your cart.`, sender: "bot" },
      ]);
      setLoading(false);
      return;
    }

    // 💰 Total cart amount
    if (lowerInput.includes("total amount") || lowerInput.includes("total price")) {
      const totalAmount = getTotalCartAmount();
      setMessages((prev) => [
        ...prev,
        { text: `💰 The total amount of your cart is Rs ${totalAmount}.`, sender: "bot" },
      ]);
      setLoading(false);
      return;
    }

    // 🛍️ Show all products
    if (lowerInput.includes("all products") || lowerInput.includes("list products")) {
      setMessages((prev) => [
        ...prev,
        { text: `🛍️ Here are all products:\n${showAllProducts()}`, sender: "bot" },
      ]);
      setLoading(false);
      return;
    }

    // 🤖 Otherwise → Ask Gemini
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const result = await model.generateContent({
        contents: [
          ...messages.map((m) => ({
            role: m.sender === "user" ? "user" : "model",
            parts: [{ text: m.text }],
          })),
          {
            role: "user",
            parts: [
              {
                text: `
You are a shopping assistant for LA Organic Store.
ONLY talk about the store’s products and shopping-related queries.
If the user asks something unrelated, politely say:
"Sorry, I can only help with shopping questions in our store."

User query: ${input}

Available products:
${showAllProducts()}
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
  }; // ✅ FIX: properly closed handleSend

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
            <span className="chatbot-close" onClick={() => setIsOpen(false)}>✖</span>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chatbot-message ${msg.sender === "user" ? "user-message" : "bot-message"}`}
              >
                {msg.text.split("\n").map((line, idx) => (
                  <div key={idx} style={{ marginBottom: line.startsWith("📌") ? "8px" : "2px" }}>
                    {line}
                  </div>
                ))}
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
