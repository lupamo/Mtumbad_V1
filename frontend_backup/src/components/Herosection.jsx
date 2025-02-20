import React, { useState, useEffect } from 'react';
import './Herosection.css';
import Navbar from './Navbar';
import hero1 from "../assets/hero-1.png";
import hero2 from "../assets/hero-2.png";
import hero3 from "../assets/hero-3.png";

const Herosection = () => {
	const [currentSlide, setCurrentSlide] = useState(0);
  
	const slides = [
	  {
		image: hero1,
		title: "Define your personal style",
		description: "Everyday Style — Discover stylish, comfortable fashion that suits every occasion. Elevate your look with our...",
		backgroundColor: "#f5f5f5"
	  },
	  {
		image: hero2,
		title: "Elevate your style",
		description: "Quality, Stylish, Affordable Clothing & Accessories for Gents. Our mission is to deliver collection and accessories everyday.",
		backgroundColor: "#f5f5f5"
	  },
	  {
		image: hero3,
		title: "Redefine your Fashion",
		description: "Quality, Stylish, Affordable Clothing & Accessories for Gents. Our mission is to deliver collection and accessories everyday",
		backgroundColor: "#ffffff"
	  }
	];
  
	useEffect(() => {
	  const timer = setInterval(() => {
		setCurrentSlide((prevSlide) => 
		  prevSlide === slides.length - 1 ? 0 : prevSlide + 1
		);
	  }, 5000);
  
	  return () => clearInterval(timer);
	}, []);
  
	const goToSlide = (index) => {
	  setCurrentSlide(index);
	};
  
	return (
		<>
			<Navbar />
			<div className="hero-section">
				{slides.map((slide, index) => (
				<div
					key={index}
					className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
					style={{ backgroundColor: slide.backgroundColor }}
				>
					<div className="hero-content">
					<div className="text-content">
						<h1>{slide.title}</h1>
						{slide.description && <p>{slide.description}</p>}
					</div>
					<div className="image-container">
						<img src={slide.image} alt={`Slide ${index + 1}`} />
					</div>
					</div>
				</div>
				))}
				
				<div className="slide-indicators">
				{slides.map((_, index) => (
					<button
					key={index}
					className={`indicator ${index === currentSlide ? 'active' : ''}`}
					onClick={() => goToSlide(index)}
					/>
				))}
				</div>
			</div>
		</>
	  
	);
  };
  
  export default Herosection;