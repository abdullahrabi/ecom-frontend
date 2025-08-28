import React, { useContext } from 'react';
import './ProductDisplay.css';
import star_icon from '../Assests/star_icon.png';
import star_dull_icon from '../Assests/star_dull_icon.png';
import { ShopContext } from '../../Context/ShopContext';

const ProductDisplay = (props) => {
    const { product } = props;
    const { addToCart, cartItems, updateCartQuantity } = useContext(ShopContext);

    // Handle quantity change like in CartItems
    const handleQuantityChange = (event, productId) => {
        const newQuantity = parseInt(event.target.value, 10);
        if (!isNaN(newQuantity) && newQuantity >= 0) {
            updateCartQuantity(productId, newQuantity); // update quantity in context
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
                <h1 className="productdisplay-right-name">{product.name}</h1>

                <div className='productdisplay-right-category'>
                    Category: <strong>{product.category}</strong>
                </div>

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

                {/* Quantity input like CartItems */}
                <div className='productdisplay-right-quantity'>
                    <label>Quantity:</label>
                    <input
                        type="number"
                        min="0"
                        value={cartItems[product.id] || 0}
                        onChange={(e) => handleQuantityChange(e, product.id)}
                    />
                </div>

                <button onClick={() => addToCart(product.id)}>ADD TO CART</button>
            </div>
        </div>
    );
};

export default ProductDisplay;
