import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/chat.css';
var blink = "http://localhost:5000";
export default function Home() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [profiles, setProfiles] = useState([]);
    const [curr, setCurr] = useState(false);
    const [tar, setTar] = useState("");

    const getData2 = async (search) => {
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

    const checkLoggedIn = () => {
        const rslt = localStorage.getItem("username");
        if (!rslt) {
            navigate("/");
        }
    };

    useEffect(() => {
        checkLoggedIn();
    }, []);

    return (
        <div className="container">
            <div className="content">
                <div>
                    <input
                        type="text"
                        placeholder="Search"
                        className="inputchat"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); getData2(search); }}
                        onClick={() => { setCurr(false); }}
                    />
                </div>
                {search === "" ? "" :
                    !curr ? (
                        <div>
                            {profiles.map((item, index) => (
                                <h1
                                    key={index}
                                    className="profile"
                                    onClick={() => {
                                        setCurr(true);
                                        localStorage.setItem("chatusername", item.username);
                                        navigate("/chat2");
                                    }}
                                >
                                    @{item.username}
                                </h1>
                            ))}
                        </div>
                    ) : ""}
            </div>
        </div>
    );
}
