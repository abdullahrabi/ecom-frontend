import React, { useEffect, useState } from 'react';
import './Popular.css';
import Item from "../Item/Item";

export const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    const fetchPopularItems = async () => {
      try {
        console.log("Fetching Popular Fruits and Vegetables");
        const response = await fetch('http://localhost:5000/popularinvegetables');
        const data = await response.json();
        setPopularProducts(data);
        console.log("Popular in Fruits and Vegetables is Fetched");
      } catch (error) {
        console.error("Error fetching popular items:", error);
      }
    };

    fetchPopularItems();
  }, []); // Empty array ensures the effect runs only once after the initial render

  return (
    <div className='popular'>
      <h1>POPULAR DISCOUNTS IN VEGETABLES</h1>
      <hr />
      <div className='popular-item'>
        {popularProducts.map((item, i) => (
          <Item 
            key={i} 
            id={item.id} 
            name={item.name} 
            image={item.image} 
            new_price={item.new_price} 
            old_price={item.old_price} 
          />
        ))}
      </div>
    </div>
  );
};

export default Popular;
