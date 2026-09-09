import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js';


const generateAccessAndRefreshTokens = async(userId) => { //we are amking this method as this can be used many times and at many places
    try{
        const user = await User.findById(userId)

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken //that user.refreshToken is in usermodel schema and second refresToken is var we just made
        await user.save({validateBeforeSave: false}) // abhi humne manually code mein add kiya hai toh save krna padega aur validatBeforeSave: false jo baki required fields hai na irrespective of that ye save karega

        return{accessToken, refreshToken}


    }catch(error){
        throw new ApiError("Something went wrong while generating refresh and access token", 500)
    }
} 

//Register User
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

    const avatarLocalPath = req.files?.avatar?.[0]?.path; //Multer gives us the path of the uploaded file in req.files object. We are using optional chaining '?' operator to check if the file is uploaded or not. If the file is not uploaded then it will return undefined.
    // this is one way
    // // const coverImageLocalPath = req.files?.cover[0]?.path; //Multer gives us the path of the uploaded file in req.files object. We are using optional chaining '?' operator to check if the file is uploaded or not. If the file is not uploaded then it will return undefined.
    
    //classical way
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if(!avatarLocalPath){
        throw new ApiError("Avatar is required", 400); //this is a good approach to check if any field is empty or not. It will check if any field is empty or not and if it is empty then it will throw an error.
    }

    //now upload the avatar and cover image to cloudinary and get the url of the uploaded image and save it to the database.
    console.log("Avatar local path:", avatarLocalPath);

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
        throw new ApiError("Something went wrong while registering the user" , 500)
    }

    //at last we are returning the response
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully") //this ApiResponse is a utility you made it in utils
    )


})

//Login User
const loginUser = asyncHandler( async ( req, res)=>{
    // req.body -> data
    //username or email = ye apke upr hai ki userbase access dena hai ya email based depends
    //find the user
    //password check
    // generate access and refresh token
    // send this tokens through cookies

    //1.
    const {email, username, password} = req.body ;

    //2.
    if(!username && !email){ // this also depends
        // remember you have defined first msg then status code in utils ApiError
        throw new ApiError("username or email is required", 400)
    }

    //3.
    const user = await User.findOne({    //ya toh usename find krdo ya fir email find krdo
        $or: [{email},{username}]
    })
    
    if(!user){
        throw new ApiError("User does not exist", 400)
    }

    //4.
    const isPasswordValid =  await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError("Invalid user credentials", 401)
    }
    
    //5.
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    //Optional step
    // jo humne 3. step mein user ko find kiya toh humare pass unwanted fields like password, refreshToken bhi aa gae toh vahi nikal rahe hai
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken") // ye hum aur ek baar database operation kr rahe hai toh expensive bhi ho skta hai
    //if you find the above operation is expensive then you update the existing object

    //6.
    const options = {
        httpOnly: true, //ab isse kya hoga ki frontend pe cookies modifyable nhi hogi sirf server pe modify kr skte hai
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user:  loggedInUser, accessToken, refreshToken
            },
            "User logged In successfully"
        )
    )
})

//Logout User
const logoutUser = asyncHandler(async(req, res) =>{ // to logout user remove cookies as well as reset the saved refreshToken in DB
    
    //as there is a middleware before this therefore i now have access to req.user because that middleware is adding req.user auth.middleware.js
    
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true, //ab isse kya hoga ki frontend pe cookies modifyable nhi hogi sirf server pe modify kr skte hai
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(
            200,
            {},
            "User logged Out successfully"
        )
    )
})

export {
    registerUser,
    loginUser,
    logoutUser
};