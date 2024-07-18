import React, { useEffect, useState } from 'react';
import '../css/profile.css'; 
var blink = "https://connex-backend.onrender.com";
export default function Notification() {
    const [notification, setNotification] = useState([]);

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
                alert("Sorry, failed to fetch notifications.");
            } else {
                setNotification(json.nots);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const setData = async () => {
        try {
            const resp = await fetch(blink+"/api/setnotify", {
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
                alert("Sorry, failed to update notifications.");
            }
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        setData();
    }, [notification]);

    return (
        <div className="NotificationContainer">
            {notification.map((item, index) => (
                <center><p key={index} className={`Notify ${item.seen ? '' : 'unseen'}`}>
                    <strong>{item.time}</strong> {item.message}
                </p></center>
            ))}
            {notification.length === 0 && <h1 className="Notify">No Notifications Yet</h1>}
        </div>
    );
}
