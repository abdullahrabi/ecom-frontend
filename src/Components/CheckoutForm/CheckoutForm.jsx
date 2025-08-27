import React, { useState, useContext } from "react";
import './CheckoutForm.css';
import { ShopContext } from '../../Context/ShopContext';
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";

const CheckoutForm = () => {
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const { placeOrder } = useContext(ShopContext);

  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullName = e.target.name.value;
    const address = e.target.address.value;
    const phoneNumber = e.target.phone.value;

    if (paymentMethod === "Cash on Delivery") {
      placeOrder({ fullName, address, phoneNumber, paymentMethod });
      return;
    }

    if (paymentMethod === "Card") {
      if (!stripe || !elements) {
        toast.error("Stripe not initialized");
        return;
      }

      setLoading(true);

      try {
        // Step 1: Ask backend for clientSecret
        const res = await placeOrder({
          fullName,
          address,
          phoneNumber,
          paymentMethod: "Card",
        });

        if (!res?.clientSecret) {
          toast.error("Failed to create payment intent ❌");
          setLoading(false);
          return;
        }

        const cardElement = elements.getElement(CardElement);
        const result = await stripe.confirmCardPayment(res.clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: { name: fullName },
          },
        });

        if (result.error) {
          toast.error(result.error.message);
        } else if (result.paymentIntent.status === "succeeded") {
          toast.success("Payment successful 🎉 Order placed!");
        }
      } catch (err) {
        console.error(err);
        toast.error("Payment failed ❌");
      } finally {
        setLoading(false);
      }
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

        {paymentMethod === "Card" && (
          <div className="card-element-box">
            <CardElement />
          </div>
        )}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Processing..." : "Place Order"}
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
