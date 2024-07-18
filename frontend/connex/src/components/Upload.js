import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/profile.css'; // Import the CSS file where your styles are defined
var blink = "http://localhost:5000";
export default function Upload() {
    const nav = useNavigate();
    const [data, setData] = useState({
        url: "",
        desc: ""
    });

    const HandleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const HandleUpload = async () => {
        try {
            const resp = await fetch(blink+"/api/upload", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: localStorage.getItem("username"),
                    imageUrl: data.url,
                    description: data.desc,
                    date: new Date().toDateString()
                })
            });

            const json = await resp.json();
            if (!json.success) {
                alert("Sorry, upload failed.");
            } else {
                setData({ ...data, url: "", desc: "" });
                nav("/home"); // Navigate to home page after successful upload
            }
        } catch (e) {
            console.log(e);
            alert("Error uploading photo.");
        }
    };

    return (
        <div className="Main2">
            <h1>Upload a Photo</h1>
            <h2>Image Link</h2>
            <input
                type="text"
                name="url"
                onChange={HandleChange}
                value={data.url}
                className="Input"
                autoComplete="off"
            />
            <h2>Description (Only 35-40 words)</h2>
            <textarea
                name="desc"
                onChange={HandleChange}
                value={data.desc}
                className="TextArea"
                autoComplete="off"
            ></textarea>
            <button onClick={HandleUpload} className="Button">Submit</button>
        </div>
    );
}
