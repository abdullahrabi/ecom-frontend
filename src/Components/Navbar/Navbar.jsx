import React, { useContext, useEffect, useState } from 'react';
import './Navbar.css';
import logo from '../Assests/logo.png';
import cart_icon from '../Assests/cart_icon.png';
import login_icon from '../Assests/login_icon.png';
import logout_icon from '../Assests/logout_icon.png';
import { Link, useLocation } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import SearchBar from '../SearchBar/SearchBar';
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar = () => {
  const [menu, setMenu] = useState("Home");
  const { getTotalCartItems } = useContext(ShopContext);
  const location = useLocation();
  const [showOrders, setShowOrders] = useState(false);

  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath === '/') setMenu("Home");
    else if (currentPath === '/Grocery') setMenu("Grocery");
    else if (currentPath === '/Electronics') setMenu("Electronics");
    else if (currentPath === '/Perfume') setMenu("Perfume");
    else if (currentPath === '/Makeup') setMenu("Makeup");
    else if (currentPath === '/Skincare') setMenu("Skincare");
    else if (currentPath === '/Fruits_Vegetables') setMenu("Fruits_Vegetables");
  }, [location]);

  const isLoggedIn = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };



  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token'); 
    toast.success("Logout successful!");
    setTimeout(() => {
      window.location.replace('/');
    }, 1000);
  };

  return (
    <div className="navbar">
      <div className="navbar-top">
        <div className="navbar-logo">
          <Link to="/">
            <p><b>LA</b></p>
            <img src={logo} alt="La Organic Store Logo" />
            <p><b>Organic Store</b></p>
          </Link>
        </div>
        <SearchBar />
        <div className="nav-login-cart">
          {isLoggedIn() ? (
            <img src={logout_icon} alt="Logout Icon" onClick={handleLogout} />
          ) : (
            <Link to="/login">
              <img src={login_icon} alt="Login Icon" />
            </Link>
          )}

          <div 
            className="cart-container"
            onMouseEnter={() => setShowOrders(true)}
            onMouseLeave={() => setShowOrders(false)}
          >
            <Link to="/cart">
              <img src={cart_icon} alt="Cart Icon" />
            </Link>
            <div className="nav-cart-count">{getTotalCartItems()}</div>

            {/* Modern Order History Dropdown */}
            {isLoggedIn() (
              <div className="order-history-dropdown slide-down">
                <Link to="/order-history" className="order-history-link">
                  <div className="order-text">
                    <h4>Order History</h4>
                    </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="navbar-bottom">
        <ul className="nav-menu">
          <li>
            <Link style={{ color: 'inherit', textDecoration: 'none' }} to="/" onClick={() => setMenu("Home")}>Home</Link>
            {menu === "Home" ? <hr /> : null}
          </li>
          <li>
            <Link style={{ color: 'inherit', textDecoration: 'none' }} to="/Grocery" onClick={() => setMenu("Grocery")}>Grocery</Link>
            {menu === "Grocery" ? <hr /> : null}
          </li>
          <li>
            <Link style={{ color: 'inherit', textDecoration: 'none' }} to="/Electronics" onClick={() => setMenu("Electronics")}>Electronics</Link>
            {menu === "Electronics" ? <hr /> : null}
          </li>
          <li>
            <Link style={{ color: 'inherit', textDecoration: 'none' }} to="/Perfume" onClick={() => setMenu("Perfume")}>Perfume</Link>
            {menu === "Perfume" ? <hr /> : null}
          </li>
          <li>
            <Link style={{ color: 'inherit', textDecoration: 'none' }} to="/Makeup" onClick={() => setMenu("Makeup")}>Makeup</Link>
            {menu === "Makeup" ? <hr /> : null}
          </li>
          <li>
            <Link style={{ color: 'inherit', textDecoration: 'none' }} to="/Skincare" onClick={() => setMenu("Skincare")}>Skincare</Link>
            {menu === "Skincare" ? <hr /> : null}
          </li>
          <li>
            <Link style={{ color: 'inherit', textDecoration: 'none' }} to="/Fruits_Vegetables" onClick={() => setMenu("Fruits_Vegetables")}>Fruits & Vegetables</Link>
            {menu === "Fruits_Vegetables" ? <hr /> : null}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
