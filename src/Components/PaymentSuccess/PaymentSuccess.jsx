import { useParams, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PaymentSuccess = () => {
  const { orderId } = useParams();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const res = await axios.post(
          `https://dept-store-backend.vercel.app/api/auth/verify-payment`,
          { orderId }
        );
        if (res.data.success) {
          toast.success("Payment successful!");
          // Optionally, clear cart here
        } else {
          toast.error("Payment verification failed");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error verifying payment");
      }
    };

    verifyPayment();
  }, [orderId]);

  return <h1>Payment Processing...</h1>;
};

export default PaymentSuccess;
