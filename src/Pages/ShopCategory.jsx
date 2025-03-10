import React, { useContext } from 'react'
import Hero from '../Components/Hero/Hero'
import './CSS/ShopCategory.css'
import {ShopContext} from '../Context/ShopContext'
import Item from '../Components/Item/Item'
const ShopCategory = (props) => {
  const {all_product} = useContext(ShopContext);
  console.log(all_product,"all_productall_product")
  return (
    <div>
      <Hero/>
      <div className='shop-category'>
       <div className='shopcategory-products'>
          {all_product?.map((item,i)=>{

            if(props.category===item.category) {
              return <Item key ={i} id={item.id} name ={item.name}  image ={item.image} new_price={item.new_price} old_price={item.old_price}/>
            } 
            else {
              return null;
            }

          })}

        </div>
    </div>
    </div>
  )
}

export default ShopCategory;
