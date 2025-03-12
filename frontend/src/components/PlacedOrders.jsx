import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:8000';

const PlacedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authtoken') || sessionStorage.getItem('authtoken');
      
      if (!token) {
        toast.error("Authentication required");
        setLoading(false);
        return;
      }
      
      const response = await fetch(`${API_URL}/orders/`, {
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

  const toggleOrderDetails = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
      if (!orders.find(o => o.id === orderId).orderItems) {
        fetchOrderItems(orderId);
      }
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
          order.id === orderId ? { ...order, orderItems: items } : order
        )
      );
    } catch (error) {
      console.error('Error fetching order items:', error);
      toast.error('Failed to load order details');
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('authtoken') || sessionStorage.getItem('authtoken');
      
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
      
      const updatedOrder = await response.json();
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: updatedOrder.status } : order
        )
      );
      
      toast.success(`Order #${orderId} updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">Customer Orders</h2>
      
      {orders.length === 0 ? (
        <p className="text-gray-500 text-center py-6">No orders found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Order ID</th>
                <th className="py-3 px-6 text-left">Customer</th>
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-right">Total</th>
                <th className="py-3 px-6 text-center">Status</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      <span className="font-medium">{order.id}</span>
                    </td>
                    <td className="py-3 px-6 text-left">
                      {order.username || order.user_id}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="py-3 px-6 text-right">
                      Kshs {order.total.toFixed(2)}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <span className={`py-1 px-3 rounded-full text-xs ${
                        order.status === 'completed' ? 'bg-green-200 text-green-700' :
                        order.status === 'canceled' ? 'bg-red-200 text-red-700' :
                        'bg-yellow-200 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center">
                        <button 
                          onClick={() => toggleOrderDetails(order.id)}
                          className="w-6 transform hover:scale-110 mr-2"
                        >
                          {expandedOrderId === order.id ? 
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                            </svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          }
                        </button>
                        <div className="flex">
                          <select 
                            className="text-xs border-gray-300 rounded-md"
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="completed">Completed</option>
                            <option value="canceled">Canceled</option>
                          </select>
                        </div>
                      </div>
                    </td>
                  </tr>
                  {expandedOrderId === order.id && (
                    <tr className="bg-gray-50">
                      <td colSpan="6" className="py-3 px-6">
                        <div className="border-t border-gray-200 pt-3">
                          <h4 className="font-medium mb-2">Order Items</h4>
                          {order.orderItems ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {order.orderItems.map((item) => (
                                <div key={item.id} className="border rounded p-3 bg-white text-sm">
                                  <div className="flex justify-between mb-1">
                                    <span className="font-medium">Product:</span>
                                    <span>{item.product_name || item.product_id}</span>
                                  </div>
                                  <div className="flex justify-between mb-1">
                                    <span className="font-medium">Quantity:</span>
                                    <span>{item.quantity}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="font-medium">Price:</span>
                                    <span>Kshs {item.price.toFixed(2)}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-2">
                              <div className="animate-spin inline-block w-6 h-6 border-t-2 border-gray-900 rounded-full"></div>
                              <p className="text-sm mt-1">Loading items...</p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PlacedOrders;