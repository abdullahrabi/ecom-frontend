import React from 'react'
import './Hero.css'
import hero_icon from '../Assests/hero_icon.jpg'
import Perfumes from '../Assests/Perfumes.png'
import Skincare from '../Assests/Skincare1.png'
import { Link } from 'react-router-dom'
import Slideshow from '../Slideshow/Slideshow';
const slides = [
  { image: hero_icon, link: '/Fruits_Vegetables' },
  { image: Perfumes, link: '/Perfume' },
  { image: Skincare, link: '/Skincare' },
];


const Hero = () => {
  

return (
    <div>
     <Slideshow slides={slides} />
    </div>
  );
};

export default Hero;