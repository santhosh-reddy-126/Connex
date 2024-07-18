import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../css/Login.css';
var blink = "https://connex-backend.onrender.com";
export default function Login() {
    const nav = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [cred, setcred] = useState({
        name: "",
        password: "",
        username: ""
    })

    const handleForm = (e) => {
        setcred({ ...cred, [e.target.name]: e.target.value })
    }
    const handleClick = () => {
        nav('/')
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const resp = await fetch(blink+"/api/create", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: cred.username,
                    password: cred.password,
                    name: cred.name
                })
            })
            const json = await resp.json();
            // console.log(json);

            if (!json.success) {
                alert(json.message);
            }
            if (json.success){
                localStorage.setItem("username", json.username);
                localStorage.setItem("authToken", json.authtoken);
                nav('/home');
            }
        } catch (e) {
            console.log("Error1: " + e)
        }
        setcred({ password: '', name: '', username: '' })
    }
    return (
        <div className='Top'>

        <h1></h1>
        <div className='FlexL'>
            <div className='MainL'>
                <h1>SIGNUP</h1>
                <input type="text" placeholder='name' name='name' className='InputL' autoComplete='off' onChange={handleForm} value={cred.name} /><br />
                <input type="text" placeholder='Username' name='username' autoComplete='off' className='InputL' onChange={handleForm} value={cred.username} /><br />
                <div>
                    <input placeholder='password'
                        name='password'
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={cred.password}
                        onChange={handleForm}
                        className='Input2L' />
                    <button
                        id="show-password"
                        className='ShowPasswordButton'
                        onClick={() => setShowPassword(!showPassword)}
                    >👀</button>
                </div>


                <div>
                    <button type='submit' className='ButtonL' onClick={handleSubmit}>Sign Up</button>
                    <button type='submit' className='ButtonL' onClick={handleClick}>Already a User</button>
                </div>


            </div>
        </div>
        </div>
    )
}
