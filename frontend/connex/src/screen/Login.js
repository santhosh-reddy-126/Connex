import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../css/Login.css";
var blink = "https://connex-backend.onrender.com";
export default function Login() {
  const nav = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [cred, setcred] = useState({
    username: "",
    password: "",
  });

  const handleForm = (e) => {
    setcred({ ...cred, [e.target.name]: e.target.value });
  };

  const handleClick = () => {
    nav('/signup');
  };

  const Check = () => {
    const rslt = localStorage.getItem("username");
    if (rslt) {
      nav("/home");
    }
  };

  useEffect(() => {
    Check();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await fetch(blink+"/api/logon", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: cred.username,
          password: cred.password
        })
      });
      const json = await resp.json();
      
      if (!json.success) {
        alert("Enter Valid Credentials");
      }
      if (json.success) {
        localStorage.setItem("username", json.username);
        localStorage.setItem("authToken", json.authtoken);
        nav("/home");
      }
    } catch (e) {
      console.log("Error1: " + e);
    }
    setcred({ password: '', name: '', username: '' });
  };

  return (
    <div className='Top'>
    <h1></h1>
    <div className="FlexL">
      
      <div className="MainL">
        <h1>LOGIN</h1>
        <input type="text" placeholder='Username' className="InputL" autoComplete='off' name='username' onChange={handleForm} value={cred.username} /><br />
        <div className='Inline'>
          <input placeholder='password'
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={cred.password}
            onChange={handleForm}
            className="Input2L" />
          <button
            id="show-password"
            className="ShowPasswordButton"
            onClick={() => setShowPassword(!showPassword)}
          >👀</button>
        </div>
        <div>
          <button type='submit' className="ButtonL" onClick={handleSubmit}>Login</button>
          <button type='submit' className="ButtonL" onClick={handleClick}>New User</button>
        </div>
      </div>
    </div>
    </div>
  );
}
