import {Router} from 'express';
import {loginUser,
        logoutUser, 
        registerUser, 
        refreshAccessToken, 
        changeCurrentPassword, 
        getCurrentUser, 
        updateAccountDetails, 
        updateUserAvatar, 
        updateUserCoverImage, 
        getUserChannelProfile, 
        getWatchHistory
    } from '../controllers/user.controller.js';

import {upload} from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// router.route("/register").post(registerUser); //which allows the server to use the registerUser function for the route /register. It is set to true because we want to allow the server to use the registerUser function for the route /register.

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]), //which allows the server to use the upload middleware for the route /register. The upload middleware is used to handle file uploads. The fields method is used to specify the fields that will be uploaded.
    registerUser //jo bhi method execute ho raha usse just pehle middleware inject krte hai
);

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logoutUser)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJWT, changeCurrentPassword)

router.route("/current-user").get(verifyJWT, getCurrentUser) //here we are only getting data we are not posting anything so get rquest

router.route("/update-account").patch(verifyJWT, updateAccountDetails)

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)

router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

router.route("/c/:username").get(verifyJWT, getUserChannelProfile)  //in this we are using params in controller so we did :username in route as there we have written {username} which is named call

router.route("/history").get(verifyJWT, getWatchHistory)


router.route("")
export default router;