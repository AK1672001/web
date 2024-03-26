
const jwt=require("jsonwebtoken");
const mongoose=require("mongoose");
const dotenv=require("dotenv");
const Data=require("../Modal/Modal")
dotenv.config();

module.exports=(req,res,next)=>{
    const {authorization}=req.headers;
    if(!authorization){
        return res.status(401).json({error:"you must have loged 1"})
    }
    const token=authorization.replace("Bearer ","");
    jwt.verify(token,process.env.JWT_SECRET,(err,payload)=>{
        if(err){
            return res.status(401).json({error:"you must have loged 2"})
        }
        const {_id}=payload
        Data.findById(_id).then((userdata)=>{
            req.user=userdata;
            next();
            // console.log(userdata)
        })
    });
   
}