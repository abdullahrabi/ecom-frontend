// ShopContext.jsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // ✅ Add item to cart
  const addToCart = (product) => {
    setCartItems((prev) => [...prev, { ...product, quantity: 1 }]);
  };

  // ✅ Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  // ✅ Update quantity
  const updateQuantity = (productId, qty) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  // ✅ Calculate total
  const getTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // ✅ Checkout with 2Checkout
  const checkout = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/payment", {
        total: getTotal(),
        orderData: cartItems.map((item) => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        address: "Lahore, Pakistan",
        phoneNumber: "03001234567",
        fullName: "Abdullah Rabi",
      });

      if (response.data.success) {
        alert("Redirecting to 2Checkout...");
        window.location.href = response.data.paymentUrl; // ✅ Redirect user to 2Checkout
      } else {
        alert(response.data.message || "Payment failed");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Server error during checkout");
    }
  };

  return (
    <ShopContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotal,
        checkout,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
