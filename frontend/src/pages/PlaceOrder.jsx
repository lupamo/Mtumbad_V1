import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:8000';

const PlaceOrder = () => {
    const [method, setMethod] = useState('cod');
    const { navigate, cartItems, getCartAmount, getCartCount, delivery_fee } = useContext(ShopContext);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        
        street: '',
        location: '',
        phone_number: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleCheckout = async () => {
        // Basic validation
        if (!formData.street || !formData.location || !formData.phone_number) {
            toast.error("Please fill in all required fields");
            return;
        }
    
        // Check if cart is empty locally
        if (getCartCount() === 0) {
            toast.error("Your cart is empty");
            return;
        }
    
        setLoading(true);
    
        try {
            const token = localStorage.getItem('authtoken') || sessionStorage.getItem('authtoken');
            
            if (!token) {
                toast.error("Please log in to place an order");
                navigate('/login');
                return;
            }
    
            // Make sure all cart items are synced with the server
            // This is likely missing in your current implementation
            for (const item of Object.values(cartItems)) {
                if (item.quantity > 0) {
                    // Add item to server-side cart
                    const addToCartResponse = await fetch(`${API_URL}/cart/`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            product_id: item.id,
                            quantity: item.quantity,
                            size: item.size || "default"
                        })
                    });
                    
                    if (!addToCartResponse.ok) {
                        throw new Error("Failed to sync cart with server");
                    }
                }
            }
    
            // Now proceed with checkout
            const response = await fetch(`${API_URL}/orders/checkout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phone_number: formData.phone_number,
                    location: formData.location,
                    street: formData.street
                })
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Checkout failed');
            }
    
            const data = await response.json();
            
            // Clear the cart from localStorage
            localStorage.removeItem('cartItems');
            
            // Show success message
            toast.success("Order placed successfully!");
            
            // Navigate to orders page
            navigate('/orders');
            
        } catch (error) {
            console.error("Checkout error:", error);
            toast.error("Failed to place order: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
            {/* left side */}
            <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
                <div className="text-xl sm:text-2xl my-3">
                    <Title text1={'DELIVERY'} text2={'INFORMATION'} />
                </div>
                {/* <div className="flex gap-3">
                    <input 
                        className="border border-gray-300 rounded py-1.5 w-full px-3.5" 
                        type="text" 
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First Name" 
                        required 
                    />
                    <input 
                        className="border border-gray-300 rounded py-1.5 w-full px-3.5" 
                        type="text" 
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last Name" 
                        required 
                    />
                </div> */}
                {/* <input 
                    className="border border-gray-300 rounded py-1.5 w-full px-3.5" 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email address" 
                    required 
                /> */}
                <input 
                    className="border border-gray-300 rounded py-1.5 w-full px-3.5" 
                    type="text" 
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="Street" 
                    required 
                />
                <div className="flex gap-3">
                    <input 
                        className="border border-gray-300 rounded py-1.5 w-full px-3.5" 
                        type="text" 
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Location" 
                    />
                    {/* <input 
                        className="border border-gray-300 rounded py-1.5 w-full px-3.5" 
                        type="text" 
                        name="county"
                        value={formData.county}
                        onChange={handleChange}
                        placeholder="County" 
                    /> */}
                </div>
                {/* <div className="flex gap-3">
                    <input 
                        className="border border-gray-300 rounded py-1.5 w-full px-3.5" 
                        type="number" 
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        placeholder="Zip code" 
                    />
                    <input 
                        className="border border-gray-300 rounded py-1.5 w-full px-3.5" 
                        type="text" 
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="Country" 
                    />
                </div> */}
                <input 
                    className="border border-gray-300 rounded py-1.5 w-full px-3.5" 
                    type="number" 
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="Phone" 
                    required 
                />
            </div>

            {/* right side */}
            <div className="mt-8">
                <div className="mt-8 min-w-80">
                    <CartTotal />
                </div>
                <div className="mt-12 w-full">
                    <Title text1={'PAYMENT'} text2={'METHOD'} />
                    {/* ----payment------ */}
                    <div className="flex gap-3 flex-col lg:flex-row">
                        <div onClick={() => setMethod('mpesa')} className="flex items-center gap-3 border border-gray-200 p-2 px-3 cursor-pointer">
                            <p className={`min-w-3.5 h-3.5 border border-gray-200 rounded-full ${method === 'mpesa' ? 'bg-green-400' : ''}`}></p>
                            <img src={assets.mpesa} className="h-5 mx-4 w-15" alt="M-Pesa" />
                        </div>
                        <div onClick={() => setMethod('cod')} className="flex items-center gap-3 border border-gray-200 p-2 px-3 cursor-pointer">
                            <p className={`min-w-3.5 h-3.5 border border-gray-200 rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
                            <p className="tex-gray-500 text-sm font-medium mx-4">CASH ON DELIVERY</p>
                        </div>
                    </div>
                    <div className="w-full text-end mt-8">
                        <button 
                            onClick={handleCheckout} 
                            disabled={loading}
                            className={`${loading ? 'bg-gray-400' : 'bg-black'} text-white px-16 py-3 text-sm`}
                        >
                            {loading ? 'PROCESSING...' : 'PLACE ORDER'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlaceOrder;