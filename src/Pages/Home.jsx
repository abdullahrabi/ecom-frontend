import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSpring, animated } from '@react-spring/web'; // React Spring for animations
import { useInView } from 'react-intersection-observer'; // For detecting scroll into view
import './CSS/Home.css';
import grocery from '../Components/Assests/grocery.png';
import Electronics from '../Components/Assests/Electronics.png';
import Skincare from '../Components/Assests/Skincare.png';
import Perfume from '../Components/Assests/Perfume.png';
import Makeup from '../Components/Assests/Makeup.png';
import Fruits from '../Components/Assests/Fruits.jpg';
import Popular from '../Components/Popular/Popular';
import per from '../Components/Assests/per.png';
import make from '../Components/Assests/make.png';
import skin from '../Components/Assests/skin.png';
import home from '../Components/Assests/home.png';
import The_Latest from '../Components/The_Latest/The_Latest';
import NewsLetter from '../Components/NewsLetter/NewsLetter';
import Hero from '../Components/Hero/Hero';
import up_arrow from '../Components/Assests/up_arrow.png';

const Home = () => {
  // Create a helper function to manage scroll-triggered animations
  const useScrollAnimation = (delay) => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    const animationProps = useSpring({
      from: { opacity: 0, transform: 'translateY(50px)' },
      to: { opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(50px)' },
      config: { tension: 800, friction: 60 },
      delay: delay,
    });

    return [ref, animationProps];
  };

  // Apply scroll animations with delays to each section
  const [menu1Ref, menu1Spring] = useScrollAnimation(300);
  const [popularRef, popularSpring] = useScrollAnimation(500);
  const [menu2Ref, menu2Spring] = useScrollAnimation(700);
  const [latestRef, latestSpring] = useScrollAnimation(500);
  const [newsletterRef, newsletterSpring] = useScrollAnimation(500);

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
    <div>
      <Hero /> {/* Keeping Hero as is */}

      {/* Menu 1 with scroll animation */}
      <animated.div style={menu1Spring} ref={menu1Ref}>
        <div className='menu-1'>
          <Link className='Link1' to='/Grocery'>
            <img src={grocery} alt="Grocery Icon" onClick={scrollToTop} />
            <h4>Grocery</h4>
          </Link>
          <Link className='Link2' to='/Electronics'>
            <img src={Electronics} alt="Electronics Icon" onClick={scrollToTop} />
            <h4>Electronics</h4>
          </Link>
          <Link className='Link3' to='/Skincare'>
            <img src={Skincare} alt="Skincare Icon" onClick={scrollToTop} />
            <h4>Skincare</h4>
          </Link>
          <Link className='Link4' to='/Perfume'>
            <img src={Perfume} alt="Perfume Icon" onClick={scrollToTop} />
            <h4>Perfume</h4>
          </Link>
          <Link className='Link5' to='/Makeup'>
            <img src={Makeup} alt="Makeup Icon" onClick={scrollToTop} />
            <h4>Makeup</h4>
          </Link>
          <Link className='Link6' to='/Fruits_Vegetables'>
            <img src={Fruits} alt="Fruits & Vegetables Icon" onClick={scrollToTop} />
            <h4>Fruits & Vegetables</h4>
          </Link>
        </div>
      </animated.div>

      {/* Popular Section with scroll animation */}
      <animated.div style={popularSpring} ref={popularRef}>
        <Popular />
      </animated.div>

      {/* Menu 2 with scroll animation */}
      <animated.div style={menu2Spring} ref={menu2Ref}>
        <div className='menu-2'>
          <Link to='/Perfume'>
            <img src={per} alt="Perfume Icon" onClick={scrollToTop} />
          </Link>
          <Link className='Link8' to='/Makeup'>
            <img src={make} alt="Makeup Icon" onClick={scrollToTop} />
          </Link>
          <Link className='Link9' to='/Skincare'>
            <img src={skin} alt="Skincare Icon" onClick={scrollToTop} />
          </Link>
          <Link className='Link10' to='/Electronics'>
            <img src={home} alt="Electronics Icon" onClick={scrollToTop} />
          </Link>
        </div>
      </animated.div>

      {/* The Latest Section with scroll animation */}
      <animated.div style={latestSpring} ref={latestRef}>
        <The_Latest />
      </animated.div>

      {/* Newsletter Section with scroll animation */}
      <animated.div style={newsletterSpring} ref={newsletterRef}>
        <NewsLetter />
      </animated.div>

      {/* Scroll to Top Button */}
      {isVisible && (
        <img
          className="scroll-to-top"
          src={up_arrow}
          alt="Scroll to top"
          onClick={scrollToTop}
        />
      )}
    </div>
  );
};

export default Home;
