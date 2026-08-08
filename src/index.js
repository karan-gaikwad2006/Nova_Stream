import mongoose from "mongoose";
import express from "express";
const app = express();
import {DB_NAME} from "./constants.js";

(async ()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on("error",(err)=>{
            console.error("Error",err); //this is also a listner for error in app is not able to connect to the database
            throw err;
        });
        app.listen(process.env.PORT,()=>{
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    }catch(err){
        console.error("Error",err);
        throw err;
    }
})()