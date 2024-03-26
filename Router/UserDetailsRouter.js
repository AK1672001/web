const express = require("express");
const mongoose=require("mongoose");
const userRouter = express.Router();
const PostUser = require("../Modal/Post");
const Data = require("../Modal/Modal");
const requriedlogin = require("../middleware/requriedlogin");
const cors=require("cors");
userRouter.use(cors());

// to get user profile
userRouter.get("/user/:id",(req,res)=>{
    Data.findOne({_id:req.params.id})
     .select("-password")
    .then(user=>{
        PostUser.find({postedBy:req.params.id})
        .populate("postedBy","_id")
        .then(result => { 
            return res.status(200).json({user, result});
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({error: err});
        });
        
          
    }).catch(err=>{
        console.log(err)
        return res.status(500).json({error: "user not found"}); 
    })
    
})

// to follow user
userRouter.put("/follow",requriedlogin,(req,res)=>{
    Data.findByIdAndUpdate(req.body.followId,{
        $push:{
            followers:req.user._id
        }
    },{
        new:true
    })
    .then((result)=>{
        Data.findByIdAndUpdate(req.user._id,{
            $push:{
                following:req.body.followId
            }
        },{
            new:true
        })
        .then((result)=>{
            res.status(200).json(result);
        })
        .catch((err)=>{
            console.log(err);
        })

       
     })
     .catch((err)=>{
         console.log(err);
     })
     
})
// unfollow user
userRouter.put("/unfollow",requriedlogin,(req,res)=>{
    Data.findByIdAndUpdate(req.body.followId,{
        $pull:{
            followers:req.user._id
        }
    },{
        new:true
    })
    .then((result)=>{
        Data.findByIdAndUpdate(req.user._id,{
            $pull:{
                following:req.body.followId
            }
        },{
            new:true
        })
        .then((result)=>{
            res.status(200).json(result);
        })
        .catch((err)=>{
            console.log(err);
        })

       
     })
     .catch((err)=>{
         console.log(err);
     })
     
})

// to upload profile pic
userRouter.put("/uploadProfilePic",requriedlogin,(req,res)=>{
    // console.log(req.user._id);
    Data.findByIdAndUpdate(req.user._id,{
        $set:{
            Photo:req.body.pic
        }
    },{
        new:true
    })
    .then((result)=>{
        res.status(200).json(result);
    })
    .catch((err)=>{
        console.log(err);
    })
})
module.exports=userRouter