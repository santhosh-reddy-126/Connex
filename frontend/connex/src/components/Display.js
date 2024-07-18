import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
var blink = "http://localhost:5000";
const Main = {
  backgroundColor: "blue",
  width: "500px",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingLeft: '10px',
  paddingRight: '10px',
  overflowY: "auto",
  scrollbarWidth: "none",
  color: "white",
}
const button={
  backgroundColor:"white",
  color:"blue",
  fontSize:"15px",
  fontWeight:"bold",
  width:"100px",
  height:"20px",
  marginTop:"10px",
  border: "0px",
  borderRadius: "10px"
}
const Input={ marginTop: "20px", padding: "5px", backgroundColor: "white", color: "blue",border:"0px",borderRadius:"10px",width:"450px"}
export default function Display(props) {
  const [imageUrl, setImageUrl] = useState('');
  const [desc,setdesc]=useState('');
  const nav = useNavigate();
  if (props.action === "upload") {
    const handleUpload=async()=>{
        try{
          const response = await fetch(blink+"/api/upload",{
            method:"POST",
            headers:{
              "Content-Type":"application/json"
            },
            body:JSON.stringify({
              username: localStorage.getItem("username"),
              imageUrl: imageUrl,
              date: new Date().toDateString(),
              description: desc
            })
          })
          const json = await response.json();
          if(!json.success){
            alert("Enter valid details")
          }else{
            nav("/home");
          }
        }catch(e){
          console.log(e)
        }
    }
    return (
      <div style={Main}>
        <h1 style={{textAlign:"center",color:"white"}}>Upload Image Link</h1>
        <input
        type="text"
        onChange={(e)=>{setImageUrl(e.target.value)}}
        value={imageUrl}
        style={Input}
      />
      <textarea type="text" style={Input} value={desc} onChange={(e)=>{setdesc(e.target.value)}}></textarea>
        <button style={button} onClick={handleUpload}>Upload</button></div>
    )
  } else {
    return (
      <div style={Main}><h1>Nothing to Display</h1></div>
    )
  }

}
