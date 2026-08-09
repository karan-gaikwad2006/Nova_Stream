import dotenv from "dotenv";
import connectDB from "./db/index.js";
import mongoose from "mongoose";
import express from "express";
const app = express();
// import {DB_NAME} from "./constants.js";

dotenv.config({
    path : "./.env"
})

connectDB();

//This is the first approach of doing the

//This is an IIFE (Immediately Invoked Function Expression) which is used to connect to the database and start the server. It is an async function which allows us to use await for asynchronous operations like connecting to the database. If there is any error during the connection or starting the server, it will be caught in the catch block and logged to the console.

/*
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
*/
app.get("/",(req,res)=>{
    res.send("Hello World");
});
app.listen(process.env.PORT,()=>{
            console.log(`Server is running on port ${process.env.PORT}`);
});