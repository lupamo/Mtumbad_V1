import React, { useState, useEffect, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";

const API_URL = 'https://localhost/8000';

const Orders = () => {

	const { currency, requireAuth } = useContext(ShopContext);
  	const [orders, setOrders] = useState([]);
  	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Check if user is authenticated before fetching orders
		requireAuth(() => {
			fetchOrders();
		});
	})

	const fetchOrders = async () => {
		try {
		  setLoading(true);
		  const token = localStorage.getItem('authtoken') || sessionStorage.getItem('authtoken');
		  
		  if (!token) {
			console.error('No authentication token found');
			setLoading(false);
			return;
		  }
		  
		  const response = await fetch(`${API_URL}/orders/user`, {
			headers: {
			  'Authorization': `Bearer ${token}`
			}
		  });
		  
		  if (!response.ok) {
			throw new Error('Failed to fetch orders');
		  }
		  
		  const data = await response.json();
		  setOrders(data);
		} catch (error) {
		  console.error('Error fetching orders:', error);
		} finally {
		  setLoading(false);
		}
	  };
	
	  const formatDate = (dateString) => {
		const date = new Date(dateString);
		const options = { year: 'numeric', month: 'long', day: 'numeric' };
		return date.toLocaleDateString('en-US', options);
	  };
	
	  if (loading) {
		return (
		  <div className="flex justify-center items-center h-64">
			<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
		  </div>
		);
	  }
	
	  if (orders.length === 0) {
		return (
		  <div className="border-t pt-16">
			<div className="text-center">
			  <Title text1={'MY'} text2={'ORDERS'} />
			  <div className="mt-10 text-gray-500">You haven't placed any orders yet.</div>
			</div>
		  </div>
		);
	  }
	
	return (
		<div className="border-t pt-16">
		  <div className="text-center">
			<Title text1={'MY'} text2={'ORDERS'} />
		  </div>
		  <div>
			{orders.map((order, orderIndex) => (
			  <div key={orderIndex} className="mb-8 border rounded-lg overflow-hidden shadow-sm">
				<div className="bg-gray-50 p-4 border-b">
				  <div className="flex justify-between items-center">
					<div>
					  <p className="font-medium">Order #{order.id}</p>
					  <p className="text-sm text-gray-500">Placed on: {formatDate(order.created_at)}</p>
					</div>
					<div className="text-right">
					  <p className="font-medium">Total: {currency}{order.total_amount}</p>
					  <p className="text-sm text-gray-500">Status: {order.status}</p>
					</div>
				  </div>
				</div>
				
				{order.order_items && order.order_items.map((item, itemIndex) => (
				  <div 
					className="py-4 px-4 border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4" 
					key={itemIndex}
				  >
					<div className="flex items-start gap-6 text-sm">
					  <img 
						className="w-16 sm:w-20 h-20 object-cover" 
						src={item.product.image_urls && item.product.image_urls[0]} 
						alt={item.product.name}
						onError={(e) => {
						  e.target.onerror = null;
						  e.target.src = '/placeholder-product.jpg';
						}}
					  />
					  <div>
						<p className="sm:text-base font-medium">{item.product.name}</p>
						<div className="flex items-center gap-3 mt-2 text-base text-gray-700">
						  <p className="text-lg">{currency}{item.price}</p>
						  <p>Quantity: {item.quantity}</p>
						  <p>Size: {item.size}</p>
						</div>
					  </div>
					</div>
					<div className="md:w-1/2 flex justify-between">
					  <div className="flex items-center gap-2">
						<div className={`min-w-2 h-2 rounded-full ${
						  order.status === 'delivered' ? 'bg-green-500' : 
						  order.status === 'shipped' ? 'bg-blue-500' :
						  order.status === 'processing' ? 'bg-yellow-500' :
						  'bg-gray-500'
						}`}></div>
						<p className="text-sm md:text-base">{order.status}</p>
					  </div>
					  {order.tracking_id && (
						<button className="border px-4 py-2 text-sm font-medium rounded-sm">Track Order</button>
					  )}
					</div>
				  </div>
				))}
			  </div>
			))}
		  </div>
		</div>
	);
}

export default Orders;