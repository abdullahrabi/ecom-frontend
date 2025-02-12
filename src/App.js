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
import Turnstile from 'react-turnstile';

function App() {
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

        {/* Turnstile widget rendered here */}
        <div id="myWidget">
          <Turnstile
            siteKey="0x4AAAAAAA8Z9b0ekgrJtt0i" // Replace with your actual site key
            onSuccess={(token) => {
              console.log(`Challenge Success ${token}`);
            }}
          />
        </div>

        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
