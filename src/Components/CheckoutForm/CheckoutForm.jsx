import React, { useState, useContext } from "react";
import axios from "axios";
import './CheckoutForm.css';
import { toast } from "react-toastify";
import { ShopContext } from '../../Context/ShopContext';

const CheckoutForm = () => {
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const { all_product, cartItems, setCartItems } = useContext(ShopContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullName = e.target.name.value;
    const address = e.target.address.value;
    const phoneNumber = e.target.phone.value;

    const orderData = {
      items: Object.keys(cartItems)
        .filter(id => cartItems[id] > 0)
        .map(id => {
          const product = all_product.find(p => p.id === Number(id));
          if (!product) return null;
          return {
            productId: Number(id),
            name: product.name,
            quantity: cartItems[id],
            price: product.new_price
          };
        })
        .filter(item => item !== null),
      notes: ""
    };

    const total = orderData.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    if (!fullName || !address || !phoneNumber || total <= 0) {
      toast.error("Please fill all fields and make sure cart is not empty");
      return;
    }

    if (paymentMethod === "Cash on Delivery") {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");

        const response = await axios.post(
          "http://localhost:5000/create-order",
          {
            fullName,
            address,
            phoneNumber,
            paymentMethod,
            paymentStatus: "Pending",
            total, 
            orderData
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        console.log("Order response:", response.data);
        toast.success("Order Placed Successfully!");

        // Clear cart after successful order
        const emptyCart = {};
        Object.keys(cartItems).forEach(id => emptyCart[id] = 0);
        setCartItems(emptyCart);

      } catch (error) {
        console.error("Error placing order:", error);
        toast.error("Failed to place order. Please try again.");
      }
    } else if (paymentMethod === "Card") {
      toast.info("Card payment is not implemented yet.");
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit} className="checkout-form">
        <label>
          Full Name
          <input type="text" name="name" required />
        </label>

        <label>
          Address
          <textarea name="address" rows="3" required></textarea>
        </label>

        <label>
          Phone Number
          <input type="text" name="phone" required />
        </label>

        <h3>Select Payment Method</h3>
        <div className="payment-method">
          <label>
            <input
              type="radio"
              name="payment"
              value="Cash on Delivery"
              checked={paymentMethod === "Cash on Delivery"}
              onChange={() => setPaymentMethod("Cash on Delivery")}
            />
            Cash on Delivery
          </label>

          <label>
            <input
              type="radio"
              name="payment"
              value="Card"
              checked={paymentMethod === "Card"}
              onChange={() => setPaymentMethod("Card")}
            />
            Card
          </label>
        </div>

        <button type="submit" className="submit-btn">
          Place Order
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
