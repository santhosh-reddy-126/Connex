import React, { useEffect, useState } from 'react'
import Post from './Post'
import '../css/one.css'
var blink = "http://localhost:5000";
export default function Posts() {
  const [data,setdata]=useState([])
  
  const Getdata = async() => {
    try {
      const resp = await fetch(blink+"/api/getall", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: localStorage.getItem("username")
        })
      })
      const data2 = await resp.json()
      setdata(data2.MainArray);
      
    } catch (e) {
      console.log("Error1: " + e)
    }
  }

  useEffect(() => {
    Getdata();
  },[])
  return (
    <div className='Main'>
      {data.map((item)=>{
          return <Post link={item.imgUrl} likecount={item.likes.length} username={item.username} desc={item.description} id={item._id}/>
      })}
    </div>
  )
}
