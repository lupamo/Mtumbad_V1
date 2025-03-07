import React, { useState, useEffect, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { toast } from 'react-toastify';

const API_URL = 'https://localhost/8000';

const Orders = () => {
    const { currency, requireAuth } = useContext(ShopContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
  
    useEffect(() => {
        // Check if user is authenticated before fetching orders
        requireAuth(() => {
            fetchOrders();
        });
    }, []);
  
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authtoken') || sessionStorage.getItem('authtoken');
            
            if (!token) {
                console.error('No authentication token found');
                setLoading(false);
                return;
            }

            // Get current user email to fetch their orders
            const userEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
            
            if (!userEmail) {
                toast.error("User information not found");
                setLoading(false);
                return;
            }
            
            const response = await fetch(`${API_URL}/orders/user/${userEmail}`, {
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
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };
  
    const fetchOrderItems = async (orderId) => {
        try {
            const token = localStorage.getItem('authtoken') || sessionStorage.getItem('authtoken');
            
            const response = await fetch(`${API_URL}/orders/${orderId}/items`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch order items');
            }
            
            const items = await response.json();
            
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order.id === orderId ? { ...order, order_items: items } : order
                )
            );
        } catch (error) {
            console.error('Error fetching order items:', error);
        }
    };
  
    const toggleOrderDetails = (orderId) => {
        if (expandedOrderId === orderId) {
            setExpandedOrderId(null);
        } else {
            setExpandedOrderId(orderId);
            fetchOrderItems(orderId);
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
		  {orders.map((order) => (
			<div key={order.id} className="mb-8 border rounded-lg overflow-hidden shadow-sm">
			  <div 
				className="bg-gray-50 p-4 border-b cursor-pointer hover:bg-gray-100"
				onClick={() => toggleOrderDetails(order.id)}
			  >
				<div className="flex justify-between items-center">
				  <div>
					<p className="font-medium">Order #{order.id}</p>
					<p className="text-sm text-gray-500">Placed on: {formatDate(order.created_at)}</p>
				  </div>
				  <div className="text-right">
					<p className="font-medium">Total: {currency}{order.total}</p>
					<p className="text-sm text-gray-500">
					  Status: 
					  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
						order.status === 'completed' ? 'bg-green-100 text-green-800' :
						order.status === 'canceled' ? 'bg-red-100 text-red-800' :
						order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
						order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
						'bg-gray-100 text-gray-800'
					  }`}>
						{order.status}
					  </span>
					</p>
				  </div>
				</div>
				<div className="flex justify-end mt-2">
				  <p className="text-sm text-blue-600">
					{expandedOrderId === order.id ? 'Hide Details' : 'View Details'}
				  </p>
				</div>
			  </div>
			  
			  {expandedOrderId === order.id && (
				<div className="p-4 bg-white">
				  <h3 className="font-medium mb-3">Order Items</h3>
				  {order.order_items ? (
					order.order_items.length > 0 ? (
					  <div className="space-y-4">
						{order.order_items.map((item) => (
						  <div key={item.id} className="border-b pb-4 flex flex-col sm:flex-row justify-between">
							<div className="flex items-start gap-4">
							  <div className="w-16 h-16 bg-gray-100 flex items-center justify-center">
								<p className="text-gray-400 text-xs">Product Image</p>
							  </div>
							  <div>
								<p className="font-medium">Product ID: {item.product_id}</p>
								<p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
								<p className="text-sm text-gray-600">Price per unit: {currency}{item.price}</p>
							  </div>
							</div>
							<div className="mt-3 sm:mt-0">
							  <p className="font-medium text-right">Total: {currency}{(item.price * item.quantity).toFixed(2)}</p>
							</div>
						  </div>
						))}
					  </div>
					) : (
					  <p className="text-gray-500">No items found for this order.</p>
					)
				  ) : (
					<div className="text-center py-4">
					  <div className="animate-spin inline-block w-6 h-6 border-t-2 border-b-2 border-gray-900 rounded-full"></div>
					  <p className="text-sm mt-2">Loading order items...</p>
					</div>
				  )}
				</div>
			  )}
			</div>
		  ))}
		</div>
	  </div>
	);
  };
  
  export default Orders;