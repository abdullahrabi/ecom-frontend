import React, { createContext, useEffect, useState } from "react";

// Create ShopContext
export const ShopContext = createContext(null);

// You can adjust the range if needed, but generally this should be flexible.
const getDefaultCart = () => {
    let cart = {};
    for (let index = 1; index < 300 + 1; index++) {
        cart[index] = 0;
    }
    return cart;
};

const ShopContextProvider = (props) => {
    const [all_product, setAll_Product] = useState([]);
    const [cartItems, setCartItems] = useState(getDefaultCart());

    // Fetch all products on component mount
    useEffect(() => {
        fetch('http://localhost:5000/allproducts')
            .then((response) => response.json())
            .then((data) => setAll_Product(data));
    }, []);

    // Add item to the cart and update the backend
    const addToCart = (itemId) => {
        // Update the cart locally
        setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));

        // API call to add to cart
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
            fetch('http://localhost:5000/addtocart', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId, quantity: 1 }) // Add quantity 1
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

        
    };

    // Remove an item from the cart completely or decrease quantity
    const removeFromCart = (itemId, removeCompletely = false) => {
        if (removeCompletely) {
            setCartItems((prev) => ({ ...prev, [itemId]: 0 }));  // Set item quantity to 0 to remove completely
        } else {
            setCartItems((prev) => {
                const newQuantity = prev[itemId] > 1 ? prev[itemId] - 1 : 0;
                return { ...prev, [itemId]: newQuantity };
            });
        }

        // API call to remove from cart or update quantity
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
            fetch('http://localhost:5000/removetocart', {
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
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
