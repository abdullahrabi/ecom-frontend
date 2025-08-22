import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ShopContextProvider from './Context/ShopContext';
import CaptchaModal from '../Components/CaptchaModel/CaptchaModel.jsx';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <CaptchaModal>
    <ShopContextProvider>
      <App />
    </ShopContextProvider>
</CaptchaModal>
);

reportWebVitals();
