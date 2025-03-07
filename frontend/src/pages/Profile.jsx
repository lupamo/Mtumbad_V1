import React, { useState, useEffect, useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
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
			
			const response = await fetch(`http://localhost:8000/orders/user/${currentUser.id}`, {
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
			  <div>
				{orders.map((order, index) => (
				  <div 
					className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4" 
					key={order.id || index}
				  >
					<div className="flex items-start gap-6 text-sm">
					  {/* Placeholder for item image - you might need to adjust based on actual order structure */}
					  <img 
						className="w-16 sm:w-20" 
						src="/placeholder-image.jpg" 
						alt="order img" 
					  />
					  <div>
						<p className="sm:text-base font-medium">
						  Order #{order.id}
						</p>
						<div className="flex items-center gap-3 mt-2 text-base text-gray-700">
						  <p className="text-lg">
							{currency}{order.total?.toFixed(2) || 'N/A'}
						  </p>
						  <p>Items: {order.items_count || 'N/A'}</p>
						</div>
						<p className="mt-2">
						  Date: <span className="text-gray-400">
							{order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
						  </span>
						</p>
					  </div>
					</div>
					<div className="md:w-1/2 flex justify-between">
					  <div className="flex items-center gap-2">
						<p className={`min-w-2 h-2 rounded-full ${
						  order.status === 'delivered' ? 'bg-green-500' :
						  order.status === 'processing' ? 'bg-yellow-500' :
						  'bg-blue-500'
						}`}></p>
						<p className="text-sm md:text-base">
						  {order.status || 'Processing'}
						</p>
					  </div>
					  <button 
						onClick={() => window.location.href = `/orders/${order.id}`}
						className="border px-4 py-2 text-sm font-medium rounded-sm"
					  >
						Track Order
					  </button>
					</div>
				  </div>
				))}
			  </div>
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