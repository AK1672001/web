const mongoose=require("mongoose");
const Data = require("./Modal");
const {ObjectId}=mongoose.Schema.Types
const postSchema=new mongoose.Schema({
  
    body:{
        type:String,
        required:true,
    },
   
    photo:{
        type:String,
        default:"no photo",
    },
    likes:[{
        type:ObjectId,
        ref:Data 
    }],
    comments:[{
        comment:String,
        postedBy:{type:ObjectId,ref:Data}
    }],
    postedBy:{
       type:ObjectId,
       ref:Data
    },
},{timestamps:true})

const PostUser=mongoose.model("PostUser",postSchema);
module.exports=PostUser