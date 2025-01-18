import React, { useContext } from 'react'
import { ShopContext } from '../Context/ShopContext'
import { useParams } from 'react-router-dom';
import Breadcrum from '../Components/Breadcrums/Breadcrum';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';




const Product = () => {
  const {all_product}= useContext(ShopContext);
  const {productId}= useParams();
  const product = all_product.find((e)=> e.id === Number(productId));
  
  return (
    <div className='All'>
      
    <Breadcrum product={product}/>
    <ProductDisplay product={product}/>
    <DescriptionBox/>
    {product && (
        <RelatedProducts 
          category={product.category} 
          selectedProductId={product.id}  // This is where selectedProductId is passed
        />
      )}
      
    </div>
  )
}

export default Product
