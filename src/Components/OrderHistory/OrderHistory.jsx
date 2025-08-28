import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/orders/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setOrders(response.data.orders);
        } else {
          toast.error("Failed to fetch orders");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error fetching order history");
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
        orders.map((order, index) => (
          <div key={order._id} className="order-block">
            {/* -------- Order Details Table -------- */}
            <table border="1" cellPadding="10" cellSpacing="0" style={{ width: "100%", marginBottom: "20px" }}>
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Order ID</th>
                  <th>Email</th>
                  <th>User ID</th>
                  <th>Full Name</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Payment Method</th>
                  <th>Payment Status</th>
                  <th>Total</th>
                  <th>Payment Intent ID</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{index + 1}</td>
                  <td>{order._id}</td>
                  <td>{order.email}</td>
                  <td>{order.userId}</td>
                  <td>{order.fullName}</td>
                  <td>{order.phoneNumber}</td>
                  <td>{order.address}</td>
                  <td>{order.paymentMethod}</td>
                  <td>{order.paymentStatus}</td>
                  <td>Rs. {order.total}</td>
                  <td>{order.paymentIntentId || "N/A"}</td>
                  <td>{new Date(order.date).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            {/* -------- Order Items Table -------- */}
            <h4>Items in this Order:</h4>
            <table border="1" cellPadding="10" cellSpacing="0" style={{ width: "100%", marginBottom: "40px" }}>
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i}>
                    <td>{item.productId}</td>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>Rs. {item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
