import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ShopContextProvider from './Context/ShopContext';
import CaptchaProvider from './Context/CaptchaContext';  // ✅ use Provider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <CaptchaProvider>
    <ShopContextProvider>
      <App />
    </ShopContextProvider>
  </CaptchaProvider>
);

reportWebVitals();
