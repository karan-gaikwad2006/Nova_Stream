import mongoose, { Schema } from 'mongoose';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true //makes the username field indexed for faster search
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname:{
        type: String,
        required: true,
        trim: true,
        index: true //makes the fullname field indexed for faster search
    },
    avatar:{
        type: String, //cloudinary ka url use karenge
        required: true,
    },
    coverImage:{
        type: String, //cloudinary ka url use karenge
    },
    watchHistory: [{
        type: Schema.Types.ObjectId,
        ref: "Video"
    }],
    password:{
        type: String,
        required: [true, "Password is required"],
    },
    refreshToken:{
        type: String,
    }  
},{timestamps: true});

userSchema.pre("save", async function(){
    if(!this.isModified("password")) {  //this line checks if the       password field is modified or not. If it is not modified, then we don't need to hash it again. We can just return next() to move to the next middleware. otherwiswe it will hash the password again and again which is not required.
        return ;
    } 
    this.password = await bcrypt.hash(this.password,10);
 })// this hook is used to hash the password before saving it to the database

userSchema.methods.isPasswordCorrect = async function(password){ //This is the custom method i made with .methods to check if the password is correct or not. It takes the password as an argument and compares it with the hashed password stored in the database. It returns true if the password is correct, otherwise false.
    return await bcrypt.compare(password, this.password); //this.passwrod is the one saved in the DB
}

userSchema.methods.generateAccessToken = function(){ //This is the custom method i made with .methods to generate the access token. It takes the user id as an argument and generates the access token using the jwt.sign() method. It returns the access token.
       return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname,
        }, 
        process.env.ACCESS_TOKEN_SECRET, 
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
}

userSchema.methods.generateRefreshToken = function(){ //This is the custom method i made with .methods to generate the refresh token. It takes the user id as an argument and generates the refresh token using the jwt.sign() method. It returns the refresh token.
    return jwt.sign(
        {
            _id: this._id,
        }, 
        process.env.REFRESH_TOKEN_SECRET, 
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
}

export const User = mongoose.model('User', userSchema);

//see the methods which use declare using .methods krke na that are used with small 'user' which you do when const user = User.findOne()
//The methods like findOne, create, these are provided by mongoose so that are ysed with capital 'User' that you do export Const User