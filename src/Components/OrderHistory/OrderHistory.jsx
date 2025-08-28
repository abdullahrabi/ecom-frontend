import React, { useEffect, useState } from 'react';
import './OrderHistory.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
          toast.error('User not authenticated!');
          return;
        }

        const response = await axios.get('https://dept-store-backend.vercel.app/api/auth/order-history', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.orders) {
          setOrders(response.data.orders);
          toast.success('Order history loaded!');
        } else {
          setOrders([]);
          toast.info('No orders found.');
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch order history.');
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="order-history">
      <h2>Your Order History</h2>
      {orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <li key={order._id} className="order-item">
              <h4>Order #{order._id}</h4>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Total:</strong> Rs {order.totalPrice}</p>
              <ul>
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.productId?.name || 'Unknown Product'} - {item.quantity} pcs
                    </li>
                  ))
                ) : (
                  <li>No items in this order</li>
                )}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default OrderHistory;
