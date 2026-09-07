import {Router} from 'express';
import {registerUser} from '../controllers/user.controller.js';
const router = Router();

router.route("/register").post(registerUser); //which allows the server to use the registerUser function for the route /register. It is set to true because we want to allow the server to use the registerUser function for the route /register.




export default router;