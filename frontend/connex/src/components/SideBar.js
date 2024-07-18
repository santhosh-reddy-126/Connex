import React, { useState, useEffect } from 'react';
import home from './images/home.png';
import chat from './images/chat.png';
import profile from './images/profile.png';
import Modal from './Modal';
import logout from './images/logout.png';
import search from './images/search.png';
import bell from './images/bell.png';
import Notification from './Notification';
import { useNavigate } from 'react-router-dom';
import '../css/one.css';
var blink = "https://connex-backend.onrender.com";
export default function SideBar(props) {
    const [noti, setnot] = useState(false);
    const [notify, setnotify] = useState(false);
    const nav = useNavigate();

    const getData = async () => {
        try {
            const resp = await fetch(blink+"/api/getnotify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: localStorage.getItem("username")
                })
            });
            const json = await resp.json();
            if (!json.updated) {
                alert("Sorry");
            } else {
                const unseenNotifications = json.nots.filter(item => !item.seen);
                setnotify(unseenNotifications.length > 0);
            }
        } catch (e) {
            console.log(e);
        }
    }

    const HandleChat = () => {
        nav("/chat");
    }

    const Handleprofile = () => {
        nav("/profile");
    }

    const Handlenotify = () => {
        setnot(true);
    }

    const HandleClose = () => {
        getData();
        setnot(false);
    }

    const Handlesearch = () => {
        nav("/search");
    }

    const Handlelogout = () => {
        localStorage.removeItem("username");
        localStorage.removeItem("authToken");
        nav("/");
    }

    const Handlehome = () => {
        nav("/home");
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <div>
            <div className="Side">
                <button className={props.page === "Home" ? "active" : ""} onClick={Handlehome}><img src={home} alt="Home" /></button>
                <button className={props.page === "Search" ? "active" : ""} onClick={Handlesearch}><img src={search} alt="Search" /></button>
                <button className={props.page === "Chat" ? "active" : ""} onClick={HandleChat}><img src={chat} alt="Chat" /></button>
                <button className={props.page === "Profile" ? "active" : ""} onClick={Handleprofile}><img src={profile} alt="Profile" /></button>
                <button className={props.page === "Notify" ? "active" : ""} onClick={Handlenotify}>
                    <img src={bell} alt="Notification" />
                </button>
                <button onClick={Handlelogout}><img src={logout} alt="Logout" /></button>
            </div>
            {noti && <Modal onClose={HandleClose}><Notification /></Modal>}
        </div>
    );
}
