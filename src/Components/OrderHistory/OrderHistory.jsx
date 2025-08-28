import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OrderHistory.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token"); // or sessionStorage
        const res = await axios.get("https://dept-store-backend.vercel.app/api/auth/order-history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders", error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="order-history">
      <h2>Your Order History</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order, index) => (
          <div key={index} className="order-card">
            {/* Order Details Table */}
            <table className="order-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td>PKR {order.totalAmount}</td>
                  <td>{order.status}</td>
                </tr>
              </tbody>
            </table>

            {/* Items Table */}
            <table className="items-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {order.orderData && order.orderData.length > 0 ? (
                  order.orderData.map((item, i) => (
                    <tr key={i}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>PKR {item.price}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No items found in this order.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
