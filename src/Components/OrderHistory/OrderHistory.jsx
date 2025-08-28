import React, { useEffect, useState } from 'react';
import './OrderHistory.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token =
          localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
          toast.error('You must be logged in to view your orders');
          return;
        }

        const response = await axios.get(
          'https://dept-store-backend.vercel.app/api/auth/order-history',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.orders && response.data.orders.length > 0) {
          setOrders(response.data.orders);
          toast.success('Order history loaded successfully');
        } else {
          toast.info('No orders found');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to fetch order history');
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="order-history">
      <h2>Order History</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order, index) => (
            <div key={index} className="order-card">
              <h3>Order #{order._id}</h3>
              <p>
                <strong>Total:</strong> Rs {order.totalPrice}
              </p>
              <p>
                <strong>Date:</strong>{' '}
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Payment Method:</strong> {order.paymentMethod}
              </p>
              <p>
                <strong>Payment Status:</strong> {order.paymentStatus}
              </p>

              <h4>Items:</h4>
              <ul className="order-items">
                {order.items.map((item, i) => (
                  <li key={i} className="order-item">
                    <span>
                      <strong>{item.productName}</strong>
                    </span>{' '}
                    - Qty: {item.quantity} | Rs {item.total}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
