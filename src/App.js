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
import Turnstile from 'react-turnstile';
import CheckoutForm from './Components/CheckoutForm/CheckoutForm';
import OrderHistory from './Components/OrderHistory/OrderHistory';
import Chatbot from '../Components/Chatbot/Chatbot';
function App() {
  // ✅ Track login status
    const [isLoggedIn, setIsLoggedIn] = useState(false);
  
    useEffect(() => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      setIsLoggedIn(!!token); // true if token exists
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
          {isLoggedIn &&
          <Route path='/order-history' element={<OrderHistory/>} />}
          <Route path='/product/:productId' element={<Product />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<LoginSignup />} />
          <Route path='/checkout' element={<CheckoutForm/>} />
        </Routes>
         {/* ✅ Show chatbot only if logged in */}
      {isLoggedIn && <Chatbot />}
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;