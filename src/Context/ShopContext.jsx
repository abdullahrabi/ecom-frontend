import React, { createContext, useEffect, useState } from "react";

// Create ShopContext
export const ShopContext = createContext(null);
const getDefaultCart = () => {
    let cart = {};
    for (let index = 0; index < 300 + 1; index++) {
        cart[index] = 0;
    }
    return cart;
};
const ShopContextProvider = (props) => {
    const [all_product, setAll_Product] = useState([]);
    const [cartItems, setCartItems] = useState(getDefaultCart());// Start with an empty object

    // Fetch all products on component mount
    useEffect(() => {
        fetch('http://localhost:5000/allproducts')
            .then((response) => response.json())
            .then((data) => setAll_Product(data));
    }, []);

    const addToCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    
    }
        
      
    const updateCartQuantity = (itemId, quantity) => {
        setCartItems((prev) => ({ ...prev, [itemId]: quantity }));
    };
    
    // Remove an item from the cart completely
    const removeFromCart = (itemId, removeCompletely = false) => {
        if (removeCompletely) {
            setCartItems((prev) => ({ ...prev, [itemId]: 0 }));  // Completely remove the item
        } else {
            setCartItems((prev) => {
                if (prev[itemId] > 1) {
                    return { ...prev, [itemId]: prev[itemId] - 1 };
                } else {
                    return { ...prev, [itemId]: 0 };  // Remove item if quantity goes to 0
                }
            });
        }
    };

    // Get total cart amount
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

    // Get total number of items in the cart
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
        updateCartQuantity,  // Include the new function to update quantity
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