import React from 'react';
import { useLocation } from 'react-router-dom';
import all_product from '../Components/Assests/data/all_product';
import './CSS/SearchResults.css';
import Item from '../Components/Item/Item';

const SearchResults = () => {
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('query')?.toLowerCase() || '';

  // Filter products based on search query
  const filteredResults = all_product.filter((product) =>
    product.name.toLowerCase().includes(searchQuery)
  );
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Smooth scrolling
    });
  };
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
