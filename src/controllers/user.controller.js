import {asyncHandler} from "../utils/asyncHandler.js"

 const registerUser=asyncHandler(async(requestAnimationFrame,res)=>{
    registerUser.status(200).json({
        message:"OK"
    })
 })

 export  {registerUser}