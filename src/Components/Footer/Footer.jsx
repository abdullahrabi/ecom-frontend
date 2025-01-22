import React, { useState, useEffect } from 'react';
import './Footer.css';
import footer_logo from '../Assests/footer_logo.png';
import facebook from '../Assests/facebook1.png';
import instgram from '../Assests/instgram.png';
import x from '../Assests/x.png';
import youtube from '../Assests/youtube.jpeg';
import { Link } from 'react-router-dom';
import up_arrow from '../Assests/up_arrow.png';

const Footer = () => {
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // State to handle the visibility of the scroll to top button
  const [isVisible, setIsVisible] = useState(false);

  // Check scroll position and toggle visibility of scroll-to-top button
  const toggleVisibility = () => {
    if (window.pageYOffset > 500) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Add event listener for scrolling
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);

    // Cleanup the event listener
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <div className="footer-logo-text">
            <h3>LA</h3>
            <img src={footer_logo} alt="Footer Logo" />
            <h4>ORGANIC</h4>
            <h4>STORE</h4>
          </div>
        </div>

        <div className="footer-links">
          <ul>
            <li>OUR BRANCHES</li>
            <li>LAHORE</li>
            <li>KARACHI</li>
            <li>FAISALABAD</li>
            <li>MULTAN</li>
            <li>RAWALPINDI</li>
          </ul>
          <ul>
            <Link className='link1' to='/Fruits_Vegetables' onClick={scrollToTop}>
              <li>Fruits & Vegetables</li>
            </Link>
            <Link className='link2' to='/Grocery' onClick={scrollToTop}>
              <li>Grocery</li>
            </Link>
            <Link className='link3' to='/Electronics' onClick={scrollToTop}>
              <li>Electronics</li>
            </Link>
            <Link className='link4' to='/Perfume' onClick={scrollToTop}>
              <li>Perfume</li>
            </Link>
            <Link className='link5' to='/Makeup' onClick={scrollToTop}>
              <li>Makeup</li>
            </Link>
            <Link className='link6' to='/Skincare' onClick={scrollToTop}>
              <li>Skincare</li>
            </Link>
          </ul>
          <ul>
            <li>Customer Service</li>
            {/* Conditional rendering based on login status */}
            {localStorage.getItem('token') || sessionStorage.getItem('token') ? (
              <li>Already Logged In</li>
            ) : (
              <Link className='link7' to='/login' onClick={scrollToTop}>
                <li>My Account</li>
              </Link>
            )}
            <li>Contact US</li>
            <li>Cash On Delivery Service</li>
            <li>Terms & Condition</li>
            <li>Shipping Policy</li>
          </ul>
        </div>
      </div>
      <div className='social-media'>
        <h3>FOLLOW US ON</h3>
        <img src={facebook} alt="Facebook" />
        <img src={instgram} alt="Instagram" />
        <img src={x} alt="X" />
        <img src={youtube} alt="YouTube" />
      </div>
      <div className="footer-bottom">
        <p>© 2024, La Organic Store All Rights Reserved - Powered By Developer Studio</p>
      </div>
      {/* Scroll to Top button */}
      {isVisible && (
        <img
          className="scroll-to-top"
          src={up_arrow}
          alt="Scroll to top"
          onClick={scrollToTop}
        />
      )}
    </footer>
  );
};

export default Footer;
