import React, { useState, useEffect, useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from "../components/Title";


const Profile = () => {
	const { currency } = useContext(ShopContext);
	const [user , setUser] = useState({});
	const [loading , setLoading] = useState(true);
	const [error , setError] = useState('');
	const [orders , setOrders] = useState([]);

	useEffect(() => {
		fetchUserOrders();
	}, []);

	const fetchUserOrders = async () => {
		try {
			setLoading(true);

			const userId = 'current-user-id';
			const response = await fetch(`http://localhost:8001/orders/user/${userId}`);

			if (!response.ok) {
				throw new Error('Failed to fetch orders');
			}

			const data = await response.json();
			setOrders(data.orders);
			setLoading(false);
		} catch (error) {
			setError(err.message);
			setLoading(false);
		}
	};
	const handleLogout = () => {
		localStorage.removeItem('token');
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
						<label className="block text-sm font-medium text-gray-700">Name</label>
						<div className="mt-1 text-gray-400">{user.name}</div>
					</div>
				<div>
					<label className="block text-sm font-medium text-gray-700">Email</label>
					<div className="mt-1 text-gray-400">{user.email}</div>
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
				<div className="space-y-4">
					{orders.map(order => (
					<div key={order.id} className="border rounded-md p-4">
						<div className="flex justify-between items-center mb-2">
						<h3 className="font-medium">Order #{order.id}</h3>
						<span className={`px-2 py-1 rounded-full text-xs ${
							order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
							order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
							'bg-yellow-100 text-yellow-800'
						}`}>
							{order.status}
						</span>
						</div>
						<p className="text-sm text-gray-600">Date: {new Date(order.created_at).toLocaleDateString()}</p>
						<p className="text-sm text-gray-600">Items: {order.items?.length || 0}</p>
						<p className="text-sm font-medium mt-2">
						Total: {currency.symbol}{order.total.toFixed(2)}
						</p>
						<button 
						onClick={() => window.location.href = `/orders/${order.id}`}
						className="mt-2 text-sm text-blue-600 hover:text-blue-800"
						>
						View Details
						</button>
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