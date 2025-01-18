import './Slideshow.css';
import React, { useState, useEffect } from 'react';

const Slideshow = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Function to go to the next slide
  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  // Function to go to a specific slide
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Use effect to auto slide every 3 seconds
  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 3000);
    return () => clearInterval(slideInterval);
  }, [currentSlide, slides.length]);

  return (
    <div className="slideshow-container">
      <div className="slideshow-wrapper" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {slides.map((slide, index) => (
          <a key={index} href={slide.link} className="slide">
            <img src={slide.image} alt={`Slide ${index}`} />
          </a>
        ))}
      </div>
      <button onClick={() => setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length)} className="prev">&#10094;</button>
      <button onClick={nextSlide} className="next">&#10095;</button>
      <div className="dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Slideshow;
