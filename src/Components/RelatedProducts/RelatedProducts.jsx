import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import './RelatedProducts.css';
import all_product from '../Assests/data/all_product';
import Item from '../Item/Item';
import up_arrow from '../Assests/up_arrow.png';

const RelatedProducts = ({ category, selectedProductId }) => {
  // Filter by category and exclude the currently selected product
  const relatedProducts = all_product.filter(
    (item) => item.category === category && item.id !== selectedProductId
  );

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // State to handle the visibility of the scroll to top button
  const [isVisible, setIsVisible] = useState(false);

  // Check scroll position and toggle visibility of scroll-to-top button
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', toggleVisibility);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []); // Empty dependency array ensures it runs only once when the component mounts

  return (
    <div className='relatedproducts'>
      <h1>Related Products</h1>
      <hr />
      <div className='relatedproducts-items'>
        {relatedProducts.length > 0 ? (
          relatedProducts.map((item, i) => (
            <Item
              key={i}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
              scrollToTop={scrollToTop} // Pass the function to Item if needed
            />
          ))
        ) : (
          <p>No related products found.</p>
        )}
      </div>

      {/* Scroll to Top button */}
      {isVisible && (
        <img
          className="scroll-to-top"
          src={up_arrow }
          alt="Scroll to top"
          onClick={scrollToTop}
        />
      )}
    </div>
  );
};

export default RelatedProducts;
