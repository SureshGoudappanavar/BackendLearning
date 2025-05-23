import express from "express";
import { registerUser,loginUser,logoutUser, refreshAccessToken } from "../controllers/user.controller.js"; // ✅ import your controller
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
 
const router = express.Router();

// Use actual controller function
router.route("/register").post(
    upload.fields ([
    {
        name:"avatar",
        maxCount:1
    },
    {
        name:"coverImage",
        maxCount:1
    }
    ]),
    registerUser)

router.route("/login").post(loginUser)
 router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(verifyJWT,refreshAccessToken)
export default router;
  