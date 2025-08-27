import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ShopContextProvider from './Context/ShopContext';

// Stripe imports
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Load publishable key from env
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
console.log("Stripe ENV Key:", process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ShopContextProvider>
      {/* Wrap your whole app in Stripe Elements */}
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </ShopContextProvider>
  </React.StrictMode>
);

reportWebVitals();
