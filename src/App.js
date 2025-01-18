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

          {/* Corrected the routes for productId and cart */}
          <Route path='/product/:productId' element={<Product />} />
          
          {/* Cart and login routes should be independent, not nested */}
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<LoginSignup />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
