import express from "express";
import User from "../schemas/user.js";
import Post from "../schemas/postschema.js";
import frnd from "../schemas/freinds.js";
import { body, validationResult } from "express-validator";
const router = express.Router();
import bcrypt from "bcryptjs"
import jsonwebtoken from "jsonwebtoken";
import { connect } from "mongoose";
const jsecret = "hjsdbckjwhciwehihqwdihweihweiuhiweuh";


router.post("/upload", async (req, res) => {
    try {
        const resp = await Post.create({
            username: req.body.username,
            imgUrl: req.body.imageUrl,
            likes: [],
            date: req.body.date,
            description: req.body.description,
            time: new Date().toTimeString().split(' ')[0]
        })
        const resp2 = await User.updateOne(
            { username: req.body.username },
            { $inc: { posts: 1 } },
            { new: true }      
        )
        return res.json({ success: true})


    } catch (e) {
        console.log("Error3: " + e)
        return res.json({ success: false})
    }
})

router.post("/getall", async (req, res) => {
    try {
        const response = await Post.find({}).sort({date:-1,time:-1})
        const resp2 = await frnd.findOne({username: req.body.username})
        let final=[]
        for(let i=0;i<response.length;i++){
            if (resp2.friends.includes(response[i].username)){
                final.push(response[i])
            }
        }
        return res.json({done:true,MainArray: final})
    } catch (e) {
        console.log("Error3: " + e)
        return res.json({done:false})
    }
})

router.post("/getmine", async (req, res) => {
    try {
        const response = await Post.find({username: req.body.username}).sort({date:-1,time:-1})
        const response2 = await User.findOne({username: req.body.username})
        return res.json({done:true,MyPosts:response,MyData: response2})
    } catch (e) {
        console.log("Error3: " + e)
        return res.json({done:false})
    }
})
router.post("/getallset", async (req, res) => {
    try {
        const response = await Post.find({}).sort({date:-1,time:-1})
        return res.json({done:true,MyPosts:response})
    } catch (e) {
        console.log("Error3: " + e)
        return res.json({done:false})
    }
})

router.post("/getprofiles", async (req, res) => {
    try {
        const response = await User.find({})
        let final=[]
        for(let i=0;i<response.length;i++){
            if (response[i].username.includes(req.body.search)){
                final.push(response[i])
            }
        }
        return res.json({done:true,profiles:final})
    } catch (e) {
        console.log("Error4: " + e)
        return res.json({done:false})
    }
})

router.post("/getprofile", async (req, res) => {
    try {
        const response = await User.findOne({username: req.body.username})
        
        return res.json({done:true,profile:response})
    } catch (e) {
        console.log("Error4: " + e)
        return res.json({done:false})
    }
})


router.post("/connect",async (req, res)=>{
    try{
        const resp = await frnd.findOne({username: req.body.musername})
        let addConnect = true
        if (resp.friends.includes(req.body.tusername)){
            addConnect=false
        }
        if (addConnect){
            const resp3 = await frnd.updateOne(
                { username: req.body.musername },
                { $push: { friends: req.body.tusername} },
                { new: true }      
            )
            const resp4 = await frnd.updateOne(
                { username: req.body.tusername },
                { $push: { friends: req.body.musername} },
                { new: true }      
            )
            
            if(resp3 && resp4){
                const resp1 = await User.updateOne(
                    { username: req.body.tusername },
                    { $inc: { Connects: 1 } },
                    { new: true }      
                )
                const resp2 = await User.updateOne(
                    { username: req.body.musername },
                    { $inc: { Connects: 1 } },
                    { new: true }      
                )
            }
        }
        
        
        
        return res.json({done:true})
    }catch(e){
        console.log("Error4: "+e)
        return res.json({done:false})
    }
})


router.post("/disconnect",async (req, res)=>{
    try{
        const resp = await frnd.findOne({username: req.body.musername})
        let disConnect = false
        if (resp.friends.includes(req.body.tusername)){
            disConnect=true
        }
        if (disConnect){
            const resp3 = await frnd.updateOne(
                { username: req.body.musername },
                { $pull: { friends: req.body.tusername} },
                { new: true }      
            )
            const resp4 = await frnd.updateOne(
                { username: req.body.tusername },
                { $pull: { friends: req.body.musername} },
                { new: true }      
            )
            
            if(resp3 && resp4){
                const resp1 = await User.updateOne(
                    { username: req.body.tusername },
                    { $inc: { Connects: -1 } },
                    { new: true }      
                )
                const resp2 = await User.updateOne(
                    { username: req.body.musername },
                    { $inc: { Connects: -1 } },
                    { new: true }      
                )
                return res.json({done:true})
            }
        }
        
        
        
        
    }catch(e){
        console.log("Error4: "+e)
        return res.json({done:false})
    }
})


router.post("/connectcheck",async (req, res)=>{
    try{
        const resp2 = await frnd.findOne(
            {username: req.body.musername}  
        )
        
        if (resp2.friends.includes(req.body.tusername)){
            return res.json({done:true,connected: true})
        }else{
            return res.json({done:true,connected: false})
        }
        
    }catch(e){
        console.log("Error4: "+e)
        return res.json({done:false})
    }
})
export default router;