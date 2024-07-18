import express from "express";
import User from "../schemas/user.js";
import Post from "../schemas/postschema.js";
import frnd from "../schemas/freinds.js";
import chat from "../schemas/chat.js";
import Notify from "../schemas/notify.js";
import { body, validationResult } from "express-validator";
const router = express.Router();
import bcrypt from "bcryptjs"
import jsonwebtoken from "jsonwebtoken";
import { connect } from "mongoose";
const jsecret = "hjsdbckjwhciwehihqwdihweihweiuhiweuh";

router.post("/like", async (req, res) => {
    try {
        const resp = await Post.findById(req.body.id);
        if (resp.likes.includes(req.body.username)) {
            const updatedDoc = await Post.findByIdAndUpdate(
                req.body.id,
                { $pull: { likes: req.body.username } },
                { new: true }
            )
            return res.json({ done: true, liked: false })
        } else {
            const updatedDoc = await Post.findByIdAndUpdate(
                req.body.id,
                { $push: { likes: req.body.username } },
                { new: true }
            )
            const New = await Notify.create({
                message: req.body.username + " liked your Post",
                seen: false,
                messageType: false,
                towhom: resp.username,
                date: new Date().toDateString(),
                time: new Date().toTimeString().split(' ')[0]
            })
            return res.json({ done: true, liked: true })
        }


    } catch (e) {
        console.log("Error3: " + e)
        return res.json({ done: false })
    }
})
router.post("/getlike", async (req, res) => {
    try {
        const resp = await Post.findById(req.body.id);
        if (resp.likes.includes(req.body.username)) {
            return res.json({ likes: resp.likes.length, success: true, liked: true })
        } else {
            return res.json({ likes: resp.likes.length, success: true, liked: false })
        }


    } catch (e) {
        console.log("Error3: " + e)
        return res.json({ success: false })
    }
})
router.post("/getcomments", async (req, res) => {
    try {
        const resp = await Post.findById(req.body.id);
        return res.json({ comments: resp.comments, success: true, commentedBy: resp.commentedBy, url: resp.imgUrl })
    } catch (e) {
        console.log("Error3: " + e)
        return res.json({ success: false })
    }
})
router.post("/setcomments", async (req, res) => {
    try {
        const resp = await Post.findOneAndUpdate({
            _id: req.body.id
        },
            { $push: { commentedBy: req.body.username, comments: req.body.comment } },
            { new: true });
        const New = await Notify.create({
            message: req.body.username + " Commented on your Post",
            seen: false,
            messageType: false,
            towhom: resp.username,
            date: new Date().toDateString(),
            time: new Date().toTimeString().split(' ')[0]
        })
        return res.json({ comments: resp.comments, success: true, commentedBy: resp.commentedBy, url: resp.imgUrl })
    } catch (e) {
        console.log("Error3: " + e)
        return res.json({ success: false })
    }
})


router.post("/updateprofile", async (req, res) => {
    try {
        if (req.body.def) {
            const resp = await User.findOneAndUpdate({
                username: req.body.username
            },
                { profilePhoto: "https://img.icons8.com/?size=100&id=98957&format=png&color=FFFFFF" },
                { new: true });
        } else {
            const resp = await User.findOneAndUpdate({
                username: req.body.username
            },
                { profilePhoto: req.body.url },
                { new: true });
        }

        return res.json({ updated: true })
    } catch (e) {
        console.log("Error3: " + e)
        return res.json({ updated: false })
    }
})

router.post("/createchat", async (req, res) => {
    try {
        const Sorted = [req.body.username, req.body.target].sort()
        const resp = await chat.findOne({ username: [req.body.username, req.body.target].sort() })
        const Updatedd = await Notify.updateMany({
            fromwhom: req.body.target
        },{seen: true})
        if (resp) {
            return res.json({ id: resp._id, hist: resp.Chathistory, names: resp.username });
        } else {
            const Usrs = [req.body.username, req.body.target]
            const h2 = await chat.create({
                username: Usrs.sort(),
                Chathistory: [],
                iden: Sorted[0] + Sorted[1],
                date: new Date().toDateString(),
                time: new Date().toTimeString().split(' ')[0]
            })
            return res.json({ id: h2._id, hist: [], names: h2.username });
        }
        
    } catch (e) {
        console.log("Error3: " + e)
        const resp = await chat.findOne({ username: [req.body.username, req.body.target].sort() })
        if(resp){
            return res.json({ id: resp._id, hist: resp.Chathistory, names: resp.username });
        }
        
    }
})

router.post("/addchat", async (req, res) => {
    try {
        const Chat1 = await chat.updateOne(
            { _id: req.body.id },
            { $push: { Chathistory: { $each: [req.body.addon] } },
                $set: {
                date: new Date().toDateString(),
                time: new Date().toTimeString().split(' ')[0]
              }}
        );
        // console.log(req.body.id)
        const resp1 = await Notify.findOne({ towhom: req.body.username, messageType: true , fromwhom: req.body.target,seen: false})
        if (resp1) {
            //nothing to do
        } else {
            await Notify.create({
                seen: false,
                messageType: true,
                towhom: req.body.target,
                fromwhom: req.body.username,
                date: new Date().toDateString(),
                time: new Date().toTimeString().split(' ')[0]
            })
        }
        if (Chat1) {
            return res.json({ updated: true })
        }

    } catch (e) {
        console.log("Error3: " + e)
        return res.json({ updated: false })
    }
})

router.post("/getnotify", async (req, res) => {
    try {
        const C = await Notify.find(
            { towhom: req.body.username }
        ).sort({ date: -1, time: -1 });
        return res.json({ updated: true, nots: C })


    } catch (e) {
        console.log("Error3: " + e)
        return res.json({ updated: false })
    }
})

router.post("/setnotify", async (req, res) => {
    try {
        const C = await Notify.updateMany(
            { towhom: req.body.username,messageType: false }, { seen: true }
        );
        return res.json({ updated: true })


    } catch (e) {
        console.log("Error3: " + e)
        return res.json({ updated: false })
    }
})

router.post("/getchats", async (req, res) => {
    try {
        const C = await Notify.find(
            { towhom: req.body.username,seen: false }
        );
        var myArray = []
        for (let i = 0; i < C.length; i++) {
            myArray.push(C[i].fromwhom)
        }
        // console.log(myArray)
        const D = await chat.find({
            username: { $in: req.body.username }
        }).sort({date:-1,time:-1})
        var newArray = []
        for (let i = 0; i < D.length; i++) {
            newArray.push(D[i])
        }
        var finalArray=[]
        newArray.forEach(item => {
            
            if ((item.username[0] === req.body.username) && myArray.includes(item.username[1])) {
                // console.log("Here0",item.username,req.body.username)
            }else if((item.username[1] === req.body.username) && myArray.includes(item.username[0])){
                // console.log("Here2",item.username,req.body.username)
            }else{
                // console.log("Here3",item.username,req.body.username)
                finalArray.push(item)
            }
        });
        return res.json({ updated: true,top: C,bottom: finalArray })


    } catch (e) {
        console.log("Error3: " + e)
        return res.json({ updated: false })
    }
})

export default router;