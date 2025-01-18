import React, { useContext, useState, useEffect } from 'react';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../Assests/remove_icon.png';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CartItems = () => {
    const { getTotalCartAmount, all_product, cartItems, removeFromCart, updateCartQuantity } = useContext(ShopContext);

    // Check both localStorage and sessionStorage for token
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem('token') || sessionStorage.getItem('token') ? true : false
    );

    // Calculate the total number of items in the cart
    const totalCartItems = Object.values(cartItems).reduce((sum, quantity) => sum + quantity, 0);

    useEffect(() => {
        console.log('Cart items:', cartItems);  // Debugging cartItems structure
        console.log('Total items in cart:', totalCartItems);  // Check if totalCartItems is calculated correctly
    }, [cartItems]);

    // Update cart quantity when user enters it manually
    const handleQuantityChange = (event, productId) => {
        const newQuantity = parseInt(event.target.value, 10);
        if (!isNaN(newQuantity) && newQuantity > 0) {
            updateCartQuantity(productId, newQuantity);  // Call a function to update the cart's quantity
        }
    };

    const handleCheckout = () => {
        if (!isAuthenticated) {
            // Show a toast message asking the user to log in
            toast.warning('Kindly Login to Proceed to Checkout');
        } else if (totalCartItems === 0) {
            // Show a toast message if there are no items in the cart
            toast.warning('Please Add Atleast one Item to Your Cart for Checkout');
        } else {
            // Proceed to checkout
            console.log('Proceeding to checkout...');
            toast.success('Proceeding to Checkout!');
        }
    };

    return (
        <div className='cartitems'>
            <div className='cartitems-format-main'>
                <p>Products</p>
                <p>Title</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            <hr />

            {all_product?.map((e) => {
                if (cartItems[e.id] > 0) {
                    return (
                        <div key={e.id}>
                            <div className='cartitems-format cartitems-format-main'>
                                <img src={e.image} alt="" className='carticon-product-icon' />
                                <p>{e.name}</p>
                                <p>RS {e.new_price}</p>
                                
                                {/* Quantity Input Field */}
                                <input 
                                    type='number' 
                                    className='cartitems-quantity' 
                                    value={cartItems[e.id]} 
                                    onChange={(event) => handleQuantityChange(event, e.id)} 
                                />

                                <p>RS {e.new_price * cartItems[e.id]}</p>
                                
                                {/* Remove Item Button */}
                                <img 
                                    className='cartitems-remove-icon' 
                                    src={remove_icon} 
                                    onClick={() => removeFromCart(e.id, true)}  // Pass a flag to remove the whole item
                                    alt="" 
                                />
                            </div>
                            <hr />
                        </div>
                    );
                }
                return null;
            })}

            <div className='cartitems-down'>
                <div className='cartitems-total'>
                    <h1>Cart Totals</h1>
                    <div>
                        <div className='cartitems-total-item'>
                            <p>Subtotal</p>
                            <p>RS {getTotalCartAmount()}</p>
                        </div>
                        <hr />
                        <div className='cartitems-total-item'>
                            <p>Shipping Fee</p>
                            <p>Free</p>
                        </div>
                        <hr />
                        <div className='cartitems-total-item'>
                            <h3>Total</h3>
                            <h3>RS {getTotalCartAmount()}</h3>
                        </div>
                    </div>
                    <button onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
                </div>
                <div className='cartitems-promocode'>
                    <p>If you have a promo code, Enter it here</p>
                    <div className='cartitems-promobox'>
                        <input type='text' placeholder='promo code' />
                        <button>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItems;