import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    <div className="order-history-container" style={{ padding: "20px" }}>
      <h2>Order History</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order, index) => (
          <div
            key={order._id || index}
            className="order-card"
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "8px",
            }}
          >
            {/* ================= ORDER MAIN INFO ================= */}
            <h3 style={{ marginBottom: "10px" }}>Order #{index + 1}</h3>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "15px",
              }}
            >
              <tbody>
                <tr>
                  <td><strong>Order ID:</strong></td>
                  <td>{order._id}</td>
                </tr>
                <tr>
                  <td><strong>Email:</strong></td>
                  <td>{order.email}</td>
                </tr>
                <tr>
                  <td><strong>User ID:</strong></td>
                  <td>{order.userId}</td>
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
                  <td><strong>Payment Intent ID:</strong></td>
                  <td>{order.paymentIntentId || "N/A"}</td>
                </tr>
                <tr>
                  <td><strong>Date:</strong></td>
                  <td>{new Date(order.date).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            {/* ================= ORDER ITEMS ================= */}
            <h4>Items</h4>
            {order.orderData && order.orderData.length > 0 ?(
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "10px",
                }}
                border="1"
              >
                <thead>
                  <tr>
                    <th style={{ padding: "8px" }}>Product ID</th>
                    <th style={{ padding: "8px" }}>Name</th>
                    <th style={{ padding: "8px" }}>Quantity</th>
                    <th style={{ padding: "8px" }}>Price (PKR)</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderData.map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: "8px" }}>{item.productId}</td>
                      <td style={{ padding: "8px" }}>{item.name}</td>
                      <td style={{ padding: "8px" }}>{item.quantity}</td>
                      <td style={{ padding: "8px" }}>{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No items found in this order.</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
