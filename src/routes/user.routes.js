import express from "express";
import { registerUser } from "../controllers/user.controller.js"; // ✅ import your controller
import { upload } from "../middlewares/multer.middleware.js";
 
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
export default router;
  