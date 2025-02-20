import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from './Navbar';
import style1 from '../assets/style1.jpg';
import style2 from '../assets/style2.jpg';
import style3 from '../assets/style3.jpg';
import style4 from '../assets/style4.jpg';
import style5 from '../assets/style5.jpg';
import style6 from '../assets/style6.jpg';
import './Deals.css';

const ProductCard = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const intervalRef = useRef(null);
  const navigate = useNavigate();


  const handleMouseEnter = () => {
    if (product.images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex(prev => 
          prev === product.images.length - 1 ? 0 : prev + 1
        );
      }, 1000);
    }
  };

  const handleMouseLeave = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCurrentImageIndex(0);
  };

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  React.useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div 
      className="product-card"
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      onMouseLeave={handleMouseLeave}
    >
      <div className="product-image-container">
        {product.images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${product.name} - View ${index + 1}`}
            className={`product-image ${index === currentImageIndex ? 'active' : ''}`}
            loading="lazy"
          />
        ))}
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="price">FROM {product.price}</p>
      </div>
    </div>
  );
};

const Deals = () => {
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [sortOption, setSortOption] = useState('default');


  const products = [
    {
      id: 1,
      name: "DRIVEN BY FAITH DECAL",
      price: "KSH1,600.00",
      images: [
        style1,
        style3,
        style5
      ],
      status: "in stock"
    },
    {
      id: 2,
      name: "CLUTCH WINDSHIELD BANNER V2",
      price: "KSH3,700.00",
      images: [
        style2,
        style4,
        style6
      ],
      status: "in stock"
    },
    {
      id: 3,
      name: "V2 CROSS DECAL",
      price: "KSH1,600.00",
      images: [
        style3,
        style5,
        style4
      ],
      status: "in stock"
    },
    {
      id: 4,
      name: "ORIGINAL CLUTCH WINDSHIELD BANNER",
      price: "KSH3,700.00",
      images: [
        style4,
        style6,
        style2
      ],
      status: "out of stock"
    },
    {
      id: 6,
      name: "ORIGINAL CLUTCH WINDSHIELD BANNER",
      price: "KSH3,700.00",
      images: [
        style5,
        style6,
        style2
      ],
      status: "out of stock"
    },
    {
      id: 5,
      name: "ORIGINAL CLUTCH WINDSHIELD BANNER",
      price: "KSH3,700.00",
      images: [
        style2,
        style6,
        style2
      ],
      status: "out of stock"
    }
  ];

  const filteredProducts = products.filter(product => {
    if (selectedAvailability === 'all') return true;
    return product.status === selectedAvailability;
  });

  const inStockCount = products.filter(p => p.status === 'in stock').length;
  const outOfStockCount = products.filter(p => p.status === 'out of stock').length;

  return (
    <>
      <Navbar />
      <div className="deals-container">
      <div className="page-header">
        <h1>DEALS</h1>
      </div>
      
      <div className="deals-layout">
        <aside className="filters">
          <div className="filter-section">
            <h2>AVAILABILITY</h2>
            <div className="filter-options">
              <div 
                className={`filter-option ${selectedAvailability === 'in stock' ? 'selected' : ''}`}
                onClick={() => setSelectedAvailability('in stock')}
              >
                <span>In stock</span>
                <span className="count">({inStockCount})</span>
              </div>
              <div 
                className={`filter-option ${selectedAvailability === 'out of stock' ? 'selected' : ''}`}
                onClick={() => setSelectedAvailability('out of stock')}
              >
                <span>Out of stock</span>
                <span className="count">({outOfStockCount})</span>
              </div>
            </div>
          </div>
        </aside>

        <main className="products-grid">
          <div className="sort-bar">
            <select 
              className="sort-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="default">SORT</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="name-a-z">Name: A to Z</option>
              <option value="name-z-a">Name: Z to A</option>
            </select>
          </div>
          
          <div className="products">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </main>
      </div>
    </div>
    </>
    
  );
};

export default Deals;