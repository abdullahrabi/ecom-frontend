import React, { useEffect, useState } from "react";
import "./OrderHistory.css";
import { toast } from "react-toastify";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");

        if (!token) {
          toast.error("Please log in to view your orders.");
          setLoading(false);
          return;
        }

        const response = await fetch("https://dept-store-backend.vercel.app/api/auth/order-history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          // ✅ Safe check
          if (data.orders && Array.isArray(data.orders)) {
            setOrders(data.orders);
          } else {
            setOrders([]); // No orders available
          }
          toast.success("Orders fetched successfully!");
        } else {
          toast.error(data.message || "Failed to fetch orders.");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="order-history">
      <h2>Order History</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order, index) => (
          <div key={order._id || index} className="order-card">
            <h3>Order #{index + 1}</h3>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Total:</strong> Rs. {order.totalAmount}</p>

            <div className="order-items">
              {order.items && Array.isArray(order.items) && order.items.length > 0 ? (
                order.items.map((item, idx) => (
                  <div key={idx} className="order-item">
                    <p>{item.name} × {item.quantity}</p>
                    <p>Rs. {item.price}</p>
                  </div>
                ))
              ) : (
                <p>No items in this order.</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
