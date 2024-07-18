import React from 'react'
import { useEffect } from 'react';
import {useNavigate} from "react-router-dom"
import SideBar from '../components/SideBar';
import Posts from '../components/Posts';

var blink = "http://localhost:5000";
export default function Home() {
    const navigate = useNavigate();
    const Check=()=>{
        const rslt = localStorage.getItem("username")
        if (rslt){
            // console.log("Logged in")
        }else{
            navigate("/")
        }
    }
    useEffect(()=>{
        Check()
    },[])
    return (
        <div style={{display:"flex",gap: "0px"}}>
            <SideBar page="Home"/>
            <Posts/>
        </div>
    )
}
