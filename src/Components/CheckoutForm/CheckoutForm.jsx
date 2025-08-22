import React, { useState, useContext } from "react";
import './CheckoutForm.css';
import { toast } from "react-toastify";
import { ShopContext } from '../../Context/ShopContext';
import axios from "axios";

const CheckoutForm = () => {
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const { getTotalCartAmount, cartItems, setCartItems } = useContext(ShopContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullName = e.target.name.value;
    const address = e.target.address.value;
    const phoneNumber = e.target.phone.value;
    const total = getTotalCartAmount(); // number
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!fullName || !address || !phoneNumber || total <= 0) {
      toast.error("Please fill all fields and make sure your cart is not empty");
      return;
    }

    if (paymentMethod === "Card") {
      toast.info("Card payment is not implemented yet.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/create-order",
        {
          fullName,
          address,
          phoneNumber,
          paymentMethod,
          paymentStatus: "Pending",
          total,
          cartItems // send cartItems object
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
