import React, { useState, useEffect, useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import Orders from "./Orders";
import Title from "../components/Title";


const Profile = () => {
	const { currency, currentUser, logout } = useContext(ShopContext);
	const navigate = useNavigate();
	const [loading , setLoading] = useState(true);
	const [error , setError] = useState('');
	const [orders , setOrders] = useState([]);

	useEffect(() => {
		if (currentUser && currentUser.email) {
			fetchUserOrders();
		}
	}, [currentUser]);

	const fetchUserOrders = async () => {
		try {
			setLoading(true);
			// Get the authentication token
			const token = localStorage.getItem('authtoken') || sessionStorage.getItem('authtoken');
			
			const response = await fetch(`http://localhost:8000/orders/me`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});
			if (!response.ok) {
				throw new Error('Failed to fetch orders');
			}

			const data = await response.json();
			setOrders(Array.isArray(data) ? data : []);
			setLoading(false);
		} catch (err) {
			setError(err.message);
			setLoading(false);
			setOrders([]);
		}
	};
	const handleLogout = () => {
		logout();
		navigate('/');
	};

	return (
		<div className="container mx-auto px-4 py-8">
		  <Title title="My Profile" />
		  
		  {/* Name and Email Section */}
		  <div className="bg-white shadow rounded-lg p-6 mb-6">
			<h2 className="text-xl font-semibold mb-4">Account Information</h2>
			<div className="space-y-4">
			  <div>
				<label className="block text-sm font-medium text-gray-700">Email</label>
				<div className="mt-1 text-gray-900">{currentUser?.email || 'N/A'}</div>
			  </div>
			</div>
		  </div>
		  
		  {/* My Orders Section */}
		  <div className="bg-white shadow rounded-lg p-6 mb-6">
			<h2 className="text-xl font-semibold mb-4">My Orders</h2>
			
			{loading ? (
			  <p>Loading orders...</p>
			) : error ? (
			  <p className="text-red-500">{error}</p>
			) : orders.length === 0 ? (
			  <p>You haven't placed any orders yet.</p>
			) : (
			<Orders />
			)}
		  </div>
		  
		  {/* Logout Button */}
		  <div className="flex justify-center">
			<button
			  onClick={handleLogout}
			  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
			>
			  Logout
			</button>
		  </div>
		</div>
	);
}
export default Profile;