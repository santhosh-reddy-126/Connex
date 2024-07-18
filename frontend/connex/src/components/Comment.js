import React, { useState, useEffect } from 'react';
import '../css/profile.css'; // Import the CSS file where your styles are defined
var blink = "http://localhost:5000";
export default function Comment(props) {
    const [comm, setComm] = useState({
        com: [],
        by: [],
        url: ""
    });
    const [comment, setComment] = useState("");

    const setComments = async () => {
        try {
            const resp = await fetch(blink+"/api/setcomments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: props.id,
                    comment: comment,
                    username: localStorage.getItem("username")
                })
            });
            const json = await resp.json();
            if (!json.success) {
                alert("Sorry");
            } else {
                setComm(prevComm => ({
                    ...prevComm,
                    com: json.comments,
                    by: json.commentedBy,
                    url: json.url
                }));
                setComment("");
            }
        } catch (e) {
            console.log(e);
        }
    };

    const getComments = async () => {
        try {
            const resp = await fetch(blink+"/api/getcomments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: props.id,
                    username: localStorage.getItem("username")
                })
            });
            const json = await resp.json();
            if (!json.success) {
                alert("Sorry");
            } else {
                setComm(prevComm => ({
                    ...prevComm,
                    com: json.comments,
                    by: json.commentedBy,
                    url: json.url
                }));
            }
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getComments();
    }, []);

    return (
        <div className="CommentContainer">
            <div className='Img'>
                {props.name === localStorage.getItem("username") ? <h2>You</h2> : <h2>{props.name}</h2>}
                <img src={comm.url} alt="Profile" />
            </div>
            <div className='H'>
                <h2>Comments</h2>
                <div className="Comments">
                    {comm.com.map((item, index) => (
                        <p key={index}>
                            {localStorage.getItem("username") === comm.by[index] ? "You" : comm.by[index]}➜{item}
                        </p>
                    ))}
                    {comm.com.length === 0 && "No Comments yet"}
                </div>
                <div>
                    <textarea className="CommentInput" onChange={(e) => setComment(e.target.value)} value={comment}></textarea><br />
                    <button className="CommentButton" onClick={setComments}>Add Comment</button>
                </div>
            </div>
        </div>
    );
}
