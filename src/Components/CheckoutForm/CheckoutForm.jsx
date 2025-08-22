import React, { useState } from "react";
import './CheckoutForm.css';
import { toast } from "react-toastify";

const CheckoutForm = () => {
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod === "Jazz Cash") {
    
    
    
    
    } else {
      toast.success("Order Placed");
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
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
            />
            Cash on Delivery
          </label>

          <label>
            <input
              type="radio"
              name="payment"
              value="Jazz Cash"
              checked={paymentMethod === "Jazz Cash"}
              onChange={() => setPaymentMethod("Jazz Cash")}
            />
            Debit Card
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
