import React, { useState, useEffect } from "react";
import './Navbar.css';
import { Search, ShoppingCart, Menu } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return(
    <nav className={`fixed top-0 left-0 right-0 z-1000 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-white'
    }`}>
      <div className="max-w-[1200px] mx-2 my-2">
        <div className="flex justify-between h-8 navbar-container">
          
          {/* Hamburger Menu Button - Only visible on mobile */}
          <button 
            className="mobile-menu-btn"
            onClick={toggleMenu}
          >
            <Menu size={30} />
          </button>

          {/* Logo */}
          <div className="flex-shrink-0">
            <h3 className="text-2xl font-bold">Mtu-mbad</h3>
          </div>

          {/* Navigation Links */}
          <div className={`nav-links ${isMenuOpen ? 'show' : ''}`}>
            <a href="/">HOME</a>
            <a href="/about">ABOUT US</a>
            <a href="/shop">SHOP</a>
            <a href="/contact">CONTACT</a>
          </div>

          {/* Right Side Icons */}
          <div className="flex">
            <button className="text-gray-800 hover:text-gray-600 carts">
              <Search size={30} />
            </button>
            <button className="text-gray-800 hover:text-gray-600 flex items-center carts">
              <ShoppingCart size={30} />
              <span className="ml-1">0</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;