import React, { useState, useEffect, useContext, useRef } from "react";
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

  const messagesEndRef = useRef(null);

  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
  const API_BASE = process.env.REACT_APP_BACKEND_URL;

  // ✅ Auto-scroll to last message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // ✅ Load full chat history when chatbot opens
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${API_BASE}/chat/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success && res.data.chat) {
          const oldMessages = res.data.chat.messages;

          setMessages((prev) => {
            const newMessages = oldMessages.filter(
              (m) => !prev.some(pm => pm.text === m.text && pm.sender === m.sender)
            );
            return [...prev, ...newMessages];
          });
        }
      } catch (err) {
        console.error("Error loading chat history:", err);
      }
    };

    if (isOpen && messages.length <= 1) fetchHistory(); // fetch only once
  }, [isOpen]);

  // ✅ Save chat history after each new message
  const saveHistory = async (messagesToSave) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token || messagesToSave.length === 0) return;

      await axios.post(
        `${API_BASE}/chat/save`,
        { messages: messagesToSave },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Error saving chat history:", err);
    }
  };

  // 🔍 Helper: Find product by name
  const findProduct = (query) => {
    if (!query) return null;
    const cleanQuery = query.toLowerCase().trim();

    return (
      all_product.find((p) => p.name.toLowerCase().trim() === cleanQuery) ||
      all_product.find((p) => p.name.toLowerCase().includes(cleanQuery))
    );
  };

  // 📋 Helper: Find category by name
  const findCategory = (query) => {
    if (!query) return null;
    const cleanQuery = query.toLowerCase().trim();
    const categories = [...new Set(all_product.map((p) => p.category))];
    return categories.find((c) => c.toLowerCase().includes(cleanQuery));
  };
// 📋 Show all products (no bullets)
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
        `📌 ${cat.replace("_", " & ")}:\n${categories[cat].join("\n")}` // removed "-" to avoid "*"
    )
    .join("\n\n");
};

  // 🚀 Handle send
  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => {
      const updated = [...prev, userMessage];
      saveHistory(updated); // Save after adding new message
      return updated;
    });

    setInput("");
    setLoading(true);

    const lowerInput = input.toLowerCase();

    // 🛒 Add to cart
    if (lowerInput.includes("add") || lowerInput.includes("buy")) {
      const productName = input.replace(/add|buy/gi, "").trim();
      const product = findProduct(productName);
      if (product) {
        addToCart(product.id);
        const botMsg = { text: `✅ Added ${product.name} to your cart. 🛍️`, sender: "bot" };
        setMessages((prev) => { saveHistory([...prev, botMsg]); return [...prev, botMsg]; });
      } else {
        const botMsg = { text: "⚠️ Sorry, I couldn’t find that product in our store.", sender: "bot" };
        setMessages((prev) => { saveHistory([...prev, botMsg]); return [...prev, botMsg]; });
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
        const botMsg = { text: `🗑️ Removed ${product.name} from your cart.`, sender: "bot" };
        setMessages((prev) => { saveHistory([...prev, botMsg]); return [...prev, botMsg]; });
      } else {
        const botMsg = { text: "⚠️ I couldn’t find that product in your cart.", sender: "bot" };
        setMessages((prev) => { saveHistory([...prev, botMsg]); return [...prev, botMsg]; });
      }
      setLoading(false);
      return;
    }

    // Other queries handled similarly...
    // 🤖 Gemini AI fallback
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const result = await model.generateContent({
        contents: [
          ...messages.map((m) => ({ role: m.sender === "user" ? "user" : "model", parts: [{ text: m.text }] })),
          { role: "user", parts: [{ text: `You are a shopping assistant. Query: ${input}\nAvailable products:\n${showAllProducts()}` }] },
        ],
      });

      let text = (await result.response).text();
      
      // ✅ Clean up Markdown formatting
      text = text.replace(/\*\*(.*?)\*\*/g, "$1"); // remove bold
      text = text.replace(/\*(.*?)\*/g, "$1");     // remove bullet asterisks
      text = text.replace(/#+\s/g, "");           // remove headers
      text = text.replace(/-/g, "");              // remove any leftover hyphens


      const botMsg = { text, sender: "bot" };
      setMessages((prev) => { saveHistory([...prev, botMsg]); return [...prev, botMsg]; });
    } catch (error) {
      const botMsg = { text: "⚠️ Oops! Something went wrong. Please try again.", sender: "bot" };
      setMessages((prev) => { saveHistory([...prev, botMsg]); return [...prev, botMsg]; });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!isOpen && (
        <button className="chatbot-icon" onClick={() => setIsOpen(true)}>
          <img src={help_icon} alt="Chatbot Icon" />
        </button>
      )}

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
            <div ref={messagesEndRef} />
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
