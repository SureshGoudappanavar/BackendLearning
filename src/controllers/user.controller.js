import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import  Jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch {
    throw new ApiError(400, "Something went wrong while generating tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;

  if ([fullname, email, username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All Fields are required");
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, "Username or email already exists");
  }

  const avatarLocalPath = Array.isArray(req.files?.avatar)
    ? req.files.avatar[0]?.path
    : null;

  let coverImageLocalPath = null;
  if (Array.isArray(req.files?.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

  if (!avatar?.url) {
    throw new ApiError(400, "Avatar upload failed");
  }

  const user = await User.create({
    fullname,
    email,
    username: username.toLowerCase(),
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await User.findOne({ $or: [{ username }, { email }] }).select("+password");

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

const isPasswordValid = await user.isPasswordCorrect(password);
console.log('Stored password:', user.password);
console.log('Entered password:', password);
console.log('Password comparison result:', isPasswordValid);

if (!isPasswordValid) {
  throw new ApiError(401, "Invalid user credentials");
}


  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken=asyncHandler(async(req,res)=>{
  const incomingRefreshToken=req.cookies.refreshToken||
  req.body.refreshToken

  if(!incomingRefreshToken){
       throw new ApiError(401,"unauthorized request")
  }

 try {
   const decodedToken=Jwt.verify(
     incomingRefreshToken,
     process.env.REFRESH_TOKEN_SECRET
   )
 
   const user=await User.findById(decodedToken?._id)
 
   if(!user){
     throw new ApiError(401,"Invalid refreshToken")
   }
 
 if(incomingRefreshToken!==user?.refreshToken){
   throw new ApiError(401,"Refresh Token in expired or used")
 }
 
 
 const options={
   httpOnly:true,
   secure:true
 }
 
 const {accessToken,newrefreshToken}=await generateAccessAndRefreshToken(user._id)
 
 return res
 .status(200)
 .cookie("accessToken",accessToken,options)
 .cookie("refreshToken",newrefreshToken,options)
 .json(new ApiResponse(
    200,{accessToken,refreshToken:newrefreshToken},
    "AccessToken refreshed successfully"
 ))
 } catch (error) {
     throw new ApiError(401,error?.message ||
      "Invalid refresh token "
     )
 }

})

export { registerUser, loginUser, logoutUser,
  refreshAccessToken
 };

 