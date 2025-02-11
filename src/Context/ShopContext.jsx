import React, { createContext, useEffect, useState } from "react";

// Create ShopContext
export const ShopContext = createContext(null);

// Default cart setup with an adjustable range
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
    const [loading, setLoading] = useState(true); // Loading state for product fetch
    const [cartUpdated, setCartUpdated] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token') || sessionStorage.getItem('token'));
    
   
    const updateToken = (newToken) => {
    setToken(newToken);
};
setTimeout(()=>{
  setCartUpdated(true)
},5000)


    // Set cart updated flag after 5 seconds (optional)
    setTimeout(() => {
        setCartUpdated(true);
    }, 5000);

    useEffect(() => {
        // Fetch all products from backend
        fetch('https://dept-store-backend.vercel.app/allproducts')
            .then((response) => response.json())
            .then((data) => {
                setAll_Product(data);
                setLoading(false);
            })
            .catch((error) => console.error('Error fetching products:', error));

        // Fetch cart data if token is present
        if (token) {
            fetch('https://dept-store-auth-server.vercel.app/getcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: "", // Empty body since this is a fetch request
            })
                .then((response) => response.json())
                .then((data) => {
                    setCartItems(data);
                })
                .catch((error) => console.error('Error fetching cart:', error));
        }
    }, [token]);

    // Add item to the cart and update the backend
    const addToCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));

        if (token) {
            fetch('https://dept-store-auth-server.vercel.app/addtocart', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId, quantity: 1 })
            })
                .then((response) => response.json())
                .then((data) => console.log("Added to cart:", data))
                .catch((error) => console.error('Error adding to cart:', error));
        } else {
            console.error('No token found. User not authenticated.');
        }
    };

    // Update the quantity of items in the cart
    const updateCartQuantity = (itemId, quantity) => {
        setCartItems((prev) => ({ ...prev, [itemId]: quantity }));

        if (token) {
            fetch('https://dept-store-auth-server.vercel.app/updatecart', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId, quantity })
            })
                .then((response) => response.json())
                .then((data) => console.log("Updated cart:", data))
                .catch((error) => console.error('Error updating cart:', error));
        } else {
            console.error('No token found. User not authenticated.');
        }
    };

    // Remove an item from the cart or decrease quantity
    const removeFromCart = (itemId, removeCompletely = false) => {
        setCartItems((prev) => ({ ...prev, [itemId]: removeCompletely ? 0 : Math.max(prev[itemId] - 1, 0) }));

        if (token) {
            fetch('https://dept-store-auth-server.vercel.app/removetocart', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId, removeCompletely })
            })
                .then((response) => response.json())
                .then((data) => console.log("Removed from cart:", data))
                .catch((error) => console.error('Error removing from cart:', error));
        } else {
            console.error('No token found. User not authenticated.');
        }
    };

    // Calculate total cart amount
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = all_product.find((product) => product.id === Number(item));
                if (itemInfo) {
                    totalAmount += itemInfo.new_price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    // Calculate total number of items in the cart
    const getTotalCartItems = () => {
        let totalItem = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalItem += cartItems[item];
            }
        }
        return totalItem;
    };

    const contextValue = {
        getTotalCartItems,
        getTotalCartAmount,
        updateCartQuantity,
        removeFromCart,
        all_product,
        cartItems,
        addToCart,
        updateToken,
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {loading ? <p>Loading...</p> : props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
