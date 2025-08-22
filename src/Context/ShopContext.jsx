import React, { createContext, useEffect, useState } from "react";

// Create ShopContext
export const ShopContext = createContext(null);

// Default cart setup
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
    localStorage.getItem('token') || sessionStorage.getItem('token')
  );

  // Persist token and update state
  const updateToken = (newToken, rememberMe = false) => {
    setToken(newToken);
    if (newToken) {
      if (rememberMe) {
        localStorage.setItem('token', newToken);
        sessionStorage.removeItem('token');
      } else {
        sessionStorage.setItem('token', newToken);
        localStorage.removeItem('token');
      }
    } else {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
    }
  };

  // Fetch all products & cart data when token changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all products
        const res = await fetch('https://dept-store-backend.vercel.app/allproducts');
        const data = await res.json();
        setAll_Product(data);
        setLoading(false);

        // Fetch cart if token exists
        if (token) {
          const cartRes = await fetch('https://dept-store-auth-server.vercel.app/getcart', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({})
          });
          const cartData = await cartRes.json();
          setCartItems(cartData);
        }
      } catch (err) {
        console.error('Error fetching products/cart:', err);
      }
    };

    fetchData();
  }, [token]);

  // Add to cart
  const addToCart = async (itemId) => {
    setCartItems(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));

    if (!token) return console.error('No token found. User not authenticated.');

    try {
      const res = await fetch('https://dept-store-auth-server.vercel.app/addtocart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId, quantity: 1 })
      });
      console.log("Added to cart:", await res.json());
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  // Update cart quantity
  const updateCartQuantity = async (itemId, quantity) => {
    setCartItems(prev => ({ ...prev, [itemId]: quantity }));

    if (!token) return console.error('No token found. User not authenticated.');

    try {
      const res = await fetch('https://dept-store-auth-server.vercel.app/updatecart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId, quantity })
      });
      console.log("Updated cart:", await res.json());
    } catch (err) {
      console.error('Error updating cart:', err);
    }
  };

  // Remove from cart
  const removeFromCart = async (itemId, removeCompletely = false) => {
    setCartItems(prev => ({ 
      ...prev, 
      [itemId]: removeCompletely ? 0 : Math.max(prev[itemId] - 1, 0) 
    }));

    if (!token) return console.error('No token found. User not authenticated.');

    try {
      const res = await fetch('https://dept-store-auth-server.vercel.app/removetocart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId, removeCompletely })
      });
      console.log("Removed from cart:", await res.json());
    } catch (err) {
      console.error('Error removing from cart:', err);
    }
  };

  // Calculate total cart amount
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const product = all_product.find(p => p.id === Number(item));
        if (product) totalAmount += product.new_price * cartItems[item];
      }
    }
    return totalAmount;
  };

  // Calculate total cart items
  const getTotalCartItems = () => {
    return Object.values(cartItems).reduce((acc, qty) => acc + qty, 0);
  };

  const contextValue = {
    all_product,
    cartItems,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    getTotalCartAmount,
    getTotalCartItems,
    updateToken,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {loading ? <p>Loading...</p> : props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
