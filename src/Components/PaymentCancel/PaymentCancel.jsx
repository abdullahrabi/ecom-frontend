import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from 'react';
const PaymentCancel = () => {
  const { orderId } = useParams();

  useEffect(() => {
    toast.error("Payment was cancelled!");
  }, [orderId]);

  return <h1>Payment Cancelled</h1>;
};

export default PaymentCancel;
