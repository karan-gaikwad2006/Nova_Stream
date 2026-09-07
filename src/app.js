import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN, //which origin is allowed to access the resources of the server. It can be a single origin or an array of origins. It can also be a function which returns a boolean value indicating whether the origin is allowed or not.
    credentials: true //which allows the server to accept cookies from the client. It is set to true because we want to allow the server to accept cookies from the client.
})); 

app.use(cookieParser());// iska mtlb hai ki mein server se user ke browser me cookie bhejunga aur user ke browser me cookie set karunga. Ye middleware hai jo ki server ko allow karta hai ki wo user ke browser me cookie set kare aur user ke browser se cookie read kare. CRUD operation kr pau uske cookie se
app.use(express.json({limit:"16kb"})); //which allows the server to accept JSON data from the client. It is set to true because we want to allow the server to accept JSON data from the client.
app.use(express.urlencoded({extended:true, limit:"16kb"})); //which allows the server to accept URL encoded data from the client. It is set to true because we want to allow the server to accept URL encoded data from the client.
app.use(express.static("public")); //which allows the server to serve static files from the public folder. It is set to true because we want to allow the server to serve static files from the public folder.


//routes import
import userRouter from './routes/user.routes.js';



// routes declaration
app.use("/api/v1/user" , userRouter); //which allows the server to use the userRouter for all the routes starting with /user. It is set to true because we want to allow the server to use the userRouter for all the routes starting with /user.

export {app};