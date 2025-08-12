import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './CSS/SearchResults.css';
import Item from '../Components/Item/Item';

const SearchResults = () => {
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('query')?.toLowerCase() || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://dept-store-backend.vercel.app/allproducts');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch products.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search query
  const filteredResults = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery)
  );

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Smooth scrolling
    });
  };

  if (loading) {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
    </div>
  );
}
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className='searchbar-container'>
      <h2>Search Results for "{searchQuery}"</h2>
      {filteredResults.length > 0 ? (
        <ul className='searchbar-products'>
          {filteredResults.map((product) => (
            <li key={product.id} style={{ listStyleType: 'none' }}>
              <Item
                id={product.id}
                name={product.name}
                image={product.image}
                new_price={product.new_price}
                old_price={product.old_price}
                scrollToTop={scrollToTop} // Pass the function to Item
              />
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found for "{searchQuery}"</p>
      )}
    </div>
  );
};

export default SearchResults;
