import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { ShopContext } from '../../Context/ShopContext';
const CheckoutForm = () => {
  const { placeOrder, getTotalCartAmount } = useContext(ShopContext);
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (getTotalCartAmount() <= 0) {
      toast.error("Your cart is empty!");
      return;
    }
    await placeOrder({ fullName, address, phoneNumber, paymentMethod });
    setFullName(''); setAddress(''); setPhoneNumber(''); setPaymentMethod('Cash on Delivery');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Checkout</h2>
      <input type="text" placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} required />
      <input type="text" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} required />
      <input type="text" placeholder="Phone Number" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required />
      <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
        <option value="Cash on Delivery">Cash on Delivery</option>
        <option value="Card">Card</option>
      </select>
      <button type="submit">Place Order</button>
    </form>
  );
};

export default CheckoutForm;
