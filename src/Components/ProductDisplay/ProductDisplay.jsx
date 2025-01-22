import React, { useContext } from 'react';
import './ProductDisplay.css';
import star_icon from '../Assests/star_icon.png';
import star_dull_icon from '../Assests/star_dull_icon.png';
import { ShopContext } from '../../Context/ShopContext';

const ProductDisplay = (props) => {
    const { product } = props;
    const { addToCart, cartItems, removeFromCart, updateCartQuantity } = useContext(ShopContext);
    
    // Update cart quantity when user enters it manually
    const handleQuantityChange = (event, productId) => {
        const newQuantity = parseInt(event.target.value, 10);
        if (!isNaN(newQuantity) && newQuantity > 0) {
            updateCartQuantity(productId, newQuantity);  // Call a function to update the cart's quantity
        }
    };

    return (
        <div className='productdisplay'>
            <div className='productdisplay-left'>
                <div className='productdisplay-img-list'>
                    <img src={product.image} alt="" />
                    <img src={product.image} alt="" />
                    <img src={product.image} alt="" />
                    <img src={product.image} alt="" />
                </div>
                <div className='productdisplay-img'>
                    <img className='productdisplay-main-img' src={product.image} alt="" />
                </div>
            </div>
            <div className='productdisplay-right'>
                <h1>{product.name}</h1>
                <div className='productdisplay-right-stars'>
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_dull_icon} alt="" />
                </div>
                <div className='productdisplay-right-prices'>
                    <div className='productdisplay-right-price-old'>RS {product.old_price}</div>
                    <div className='productdisplay-right-price-new'>RS {product.new_price}</div>
                </div>
                <button onClick={() => addToCart(product.id)}>ADD TO CART</button>
            </div>
        </div>
    );
};

export default ProductDisplay;
