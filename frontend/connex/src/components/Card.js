import React, { useEffect, useState } from 'react';
import '../css/friend.css';
var blink = "http://localhost:5000";
export default function Card(props) {
    const [connected, setConnected] = useState(true);

    const Check = async () => {
        try {
            const resp = await fetch(blink+"/api/connectcheck", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    tusername: props.username,
                    musername: localStorage.getItem("username")
                })
            });
            const json2 = await resp.json();
            return json2.connected;
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        const fetchConnectionStatus = async () => {
            const isConnected = await Check();
            setConnected(isConnected);
        };
        fetchConnectionStatus();
    }, [props.username]);

    const AddConnect = async () => {
        try {
            const resp = await fetch(blink+"/api/connect", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    tusername: props.username,
                    musername: localStorage.getItem("username")
                })
            });
            const json = await resp.json();

            if (!json.done) {
                alert("Sorry");
            } else {
                const isConnected = await Check();
                setConnected(isConnected);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const DropConnect = async () => {
        try {
            const resp = await fetch(blink+"/api/disconnect", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    tusername: props.username,
                    musername: localStorage.getItem("username")
                })
            });
            const json = await resp.json();

            if (!json.done) {
                alert("Sorry");
            } else {
                const isConnected = await Check();
                setConnected(isConnected);
            }
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className="DesignContainer">
            <div className="CardHeader">
                <img src={props.img} className="CardImage" />
                <div className="CardDetails">
                    <div>
                        <h1>{props.username}</h1>
                        <h1>{props.name}</h1>
                        <h2>Joined on {props.date}</h2>
                    </div>
                    <div>
                        {props.posts > 1 ? <h1>{props.posts} Posts</h1> : <h1>{props.posts} Post</h1>}
                        {props.connect > 1 ? <h1>{props.connect} Connects</h1> : <h1>{props.connect} Connect</h1>}
                    </div>
                </div>
            </div>
            <div className="CardButtonContainer">
                {localStorage.getItem("username") === props.username ? "" :
                    !connected ?
                        <button className="CardButton" onClick={AddConnect}>Connect</button> :
                        <button className="CardButton" onClick={DropConnect}>Connected</button>
                }
            </div>
        </div>
    );
}
