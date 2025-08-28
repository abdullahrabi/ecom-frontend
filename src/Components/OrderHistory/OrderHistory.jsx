import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./OrderHistory.css"; // Import the new CSS file

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");

        if (!token) {
          toast.error("You are not logged in.");
          return;
        }

        const response = await axios.get(
          "https://dept-store-backend.vercel.app/api/auth/order-history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && Array.isArray(response.data.orders)) {
          setOrders(response.data.orders);
          toast.success("Orders fetched successfully!");
        } else {
          toast.error("No orders found.");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch order history.");
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="order-history-container">
      <h2 className="order-history-title">Order History</h2>

      {orders.length === 0 ? (
        <p className="no-orders">No orders found.</p>
      ) : (
        orders.map((order, index) => (
          <div key={order._id || index} className="order-card">
            {/* ================= ORDER MAIN INFO ================= */}
            <h3 className="order-number">Order #{index + 1}</h3>
            <table className="order-info-table">
              <tbody>
                <tr>
                  <td><strong>Email:</strong></td>
                  <td>{order.email}</td>
                </tr>
                <tr>
                  <td><strong>Full Name:</strong></td>
                  <td>{order.fullName}</td>
                </tr>
                <tr>
                  <td><strong>Phone:</strong></td>
                  <td>{order.phoneNumber}</td>
                </tr>
                <tr>
                  <td><strong>Address:</strong></td>
                  <td>{order.address}</td>
                </tr>
                <tr>
                  <td><strong>Payment Method:</strong></td>
                  <td>{order.paymentMethod}</td>
                </tr>
                <tr>
                  <td><strong>Payment Status:</strong></td>
                  <td>{order.paymentStatus}</td>
                </tr>
                <tr>
                  <td><strong>Total:</strong></td>
                  <td>PKR {order.total}</td>
                </tr>
                <tr>
                  <td><strong>Date:</strong></td>
                  <td>{new Date(order.date).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            {/* ================= ORDER ITEMS ================= */}
            <h4 className="items-title">Items</h4>
            {order.orderData && order.orderData.length > 0 ? (
              <table className="order-items-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Price (PKR)</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderData.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-items">No items found in this order.</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
