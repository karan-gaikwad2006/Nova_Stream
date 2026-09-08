import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async(req, res, next)=>{
    
   try {
    //pehle humne cookies le liye
    //kumne app.use(cookie-Parser) jo kiya tha uske vajah se hume req.cookies mil gae 
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
 
    //check if cookie hai bhi ya nhi
    if(!token){
     throw new ApiError("Unauthorized request", 401)
    }
 
    //validate cookie is valid or not
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
 
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
 
    if(!user){
     throw new ApiError("Invalid Access Token", 401)
    }
 
    req.user = user;

    next()
   } catch (error) {
    throw new ApiError(error?.message || "Invalid access token", 401)
   }

})