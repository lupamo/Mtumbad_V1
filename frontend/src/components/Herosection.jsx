import React, { useState, useEffect } from 'react';
import './Herosection.css';
import hero1 from "../assets/hero-1.png";
import hero2 from "../assets/hero-2.png";
import hero3 from "../assets/hero-3.png";

const Herosection = () => {
	const [currentSlide, setCurrentSlide] = useState(0);
  
	const images = [
	  hero1,
	  hero2,
	  hero3
	];
  
	// Auto-rotate slides
	useEffect(() => {
	  const timer = setInterval(() => {
		setCurrentSlide((prevSlide) => 
		  prevSlide === images.length - 1 ? 0 : prevSlide + 1
		);
	  }, 5000); // Change slide every 5 seconds
  
	  return () => clearInterval(timer);
	}, []);
  
	// Manual navigation
	const goToSlide = (index) => {
	  setCurrentSlide(index);
	};
  
	return (
	  <div className="hero-section">
		{/* Image Slides */}
		<div className="hero-slider">
		  {images.map((image, index) => (
			<div 
			  key={index}
			  className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
			  style={{ backgroundImage: `url(${image})`, height:"95%"}}
			>
			  <div className="overlay"></div>
			</div>
		  ))}
		</div>
  
		{/* Hero Content */}
		<div className="hero-content">
		</div>
		{/* Slide Indicators */}
		<div className="slide-indicators">
		  {images.map((_, index) => (
			<button
			  key={index}
			  className={`indicator ${index === currentSlide ? 'active' : ''}`}
			  onClick={() => goToSlide(index)}
			/>
		  ))}
		</div>
	  </div>
	);
  };
  
  export default Herosection;
