import mongoose from "mongoose";
import express from "express";
const app = express();
import {DB_NAME} from "../constants.js";

//Configuration for database connection
const connectDB = async () => {
    try{
      const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
      console.log(`\nMongoDB connected: ${connectionInstance}\n`); //here we can write connectionInstance.connection.host to get the host name of the database it is to check whether it is connected to the correct database or not. It will return the host name of the database which is connected to the application.
    }catch(err){
        console.log("MONGODB CONNECTION ERROR",err);
        process.exit(1);
    }
}

export default connectDB; 
