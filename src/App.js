import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import ShopCategory from './Pages/ShopCategory';
import LoginSignup from './Pages/LoginSignup';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import SearchResults from './Pages/SearchResults';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './Components/Footer/Footer';
import { useEffect } from 'react';
import Turnstile from 'react-turnstile'
function App() {
  useEffect(() => {
    // Make sure the turnstile script is loaded, then initialize the callback
    window.onloadTurnstileCallback = function () {
      Turnstile.render('#myWidget', {
        sitekey: '0x4AAAAAAA8Z9b0ekgrJtt0i',  // replace with your actual site key
        callback: function (token) {
          console.log(`Challenge Success ${token}`);
        },
      });
    };

   

  }, []);  

  return (
    <div>
      <ToastContainer />
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Grocery' element={<ShopCategory category="Grocery" />} />
          <Route path='/Electronics' element={<ShopCategory category="Electronics" />} />
          <Route path='/Perfume' element={<ShopCategory category="Perfume" />} />
          <Route path='/Makeup' element={<ShopCategory category="Makeup" />} />
          <Route path='/Skincare' element={<ShopCategory category="Skincare" />} />
          <Route path='/Fruits_Vegetables' element={<ShopCategory category="Fruits_Vegetables" />} />
          <Route path="/search" element={<SearchResults />} />

          <Route path='/product/:productId' element={<Product />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<LoginSignup />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;