import express from "express";
import User from "../schemas/user.js";
import { body, validationResult } from "express-validator";
const router = express.Router();
import frnd from "../schemas/freinds.js";
import bcrypt from "bcryptjs"
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import jsonwebtoken from "jsonwebtoken";
const jsecret = "hjsdbckjwhciwehihqwdihweihweiuhiweuh";
router.post("/create", body("username").isLength({ min: 5 }), body("password", "Very Small Password").isLength({ min: 5 }), async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(),message: "choose correct credentials" })
    }
    const salt = await bcrypt.genSalt(10);
    let secpass = await bcrypt.hash(req.body.password,salt)
    try{
        const resp = await User.create({
            name: req.body.name,
            username: req.body.username,
            password: secpass
        })
        const resp2 = await frnd.create({
            username: req.body.username,
            friends: [req.body.username]
        })
        const data = {
            user:{
                id: resp._id
            }
        }
        const authtoken = jsonwebtoken.sign(data,jsecret)
        res.send({ success: true,authtoken:  authtoken,username: resp.username })
    }catch(e){
        console.log("Error2: "+e)
        res.send({ success: false, message: "try using a different username"})
    }
    
})
router.post("/logon", async(req, res) => {
    try{
        const userData = await User.findOne({
            username: req.body.username,
        })
        if (!userData){
            return res.status(400).json({ errors: "Try logging in with correct credentials" })
        }
        const pwdcompare = await bcrypt.compare(req.body.password,userData.password)
        if (!pwdcompare){
            return res.status(400).json({ errors: "Try logging in with correct credentials"})
        }
        const data = {
            user:{
                id: userData._id
            }
        }
        const authtoken = jsonwebtoken.sign(data,jsecret)
        return res.json({ success: true,authtoken:  authtoken,username: userData.username})
    }catch(e){
        console.log("Error2: "+e)
        res.json({ success: false, message: "Enter Valid Credentials"})
    }
    
})

  

export default router;