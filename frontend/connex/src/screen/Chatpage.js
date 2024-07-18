import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import SideBar from '../components/SideBar';
import '../css/chatpage.css'; // Import the CSS file
var blink = "https://connex-backend.onrender.com";
var slink = "http://localhost:4000"
const Chatpage = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [receivedMessages, setReceivedMessages] = useState([]);
    const [Id, setId] = useState("");
    const [Users, setUsers] = useState([]);

    useEffect(() => {
        const checkLoggedIn = () => {
            const username = localStorage.getItem("username");
            if (!username) {
                navigate("/");
            }
        };
        checkLoggedIn();
    }, [navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await fetch(blink+"/api/createchat", {
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
                setId(response.id);
                setUsers(response.names);
                setReceivedMessages(response.hist);
            } catch (e) {
                console.log(e);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const socket = io(slink, {
            transports: ['websocket'],
            withCredentials: true,
            extraHeaders: {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
            }
        });

        if (Id) {
            socket.emit('Id', { id: Id });

            socket.on(Id, (msg) => {
                setReceivedMessages(prevMessages => [...prevMessages, msg]);
            });

            return () => {
                socket.disconnect();
            };
        }
    }, [Id]);

    const sendMessage = async () => {
        const socket = io(slink, {
            transports: ['websocket'],
            withCredentials: true,
            extraHeaders: {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
            }
        });

        const newMessage = {
            sender: localStorage.getItem("username"),
            message: message,
            receiver: localStorage.getItem("chatusername")
        };

        try {
            const resp = await fetch(blink+"/api/addchat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: Id,
                    addon: newMessage,
                    username: localStorage.getItem("username"),
                    target: localStorage.getItem("chatusername")
                })
            });
            const response = await resp.json();
            if (!response.updated) {
                alert("Message not sent");
            }
        } catch (e) {
            console.log(e);
        }

        socket.emit(Id, newMessage);
        setMessage('');
    };

    return (
        <div className="container">
            <SideBar page="Chat" />
            <div className='User'>
                <h1>{localStorage.getItem("chatusername")}</h1>
                <div className="message-container">
                    {receivedMessages.map((msg, index) => (
                        <div key={index} className="message">
                            <strong>{msg.sender === localStorage.getItem("username") ? "You" : msg.sender}: </strong>{msg.message}
                        </div>
                    ))}
                </div>
                <div style={{ position: "fixed", bottom: "70px" }}>
                    <input
                        className="input"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button className="button" onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default Chatpage;
