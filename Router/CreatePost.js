const express = require("express");
const mongoose=require("mongoose");
const Router = express.Router();
const PostUser = require("../Modal/Post");
const requriedlogin = require("../middleware/requriedlogin");

const cors=require("cors");
Router.use(cors());

Router.get("/allposts",requriedlogin,(req,res)=>{
    // PostUser.find().populate("postedBy","_id name").then(result=>{
    //     res.json({post:result})
    PostUser.find()
    .populate("postedBy","_id name Photo")
    .populate("comments.postedBy","_id name")
    .sort("-createdAt")
    .then(result=>{
        res.json({post:result})
    }).catch(err=>{
        console.log(err)
    })
    
})


Router.get("/myposts",requriedlogin,(req,res)=>{
    PostUser.find({postedBy:req.user._id})
     .populate("postedBy","_id name ")
      .populate("comments.postedBy","_id name")
      .sort("-createdAt")
    .then(result=>{
        res.json({post:result})
    }).catch(err=>{
        console.log(err)
    })
})

Router.post("/createpost",requriedlogin,(req,res)=>{
   const{body,pic}=req.body;
   console.log(pic);
   if(!body||!pic){
    return res.status(422).json({error:"filled the body and pic"})
   }
   console.log(req.user)
   const post=new PostUser({
    
    body,
    photo:pic,
    postedBy:req.user
   })
   post.save().then(result=>{
    res.json({post:result})
   }).catch(err=>{
    console.log(err)
   })
})

Router.put("/likes",requriedlogin,(req,res)=>{
    PostUser.findByIdAndUpdate(req.body.postId,{
        $push:{
            likes:req.user._id
        }
    },{
        new:true
    }) .populate("postedBy","_id name Photo")
    .then((response)=>{
        res.json(response);
     })
     .catch((err)=>{
         console.log(err);
     })
})

Router.put("/unlikes",requriedlogin,(req,res)=>{
    PostUser.findByIdAndUpdate(req.body.postId,{
        $pull:{
            likes:req.user._id
        }
    },{
        new:true
    }) .populate("postedBy","_id name Photo")
    .then((response)=>{
       res.json(response);
    })
    .catch((err)=>{
        console.log(err);
    })
})

Router.put("/comment",requriedlogin,(req,res)=>{
    const comment={
        comment:req.body.text,
        postedBy:req.user._id
    }
    PostUser.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment }
    },{
        new:true
    })
    .populate("comments.postedBy","_id name ")
    .populate("postedBy","_id name Photo")
    .then((result)=>{
        res.json(result)
    })
    .catch((err)=>{
        console.log(err);
    })
   
})


Router.delete("/deletePost/:postId", requriedlogin, (req, res) => {
    PostUser.findOne({ _id: req.params.postId })
      .populate("postedBy", "_id ")
      .then(post => {
        if (!post) {
          return res.status(404).json({ error: "No post found" }); // Use a valid status code for not found
        }
  
        if (post.postedBy._id.toString() === req.user._id.toString()) {
          post.deleteOne()
            .then(result => {
              return res.status(200).json({ message: "Successfully deleted" }); // Use a valid status code for success
            })
            .catch(err => {
              console.log(err);
              return res.status(500).json({ error: "An error occurred while deleting the post" });
            });
        } else {
          return res.status(403).json({ error: "You are not authorized to delete this post" }); // Use a valid status code for forbidden
        }
      })
      .catch(err => {
        console.log(err);
        return res.status(500).json({ error: "An error occurred while finding the post" });
      });
  });
  
    // to follow

Router.get("/myfollowingpost",requriedlogin,(req,res)=>{
  
    // console.log({postedBy:{$in:req.user.followers}})
    PostUser.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .then(result=>{
        res.json(result)
    }).catch(err=>{
        console.log(err)
    })
})
module.exports=Router