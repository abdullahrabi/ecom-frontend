import React, { useState, useContext } from "react";
import './CheckoutForm.css';
import { ShopContext } from '../../Context/ShopContext';
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CheckoutForm = () => {
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const { placeOrder, cartItems, setCartItems } = useContext(ShopContext);

  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const clearCart = () => {
    const emptyCart = {};
    Object.keys(cartItems).forEach((id) => (emptyCart[id] = 0));
    setCartItems(emptyCart);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullName = e.target.name.value;
    const address = e.target.address.value;
    const phoneNumber = e.target.phone.value;

    if (paymentMethod === "Cash on Delivery") {
      await placeOrder({ fullName, address, phoneNumber, paymentMethod });
      clearCart();
      navigate("/"); // Navigate to homepage after COD order
      return;
    }

    if (paymentMethod === "Card") {
      if (!stripe || !elements) {
        toast.error("Stripe not initialized");
        return;
      }

      setLoading(true);

      try {
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
          clearCart(); // Clear cart after successful Card payment
          navigate("/"); // Navigate to homepage
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
          <label>
            Card Details
            <div className="card-element-box">
              <CardElement options={{ hidePostalCode: true }} />
            </div>
          </label>
        )}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Processing..." : "Place Order"}
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
