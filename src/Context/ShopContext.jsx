import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";



export const ShopContext = createContext(null);

const getDefaultCart = () => {
  let cart = {};
  for (let index = 1; index <= 300; index++) {
    cart[index] = 0;
  }
  return cart;
};

const ShopContextProvider = (props) => {

  const [all_product, setAll_Product] = useState([]);
  const [cartItems, setCartItems] = useState(getDefaultCart());
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(
    localStorage.getItem("token") || sessionStorage.getItem("token")
  );

 
  // Axios instance with token
  const axiosInstance = axios.create();
  axiosInstance.interceptors.request.use((config) => {
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  const updateToken = (newToken, rememberMe = false) => {
    setToken(newToken);
    if (rememberMe) {
      localStorage.setItem("token", newToken);
      sessionStorage.removeItem("token");
    } else {
      sessionStorage.setItem("token", newToken);
      localStorage.removeItem("token");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          "https://dept-store-backend.vercel.app/allproducts"
        );
        setAll_Product(data);

        if (token) {
          const { data: cartData } = await axiosInstance.post(
            "https://dept-store-backend.vercel.app/getcart",
            {}
          );
          setCartItems(cartData);
        }
      } catch (err) {
        console.error("Error fetching products/cart:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const addToCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    if (!token) return;

    try {
      await axiosInstance.post(
        "https://dept-store-backend.vercel.app/addtocart",
        { itemId, quantity: 1 }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const updateCartQuantity = async (itemId, quantity) => {
    setCartItems((prev) => ({ ...prev, [itemId]: quantity }));
    if (!token) return;

    try {
      await axiosInstance.post(
        "https://dept-store-backend.vercel.app/updatecart",
        { itemId, quantity }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromCart = async (itemId, removeCompletely = false) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: removeCompletely ? 0 : Math.max(prev[itemId] - 1, 0),
    }));
    if (!token) return;

    try {
      await axiosInstance.post(
        "https://dept-store-backend.vercel.app/removetocart",
        { itemId, removeCompletely }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const getTotalCartAmount = () => {
    let total = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const product = all_product.find((p) => p.id === Number(item));
        if (product) total += product.new_price * cartItems[item];
      }
    }
    return total;
  };

  const getTotalCartItems = () =>
    Object.values(cartItems).reduce((acc, qty) => acc + qty, 0);

  const placeOrder = async ({ fullName, address, phoneNumber, paymentMethod }) => {
    if (!fullName || !address || !phoneNumber) {
      toast.error("Please fill all fields");
      return;
    }

    const orderData = Object.keys(cartItems)
      .filter((id) => cartItems[id] > 0)
      .map((id) => {
        const product = all_product.find((p) => p.id === Number(id));
        if (!product) return null;
        return {
          productId: Number(id),
          name: product.name,
          quantity: cartItems[id],
          price: product.new_price,
        };
      })
      .filter((item) => item !== null);

    const total = orderData.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    if (total <= 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!token) {
      toast.error("You must be logged in to place an order");
      return;
    }

    try {
      if (paymentMethod === "Cash on Delivery") {
        await axiosInstance.post(
          "https://dept-store-backend.vercel.app/create-order",
          {
            fullName,
            address,
            phoneNumber,
            paymentMethod,
            paymentStatus: "Pending",
            total,
            orderData,
          }
        );

        toast.success("Order Placed Successfully!");
        const emptyCart = {};
        Object.keys(cartItems).forEach((id) => (emptyCart[id] = 0));
        setCartItems(emptyCart);
        

      } else if (paymentMethod === "Card") {
        // ✅ Payment Intents Flow
        const { data } = await axiosInstance.post(
          "https://dept-store-backend.vercel.app/api/auth/payment",
          {
            fullName,
            address,
            phoneNumber,
            orderData,
            total,
          }
        );
        return data;
      } else {
        toast.error("Please select a payment method");
      }
    } catch (err) {
      console.error("Error placing order / Stripe Payment Error:", err);
      toast.error(
        err?.response?.data?.message || "Failed to place order. Please try again."
      );
    }
  };

  return (
    <ShopContext.Provider
      value={{
        all_product,
        cartItems,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        getTotalCartAmount,
        getTotalCartItems,
        updateToken,
        token,
        setCartItems,
        placeOrder,
      }}
    >
      {loading ? <p>Loading...</p> : props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
