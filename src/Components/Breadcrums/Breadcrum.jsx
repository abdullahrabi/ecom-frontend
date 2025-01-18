import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import arrow_icon from '../Assests/breadcrum_icon.png';
import './Breadcrum.css';

const Breadcrum = (props) => {
    const { product } = props;
    const location = useLocation();

    // Determine the active link based on the current path
    const isActiveLink = (path) => location.pathname === path ? 'active' : '';

    return (
        <div className='breadcrum'>
            {/* Home Link */}
            <Link to="/" className={isActiveLink('/')}>Home</Link>
            <img src={arrow_icon} alt="arrow" />

            {/* Category Link */}
            {product.category && (
                <>
                    {product.category === 'Grocery' && <Link to="/Grocery" className={isActiveLink('/Grocery')}>Grocery</Link>}
                    {product.category === 'Electronics' && <Link to="/Electronics" className={isActiveLink('/Electronics')}>Electronics</Link>}
                    {product.category === 'Perfume' && <Link to="/Perfume" className={isActiveLink('/Perfume')}>Perfume</Link>}
                    {product.category === 'Makeup' && <Link to="/Makeup" className={isActiveLink('/Makeup')}>Makeup</Link>}
                    {product.category === 'Skincare' && <Link to="/Skincare" className={isActiveLink('/Skincare')}>Skincare</Link>}
                    {product.category === 'Fruits_Vegetables' && <Link to="/Fruits_Vegetables" className={isActiveLink('/Fruits_Vegetables')}>Fruits & Vegetables</Link>}
                    <img src={arrow_icon} alt="arrow" />
                </>
            )}

            {/* Product Link */}
            {product.name && (
                <Link to={`/product/${product.id}`} className={isActiveLink(`/product/${product.id}`)}>{product.name}</Link>
            )}
        </div>
    );
};

export default Breadcrum;
