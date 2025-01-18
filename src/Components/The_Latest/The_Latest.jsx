import React, { useEffect, useState } from 'react'
import './The_Latest.css'
import Item from "../Item/Item"


export const The_Latest = () => {
  const [The_Latest_Data,setThe_Latest_Data] =useState([]);
  useEffect(()=>{
    fetch('http://localhost:5000/LatestItems')
    .then((response)=>response.json())
    .then((data)=>setThe_Latest_Data(data));
  },[])
  return (
    <div className='new-collections'>
      <h1>Our Latest Items</h1>
      <hr/>
      <div className='collections'>
        {The_Latest_Data.map ((item,i)=>{
              return <Item key ={i} id={item.id} name ={item.name} image ={item.image} new_price={item.new_price} old_price={item.old_price}/>




        })}
        
      </div>
      
      
      
      </div>
  )
}
export default The_Latest;