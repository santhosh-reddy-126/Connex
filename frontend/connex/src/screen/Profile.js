import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import SideBar from '../components/SideBar';
import Post from '../components/Post';
import upload from '../components/images/upload.png';
import { useState } from 'react';
import Modal from '../components/Modal';
import Upload from '../components/Upload';
import '../css/profile.css';
var blink = "http://localhost:5000";
export default function Home() {
    const [action, setAction] = useState("");
    const [data, setData] = useState([]);
    const [url, setUrl] = useState("");
    const [info, setInfo] = useState({
        _id: "",
        name: "",
        username: "",
        posts: "",
        connects: "",
        date: "",
        url: ""
    });
    const navigate = useNavigate();

    const GetData = async () => {
        try {
            const resp = await fetch(blink+"/api/getmine", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: localStorage.getItem("username")
                })
            });
            const data2 = await resp.json();
            setData(data2.MyPosts);
            setInfo({
                _id: data2.MyData._id,
                name: data2.MyData.name,
                username: data2.MyData.username,
                posts: data2.MyData.posts,
                connects: data2.MyData.Connects,
                date: data2.MyData.date,
                url: data2.MyData.profilePhoto
            });
        } catch (e) {
            console.log("Error1: " + e);
        }
    };

    const Check = () => {
        const result = localStorage.getItem("username");
        if (!result) {
            navigate("/");
        }
    };

    const HandleUpload = () => {
        setAction("upload");
    };

    useEffect(() => {
        Check();
        GetData();
    }, []);

    const formatDate = (inputDate) => {
        const date = new Date(inputDate);
        const options = {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        };
        const formattedDate = date.toLocaleDateString('en-GB', options);
        const day = date.getDate();
        let suffix = 'th';
        if (day === 1 || day === 21 || day === 31) {
            suffix = 'st';
        } else if (day === 2 || day === 22) {
            suffix = 'nd';
        } else if (day === 3 || day === 23) {
            suffix = 'rd';
        }
        const finalFormattedDate = `${formattedDate}`;
        return finalFormattedDate;
    };

    const UploadProfilePhoto = async () => {
        try {
            const resp = await fetch(blink+"/api/updateprofile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    url: url,
                    username: localStorage.getItem("username"),
                    def: false
                })
            });
            const data2 = await resp.json();
            if (data2.updated) {
                GetData();
                setUrl("");
                setAction("");
            } else {
                alert("Failed to Upload");
            }
        } catch (e) {
            console.log("Error1: " + e);
        }
    };

    const RemoveProfilePhoto = async () => {
        try {
            const resp = await fetch(blink+"/api/updateprofile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: localStorage.getItem("username"),
                    def: true
                })
            });
            const data2 = await resp.json();
            if (data2.updated) {
                GetData();
                setUrl("");
                setAction("");
            } else {
                alert("Failed to Remove");
            }
        } catch (e) {
            console.log("Error1: " + e);
        }
    };

    return (
        <div style={{ display: "flex", gap: "0px" }}>
            <SideBar page="Profile" />
            <div className="Main">
                <img src={info.url} onClick={() => setAction("uploadprofile")} className="ProfileImage" />
                <span className="Username">{localStorage.getItem("username")}</span><br />
                <div className="Stats">
                    <span>{data.length} {data.length > 1 ? "Posts" : "Post"}</span>
                    <span>{info.connects} {info.connects > 1 ? "Connects" : "Connect"}</span>
                </div>
                <div className="Details">
                    <div className="ProfileDetails">
                        <span>{info.name}</span>
                        <span>@{localStorage.getItem("username")}</span>
                        <span>Joined on {formatDate(info.date.slice(0, 10))}</span>
                    </div>
                    <div>
                        <button className="Button2" onClick={HandleUpload}><img src={upload} /></button>
                    </div>
                </div>
               
                {data.length === 0 ? <h1>No Posts Yet</h1> :
                    <div>
                        {data.map((item) => (
                            <Post key={item._id} link={item.imgUrl} likecount={item.likes.length} username={item.username} desc={item.description} id={item._id} />
                        ))}
                    </div>
                }

                {action === "upload" && <Modal onClose={() => setAction("")}><Upload /></Modal>}
                {action === "uploadprofile" && <Modal onClose={() => setAction("")}>
                    <div className="UploadProfileContainer">
                        <h1 className="UploadProfileTitle">Upload Profile Photo</h1>
                        <input className="Input" placeholder="Image Url" onChange={(e) => setUrl(e.target.value)} value={url} /><br />
                        <button className="Button" onClick={UploadProfilePhoto}>Upload</button>
                        <button className="Button" onClick={RemoveProfilePhoto}>Remove</button>
                    </div>
                </Modal>}
            </div>
        </div>
    );
}
