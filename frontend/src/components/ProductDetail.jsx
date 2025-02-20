import React, { useState, useEffect } from 'react';
import './ProductDetail.css';
import { useParams } from 'react-router-dom';
import style1 from '../assets/style1.jpg';
import style2 from '../assets/style2.jpg';
import style3 from '../assets/style3.jpg';
import style4 from '../assets/style4.jpg';
import style5 from '../assets/style5.jpg';
import style6 from '../assets/style6.jpg';
import Navbar from './Navbar';

const products = [
    {
        id: 1,
        name: "DRIVEN BY FAITH DECAL",
        price: "KSH1,600.00",
        images: [style1, style3, style5],
        colors: ["Red", "Blue", "Black"],
        description: "This is a cool product",
        status: "in stock"
    },
    {
        id: 2,
        name: "CLUTCH WINDSHIELD BANNER V2",
        price: "KSH3,700.00",
        images: [style2, style4, style6],
        colors: ["Red", "Blue", "Black"],
        description: "This is a cool product",
        status: "in stock"
    }
];

const ProductDetail = () => {
    const { id } = useParams();
    const product = products.find((product) => product.id === parseInt(id));

    if (!product) {
        return <h2>Product not found</h2>;
    }

    const [selectedImage, setSelectedImage] = useState(product.images[0]);
    const [scrollPosition, setScrollPosition] = useState(0);

    // Scroll event to change images
    useEffect(() => {
        const handleScroll = () => {
            const newIndex = Math.floor(window.scrollY / 300) % product.images.length;
            setSelectedImage(product.images[newIndex]);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [product.images]);

    return (
        <>
            <Navbar />
            <div className="product-detail-container">
                <div className="image-gallery">
                    <div className="main-image">
                        <img src={selectedImage} alt="Selected Product" className="smooth-transition" />
                    </div>
                    <div className="thumbnails">
                        {product.images.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                onClick={() => setSelectedImage(image)}
                                className={image === selectedImage ? 'active' : ''}
                            />
                        ))}
                    </div>
                </div>

                <div className="product-info">
                    <h1>{product.name}</h1>
                    <p>{product.description}</p>
                    <p className="price">KSH {product.price}</p>

                    {product.colors?.length > 0 && (
                        <div className="color-selection">
                            <label htmlFor="color">Color: </label>
                            <select id="color">
                                {product.colors.map((color, index) => (
                                    <option key={index} value={color}>{color}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="quantity">
                        <button>-</button>
                        <input type="number" defaultValue={1} min="1" />
                        <button>+</button>
                    </div>
                    <button className="add-to-cart">Add to Cart</button>
                </div>
            </div>
        </>
    );
};

export default ProductDetail;
