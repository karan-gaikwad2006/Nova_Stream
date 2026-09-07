import {Router} from 'express';
import {registerUser} from '../controllers/user.controller.js';

import {upload} from '../middlewares/multer.middleware.js';
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


export default router;