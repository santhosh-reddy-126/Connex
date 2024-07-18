import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import SideBar from '../components/SideBar';
import Card from '../components/Card';
import '../css/two.css';
var blink = "https://connex-backend.onrender.com";
export default function Home() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [profiles, setProfiles] = useState([]);
    const [curr, setCurr] = useState(false);
    const [currprofile, setCurrProfile] = useState({
        _id:"",
        name:"",
        username:"",
        password:"",
        date:"",
        posts: 0,
        connects: 0,
        url: ""
    });

    const GetData2 = async (search) => {
        try {
            const resp = await fetch(blink+"/api/getprofiles", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    search: search
                })
            });
            const json = await resp.json();
            setProfiles(json.profiles);
        } catch (e) {
            console.log(e);
        }
    };

    const Getdata = async () => {
        try {
            const resp = await fetch(blink+"/api/getallset", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const json = await resp.json();
            setData(json.MyPosts);
        } catch (e) {
            console.log(e);
        }
    };

    const Getdata3 = async (curr2) => {
        try {
            const resp = await fetch(blink+"/api/getprofile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: curr2
                })
            });
            const json = await resp.json();
            setCurrProfile({
                ...currprofile,
                _id: json.profile._id,
                name: json.profile.name,
                username: json.profile.username,
                password: json.profile.password,
                date: json.profile.date,
                posts: json.profile.posts,
                connects: json.profile.Connects,
                url: json.profile.profilePhoto
            });
        } catch (e) {
            console.log(e);
        }
    };

    const Check = () => {
        const rslt = localStorage.getItem("username");
        if (!rslt) {
            navigate("/");
        }
    };

    useEffect(() => {
        Check();
        Getdata();
    }, []);

    return (
        <div className="home-container">
            <SideBar page="Search" />
            <div className="content-container">
                <div>
                    <input type="text" placeholder='Search' className="input-style" value={search} onChange={(e) => { setSearch(e.target.value); GetData2(search); }} onClick={() => { setCurr(false); }} />
                </div>
                {search === "" ?
                    <div className="posts-container">
                        {data.map((item, index) => (
                            <img key={index} src={item.imgUrl} className="post-image" alt={`Post ${index}`} />
                        ))}
                    </div> :
                    !curr ? (
                        <div className="profiles-container">
                            {profiles.map((item) => (
                                <h1 key={item._id} className="profile-item" onClick={() => { Getdata3(item.username); setCurr(true); }}>@{item.username}</h1>
                            ))}
                        </div>
                    ) : (
                        <div className="profile-card">
                            <Card
                                img={currprofile.url}
                                username={currprofile.username}
                                name={currprofile.name}
                                date={currprofile.date.slice(0, 10)}
                                posts={currprofile.posts}
                                connect={currprofile.connects}
                            />
                        </div>
                    )}
            </div>
        </div>
    );
}
