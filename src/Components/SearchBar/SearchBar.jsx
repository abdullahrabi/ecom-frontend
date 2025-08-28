// SearchBar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SearchBar.css';
import search from '../Assests/search.png';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const navigate = useNavigate();

  // Fetch all products once
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('https://dept-store-backend.vercel.app/allproducts');
        setAllProducts(res.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, []);

  // Update suggestions as user types
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
    } else {
      const filtered = allProducts
        .filter(product => product.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5);
      setSuggestions(filtered);
    }
  }, [query, allProducts]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${query}`);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (name) => {
    setQuery(name);
    navigate(`/search?query=${name}`);
    setSuggestions([]);
  };

  return (
    <div className="search-bar-container" style={{ position: 'relative' }}>
      <form onSubmit={handleSubmit} className="search-bar">
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <img src={search} onClick={handleSubmit} alt="search" />
      </form>

      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((item) => (
            <li key={item.id} onClick={() => handleSuggestionClick(item.name)}>
              <div className="suggestion-item">
                <img src={item.image} alt={item.name} className="suggestion-image" />
                <div className="suggestion-info">
                  <span className="suggestion-name">{item.name}</span>
                  <span className="suggestion-price">PKR {item.new_price}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
