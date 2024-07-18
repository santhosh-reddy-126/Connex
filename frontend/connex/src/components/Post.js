import React, { useEffect, useState } from 'react'
import like from './images/like.png'
import like2 from './images/like2.png'
import Modal from "./Modal.js"
import Comment from './Comment.js'
import "../css/one.css"
var blink = "http://localhost:5000";
export default function (props) {
  const [likes, setlikes] = useState(0)
  const [liked, setliked] = useState(false)
  const [viewcom, setviewcom] = useState(false)
  const [comm, setcomm] = useState({
    com: [],
    by: [],
    url: ""
  })
  const GetLikes = async () => {
    try {
      const resp = await fetch(blink+"/api/getlike", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }, body: JSON.stringify({
          id: props.id,
          username: localStorage.getItem("username")
        })
      })
      const json = await resp.json()
      if (!json.success) {
        alert("Sorry")
      } else {
        setlikes(json.likes)
        setliked(json.liked)
      }
    } catch (e) {
      console.log(e)
    }

  }
  const GetComments = async () => {
    try {
      const resp = await fetch(blink+"/api/getcomments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }, body: JSON.stringify({
          id: props.id,
          username: localStorage.getItem("username")
        })
      })
      const json = await resp.json()
      if (!json.success) {
        alert("Sorry")
      } else {

        setcomm(prevComm => ({
          ...prevComm,
          com: json.comments,
          by: json.commentedBy,
          url: json.url
        }))

      }
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    GetLikes()
    GetComments()
  }, [])
  const HandleLike = async () => {
    try {
      const resp = await fetch(blink+"/api/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }, body: JSON.stringify({
          id: props.id,
          username: localStorage.getItem("username")
        })
      })
      const json = await resp.json()
      if (!json.done) {
        alert("Sorry")
      } else {
        GetLikes();
      }
    } catch (e) {
      console.log(e)
    }

  }
  const HandleClose=()=>{
   setviewcom(false); 
   GetComments()
  }
  return (
    <div className='PostContainer'>
      <div className='ImgPart'>
        {props.username === localStorage.getItem("username") ? <h2>You</h2> : <h2>{props.username}</h2>}
        <hr/>
        <img src={props.link} className='MainImage'/>
      </div>

      <div className='PostActions'>
        <button onClick={HandleLike}><img src={liked ? like2 : like} /></button>
        <div className='PostDetails'>
          <span >{likes} {likes == 1 ? "Like" : "Likes"}</span>
          <p>{props.desc}</p>
          <div>
            {(comm.com.slice(0,2)).map((item, index) => {
              return <p>
                {localStorage.getItem("username") === comm.by[index] ? "You" : comm.by[index]}➜{item}
              </p>
            })}
            {comm.com.length===0 ? "No Comments yet":""}
            <p></p>
          </div>

          <button className="AddCommentButton" onClick={() => { setviewcom(true) }}>
            View and Add Comments
          </button>
        </div>
      </div>

      {viewcom ? <Modal onClose={HandleClose}><Comment name={props.username} url={props.link} comm={comm.com} by={comm.by} id={props.id}/></Modal> : null}
    </div>
  )
}
