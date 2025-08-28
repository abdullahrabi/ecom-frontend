import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';
import search from '../Assests/search.png';
import axios from 'axios';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const navigate = useNavigate();

  // Fetch all products once when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('https://dept-store-backend.vercel.app/allproducts');
        setAllProducts(res.data); // assuming res.data is an array of product objects
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, []);

  // Update suggestions as user types
  useEffect(() => {
    if (query.trim() === '') {
      setSuggestions([]);
    } else {
      const filtered = allProducts
        .filter(product => product.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5); // limit to top 5 suggestions
      setSuggestions(filtered);
    }
  }, [query, allProducts]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${query}`);
      setSuggestions([]); // clear suggestions after submit
    }
  };

  const handleSuggestionClick = (name) => {
    setQuery(name);
    navigate(`/search?query=${name}`);
    setSuggestions([]);
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSubmit} className="search-bar">
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <img src={search} onClick={handleSubmit} alt="" />
      </form>

      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((item) => (
            <li key={item.id} onClick={() => handleSuggestionClick(item.name)}>
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
