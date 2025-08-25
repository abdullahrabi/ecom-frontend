import React, { useState, useContext } from "react";
import "./CheckoutForm.css";
import { ShopContext } from "../../Context/ShopContext";

const CheckoutForm = () => {
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const { checkout } = useContext(ShopContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    const fullName = e.target.name.value;
    const address = e.target.address.value;
    const phoneNumber = e.target.phone.value;

    if (paymentMethod === "Cash on Delivery") {
      alert("Order placed with Cash on Delivery ✅");
      // Here you can also call your backend to save COD orders
    } else if (paymentMethod === "Card") {
      // ✅ Call checkout (this will redirect to 2Checkout)
      checkout({ fullName, address, phoneNumber });
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
