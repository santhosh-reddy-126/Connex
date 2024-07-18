import React, { useState } from 'react'
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import SideBar from '../components/SideBar';
import Search from "../components/Search"
import '../css/chat.css';
var blink = "https://connex-backend.onrender.com";
export default function Home() {
    const [top,settop]=useState([]);
    const [bot,setbot]=useState([]);
    const [see,setsee]=useState(false);
    const [dot,setdot]=useState(false)
    const getData = async () => {
        try {
            const resp = await fetch(blink+"/api/getchats", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    target: localStorage.getItem("chatusername"),
                    username: localStorage.getItem("username")
                })
            });
            const response = await resp.json();
            if(response.updated){
                settop(response.top)
                setbot(response.bottom)
            }
            
        } catch (e) {
            console.log(e);
        }
    };
    useState(()=>{
        getData()
    },[])
    const navigate = useNavigate();
    const Check = () => {
        const rslt = localStorage.getItem("username")
        if (rslt) {
            // console.log("Logged in")
        } else {
            navigate("/")
        }
    }
    useEffect(() => {
        Check()
        localStorage.setItem("chatusername", "");
    }, [])
    return (
        <div className='container'>
            <SideBar page="Chat" />
            <div>
                <Search />
                {!see ? <div>
                    {top.map((item)=>{
                        return <h1 className='header' style={{border: "5px solid red"}} onClick={()=>{setsee(true); localStorage.setItem("chatusername",item.fromwhom); navigate("/chat2")}}>{item.fromwhom}</h1>
                    })}
                    {bot.map((j)=>{
                            return j.username[0]===localStorage.getItem("username") ? <h1 className='header' onClick={()=>{setsee(true); localStorage.setItem("chatusername",j.username[1]); navigate("/chat2")}}>{j.username[1]}</h1>:<h1 className='header' onClick={()=>{setsee(true); localStorage.setItem("chatusername",j.username[0]); navigate("/chat2")}}>{j.username[0]}</h1>
                    })}
                </div>:""}
                
            </div>
            
            
        </div>
        
    )
}

