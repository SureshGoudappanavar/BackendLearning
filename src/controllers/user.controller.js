import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponce.js"


 const registerUser=asyncHandler(async(req,res)=>{
    //get user details from frontend
    //validation -not empty
    //check if already user exist
    //check for images and avtar
    //upload them to cloudinary,avtar
    //create user object-create entry in db
    //remove password and refresh tokwn field from responce 
    //check for user creation 
    //return res

    const {fullname,email,username,password}=req.body
    console.log("email:",email);

   //  if(fullname===""){
   //    throw new ApiError(400,"full name is required")
      
   //  }

   if([
      fullname,email,username,password
   ].some((field)=>field?.trim()==="")){
      throw new ApiError(400,"All Fields are required")
   }

 if(await User.findOne({
      $or:[{username},{email}]
    })) {
      throw new ApiError(409,"Username or email Already Exist")
    }
   

    const avatarLocalPath = Array.isArray(req.files?.avatar) ? req.files.avatar[0]?.path : null; 
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.
    coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].
    path
    }
console.log(coverImageLocalPath);
  if(!avatarLocalPath){
   throw new ApiError(400,"Avatar File is Required")
  }
console.log(req.files);
const avatar=await uploadOnCloudinary(avatarLocalPath)
const coverImage=await uploadOnCloudinary(coverImageLocalPath)

if(!avatar){
   throw new ApiError(400,"Avtar required")
}

const user =await User.create({
   fullname,
   avatar:avatar.url,
   coverImage:coverImage?.url || "",
   email,
   password,
   username:username.toLowerCase()
    
})

const createdUser = await User.findById(user._id).select(
   "-password-refreshToken"
)
   if (!createdUser) {
   throw new ApiError(500, "Something went wrong while registering the user")
 }

 return res.status(201).json(
   new ApiResponse(200,createdUser,"User Registered successfully")
 )

 })

 export  {registerUser}