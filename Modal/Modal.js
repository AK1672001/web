const mongoose=require("mongoose");
const {ObjectId}=mongoose.Schema.Types
const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    }
    ,
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    Photo:{
      type:String
    },
    followers:[{type:ObjectId,ref:"Data"}],
    following:[{type:ObjectId,ref:"Data"}],
})

const  Data=mongoose.model("Data",userSchema);

module.exports=Data;