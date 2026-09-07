import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res, next) => {

    //1. get user details from frontend through request.body
    const {username , email, fullname , password} = req.body;
    console.log("User details received from frontend: ", {username , email, fullname , password});
    
    //2. ab user ki details aagai ab karenge validation

    // if(fullname === ""){
    //     throw new ApiError("Fullname is required", 400); //beginner level you can do multiple if like this
    // }

    //good approach industry 
    if(
        [fullname, username, email, password].some((field)=> field?.trim() ==="")
    ){
        throw new ApiError("All fields are required", 400); //this is a good approach to check if any field is empty or not. It will check if any field is empty or not and if it is empty then it will throw an error.
    }

    //3. After validation we will check if user already exists or not
    const existedUser = await User.findOne({
        $or: [{ email } , { username }] //this $or is operator which will check if either email or username already exists in the database. If either of them exists then it will return the user object otherwise it will return null.
    });

    if(existedUser){
        throw new ApiError("User with email or username already exists", 409);  //these all errors we are writing
    }

    const avatarLocalPath = req.files?.avatar[0]?.path; //Multer gives us the path of the uploaded file in req.files object. We are using optional chaining '?' operator to check if the file is uploaded or not. If the file is not uploaded then it will return undefined.
    const coverImageLocalPath = req.files?.cover[0]?.path; //Multer gives us the path of the uploaded file in req.files object. We are using optional chaining '?' operator to check if the file is uploaded or not. If the file is not uploaded then it will return undefined.
    
    if(!avatarLocalPath){
        throw new ApiError("Avatar is required", 400); //this is a good approach to check if any field is empty or not. It will check if any field is empty or not and if it is empty then it will throw an error.
    }

    //now upload the avatar and cover image to cloudinary and get the url of the uploaded image and save it to the database.
    
    const avatar = await uploadOnCloudinary(avatarLocalPath); //here uploadOnCloudinary is a function which will upload the file to cloudinary and return the url of the uploaded file. We are passing the local path of the uploaded file to this function.
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null; //if cover image is not uploaded then it will be null.

    //check if avatar is uploaded or not. If avatar is not uploaded then it will throw an error.
    if(!avatar){
        throw new ApiError("Avatar upload failed", 500); //this is a good approach to check if any field is empty or not. It will check if any field is empty or not and if it is empty then it will throw an error.
    }

    const user = await User.create({       //database dusre continent mein hota hai isiliye isse await krna hai
        fullname,
        username : username.toLowerCase(), //we are converting the username to lowercase because we want to make the username case insensitive. So that if user registers with username "Karan" and then tries to login with "karan" then it should be successful. So we are converting the username to lowercase before saving it to the database.
        email,
        password,
        avatar: avatar.url,  //the uploadOnCloudinary has retruned a response which has respopnse.url
        coverImage: coverImage?.url || ""  //agar cover image nhi hai to empty string set kar denge
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");  //mongodb hr ek entry ke liye _id ki field add krta hai isiliye hum user._id se user ko find kr rhe hai
    //ye upr vale select method hum vo pass krte hai jo fields hume nhi chahiye 
    
    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    //at last we are returning the response
    return res.status(201).json(
        new ApiResponse(200, createdUser , "User registered successfully")
    )

    
})

export {registerUser};